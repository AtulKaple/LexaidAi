import Image from 'next/image';
import React from 'react'

type Props = {
    labelName: string;
  
    inputName: string;
    // placeholder: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateInput:React.FC<Props> = ({labelName,inputName,required,value,onChange}) => {
  return (
    <label

            className="flex relative flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw]  "
          >
            <p>&nbsp;{labelName}<span className="text-red-500" > *</span></p>
            <input
              required={required}
              type="date"
              name={inputName}
              value={value}
              onChange={onChange}
            //   placeholder={placeholder}
              className=" h-[6vw] lg:h-[3vw] w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] "
              style={{
                WebkitAppearance: "none"
              }}
              
            />
            <Image
                src="/calendar.png"
                alt="calendar"
                height={7}
                width={12}
                className=" h-auto w-auto absolute bottom-[2.1vw] right-[10vw] lg:bottom-[0.9vw] lg:right-[8.7vw] pointer-events-none "
              />
          </label>
  )
}

export default DateInput