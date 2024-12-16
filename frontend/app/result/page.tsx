"use client";
import Navbar from "@/components/Navbar";
import CustomPhoneInput from "@/components/PhoneInput";
import TextArea from "@/components/TextArea";
import TextInput from "@/components/TextInput";
import React, { Suspense, useEffect, useRef } from "react";
import { useDataStore, useResultStore } from "../store";
import axios from "axios";
import CountryOption from "@/components/CountryOption";
import DateInput from "@/components/DateInput";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dotenv from "dotenv";
dotenv.config();

const PageContent: React.FC = () => {

  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Extract ID from query parameters
  const { Data, updateField } = useDataStore();
  const { resultData, setResultData } = useResultStore();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(resultData); // Log form data to the console
    // console.log(id); // Log form data to the console
  };

  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  useEffect(() => {
    // Adjust height for all textareas
    textareaRefs.current.forEach((textarea) => {
      if (textarea) {
        textarea.style.height = "auto"; // Reset height
        textarea.style.height = `${textarea.scrollHeight}px`; // Adjust to content
      }
    });
  }, [resultData]); // Watch for changes in resultData

  const updateResultData = (
    section: string,
    key: string,
    index: number,
    value: string
  ) => {
    const updatedSection = [...resultData.result[section][key]];
    updatedSection[index] = value;

    setResultData({
      ...resultData,
      result: {
        ...resultData.result,
        [section]: {
          ...resultData.result[section],
          [key]: updatedSection,
        },
      },
    });
  };

  const interimMeasures = resultData?.result?.Section9?.justification || [];
  const facts = resultData?.result?.Section10?.facts_summary || [];
  const claims = resultData?.result?.Section11?.supporting_claims || [];

  // Combine all arrays with continuous indexing
  const combinedData = [
    ...interimMeasures.map((item: any, idx: any) => ({
      index: idx + 1, // Start numbering from 1
      section: "Measures",
      value: item,
    })),
    ...facts.map((item: any, idx: any) => ({
      index: interimMeasures.length + idx + 1, // Continue numbering after interimMeasures
      section: "Facts",
      value: item,
    })),
    ...claims.map((item: any, idx: any) => ({
      index: interimMeasures.length + facts.length + idx + 1, // Continue numbering after facts
      section: "Claims",
      value: item,
    })),
  ];

  // const interimMeasuresFiltered = combinedData.filter(item => item.section === "Interim Measures");
  // const factsFiltered = combinedData.filter(item => item.section === "Facts");
  // const claimsFiltered = combinedData.filter(item => item.section === "Claims");

  const handleExport = async () => {
    // Dynamic data to insert into the template
    const dynamicData = {
      complainantFirstName: Data.complainant.firstName,
      complainantFamilyName: Data.complainant.familyName,
      complainantDOB: Data.complainant.dob,
      complainantNationality: Data.complainant.nationality,
      complainantEmail: Data.complainant.email,
      complainantPhoneNo: Data.complainant.phone,
      complainantAddress: Data.complainant.address,
      victimFirstName: Data.victim.firstName,
      victimFamilyName: Data.victim.familyName,
      victimDOB: Data.victim.dob,
      victimNationality: Data.victim.nationality,
      representativeFirstName: Data.lawyer.firstName,
      representativeFamilyName: Data.lawyer.familyName,
      representativeEmail: Data.lawyer.email,
      representativePhoneNo: Data.lawyer.phone,
      representativeAddress: Data.lawyer.address,
      country: Data.countriesInvolved.countries,
      isAnonymized: Data.anonymizationPreference,
      hasSubmitted: Data.priorSubmissions.hasSubmitted,
      isRequesting: Data.interimMeasures.isRequesting,
      submissionDetails: Data.priorSubmissions.details,
      committeeName: resultData?.result?.Section1?.name_of_committee,
      // interimMeasures: resultData?.result?.Section9?.justification,
      // facts: resultData?.result?.Section10?.facts_summary,
      // claims: resultData?.result?.Section11?.supporting_claims,
      interimMeasures: combinedData.filter(
        (item) => item.section === "Measures"
      ),
      facts: combinedData.filter((item) => item.section === "Facts"),
      claims: combinedData.filter((item) => item.section === "Claims"),
      // combinedData,
    };

    // console.log("Dynamic Data:", dynamicData);

    try {
      // Load the template file
      const response = await fetch("/tt.docx"); // Adjust path to your template
      const templateBlob = await response.blob();

      // Read the template file as an array buffer
      const arrayBuffer = await templateBlob.arrayBuffer();
      const zip = new PizZip(arrayBuffer);

      // Initialize Docxtemplater
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // Replace placeholders with dynamic data
      doc.render(dynamicData);

      // Generate the updated Word document
      const output = doc.getZip().generate({ type: "blob" });

      // Trigger download
      saveAs(output, "PopulatedTemplate.docx");

      try {
        const updatedResponse = await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-result/${id}`,
          {Data, result: resultData}
        );
  
        // console.log("Result updated successfully:", updatedResponse.data);
        // setResultData(updatedResponse.data); // Update state with the latest result
      } catch (error) {
        console.error("Error updating result:", error);
      }

    } catch (error) {
      console.error("Error generating document:", error);
    }
  };

  const handleFeedback = async () => {
    try {
      const updatedResponse = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-result/${id}`,
        {Data, result: resultData}
      );

      // console.log("Result updated successfully:", updatedResponse.data);
      // setResultData(updatedResponse.data); // Update state with the latest result
    } catch (error) {
      console.error("Error updating result:", error);
    }
  }

  return (
    <div className="h-screen  w-full flex flex-col items-center justify-center ">
      <Navbar />
      <div className=" h-[10vh] md:h-[20vh] lg:h-[12vh] w-[80%] flex flex-col items-center border-b justify-center   ">
        <h1 className=" text-[8.5vw] lg:text-[3vw]  ">Final Results</h1>
        {/* <p className=' text-[4vw] lg:text-[1.5vw] text-center '>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p> */}
      </div>
      <div className=" w-full h-[77vh] overflow-y-scroll px-[5vw] py-[2vw]  ">
        {resultData ? (
          <div className=" border rounded-[10px] px-[2vw] py-[4vw]  ">
            <form
              onSubmit={handleSubmit}
              className="relative flex flex-col gap-[4vw]"
            >
              <div className="complainantInfo w-full px-[3vw] flex flex-col gap-[2vw] ">
                <h1 className=" text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300 ">
                  Complainant Details:
                </h1>
                <div className=" grid-cols-2 grid gap-[2vw]  ">
                  <TextInput
                    labelName="First Name"
                    placeholder="First Name"
                    type="text"
                    inputName="complainantfirstname"
                    required={true}
                    value={Data.complainant.firstName}
                    onChange={(e) =>
                      updateField("complainant", "firstName", e.target.value)
                    }
                  />
                  <TextInput
                    labelName="Family Name"
                    placeholder="Family Name"
                    type="text"
                    inputName="complainantfamilyname"
                    required={true}
                    value={Data.complainant.familyName}
                    onChange={(e) =>
                      updateField("complainant", "familyName", e.target.value)
                    }
                  />
                  <DateInput
                    labelName="Date of birth"
                    inputName="complainantDOB"
                    required={true}
                    value={Data.complainant.dob}
                    onChange={(e) =>
                      updateField("complainant", "dob", e.target.value)
                    }
                  />
                  <CountryOption
                    labelName="Nationality"
                    inputName="complainantnationality"
                    required={true}
                    value={Data.complainant.nationality}
                    onChange={(e) =>
                      updateField("complainant", "nationality", e.target.value)
                    }
                  />
                  <TextInput
                    labelName="Email"
                    placeholder="Email"
                    type="email"
                    inputName="complainantemail"
                    required={true}
                    value={Data.complainant.email}
                    onChange={(e) =>
                      updateField("complainant", "email", e.target.value)
                    }
                  />
                  <CustomPhoneInput
                    // required={true}
                    labelName="Phone Number"
                    inputName="complainantphoneno"
                    value={Data.complainant.phone}
                    onChange={(e) =>
                      updateField("complainant", "phone", e.target.value)
                    }
                  />
                  <TextArea
                    required={true}
                    labelName="Address"
                    placeholder="Enter your address"
                    inputName="complainantaddress"
                    value={Data.complainant.address}
                    onChange={(e) =>
                      updateField("complainant", "address", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="victimInfo w-full px-[3vw] flex flex-col gap-[2vw] ">
                <h1 className=" text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300 ">
                  Victim Details:
                </h1>
                <div className=" grid-cols-2 grid gap-[2vw]  ">
                  <TextInput
                    labelName="First Name"
                    placeholder="First Name"
                    type="text"
                    inputName="victimfirstname"
                    required={true}
                    value={Data.victim.firstName}
                    onChange={(e) =>
                      updateField("victim", "firstName", e.target.value)
                    }
                  />
                  <TextInput
                    labelName="Family Name"
                    placeholder="Family Name"
                    type="text"
                    inputName="victimfamilyname"
                    required={true}
                    value={Data.victim.familyName}
                    onChange={(e) =>
                      updateField("victim", "familyName", e.target.value)
                    }
                  />
                  <DateInput
                    labelName="Date of birth"
                    inputName="victimDOB"
                    required={true}
                    value={Data.victim.dob}
                    onChange={(e) =>
                      updateField("victim", "dob", e.target.value)
                    }
                  />
                  <CountryOption
                    labelName="Nationality"
                    inputName="victimnationality"
                    required={true}
                    value={Data.victim.nationality}
                    onChange={(e) =>
                      updateField("victim", "nationality", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="anonymizationPreference w-full px-[3vw] flex flex-col gap-[2vw] ">
                <h1 className=" text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300 ">
                  Anonymization Preference:
                </h1>
                <div className=" gap-[2vw] text-[3vw] lg:text-[1.3vw]  ">
                  <label className="flex flex-col gap-[0.7vw]  ">
                    <p>
                      &nbsp;Would you like for the complainant / victim’s name
                      to be anonymized?<span className="text-red-500"> *</span>
                    </p>
                  </label>
                  <div className="px-[9vw] pt-[2vw] flex gap-[10vw] ">
                    <label>
                      <input
                        type="radio"
                        name="anonymizationPreference"
                        className=" accent-green-500 mr-[0.5vw] "
                        required={true}
                        checked={Data.anonymizationPreference === true} // Check if the state matches
                        onChange={(e) =>
                          updateField(
                            "anonymizationPreference",
                            "preference",
                            true
                          )
                        }
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        required={true}
                        name="anonymizationPreference"
                        className=" accent-red-500 mr-[0.5vw]  "
                        checked={Data.anonymizationPreference === false} // Check if the state matches
                        onChange={(e) =>
                          updateField(
                            "anonymizationPreference",
                            "preference",
                            false
                          )
                        }
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="countriesInvolved w-full px-[3vw] flex flex-col gap-[2vw] ">
                <h1 className=" text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300 ">
                  State Party or States Parties Concerned:
                </h1>
                <div className=" grid-cols-2 grid gap-[2vw]  ">
                  <label className="flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw]  ">
                    <p>
                      &nbsp;Specify the countries involved (Seperated by comma)
                      <span className="text-red-500"> *</span>
                    </p>
                    <input
                      required
                      type="text"
                      id="countriesInput"
                      name="countriesinvolved"
                      value={Data.countriesInvolved.countries}
                      onChange={(e) => {
                        // setSelectedCountries(e.target.value); // Allow manual editing
                        updateField(
                          "countriesInvolved",
                          "countries",
                          e.target.value
                        );
                      }}
                      placeholder="Enter countries involved"
                      className=" h-[6vw] lg:h-[3vw] w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] "
                    />
                  </label>
                </div>
              </div>
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
              <div className="priorSubmissions w-full px-[3vw] flex flex-col gap-[2vw] ">
                <h1 className=" text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300 ">
                  Prior Submissions:
                </h1>
                <div className=" gap-[2vw] text-[3vw] lg:text-[1.3vw]  ">
                  <label className="flex flex-col gap-[0.7vw]  ">
                    <p>
                      &nbsp;Have you submitted the same matter under another
                      procedure of regional / international investigation or
                      settlement?<span className="text-red-500"> *</span>
                    </p>
                  </label>
                  <div className="px-[9vw] pt-[2vw] flex gap-[10vw] ">
                    <label>
                      <input
                        type="radio"
                        name="priorSubmissions"
                        required={true}
                        className=" accent-green-500 mr-[0.5vw] "
                        checked={Data.priorSubmissions.hasSubmitted === true} // Check if the state matches
                        onChange={() =>
                          updateField("priorSubmissions", "hasSubmitted", true)
                        }
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="priorSubmissions"
                        className=" accent-red-500 mr-[0.5vw] "
                        required={true}
                        checked={Data.priorSubmissions.hasSubmitted === false} // Check if the state matches
                        onChange={() =>
                          updateField("priorSubmissions", "hasSubmitted", false)
                        }
                      />
                      No
                    </label>
                  </div>
                  {Data.priorSubmissions.hasSubmitted && (
                    <TextArea
                      labelName="Please indicate the procedure or body, the date of submission, the authors and the claims invoked, and the decision adopted"
                      placeholder="Enter the details here"
                      inputName="priorsubmissionsdetails"
                      required={true}
                      value={Data.priorSubmissions.details}
                      onChange={(e) =>
                        updateField(
                          "priorSubmissions",
                          "details",
                          e.target.value
                        )
                      }
                      className="mt-[2vw]"
                    />
                  )}
                </div>
              </div>
              <ol className="text-white list-decimal list-inside flex flex-col items-start justify-center gap-[4vw] ">
                <div className="committee  w-full px-[3vw] flex flex-col gap-[2vw]">
                  <h1 className="text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300">
                    Name of Committee to which the communication is submitted:
                  </h1>
                  {resultData?.result?.Section1?.name_of_committee?.map(
                    (committee: any, index: any) => (
                      <div key={index} className=" flex w-full gap-[1vw] ">
                        <input
                          value={committee}
                          onChange={(e) =>
                            updateResultData(
                              "Section1",
                              "name_of_committee",
                              index,
                              e.target.value
                            )
                          }
                          className="h-[4vw]  w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] py-[1.5vw] lg:py-[1vw] overflow-hidden resize-none "
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto"; // Reset height to auto to calculate new height
                            target.style.height = `${target.scrollHeight}px`; // Set height based on content
                          }}
                        ></input>
                      </div>
                    )
                  )}
                </div>
                <div className="interimMeasures w-full px-[3vw] flex flex-col gap-[2vw]">
                  <h1 className="text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300">
                    Request for Interim Measures or Protection:
                  </h1>
                  {resultData?.result?.Section9?.justification?.map(
                    (justification: any, index: any) => (
                      <div key={index} className=" flex w-full gap-[1vw] ">
                        <li></li>
                        <textarea
                          ref={(el) => {
                            // textareaRefs.current[index] = el;
                          }} // Add textarea reference dynamically
                          //  ref={(el) => (textareaRefs.current[index] = el)}
                          value={justification}
                          onChange={(e) =>
                            updateResultData(
                              "Section9",
                              "justification",
                              index,
                              e.target.value
                            )
                          }
                          className="h-[7vw]  w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] py-[1.5vw] lg:py-[1vw] "
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto"; // Reset height to auto to calculate new height
                            target.style.height = `${target.scrollHeight}px`; // Set height based on content
                          }}
                        ></textarea>
                      </div>
                    )
                  )}
                </div>
                <div className="facts w-full px-[3vw] flex flex-col gap-[2vw]">
                  <h1 className="text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300">
                    Facts of the Case:
                  </h1>
                  {resultData?.result?.Section10?.facts_summary?.map(
                    (fact: any, index: any) => (
                      <div key={index} className=" flex w-full gap-[1vw] ">
                        <li></li>
                        <textarea
                          ref={(el) => {
                            // textareaRefs.current[index] = el;
                          }} // Add textarea reference dynamically
                          value={fact}
                          onChange={(e) =>
                            updateResultData(
                              "Section10",
                              "facts_summary",
                              index,
                              e.target.value
                            )
                          }
                          // onChange={(e) => {
                          //   // Update the specific index in the facts_summary array
                          //   const updatedFacts = [
                          //     ...resultData.result.Section10.facts_summary,
                          //   ];
                          //   updatedFacts[index] = e.target.value;

                          //   // Update the Zustand store with the new facts_summary array
                          //   setResultData({
                          //     ...resultData,
                          //     result: {
                          //       ...resultData.result,
                          //       Section10: {
                          //         ...resultData.result.Section10,
                          //         facts_summary: updatedFacts,
                          //       },
                          //     },
                          //   });
                          // }}
                          className="h-[7vw]  w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] py-[1.5vw] lg:py-[1vw] "
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto"; // Reset height to auto to calculate new height
                            target.style.height = `${target.scrollHeight}px`; // Set height based on content
                          }}
                        ></textarea>
                      </div>
                    )
                  )}
                </div>
                <div className="claims w-full px-[3vw] flex flex-col gap-[2vw]">
                  <h1 className="text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300">
                    Claims:
                  </h1>
                  {resultData?.result?.Section11?.supporting_claims?.map(
                    (claim: any, index: any) => (
                      <div key={index} className=" flex w-full gap-[1vw] ">
                        <li></li>
                        <textarea
                          ref={(el) => {
                            // textareaRefs.current[index] = el;
                          }} // Add textarea reference dynamically
                          value={claim}
                          onChange={(e) =>
                            updateResultData(
                              "Section11",
                              "supporting_claims",
                              index,
                              e.target.value
                            )
                          }
                          className="h-[7vw]  w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] py-[1.5vw] lg:py-[1vw] "
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = "auto"; // Reset height to auto to calculate new height
                            target.style.height = `${target.scrollHeight}px`; // Set height based on content
                          }}
                        ></textarea>
                      </div>
                    )
                  )}
                </div>
                <div className="committee  w-full px-[3vw] flex flex-col justify-start gap-[1vw]">
                  <div>
                  <TextArea
                    required={false}
                    labelName="Feedback"
                    placeholder="Enter your feedback here"
                    inputName="feedback"
                    value={Data.feedback.content}
                    onChange={(e) =>
                      updateField("feedback", "content", e.target.value)
                    }
                  />
                  </div>
                  
                  <button onClick={handleFeedback}  className="p-[0.3vw] border rounded-[10px] w-[4vw] flex items-center justify-center hover:bg-blue-400   "  >Send</button>
                </div>
                
              </ol>

              <div className="relative h-[3.5vw] ">
                <button
                  type="submit"
                  onClick={handleExport}
                  className="absolute right-[6vw] w-[12vw]  text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center border p-[1vw] lg:p-[0.8vw] rounded-[10px] bg-blue-400 "
                >
                  Download File
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className=" border h-full rounded-[10px] px-[2vw] py-[4vw] flex items-center justify-center  ">
            <h3 className="text-[8.5vw] lg:text-[3vw] w-[70%] text-center flex flex-col items-center justify-center gap-[1vw] ">
              No results to show... <br />
              Please fill up the form to generate results
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

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
};

export default Page;
