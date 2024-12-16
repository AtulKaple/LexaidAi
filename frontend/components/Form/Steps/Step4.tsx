"use client";
import React, { useState } from "react"
import { useFormStore, useStepStore } from "@/app/store";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
// import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs"; // Import the worker entry point
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { useEligibilityStore } from "@/app/store";
import { useRouter } from "next/navigation";
import dotenv from "dotenv";
dotenv.config();


type FormDataType = {
    name: string;
    country: string;
    caseId: string;
    description: string;
    rejectionHistory: string;
    appealAttempts: number | string; // Adjust type as needed
  };

const Step4: React.FC = () => {
    const { step, setStep } = useStepStore();
  const { formData,uploadedFiles } = useFormStore();
  const { setEligibilityData } = useEligibilityStore();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const parsePDF = async (file: File): Promise<string> => {
    try {
      // Specify the worker source
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
  
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let text = "";
  
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(" ");
      }
  
      return text;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      return "Failed to parse PDF.";
    }
  };

  const parseDOCX = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer(); // Read file as ArrayBuffer
      const result = await mammoth.extractRawText({ arrayBuffer }); // Use Mammoth.js
      if (result.value) {
        return result.value; // Return the extracted text
      } else {
        console.error("Mammoth returned no content for the DOCX file.");
        return "No text could be extracted from this DOCX file.";
      }
    } catch (error) {
      console.error("Error parsing DOCX file:", error);
      return "Failed to parse DOCX file.";
    }
  };
  

  const parseImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      Tesseract.recognize(file, "eng")
        .then(({ data: { text } }) => resolve(text))
        .catch(reject);
    });
  };

  const parseFile = async (file: File): Promise<string> => {
    if (file.type === "application/pdf") {
      return parsePDF(file);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return parseDOCX(file);
    } else if (file.type.startsWith("image/")) {
      return parseImage(file);
    } else {
      return "Unsupported file type.";
    }
  };
  ///////


  const handleSubmit = async () => {

    setLoading(true); // Start loading state
    const form = new FormData();

      // Ensure `formData` has a proper type
  const typedFormData = formData as FormDataType;


    // Append form data
  Object.keys(typedFormData).forEach((key) => {
    form.append(key, String(typedFormData[key as keyof FormDataType])); // Convert values to string if needed
  });


    // Append files
    uploadedFiles.forEach((fileDetail: any) => {
      form.append("files", fileDetail.file); // Append the actual File object
    });


    try {
      // First API call to `/api/intake`
    const intakeResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/intake`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    // console.log("Intake submission successful:", intakeResponse.data);

    // Parse each uploaded file
    const parsedFiles = await Promise.all(
      uploadedFiles.map((fileDetail: any) =>
        parseFile(fileDetail.file).then((content) => ({
          name: fileDetail.file.name,
          type: fileDetail.file.type,
          size: fileDetail.file.size,
          content,
        }))
      )
    );

    // Prepare payload for `/api/eligibility`
    const eligibilityPayload = {
      applicantDetails: {
        name: formData.name,
        country: formData.country,
        caseId: formData.caseId || "N/A",
      },
      caseSummary: {
        description: formData.description,
        rejectionHistory: formData.rejectionHistory,
        appealAttempts: formData.appealAttempts,
      },
      evidence: parsedFiles,
    };

    // API call to `/api/eligibility`
    const eligibilityResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/eligibility`,
      eligibilityPayload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // console.log("Eligibility assessment successful:", eligibilityResponse.data);

    // Include eligibilityResponse in the /api/intake request
    const finalPayload = new FormData();
    Object.keys(typedFormData).forEach((key) => {
      finalPayload.append(key, String(typedFormData[key as keyof FormDataType]));
    });
    uploadedFiles.forEach((fileDetail: any) => {
      finalPayload.append("files", fileDetail.file);
    });
    finalPayload.append("eligibilityResponse", JSON.stringify(eligibilityResponse.data));

    // Send final data including eligibilityResponse to /api/intake
    await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/intake`, // Same endpoint or a different one if needed
      finalPayload,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

      // Store data in Zustand store.js
      setEligibilityData(eligibilityResponse.data);

       // Redirect to eligibility page
       router.push("/eligibility");

       if (step === 4){
        setStep(step + 1);
       }

      // alert("Form submitted successfully to both endpoints!");
      // console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Error submitting the form!");
    }finally {
      setLoading(false); // Stop loading
    }
  };

  return(
    <div className=" w-full py-[5vw] px-[7vw] lg:py-[2vw] lg:px-[5vw]   ">
     
      <div className="w-full flex justify-between items-center  " >
      <h2 className="text-[4.7vw] lg:text-[2.3vw]">Confirmation and Review</h2>
        <div className="text-[2.2vw]  lg:text-[1.1vw] text-[#828282] " >
          <p>Step 4/4</p>
        </div>
        </div>
      <div className="p-[3vw] flex flex-col gap-[3.5vw] " >
        <div className="flex  text-[2.6vw] lg:text-[1.3vw] " >
   
            <p className=" w-[50%] " >Name: {formData.name}</p>
            <p>Country of Origin: {formData.country}</p>
        </div>
        <div className="flex text-[2.6vw] lg:text-[1.3vw] " >
   
            <p className=" w-[50%] ">Case ID: {formData.caseId ==""?"Nil":formData.caseId}</p>
            <p>Appeal attempts: {formData.appealAttempts}</p>
        </div>
        <div className="flex flex-col text-[2.6vw] lg:text-[1.3vw] w-[90%] whitespace-pre-wrap " >
            <p>Case description:</p>
            <p>{formData.description }</p>
           
        </div>
        <div className="flex flex-col text-[2.6vw] lg:text-[1.3vw] w-[90%] whitespace-pre-wrap " >
            <p>Rejection history:</p>
            <p>{formData.rejectionHistory }</p>
        </div>
        <div className="flex flex-col text-[2.6vw] lg:text-[1.3vw] ">
            <p>Evidence Uploaded:</p>
            {
              uploadedFiles.length > 0 ? (
                <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
              ): (
                "No files uploaded"
              )
            }
        </div>


      </div>
      <div className="relative flex items-center justify-between px-[5vw] h-[10vw] lg:h-[4vw]">
        <button
          className="text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center   right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px]  "
          type="submit"
          onClick={() => setStep(step - 2)}
        >
          Previous
        </button>
        <button
        className={`text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px] ${
          loading ? "bg-gray-400" : "bg-blue-400"
        }  `}
        disabled={loading} // Disable button while loading
        onClick={handleSubmit}
      >
        {loading ? (
          <div className="flex items-center gap-2 text-center ">
            <span className="loader"></span>
            Evaluating Eligibility...
          </div>
        ) : (
          "Access Eligibility"
        )}
      </button>
      <style jsx>{`
        .loader {
          width: 1em;
          height: 1em;
          border: 3px solid #fff;
          border-top: 3px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      </div>
    </div>
  )

};

export default Step4;
