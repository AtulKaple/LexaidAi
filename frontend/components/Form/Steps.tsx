"use client";
import React from "react";
import { useStepStore } from "@/app/store";

type StepDetails = {
  stepNo: number;
  name: string;
};

const Steps: React.FC<StepDetails> = ({ stepNo, name }) => {
  const { step, setStep } = useStepStore();
  return (
    <div className={`flex flex-col-reverse lg:flex-row items-center gap-[1vw] w-auto justify-between lg:justify-normal lg:w-full z-50  bg-black `}>
      <p className=" text-[2.8vw] lg:text-[1.2vw] w-[90%] lg:w-[60%] text-center ">{name}</p>
      <div
        className={`${stepNo === step ? "border-[0.4vw] border-blue-400 delay-500 duration-300 " : "border"} 
        ${stepNo === step || stepNo > step ? " bg-transparent" : "bg-blue-400"}
        rounded-full h-[6vw] w-[6vw] lg:h-[4vw] lg:w-[4vw] flex items-center justify-center cursor-pointer  `}
        // onClick={() => setStep(stepNo)}
      >
        {stepNo === step || stepNo > step ? (
          <p className=" text-[2.5vw] leading-tight lg:text-[1.2vw] " >{stepNo}</p>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="30"
            fill="#ffff"
            viewBox="0 0 24 24"
            className="dutation-500 h-[60%] w-[60%] lg:h-auto lg:w-auto "
          >
            <path d="M 12 2 C 6.486 2 2 6.486 2 12 C 2 17.514 6.486 22 12 22 C 17.514 22 22 17.514 22 12 C 22 10.874 21.803984 9.7942031 21.458984 8.7832031 L 19.839844 10.402344 C 19.944844 10.918344 20 11.453 20 12 C 20 16.411 16.411 20 12 20 C 7.589 20 4 16.411 4 12 C 4 7.589 7.589 4 12 4 C 13.633 4 15.151922 4.4938906 16.419922 5.3378906 L 17.851562 3.90625 C 16.203562 2.71225 14.185 2 12 2 z M 21.292969 3.2929688 L 11 13.585938 L 7.7070312 10.292969 L 6.2929688 11.707031 L 11 16.414062 L 22.707031 4.7070312 L 21.292969 3.2929688 z"></path>
          </svg>
        )}
      </div>
    </div>
  );
};

export default Steps;
