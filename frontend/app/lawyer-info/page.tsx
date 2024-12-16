"use client";
import Navbar from "@/components/Navbar";
import CustomPhoneInput from "@/components/PhoneInput";
import TextArea from "@/components/TextArea";
import TextInput from "@/components/TextInput";
import React, { useState } from "react";
import { useDataStore, useResultStore } from "../store";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dotenv from "dotenv";
dotenv.config();

const Page: React.FC = () => {
  const { Data, updateField } = useDataStore();
  const router = useRouter();
  const { setResultData } = useResultStore();
  const [loading, setLoading] = useState(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(Data); // Log form data to the console
  };

  const handleGenerateResults = async () => {

    setLoading(true); // Start loading state

    const dataToAI = {
      submissions: Data.priorSubmissions.details || "No submissions",
      interimMeasures: Data.interimMeasures.details,
      facts: Data.facts,
    };

    try {
      // Step 1: Send data to the AI generation endpoint
      const dataResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate-results`,
        dataToAI
      );

      const generatedResult = dataResponse.data;

      // Step 2: Save the combined data and results to the backend
      try {
        const saveResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/save-result`,
          { Data, result: generatedResult }
        );

        // console.log("Saved data to backend:", saveResponse.data);
        // console.log("Saved data to backend:", saveResponse.data.data._id);

        // Extract the ID and pass it to other components
      const savedId = saveResponse?.data?.data._id; // Assuming `_id` is the identifier

        // Step 3: Update the state and navigate to the results page
        setResultData(generatedResult);
        // router.push("result");
        router.push(`/result?id=${savedId}`);
      } catch (saveError) {
        console.error("Error saving data to backend:", saveError);
      }
    } catch (error) {
      console.error("Error generating results:", error);
    }finally {
      setLoading(false); // Stop loading
    }
  };


  return (
    <div className="h-screen  w-full flex flex-col items-center justify-center ">
      <Navbar />
      <div className=" h-[10vh] md:h-[20vh] lg:h-[12vh] w-[80%] flex flex-col items-center border-b justify-center   ">
        <h1 className=" text-[8.5vw] lg:text-[3vw]  ">Lawyer Details</h1>
        {/* <p className=' text-[4vw] lg:text-[1.5vw] text-center '>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p> */}
      </div>
      <div className=" w-full h-[77vh] overflow-y-scroll px-[5vw] py-[2vw]  ">
        { Data.facts ?(
          <div className=" border rounded-[10px] px-[2vw] py-[4vw]  ">
          <form onSubmit={handleSubmit} className="relative flex flex-col">
            <div className="layerInfo w-full px-[3vw] flex flex-col gap-[2vw] ">
              <h1 className=" text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300 ">
                Counsel or Representative Information:
              </h1>
              <div className=" grid-cols-2 grid gap-[2vw]  ">
                <TextInput
                  labelName="First Name"
                  placeholder="First Name"
                  type="text"
                  inputName="layerfirstname"
                  required={true}
                  value={Data.lawyer.firstName}
                  onChange={(e) =>
                    updateField("lawyer", "firstName", e.target.value)
                  }
                />
                <TextInput
                  labelName="Family Name"
                  placeholder="Family Name"
                  type="text"
                  inputName="layerfamilyname"
                  required={true}
                  value={Data.lawyer.familyName}
                  onChange={(e) =>
                    updateField("lawyer", "familyName", e.target.value)
                  }
                />
                <TextInput
                  labelName="Email"
                  placeholder="Email"
                  type="email"
                  inputName="layeremail"
                  required={true}
                  value={Data.lawyer.email}
                  onChange={(e) =>
                    updateField("lawyer", "email", e.target.value)
                  }
                />
                <CustomPhoneInput
                  labelName="Phone Number"
                  inputName="layerphoneno"
                  value={Data.lawyer.phone}
                  onChange={(e) =>
                    updateField("lawyer", "phone", e.target.value)
                  }
                />
                <TextArea
                  required={true}
                  labelName="Address"
                  placeholder="Enter your address"
                  inputName="layeraddress"
                  value={Data.lawyer.address}
                  onChange={(e) =>
                    updateField("lawyer", "address", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="relative h-[3.5vw] ">
              <button
                onClick={handleGenerateResults}
                type="submit"
                className={`absolute right-[6vw] w-[14vw]  text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center border p-[1vw] lg:p-[0.8vw] rounded-[10px] ${
                  loading ? "bg-gray-400" : "bg-blue-400"
                }`}
                disabled={loading} // Disable button while loading
              >
                {loading ? (
          <div className="flex items-center gap-2 text-center ">
            <span className="loader"></span>
            Generating Results...
          </div>
        ) : (
          "Generate Results"
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
          </form>
        </div>
        ):(
          <div className=" border h-full rounded-[10px] px-[2vw] py-[4vw] flex items-center justify-center  ">
            <h3 className="text-[8.5vw] lg:text-[3vw] w-[70%] text-center flex flex-col items-center justify-center gap-[1vw] ">
              {/* No results to show... <br /> */}
              Please fill up the user information form first.
              <Link href="/user-info">
                <button
                  className={`text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px] bg-blue-400  `}
                >
                  Return to Form
                </button>
              </Link>
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
