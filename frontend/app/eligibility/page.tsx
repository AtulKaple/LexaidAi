"use client";
import React, { useEffect, useState } from "react";
import { useEligibilityStore } from "@/app/store";
import Link from "next/link";

const Page: React.FC = () => {
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);
  const { eligibilityData } = useEligibilityStore();
  let feedbackString = "";

  if (eligibilityData) {
    feedbackString = eligibilityData.feedback.join("\n<br>");
  }

  //Format Output

  const formatText = (text: any) => {
    // Replace **...** with <b>...</b> for bold text
    const boldFormatted = text.replace(
      /\*\*(.*?)\*\*/g,
      `<b class="hello">$1</b>`
    );

    // Replace single * with a bullet point
    const bulletFormatted = boldFormatted.replace(/(^|\s)\*(?=\s|$)/g, "<br>•");

    return bulletFormatted;
  };

  return (
    <div className="  w-full flex flex-col gap-[3vw] items-center justify-center py-[5vw] px-[10vw] ">
      {eligibilityData ? (
        <>
          <h1 className=" text-[3vw] ">All Set! Check Your Result.</h1>
          <h1 className=" text-[3vw] text-blue-400 ">
            Status: {eligibilityData.eligibility}
          </h1>
          <div className=" content border w-full min-h-[25vw] rounded-[10px] p-[4vw] text-[3vw] lg:text-[1.5vw] flex items-center justify-center gap-[2vw] ">
    
            <div
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{
                __html: formatText(feedbackString),
              }}
            ></div>
          
      </div>
      {eligibilityData.eligibility === "Eligible" && (
        <div className=" flex items-center justify-between px-[5vw] h-[10vw] lg:h-[4vw]">
        <Link href="/user-info" >
        <button
        className={`text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px] bg-blue-400  `}
        // onClick={handleSubmit}
      >
        Continue to Generate Document.. 
      </button>
      </Link>
      </div>
      )}
        </>
      ) : (
        <>
        <h1 className=" text-[3vw] ">No Data Available.</h1>
        <Link href="/form" >
        <button
        className={`text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px]  `}
      >
        Return to Eligibility Form
      </button>
        </Link>
        </>
        
      )}
      
    </div>
  );
};

export default Page;
