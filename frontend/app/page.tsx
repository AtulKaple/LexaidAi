"use client";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import dotenv from "dotenv";
dotenv.config();

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/query`,
        {
          prompt: prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(res.data);
    } catch (err: AxiosError | any) {
      console.error(err);
      setError(err.message || "Error communicating with the backend");
    } finally {
      setLoading(false);
    }
  };

  //Format Output

  const formatText = (text: any) => {
    // Replace **...** with <b>...</b> for bold text
    const boldFormatted = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // Replace single * with a bullet point
    const bulletFormatted = boldFormatted.replace(/(^|\s)\*(?=\s|$)/g, "<br>•");

    return bulletFormatted;
  };

  return (
    
<div className="h-screen  w-full flex flex-col items-center gap-[5vw]  ">
<Navbar />
<div className="w-[80%] h-[70%] flex flex-col items-center justify-center gap-[5vw] border -[5vw] rounded-[10px]  ">

<h1  className=" text-[4vw] underline underline-offset-8 ">Lexaid AI</h1>
<div className="flex justify-between gap-[5vw]" >
<Link href="/form">
                <button
                  className={`text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px] bg-blue-400  `}
                >
                  Eligibility Test
                </button>
              </Link>
              <Link href="/user-info">
                <button
                  className={`text-[2.8vw] lg:text-[1.2vw] flex items-center justify-center right-[10vw] border p-[1vw] lg:p-[0.8vw] rounded-[10px] bg-blue-400  `}
                >
                  Document Generation
                </button>
              </Link>
</div>
</div>


</div>




    // <div className=" flex flex-col gap-[5vw] bg-black items-center justify-center h-screen font-[family-name:var(--font-geist-sans)]">
    //   <div className=" flex gap-[2vw] ">
    //     <input
    //       type="text"
    //       value={prompt}
    //       onChange={(e) => setPrompt(e.target.value)}
    //       onKeyDown={(e) => {
    //         if (e.key === "Enter") {
    //           handleSubmit(e);
    //         }
    //       }}
    //       placeholder="write your prompt"
    //       className="text-black h-[5vw] p-[2vw] rounded-[20px] "
    //     />
    //     <button className="border p-[1vw] rounded-full w-[10vw] hover:bg-white hover:text-black " onClick={handleSubmit}>
    //       {loading ? "Loading..." : "Generate"}
    //     </button>
    //   </div>

    //   <div className=" w-[50%]  h-[25vw] border p-[2vw] rounded-[20px] overflow-auto ">
    //     {error && <p style={{ color: "red" }}>Error: {error}</p>}
    //     <div
    //       style={{ whiteSpace: "pre-wrap" }}
    //       dangerouslySetInnerHTML={{
    //         __html: formatText(response),
    //       }}
    //     ></div>
    //   </div>
    // </div>
  );
}
