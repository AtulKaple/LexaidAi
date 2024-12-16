"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import Step1 from "@/components/Form/Steps/Step1";
import Step2 from "@/components/Form/Steps/Step2";
import Step3 from "@/components/Form/Steps/Step3";
import Step4 from "@/components/Form/Steps/Step4";
import { useStepStore } from "@/app/store";

export default function Home() {
  
const { step, setStep } = useStepStore();

  return (
    <div className=" h-[63vh] md:h-[55vh] lg:h-[71vh] relative w-full overflow-auto  ">
      {step==1&&<Step1/>}
      {step==2&&<Step2/>}
      {step==3&&<Step3/>}
      {(step==4 || step==5) &&<Step4/>}
      {/* <Step1/> */}
      {/* <Step2/> */}
      {/* <Step3/> */}
      {/* <Step4 /> */}
      {/* <FileUploader /> */}
    </div>
  );
}
