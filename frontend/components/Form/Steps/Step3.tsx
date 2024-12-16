import Image from "next/image";
import React from "react";
import FileUpload from "../FileUpload";
import { useFormStore, useStepStore } from "@/app/store";

const Step3: React.FC = () => {
  const { step, setStep } = useStepStore();
  const { uploadedFiles } = useFormStore();
  // const isFormValid = uploadedFiles.length > 0;

  return (
    <div className=" w-full py-[5vw] px-[7vw] lg:py-[2vw] lg:px-[5vw]   ">
      <div className="w-full flex justify-between items-center  ">
        <h2 className="text-[4.7vw] lg:text-[2.3vw]">Evidence Upload</h2>
        <div className="text-[2.2vw]  lg:text-[1.1vw] text-[#828282] ">
          <p>Step {step}/4</p>
        </div>
      </div>
      <FileUpload />
      <div className="relative flex items-center justify-between px-[5vw] h-[10vw] lg:h-[4vw]">
        <button
          className="text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center   right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px]  "
          type="submit"
          onClick={() => setStep(step - 1)}
        >
          Previous
        </button>
        <button
          className={`text-[2.8vw] lg:text-[1.2vw] bg-blue-500 text-white flex items-center justify-center right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px] 
          
        }`}
          onClick={() => setStep(step + 1)}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default Step3;
