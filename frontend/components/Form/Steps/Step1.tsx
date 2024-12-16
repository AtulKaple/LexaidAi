import Image from "next/image";
import React from "react";
import { useFormStore, useStepStore } from "@/app/store";
import { countries } from "@/app/countries";

const Step1: React.FC = () => {
  const { step, setStep } = useStepStore();
  const { formData, handleChange } = useFormStore();
  const isFormValid =formData.name.trim() !== "" && formData.country.trim() !== "";
  return (
    <>
      <div className=" h-full w-full py-[5vw] px-[7vw] lg:py-[2vw] lg:px-[5vw]   ">
        <div className="w-full flex justify-between items-center  " >
        <h2 className="text-[4.7vw] lg:text-[2.3vw]">Applicant Details</h2>
        <div className="text-[2.2vw]  lg:text-[1.1vw] text-[#828282] " >
          <p>Step {step}/4</p>
          <p><span className="text-red-500" > *</span> required</p>
        </div>
        </div>
       
        <form action="" className="p-[3vw] grid-cols-2 grid gap-[4vw]  ">
          <label
            htmlFor="name"
            className="flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw]  "
          >
            <p>&nbsp;Name<span className="text-red-500" > *</span></p>
            <input
              required
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className=" h-[6vw] lg:h-[3vw] w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] "
            />
          </label>
          <label htmlFor="country" className="flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw]">
            <p>&nbsp;Country of Origin<span className="text-red-500" > *</span></p>
            <div className="relative ">
              <select
                required
                name="country"
                value={formData.country}
                onChange={handleChange}
                id="ggh"
                className="z-50 appearance-none  bg-black h-[6vw] lg:h-[3vw] w-[80%] rounded-[10px] border px-[2vw] lg:px-[1vw] "
              >
                <option value="" disabled className="">
                  Select Country
                </option>
                {countries.map((country,index) => (
                  <option key={index}  value={country.country}>
                  {country.country}
                </option>
                ))}
              </select>
              <Image
                src="/dropDown.png"
                alt="dropDown"
                height={5}
                width={10}
                className=" h-auto w-auto absolute bottom-[2.1vw] right-[10vw] lg:bottom-[1.2vw] lg:right-[8vw] pointer-events-none "
              />
            </div>
          </label>
          <label
            htmlFor="name"
            className="flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw]  "
          >
            &nbsp;Case ID (optional)
            <input
              type=""
              name="caseId"
              value={formData.caseId}
              onChange={handleChange}
              required
              className=" h-[6vw] lg:h-[3vw] w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] "
            />
          </label>
        </form>
        {/* <button
          className="  absolute right-[10vw] border p-[0.8vw] rounded-[12px] mt-[1vw] "
          type="submit"
          onClick={() => setStep(step + 1)}
        >
          NEXT
        </button> */}
        <button
        className={`absolute text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px] mt-[1vw] ${
          isFormValid ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!isFormValid}
        onClick={() => setStep(step + 1)}
      >
        NEXT
      </button>
      </div>
    </>
  );
};

export default Step1;
