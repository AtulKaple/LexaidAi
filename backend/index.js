import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import multer from "multer";
import { Case, Queries, Result } from "./databaseSchema.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "./connectDB.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

//OpenAI Code

// import OpenAI from "openai";
// const openai = new OpenAI({apiKey:""});

// const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         {
//             role: "user",
//             content: "Write a haiku about recursion in programming.",
//         },
//     ],
// });

// console.log(completion.choices[0].message);

// Connecting Database

connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running!" });
});

// Test LLM Query Endpoint

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/query", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required!" });
  }

  try {
    const result = await model.generateContent(prompt);
    res.status(200).json(result.response.text());

    await Queries.create({
      inputPrompt: prompt,
      outputResponse: result.response.text(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error communicating with OpenAI API" });
  }
});

// Simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure 'uploads' folder exists
const uploadsFolder = path.join(__dirname, "uploads/");
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsFolder); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save file with its original name
  },
});

// Initialize multer
const upload = multer({ storage });

app.post("/api/upload", upload.array("files", 10), (req, res) => {
  try {
    console.log("Uploaded Files:", req.files);

    if (req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    res.status(200).json({
      message: "Files uploaded successfully",
      files: req.files.map((file) => ({
        originalName: file.originalname,
        path: file.path,
        size: file.size,
      })),
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ error: "File upload failed" });
  }
});

///////////Enddddddddd

// Endpoint for file upload and data submission
app.post("/api/intake", upload.array("files", 10), async (req, res) => {
  console.log("Files uploaded:", req.files);
  // res.json({ message: 'Files uploaded successfully!', files: req.files });
  const {
    name,
    country,
    caseId,
    description,
    rejectionHistory,
    appealAttempts,
  } = req.body;
  // console.log("Received Body:", req.body); // Logs form fields (should show name, country, etc.)

  // Parse eligibilityResponse if it's a string
  if (req.body.eligibilityResponse) {
    try {
      const eligibilityResponse = JSON.parse(req.body.eligibilityResponse); // Correctly parse and assign the response
      req.body.eligibilityResponse = eligibilityResponse; // Store the parsed object back to req.body
    } catch (error) {
      console.error("Error parsing eligibilityResponse:", error);
      return res.status(400).send("Invalid JSON in eligibilityResponse");
    }
  }

  //   const aa= req.body.eligibilityResponse;
  //   const  feedback =await aa.feedback;
  // console.log(feedback);  // Now this will log the parsed object

  try {
    const files = await Promise.all(
      req.files.map((file) => {
        //       console.log("Received Body:", req.body); // Logs form fields (should show name, country, etc.)
        // console.log("Received Files:", req.files);
        const fileData = fs.readFileSync(file.path); // Read the file
        return {
          name: file.originalname,
          size: file.size,
          data: fileData, // Convert to binary data
          contentType: file.mimetype,
        };
      })
    );

    let newCase;

    if (req.body.eligibilityResponse) {
      // Save the case data
      newCase = await Case.create({
        applicantDetails: { name, country, caseId },
        caseSummary: { description, rejectionHistory, appealAttempts },
        evidence: files,
        eligibilityResults: {
          status: req.body.eligibilityResponse.eligibility,
          feedback: req.body.eligibilityResponse.feedback,
        },
      });
    }

    // Clean up temporary files
    // req.files.forEach((file) => fs.unlinkSync(file.path))

    res
      .status(200)
      .json({ message: "Case saved successfully!", case: newCase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving case data" });
  }
});

////lamgchain

app.post("/api/eligibility", async (req, res) => {
  try {
    const { applicantDetails, caseSummary, evidence } = req.body;

    // Basic validation
    if (!applicantDetails || !caseSummary || !evidence) {
      return res.status(400).json({ error: "Incomplete case data provided." });
    }

    // Check if a cached response exists
    const cacheKey = JSON.stringify(req.body);
    const cachedResult = await getFromCache(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    // Generate eligibility feedback using LLM
    const feedback = await assessEligibility(
      applicantDetails,
      caseSummary,
      evidence
    );

    // Cache the response for future queries
    await saveToCache(cacheKey, feedback);

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error in eligibility assessment:", error);
    res.status(500).json({ error: "Failed to assess eligibility." });
  }
});

const assessEligibility = async (applicantDetails, caseSummary, evidence) => {
  const prompt = `
     You are an expert in international human rights law and asylum procedures, with a specialization in Swiss legal mechanisms and international appeals. Your task is to help build a generative AI-powered tool for volunteer lawyers to efficiently assess and handle asylum cases. This tool aims to increase the number of refugees served by automating critical case analysis and generating tailored human rights appeals.

    ### Project Goal:
    Leverage AI to create a system that evaluates asylum cases, identifies eligibility for international appeals, and generates well-crafted appeal documents. This project focuses on improving access to justice for refugees, addressing non-refoulement principles, and adhering to Swiss and international legal standards.

    ### Context:
    - Human rights violations often lack effective remedies.
    - Refugees struggle to navigate complex asylum processes, frequently facing rejection due to insufficient evidence or procedural gaps.
    - Volunteer lawyers require tools to streamline case assessment and appeal generation.

    ### Scope of the AI-Powered Tool:
    1. **Case Assessment**:
       - Assess whether all national legal remedies, including Swiss Federal Administrative Court appeals, have been exhausted.
       - Determine if a case meets the criteria for escalation to international bodies, focusing on:
         - Non-refoulement principles (e.g., interim measures put in place or procedural gaps).
         - Rejection reasons (e.g., insufficient evidence, failure to exhaust national mechanisms).

    2. **Evidence Evaluation**:
       - Analyze submitted evidence, such as medical reports or documentation of abuse, to determine its sufficiency and credibility under Swiss and international standards.
       - Identify gaps or weaknesses in the evidence and provide recommendations for strengthening the case.

    3. **International Mechanism Recommendations**:
       - Recommend appropriate international bodies (e.g., UN Human Rights Committee, Committee Against Torture, European Court of Human Rights) based on the case attributes and fulfilled legal criteria.
       - Provide specific reasons why a case qualifies for escalation to the recommended body or explain deficiencies if it does not.

    4. **Appeal Generation**:
       - Utilize generative AI to draft human rights appeals tailored to individual cases.
       - Include references to relevant Swiss and international laws, treaties, and precedents.
       - Ensure compliance with Swiss legal formatting and language standards.

    5. **Feedback and Usability**:
       - Offer clear, actionable feedback for ineligible cases to address deficiencies.
       - Simplify the process for lawyers to refine and submit appeals.

    ### Target Audience:
    - Human rights lawyers working in Swiss asylum procedures.
    - Volunteer legal advocates assisting refugees.
    - Future scalability to multilingual support for other jurisdictions.

    ### Outputs:
    - **Case Eligibility**: Yes/No determination on whether a case can be escalated to the international level.
      - If Yes: Short explanation of which criteria are fulfilled and why.
      - If No: Short explanation of deficiencies and steps to improve eligibility.
    - **Committee Recommendations**: List of suitable international committees or bodies for escalation, with reasons for their selection.

    ### Your Role:
    Evaluate the following asylum case details and provide a structured response to determine its eligibility for escalation to the international level. Use your expertise in Swiss and international asylum laws to analyze the case comprehensively.

    ### Case Details:
    - **Applicant Name**: ${applicantDetails.name}
    - **Country of Origin**: ${applicantDetails.country}
    - **Case ID**: ${applicantDetails.caseId}
    - **Case Summary**: ${caseSummary.description}
    - **Rejection History**: ${caseSummary.rejectionHistory}
    - **Appeal Attempts**: ${caseSummary.appealAttempts}
    - **Evidence Provided**: ${evidence.map((e) => e.content).join(", ")}

    ### Assessment Criteria:
    1. **National Remedies Exhaustion**:
       - Have all Swiss legal mechanisms, including appeals to the Federal Administrative Court, been fully utilized?
       - Identify any procedural issues or omissions that could impact the rejection.
    2. **Evidence Sufficiency**:
       - Evaluate the relevance and strength of the evidence and if less evidences are avilable declare Ineligible.
       - Highlight any gaps or inconsistencies.
    3. **Alignment with International Standards**:
       - Determine whether the case meets non-refoulement and other human rights criteria under treaties such as the Geneva Convention and UNCAT.
    4. **Committee Recommendations**:
       - Recommend appropriate international bodies for escalation.
       - Provide reasons for the suitability of each recommended body.
    5. **Feedback for Improvement**:
       - Suggest steps to address deficiencies in ineligible cases.

    ### Response Format:
    - **Eligibility**: Eligible / Ineligible
    - **Feedback**:
      - **Summary**: A concise explanation of eligibility or ineligibility.
      - **Details**: Specific reasons for the decision, referencing legal frameworks and standards.
      - **Recommendations**:
        - Suitable committees or bodies with reasoning.
        - Steps to improve eligibility if necessary.

    Provide a deeply reasoned assessment with references to Swiss legal standards and international human rights laws.
  `;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const response = await model.generateContent(prompt);
  const feedback = response.response.text();
  // console.log(feedback);

  // Parse the LLM response into a structured format
  return {
    eligibility: feedback.includes("Eligible") ? "Eligible" : "Ineligible",
    feedback: feedback.split("\n").filter((line) => line.trim() !== ""),
  };
};

// Basic in-memory cache for development (Replace with Redis for production)
const cache = new Map();

const getFromCache = async (key) => {
  return cache.get(key);
};

const saveToCache = async (key, value) => {
  cache.set(key, value);
};

app.get("/api/cases", async (req, res) => {
  try {
    const cases = await Case.find(); // Retrieve all cases from the database
    res.status(200).json(cases); // Send cases as a JSON response
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({ error: "Failed to fetch cases" });
  }
});

////new ai

// API endpoint
app.post("/api/generate-results", async (req, res) => {
  try {
    const { submissions, interimMeasures, facts } = req.body;

    // console.log(req.body);

    if (!submissions || !interimMeasures || !facts) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if a cached response exists
    const cacheKey = JSON.stringify(req.body);
    const cachedResult = await getFromCache(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    // Generate eligibility feedback using LLM
    const result = await assessGeneratedAnswers(
      submissions,
      interimMeasures,
      facts
    );

    // Cache the response for future queries
    await saveToCache(cacheKey, result);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in eligibility assessment:", error);
    res.status(500).json({ error: "Failed to assess eligibility." });
  }
});

const assessGeneratedAnswers = async (submissions, interimMeasures, facts) => {
  const prompt = `{
    "task": "You are an expert in international human rights law and asylum procedures, with a specialization in Swiss legal mechanisms and international appeals. Your task is to help build a generative AI-powered tool for volunteer lawyers to efficiently assess and handle asylum cases. This tool aims to increase the number of refugees served by automating critical case analysis and generating tailored human rights appeals. Generate Human Rights Communication Sections",
    "inputs": {
      "prior_submissions": ${submissions},
      "request_for_measures": ${interimMeasures},
      "facts_of_case": ${facts}
    },
    "instructions": "Using the provided inputs, generate responses for the following sections of a human rights communication form. Ensure responses are clear and formatted as specified. Only print name and output fields of each section and do not print the instructions given.",
    "sections": [
      {
        "name": "Section1",
        "instruction": "Recommend only one appropriate international bodies (eg: Committee on the Elimination of Racial Discrimination, Committee on Economic, Social and Cultural Rights, Human Rights Committee, Committee on the Elimination of Discrimination against Women, Committee against Torture, Committee on the Rights of the Child, Committee on Migrant Workers, Subcommittee on Prevention of Torture and other Cruel, Inhuman or Degrading Treatment or Punishment, Committee on the Rights of Persons with Disabilities, Committee on Enforced Disappearances (CED)) based on the case attributes and fulfilled legal criteria. Select the relevant committee based on the case type and jurisdiction. Provide the exact name of the committee in one line without shortform .",
        "output": {
          "name_of_committee": []
        }
      },
      {
        "name": "Section9",
        "instruction": "
        You are a legal expert drafting a petition or appeal for above legal or human rights committee/body. Your task is to craft a detailed response to a request for [specific measures, e.g., interim measures or measures of protection] on behalf of a [complainant/victim], ensuring legal precision, persuasive argumentation, and adherence to international law. 

        ### Scenario:  
        ${interimMeasures}

        Be persuasive, detailed, and aligned with international law principles. Your response should ensure the protection of the complainant's rights and address all elements comprehensively.

        
      
        "output": {
          "justification": [
          - Ensure the response is a minimum of 300 words and not more than 400 words.
          - Identify and cite the relevant legal provisions, rules, or precedents that justify the requested measures.  
          - Clearly explain how these provisions are applicable to the specific case and their relevance. 
          - Summarize the complainant's situation, including relevant historical events, vulnerabilities, or harms justifying the request.  
          - Mention any medical, psychological, or expert evidence that supports the complainant’s claims.
          - Explain why the harm or risk is imminent and why it would be irreparable if the requested measures are not granted.  
          - Highlight specific threats or vulnerabilities that demonstrate the urgency of the situation.
          - Specify the measures being requested (e.g., preventing deportation, ensuring physical protection, granting therapy).  
          - Explain why these measures are necessary, appropriate, and proportionate to the risks faced.  
          - Highlight how these measures align with the principles and purpose of the legal body or framework.
          - Use formal, precise, and persuasive language.  
          - Please Justify the request in words more than 300 words but not greater than 400. while covering all critical points. 
          - Ensure that the response is tailored to the specific case and the legal framework of the relevant committee.
          - Don't use him, her, he, she, etc. Use complainant, victim, etc.
          - Structure the argument logically, dividing it into array of strings where needed.  
          
          ]
        }
      },
      {
        "name": "Section10",
        "instruction": "You are an expert in international human rights law and asylum procedures. Your task is to draft a comprehensive legal argument or petition based on the case details provided. Your response must be structured, precise, and persuasive, adhering to international law principles and best legal practices. Ensure you address all relevant facts and arguments comprehensively.

        ### Scenario:  
        ${facts}
",
        "output": {
          "facts_summary": [
          - Ensure the response is a minimum of 2000 words and not more than 2500 words.
          - Summarize the purpose of the petition or appeal.  
          - Briefly outline the key facts of the case and the legal basis for the claim.
          - Present a chronological account of the complainant’s experiences.  
          - Highlight all key incidents, including any evidence of human rights violations, trauma, or systemic failure by authorities.  
          - Emphasize medical reports, psychological assessments, or expert opinions that substantiate claims.
          - Cite and explain applicable laws, conventions, and precedents (e.g., Convention Against Torture, Refugee Convention, CEDAW, ECHR).  
          - Clearly link the facts of the case to the provisions of these legal instruments.  
          - Discuss principles of non-refoulement, state obligations, and due process.
          - Identify and analyze the procedural deficiencies in the authorities' handling of the case (e.g., failure to consider evidence, lack of credibility assessment, ignoring medical reports).  
          - Highlight failures to address gender-specific violence or psychological factors adequately.  
          - Provide evidence that such failures have led to unjust decisions.
          - Provide a detailed analysis of the risk to the complainant upon return to their home country.  
          - Reference medical and psychological evidence, social conditions, and institutional deficiencies that exacerbate their vulnerability.  
          - Explain how these risks amount to irreparable harm and violate international human rights standards.
          - Articulate the specific measures requested (e.g., suspension of deportation, granting of asylum, access to medical care).  
          - Justify these measures as necessary, proportionate, and aligned with legal obligations.  
          - Argue why these measures are in the interest of justice and compliance with international law.
          - Recap the key arguments and legal grounds for the appeal or petition.  
          - Reaffirm the urgency of the requested measures to prevent irreparable harm.
          - Emphasize the relevance and applicability of international law to support the complainant's case.  
          - Consider possible counterarguments and preemptively refute them with legal reasoning.
          - Please Justify the request in words more than 2000 words but not greater than 2500. while covering all critical points. 
          - Don't use him, her, he, she, etc. Use complainant, victim, etc.
          - Structure the argument logically, dividing it into array of strings where needed.  

          ]
        }
      },
      {
        "name": "Section11",
        "instruction": "You are an expert in international human rights law, specializing in asylum cases and gender-based violence (GBV). Your task is to draft a detailed legal analysis for a case based on the provided facts. The analysis must identify the rights violated, referencing specific articles of relevant treaties, legal precedents, and general recommendations. The response must be logically structured, concise yet comprehensive, and directly tied to the provided facts. Ensure gender-sensitive language and highlight procedural and substantive legal failings.
        
        Facts:
        ${interimMeasures} ${facts}

        ",
        "output": {
          "supporting_claims": [
          - Ensure the response is a minimum of 400 words and not more than 600 words.
          - Ensure that the response is tailored to the specific case and the legal framework of the relevant committee.
          - Explain how the facts violate the individual’s rights.
          - Specify the relevant treaties, articles, and general recommendations, if applicable.
          - Provide detailed reasoning, linking the facts to legal principles.
          - Address procedural and substantive violations separately.
          - Reference legal precedents or relevant committee decisions, if applicable.
          - Use structured sections (e.g., Procedural Failures, Substantive Failures) and professional language.
          - Reference relevant articles under applicable human rights treaties.
          - Avoid Oversimplification or vague statements.
          - Avoid Failing to link facts to legal principles.
          - Avoid Lack of citations to treaties or precedents.  
          - Please Justify the request in words more than 400 words but not greater than 600. while covering all critical points. 
          - Don't use him, her, he, she, etc. Use complainant, victim, etc.
          - Structure the argument logically, dividing it into array of strings where needed.      
          ]
        }
      }
    ],
    "parameters": {
      "language": "English",
      "tone": "Formal",
      "output_format": "JavascriptObject"
    }
  }`;

  //   `
  //    You are an advanced AI tasked with generating responses for a legal communication submission based on the provided details. Use the inputs below to draft responses for Sections 1, 9, 10, and 11 in the specified format. Be concise, professional, and adhere to the word limits for each section. The responses must be fact-based and logically derived from the inputs.

  // ### Inputs:
  // 1. **Prior Submissions**:
  //    [${submissions}]

  // 2. **Request for Interim Measures or Protection**:
  //    [${interimMeasures}]

  // 3. **Facts of the Case**:
  //    [${facts}]

  // ---

  // ### **Your Task:**
  // Generate responses for the following sections:

  // 1. **Section 1: Name of Committee to which the communication is submitted:**
  //    In one line, identify the most appropriate committee or authority to which this communication should be submitted. Base your selection on the provided facts and context.

  // 2. **Section 9: Justification for Interim/Protective Measures:**
  //    In a maximum of 400 words, justify the requested interim or protective measures. Clearly explain the nature of the harm or risks involved, and why the measures are necessary.

  // 3. **Section 10: Facts:**
  //    In a maximum of 2,500 words, provide a summary of the main facts of the case. Organize them in chronological order and include:
  //    - Dates and events related to the case.
  //    - Information about administrative and judicial remedies attempted domestically.
  //    - Reasons for the outcomes of these remedies or why they were not exhausted, if applicable.

  // 4. **Section 11: Supporting Details for Claims:**
  //    In a maximum of 600 words, explain how the facts provided demonstrate a violation of rights. Specify which rights were violated and, if possible, identify the relevant articles under the applicable treaty.

  // ---

  // ### **Formatting Guidelines:**
  // - Write in points where appropriate to ensure clarity.
  // - Use a professional and legal tone.
  // - Ensure all sections are logically consistent with the inputs.

  // ### **Output Structure:**
  // `;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const response = await model.generateContent(prompt);
  const result = response.response.text();
  const resultObject = result
    .replace("```javascript", "")
    .replace("```json", "")
    .replace("```", "");
  console.log(result);
  // console.log(JSON.parse(aa));

  // Parse the LLM response into a structured format
  return {
    // eligibility: result.includes("Eligible") ? "Eligible" : "Ineligible",
    // result: result.split("\n").filter((line) => line.trim() !== ""),
    result: JSON.parse(resultObject),
  };
};

// Basic in-memory cache for development (Replace with Redis for production)
// const cache = new Map();

// const getFromCache = async (key) => {
//   return cache.get(key);
// };

// const saveToCache = async (key, value) => {
//   cache.set(key, value);
// };

app.post("/api/save-result", async (req, res) => {
  const { Data, result } = req.body;

  if (!Data || !result) {
    return res.status(400).json({ error: "Data and result are required!" });
  }

  try {

 // Get the client IP address
 const clientIp =
 req.headers["x-forwarded-for"] || req.socket.remoteAddress;

 const resolvedIp = clientIp === "::1" ? "1.10.10.0" : clientIp;
 

 const getLocationFromIp = async (ip) => {
  try {
    const response = await axios.get(`https://ipinfo.io/${ip}/json`);
    return response.data;
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};

const location = await getLocationFromIp(resolvedIp);
// const location = geoip.lookup(clientIp);


    // Combine Data and result into one document
    const savedResult = await Result.create({
      ...Data, // Spread the fields from Data
      ...result, // Add the result section
      generatedAtIp: clientIp, // Save the IP address
      location: location || null, // Save the location information
    });

    res.status(200).json({
      success: true,
      message: "Data and results saved successfully.",
      data: savedResult,
    });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Error saving data to the database.", details: error.message });
  }
});

app.get("/api/results", async (req, res) => {
  try {
    const results = await Result.find(); // Fetch all documents in the Result collection
    res.status(200).json(results); // Return the results as JSON
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Error fetching results from the database." });
  }
});

app.put("/api/update-result/:id", async (req, res) => {
  const { id } = req.params; // Get the unique ID of the result to update
  const { Data, result } = req.body; // Extract new data from the request body

  try {
    const updatedResult = await Result.findByIdAndUpdate(
      id,
      { ...Data, ...result },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedResult) {
      return res.status(404).json({ error: "Result not found" });
    }

    res.status(200).json(updatedResult); // Return the updated result
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ error: "Error updating the result." });
  }
});



// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
