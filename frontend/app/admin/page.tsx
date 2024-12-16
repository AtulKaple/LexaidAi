"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import dotenv from "dotenv";
dotenv.config();

const Page: React.FC = () => {
  interface Result {
    _id: string;
    [key: string]: any;
  }

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/results`);
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching results:", error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

// Handle export functionality
const handleExport = async (result: Result) => {
// Extract individual sections
const interimMeasures = result?.result?.Section9?.justification || [];
const facts = result?.result?.Section10?.facts_summary || [];
const claims = result?.result?.Section11?.supporting_claims || [];

// Combine all data with continuous indexing
const combinedData = [
  ...interimMeasures.map((item: any, idx: any) => ({
    index: idx + 1,
    section: "Measures",
    value: item,
  })),
  ...facts.map((item: any, idx: any) => ({
    index: interimMeasures.length + idx + 1,
    section: "Facts",
    value: item,
  })),
  ...claims.map((item: any, idx: any) => ({
    index: interimMeasures.length + facts.length + idx + 1,
    section: "Claims",
    value: item,
  })),
];
  


  const dynamicData = {
    complainantFirstName: result.complainant.firstName,
    complainantFamilyName: result.complainant.familyName,
    complainantDOB: result.complainant.dob,
    complainantNationality: result.complainant.nationality,
    complainantEmail: result.complainant.email,
    complainantPhoneNo: result.complainant.phone,
    complainantAddress: result.complainant.address,
    victimFirstName: result.victim.firstName,
    victimFamilyName: result.victim.familyName,
    victimDOB: result.victim.dob,
    victimNationality: result.victim.nationality,
    representativeFirstName: result.lawyer.firstName,
    representativeFamilyName: result.lawyer.familyName,
    representativeEmail: result.lawyer.email,
    representativePhoneNo: result.lawyer.phone,
    representativeAddress: result.lawyer.address,
    country: result.countriesInvolved.countries,
    isAnonymized: result.anonymizationPreference,
    hasSubmitted: result.priorSubmissions.hasSubmitted,
    isRequesting: result.interimMeasures.isRequesting,
    submissionDetails: result.priorSubmissions.details,
    committeeName: result?.result?.Section1?.name_of_committee,
    interimMeasures: combinedData.filter((item) => item.section === "Measures"),
    facts: combinedData.filter((item) => item.section === "Facts"),
    claims: combinedData.filter((item) => item.section === "Claims"),
  };

  try {
    const response = await fetch("/tt.docx"); // Adjust path to your template
    const templateBlob = await response.blob();
    const arrayBuffer = await templateBlob.arrayBuffer();
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(dynamicData);

    const output = doc.getZip().generate({ type: "blob" });
    saveAs(output, `ResultsOf_${result.complainant.firstName}.docx`);

  } catch (error) {
    console.error("Error generating document:", error);
  }
};


  return (
    <div className="h-screen  w-full flex flex-col items-center justify-center ">
      <Navbar />
      <div className=" h-[10vh] md:h-[20vh] lg:h-[12vh] w-[80%] flex flex-col items-center border-b justify-center   ">
        <h1 className=" text-[8.5vw] lg:text-[3vw]  ">All Results</h1>
        {/* <p className=' text-[4vw] lg:text-[1.5vw] text-center '>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p> */}
      </div>
      <div className=" w-full h-[77vh] overflow-y-scroll px-[5vw] py-[2vw]  ">
        <div className="min-h-[100%] border rounded-[10px] p-[2vw] w-full flex flex-col items-center justify-center gap-[1vw]  ">
          {loading ?(
            <p>Loading results...</p>
          ):(
            <>
            {results.length > 0 ? (
           <>
              {results.map((result, index) => (
                <div
                  key={result._id}
                  className="border rounded-[10px] p-[2vw] w-[70%] flex flex-col justify-between gap-[2vw] "
                >
                  {/* <h3>Result {index + 1}</h3>
              <pre>{JSON.stringify(result, null, 2)}</pre> */}
              <div className="flex  justify-between gap-[2vw]" >
                  <h3><span className="text-blue-400" >Name:</span> {result.complainant.firstName}</h3>
                  <div>
                    <h4><span className="text-blue-400" >Location:</span> {result.location.city}, {result.location.region}, {result.location.country} (IP Address: {result.location.ip})</h4>
                    {/* <p>Time: {result.timestamp}</p> */}
                    <TimestampDisplay timestamp={result.timestamp} />
                  </div>
                  <button
                  onClick={() => handleExport(result)}
                  className="bg-blue-500 text-white px-4 m-[0.5vw] rounded hover:bg-blue-700"
                >
                  Export
                </button>
                </div>
                <div><span className="text-blue-400" >Feedback:</span> {result.feedback.content}</div>
                </div>
              
              ))}
              </>
  
          ) : (
            <p>No results found.</p>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;



function TimestampDisplay({ timestamp }: { timestamp: string }) {
  const date = new Date(timestamp);
  const readableDate = date.toLocaleString("en-US", {
    // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    // timeZoneName: "short",
  });

  return (
    <div>
      <p><span className="text-blue-400" >Generated On:</span> {readableDate}</p>
    </div>
  );
}

// Example usage
<TimestampDisplay timestamp="2024-12-14T08:16:01.294Z" />;