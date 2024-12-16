"use client"
import React, { useEffect, useRef } from 'react'

type Props = {
    labelName: string;
    placeholder: string;
    inputName: string;
    required?: boolean;
    value: string;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}



const TextArea : React.FC<Props> = ({labelName,inputName,placeholder,required,value,onChange,className}) => {


  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"; // Reset height to auto
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Adjust height based on content
    }
  }, [value]); // Trigger effect whenever `value` changes


  return (
    <label
    className={`flex flex-col text-[3vw] lg:text-[1.3vw] gap-[0.7vw] ${className}  `}
  >
    
    <p>&nbsp;{labelName}<span className="text-red-500" > *</span></p>
    <textarea
      ref={textAreaRef} // Attach the ref to the textarea
      required={required}
      name={inputName}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-[6vw]  w-[80%] rounded-[10px] bg-black border text-white px-[2vw] lg:px-[1vw] py-[1.5vw] lg:py-[1vw] overflow-hidden resize-none "
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement;
        target.style.height = "auto"; // Reset height to auto to calculate new height
        target.style.height = `${target.scrollHeight}px`; // Set height based on content
      }}
    />
  </label>
  )
}

export default TextArea