"use client";
import CountryOption from "@/components/CountryOption";
import DateInput from "@/components/DateInput";
import Navbar from "@/components/Navbar";
import CustomPhoneInput from "@/components/PhoneInput";
import TextArea from "@/components/TextArea";
import TextInput from "@/components/TextInput";
import Image from "next/image";
import React, { useState } from "react";
import { useDataStore, useEligibilityStore } from "../store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { countries } from "../countries";


const Page: React.FC = () => {
  const [selectedCountries, setSelectedCountries] = useState("");
  const { Data, updateField } = useDataStore();
  const { eligibilityData } = useEligibilityStore();
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/lawyer-info"); // Navigate to the lawyer-info page
  };

  const handleCountryChange = (event: any) => {
    const country = event.target.value;
    if (!selectedCountries.includes(country)) {
      const updatedCountries = selectedCountries
        ? `${selectedCountries}, ${country}`
        : country;
      setSelectedCountries(updatedCountries);
      updateField("countriesInvolved", "countries", updatedCountries);
    }
  };
  return (
    <div className="h-screen  w-full flex flex-col items-center justify-center ">
      <Navbar />
      <div className=" h-[10vh] md:h-[20vh] lg:h-[12vh] w-[80%] flex flex-col items-center border-b justify-center   ">
        <h1 className=" text-[8.5vw] lg:text-[3vw]  ">Client Details</h1>
        {/* <p className=' text-[4vw] lg:text-[1.5vw] text-center '>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p> */}
      </div>
      <div className=" w-full h-[77vh] overflow-y-scroll px-[5vw] py-[2vw]  ">
        {/* {eligibilityData ? ( */}
          <div className=" border rounded-[10px] px-[2vw] py-[4vw]  ">
          <form onSubmit={handleNext} className="relative flex flex-col gap-[4vw]">
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
                <label
                  className="flex flex-col gap-[0.7vw]  "
                >
                  <p>
                    &nbsp;Would you like for the complainant / victim’s name to
                    be anonymized?<span className="text-red-500"> *</span>
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
                        updateField("anonymizationPreference", "preference", true)
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
                        updateField("anonymizationPreference", "preference", false)
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
                <label
                  className="flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw]  "
                >
                  <p>
                    &nbsp;Specify the countries involved (Seperated by comma)
                    <span className="text-red-500"> *</span>
                  </p>
                  <input
                    required
                    type="text"
                    id="countriesInput"
                    name="countriesinvolved"
                    value={Data.countriesInvolved.countries} // Check if the state matches
                    onChange={(e) => {
                      setSelectedCountries(e.target.value); // Allow manual editing
                      updateField("countriesInvolved", "countries", e.target.value);
                    }}
                    placeholder="Enter countries involved"
                    className=" h-[6vw] lg:h-[3vw] w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] "
                  />
                </label>
                <div className="relative ">
                  <select
                    id="countrySelect"
                    onChange={handleCountryChange}
                    // required
                    // name="country"
                    value=""
                    className="z-50 appearance-none absolute bottom-0  bg-black h-[6vw] lg:h-[3vw] w-[80%] rounded-[10px] border px-[2vw] lg:px-[1vw] "
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
                    className=" h-auto w-auto absolute bottom-[2.1vw] right-[10vw] lg:bottom-[1.2vw] lg:right-[10vw] pointer-events-none z-50 "
                  />
                </div>
              </div>
            </div>
            <div className="priorSubmissions w-full px-[3vw] flex flex-col gap-[2vw] ">
              <h1 className=" text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300 ">
                Prior Submissions:
              </h1>
              <div className=" gap-[2vw] text-[3vw] lg:text-[1.3vw]  ">
                <label
                  className="flex flex-col gap-[0.7vw]  "
                >
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
                        updateField( "priorSubmissions", "hasSubmitted", true)
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
                        updateField( "priorSubmissions", "hasSubmitted", false)
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
                   updateField( "priorSubmissions", "details", e.target.value)
                 }
                  className="mt-[2vw]"
               />
               )}
              </div>
            </div>
            <div className="interimMeasures w-full px-[3vw] flex flex-col gap-[2vw] ">
              <h1 className=" text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300 ">
                Request for Interim Measures or Protection:
              </h1>
              <div className=" gap-[2vw] text-[3vw] lg:text-[1.3vw]  ">
                <label
                  className="flex flex-col gap-[0.7vw]  "
                >
                  <p>
                    &nbsp;Are you requesting interim measures or measures of
                    protection?<span className="text-red-500"> *</span>
                  </p>
                </label>
                <div className="px-[9vw] pt-[2vw] flex gap-[10vw] ">
                  <label>
                    <input
                      type="radio"
                      name="interimmeasures"
                      className=" accent-green-500 mr-[0.5vw] "
                      required={true}
                      checked={Data.interimMeasures.isRequesting === true} // Check if the state matches
                      onChange={() =>
                        updateField( "interimMeasures", "isRequesting", true)
                      }
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="interimmeasures"
                      required={true}
                      className=" accent-red-500 mr-[0.5vw] "
                      checked={Data.interimMeasures.isRequesting === false} // Check if the state matches
                      onChange={() =>
                        updateField( "interimMeasures", "isRequesting", false)
                      }
                    />
                    No
                  </label>
                </div>
               {Data.interimMeasures.isRequesting && (
                 <TextArea
                 labelName="Indicate what kind of specific measures and justify the request."
                 placeholder="Enter the details here"
                 inputName="interimmeasuresdetails"
                 required={true}
                 value={Data.interimMeasures.details}
                 onChange={(e) =>
                   updateField( "interimMeasures", "details", e.target.value)
                 }
                 className="mt-[2vw]"
               />
               )}
              </div>
            </div>
            <div className="facts w-full px-[3vw] flex flex-col gap-[2vw] ">
              <h1 className=" text-[8.5vw] lg:text-[2vw] underline underline-offset-4 text-blue-300 ">
                Facts of the Case:
              </h1>
              <div className=" gap-[2vw] text-[3vw] lg:text-[1.3vw]  ">
                <TextArea
                  labelName="Please provide a summary of the main facts of the case, in chronological order, including the dates, and information on administrative/judicial remedies."
                  placeholder="Enter the details here"
                  inputName="facts"
                  required={true}
                  value={Data.facts}
                    onChange={(e) =>
                      updateField("facts", "details", e.target.value)
                    }
                />
              </div>
            </div>

            <div className="relative h-[3.5vw] ">
              {/* <Link href="/lawyer-info" > */}
              <button
                type="submit"
                className="absolute right-[6vw] w-[6vw]  text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center border p-[1vw] lg:p-[0.8vw] rounded-[10px] bg-blue-400 "
              >
                Next
              </button>
              {/* </Link> */}
            </div>
          </form>
        </div>
          {/* ):(
           <div className=" border h-full rounded-[10px] px-[2vw] py-[4vw] flex items-center justify-center  ">
             <h3 className="text-[8.5vw] lg:text-[3vw] w-[70%] text-center flex flex-col items-center justify-center gap-[2vw] ">
               {/* No results to show... <br />
               Please check eligibility of your case first.
               <Link href="/form">
                 <button 
        //           className={`text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px] bg-blue-400  `}
        //         >
        //           Check Eligibility
        //         </button>
        //       </Link>
        //     </h3>
        //   </div>
        //  )
        //  } */}
      </div>
    </div>
  );
};

export default Page;
