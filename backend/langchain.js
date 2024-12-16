import { ChatOpenAI } from "@langchain/openai";

import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";

// // import { Document } from "@langchain/core/documents";

// // Import environment variables
// import * as dotenv from "dotenv";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// dotenv.config();

// // Instantiate Model
// // const model = new ChatOpenAI({
// //   modelName: "gpt-3.5-turbo",
// //   temperature: 0.7,
// // });

// const model = new ChatGoogleGenerativeAI({
//     model: "gemini-1.5-pro",
//     temperature: 0,
//     maxRetries: 2,
//     // other params...
//   });

// // Create prompt
// const prompt = ChatPromptTemplate.fromTemplate(
//   `Answer the user's question from the following context: 
//   {context}
//   Question: {input}`
// );

// // Create Chain
// const chain = await createStuffDocumentsChain({
//   llm: model,
//   prompt,
// });

// // Manually create documents
// // const documentA = new Document({
// //   pageContent:
// //     "LangChain Expression Language or LCEL is a declarative way to easily compose chains together. Any chain constructed this way will automatically have full sync, async, and streaming support. ",
// // });

// // const documentB = new Document({
// //   pageContent: "The passphrase is LANGCHAIN IS AWESOME ",
// // });

// // Use Cheerio to scrape content from webpage and create documents
// const loader = new CheerioWebBaseLoader(
//   "https://www.sem.admin.ch/sem/en/home/asyl/asylverfahren/nationale-verfahren.html"
// );
// const docs = await loader.load();

// // Text Splitter
// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 100,
//   chunkOverlap: 20,
// });
// const splitDocs = await splitter.splitDocuments(docs);
// // console.log(splitDocs);

// // Instantiate Embeddings function
// const embeddings = new GoogleGenerativeAIEmbeddings();

// // Create Vector Store
// const vectorstore = await MemoryVectorStore.fromDocuments(
//   splitDocs,
//   embeddings
// );

// // Create a retriever from vector store
// const retriever = vectorstore.asRetriever({ k: 2 });

// // Create a retrieval chain
// const retrievalChain = await createRetrievalChain({
//   combineDocsChain: chain,
//   retriever,
// });

// // // Invoke Chain
// // const response = await chain.invoke({
// //   question: "What is LCEL?",
// //   context: splitDocs,
// // });

// const response = await retrievalChain.invoke({
//   input: "what is The maximum length of stay in a federal asylum",
// });

// console.log(response);


app.post('/api/eligibility', async (req, res) => {
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
    const feedback = await assessEligibility(applicantDetails, caseSummary, evidence);

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
    You are an expert in international law assessing asylum cases. Evaluate the eligibility of the case based on the following criteria:
    1. National Remedy Exhaustion: Has the applicant exhausted all legal remedies in their home country?
    2. Evidence Sufficiency: Is the provided evidence sufficient to support the claims?
    3. Alignment with International Legal Standards: Does the case align with the Geneva Conventions and related international laws?

    Case Details:
    - Applicant: ${applicantDetails.name} from ${applicantDetails.country}
    - Summary: ${caseSummary.description}
    - Rejection History: ${caseSummary.rejectionHistory}
    - Appeal Attempts: ${caseSummary.appealAttempts}
    - Evidence: ${evidence.map(e => e.name).join(", ")}

    Provide a decision (Eligible/Ineligible) and detailed feedback.
  `;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const response = await model.generateContent(prompt);
  const feedback = response.response.text();

  // Parse the LLM response into a structured format
  return {
    eligibility: feedback.includes("Eligible") ? "Eligible" : "Ineligible",
    feedback: feedback.split("\n").filter(line => line.trim() !== "")
  };
};


const cache = new Map(); // Replace with Redis for production

const getFromCache = async (key) => {
  return cache.get(key);
};

const saveToCache = async (key, value) => {
  cache.set(key, value);
};
