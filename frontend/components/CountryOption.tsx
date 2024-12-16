import { countries } from '@/app/countries';
import Image from 'next/image'
import React from 'react'

type Props = {
    labelName: string;  
    inputName: string;
    required?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CountryOption:React.FC<Props> = ({labelName,inputName,required,value,onChange}) => {
  return (
    <label className="flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw]">
            <p>&nbsp;{labelName}<span className="text-red-500" > *</span></p>
            <div className="relative ">
              <select
                required
                name={inputName}
                // value={(e:any)=>e.target.value}
                value={value}
                onChange={onChange}
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
                className=" h-auto w-auto absolute bottom-[2.1vw] right-[10vw] lg:bottom-[1.2vw] lg:right-[10vw] pointer-events-none "
              />
            </div>
          </label>
  )
}

export default CountryOption