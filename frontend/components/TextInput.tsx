import React from 'react'

type Props = {
    labelName: string;
    type: string;
    inputName: string;
    placeholder: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput:React.FC<Props> = ({labelName,placeholder,type,inputName,required,onChange,value}) => {
  return (
    <label
            className="flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw]  "
          >
            <p>&nbsp;{labelName}<span className="text-red-500" > *</span></p>
            <input
              required={required}
              type={type}
              name={inputName}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className=" h-[6vw] lg:h-[3vw] w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] "
            />
          </label>
  )
}

export default TextInput