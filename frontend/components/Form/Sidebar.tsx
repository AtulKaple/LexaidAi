"use client";
import React from "react";
import Steps from "./Steps";
import { useStepStore } from "@/app/store";

const Sidebar: React.FC = () => {
  const { step, setStep } = useStepStore();
  return (
    <div className="h-[12vh] md:h-[15vh] lg:min-h-[71vh] w-full lg:w-[25vw] left-0 border-b lg:border-r flex items-center justify-center     ">
      <div className="relative flex flex-row px-[2vw] lg:px-0 lg:flex-col gap-[1vw] lg:gap-[3vw] items-center justify-center ">
        <div className="hidden lg:flex absolute h-[70%] w-[0.4vw] right-[22.5%] overflow-hidden ">
          <div
            className="w-full bg-blue-400 duration-500 "
            style={{
              height: `${(step - 1) * 33.3}%`,
            }}
          ></div>
        </div>
        <Steps stepNo={1} name="Applicant Details" />
        <Steps stepNo={2} name="Case Summary" />

        <Steps stepNo={3} name="Evidence Upload" />

        <Steps stepNo={4} name="Confirmation and Review" />
      </div>
    </div>
  );
};

export default Sidebar;
