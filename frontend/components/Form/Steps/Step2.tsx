import React, { useEffect, useRef } from "react";
import { useFormStore, useStepStore } from "@/app/store";

const Step2: React.FC = () => {
  const { step, setStep } = useStepStore();
  const { formData, handleChange } = useFormStore();
  const isFormValid =
    formData.description.trim() !== "" &&
    formData.rejectionHistory.trim() !== "";
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const rejectionHistoryRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
    }
    if (rejectionHistoryRef.current) {
      rejectionHistoryRef.current.style.height = "auto";
      rejectionHistoryRef.current.style.height = `${rejectionHistoryRef.current.scrollHeight}px`;
    }
  }, [formData.description, formData.rejectionHistory]); // Watch both fields
  return (
    <div className=" w-full py-[5vw] px-[7vw] lg:py-[2vw] lg:px-[5vw]   ">
      
      <div className="w-full flex justify-between items-center  " >
      <h2 className="text-[4.7vw] lg:text-[2.3vw]">Case Summary</h2>
        <div className="text-[2.2vw]  lg:text-[1.1vw] text-[#828282] " >
          <p>Step {step}/4</p>
          <p><span className="text-red-500" > *</span> required</p>
        </div>
        </div>
      <form action="" className="p-[3vw] flex flex-col gap-[3vw]  ">
        <label
          htmlFor="Description"
          className="flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw]  "
        >
          
          <p>&nbsp;Brief description of the case<span className="text-red-500" > *</span></p>
          <textarea
            ref={descriptionRef}
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="h-[5vw]  w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] py-[1.5vw] lg:py-[1vw] overflow-hidden resize-none "
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto"; // Reset height to auto to calculate new height
              target.style.height = `${target.scrollHeight}px`; // Set height based on content
            }}
          />
        </label>
        <label
          htmlFor="rejection history"
          className="flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw] "
        >
          <p>&nbsp;Rejection history<span className="text-red-500" > *</span></p>
          <textarea
            ref={rejectionHistoryRef}
            required
            name="rejectionHistory"
            value={formData.rejectionHistory}
            onChange={handleChange}
            placeholder="rejection history"
            className="h-[5vw]  w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] py-[1.5vw] lg:py-[1vw] overflow-hidden resize-none "
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto"; // Reset height to auto to calculate new height
              target.style.height = `${target.scrollHeight}px`; // Set height based on content
            }}
          />
        </label>
        <label
          htmlFor="appeal attempts"
          className="flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw]  "
        >
          &nbsp;Appeal attempts
          <input
            required
            name="appealAttempts"
            value={formData.appealAttempts}
            onChange={handleChange}
            type="number"
            min={0}
            className="number-input h-[6vw] lg:h-[3vw] w-[40%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] "
          />
        </label>
      </form>
      <div className="relative flex items-center justify-between px-[5vw] h-[10vw] lg:h-[4vw] ">
        <button
          onClick={() => setStep(step - 1)}
          className=" text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center  right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px]  "
        >
          Previous
        </button>
        {/* <button
            onClick={() => setStep(step + 1)}
            className="   right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[12px] "
            type="submit"
          >
            NEXT
          </button> */}
        <button
          className={`text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px]  ${
            isFormValid
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
          onClick={() => setStep(step + 1)}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default Step2;
