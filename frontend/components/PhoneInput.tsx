import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

type Props = {
  labelName: string;
  // type: string;
  inputName: string;
  // placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const CustomPhoneInput: React.FC<Props> = ({labelName,inputName,value,onChange,required}) => {
  return (
    <>
      <label className="flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw]  ">
        <p>
          &nbsp;{labelName}<span className="text-red-500"> *</span>
        </p>
        {/* Styled in global.css */}
        <PhoneInput
        name={inputName}
          international
          defaultCountry="CH"
          value={value}
          onChange={(value) => onChange({ target: { value } } as unknown as React.ChangeEvent<HTMLInputElement>)}
          className="h-[6vw] lg:h-[3vw] w-[80%] rounded-[10px] bg-black border text-black px-[2vw] lg:px-[1vw] "
        />
        {required && !value && (
        <span className="text-red-500 text-[2vw] lg:text-[1vw] mt-[0.5vw]">
          This field is required
        </span>
      )}
      </label>
    </>
  );
};

export default CustomPhoneInput;
