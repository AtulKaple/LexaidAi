"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Case {
  _id: string;
  applicantDetails: {
    name: string;
    country: string;
  };
  caseSummary: {
    description: string;
  };
  eligibilityResults: {
    status: string;
  };
}

const CaseList = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cases`);
        setCases(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cases:", error);
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

//   if (loading) return <p>Loading cases...</p>;

  return (
    <div className=" w-full flex flex-col items-center justify-center p-[5vw] gap-[2vw] ">
        
      <h1 className=" text-[3vw] ">Admin Dashboard</h1>
      <h1 className=" text-[2vw] ">All Cases</h1>
      {loading && <p>Loading cases...</p>}

      {cases.length === 0 && !loading ? (
        <p className="text-red-500" >No cases found.</p>
      ) : (
        <>
          {cases.map((caseItem) => (
            <div key={caseItem._id} className=" p-[2vw] w-[40%] flex justify-between border rounded-[10px] ">
              <h2>{caseItem.applicantDetails.name} from {caseItem.applicantDetails.country}</h2>
              {/* <p>{caseItem.caseSummary.description}</p> */}
              <p>Status: <span className=  {`${caseItem.eligibilityResults.status==="Ineligible"? "text-red-600":"text-green-500"}`}  > {caseItem.eligibilityResults.status}</span></p>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CaseList;
