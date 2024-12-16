import { useFormStore } from "@/app/store";
import React, { useState } from "react";

const FileUpload: React.FC = () => {
  // interface FileDetails {
  //   id: number;
  //   name: string;
  //   size: string;
  //   type: string;
  // }

  // const [files, setFiles] = useState<FileDetails[]>([]);

  const { uploadedFiles, addFiles, removeFile } = useFormStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files ? Array.from(event.target.files) : []; // Convert FileList to array
    const fileDetails = uploadedFiles.map((file: File) => ({
      id: Date.now() + Math.random(), // Unique ID for each file
      name: file.name,
      size: (file.size / 1024).toFixed(2), // Convert size to KB
      type: file.type || "Unknown",
      file,
    }));
    // setFiles((prevFiles) => [...prevFiles, ...fileDetails]); // Append new files
    addFiles(fileDetails);
  };

  const deleteFile = (id: any) => {
    // setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id)); // Remove file by ID
    removeFile(id)
  };

  return (
    <div className=" flex flex-col items-center justify-center ">
      <form
        action=""
        className="p-[5vw] lg:p-[2vw] w-full flex-col gap-[3vw] flex items-center justify-center   "
      >
        <input
          type="file"
          name="file"
          id="file"
          multiple
          className=" hidden file-input "
          onChange={handleFileChange}
        ></input>
        <label
          htmlFor="file"
          className="flex flex-col gap-[1vw] h-[30vw] lg:h-[17vw] w-[90%] lg:w-[60%] items-center justify-center cursor-pointer "
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3csvg width="100%25" height="100%25" xmlns="http://www.w3.org/2000/svg"%3e%3crect width="100%25" height="100%25" fill="none" rx="41" ry="41" stroke="%23828282" stroke-width="3" stroke-dasharray="6%2c 14" stroke-dashoffset="0" stroke-linecap="square"/%3e%3c/svg%3e\')',
            borderRadius: "41px",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="42"
            height="32"
            id="upload"
            className=" scale-[0.7] lg:scale-100"
          >
            <path
              fill="#828282"
              d="M33.958 12.988C33.531 6.376 28.933 0 20.5 0 12.787 0 6.839 5.733 6.524 13.384 2.304 14.697 0 19.213 0 22.5 0 27.561 4.206 32 9 32h6.5a.5.5 0 0 0 0-1H9c-4.262 0-8-3.972-8-8.5C1 19.449 3.674 14 9 14h1.5a.5.5 0 0 0 0-1H9c-.509 0-.99.057-1.459.139C7.933 7.149 12.486 1 20.5 1 29.088 1 33 7.739 33 14v1.5a.5.5 0 0 0 1 0v-1.509c3.019.331 7 3.571 7 8.509 0 3.826-3.691 8.5-8 8.5h-7.5c-3.238 0-4.5-1.262-4.5-4.5V12.783l4.078 4.07a.5.5 0 1 0 .708-.706l-4.461-4.452c-.594-.592-1.055-.592-1.648 0l-4.461 4.452a.5.5 0 0 0 .707.707L20 12.783V26.5c0 3.804 1.696 5.5 5.5 5.5H33c4.847 0 9-5.224 9-9.5 0-5.167-4.223-9.208-8.042-9.512z"
            ></path>
          </svg>
          <h4 className="text-[2.6vw] lg:text-[1.3vw] select-none ">
            &nbsp;Choose a file or drag & drop it here.
          </h4>
          <p className="text-[1.8vw] lg:text-[0.9vw] select-none">
            PDF, DOCX, JPEG and PNG formats, up to 10 MB
          </p>
          <div className="border p-[1vw] lg:p-[0.7vw] rounded-[10px] text-[2.6vw] lg:text-[1.3vw]">Upload File</div>
        </label>
      </form>
      {uploadedFiles.length > 0 && (
        <table className="text-[2.2vw] lg:text-[1.1vw] border-separate border-spacing-0  rounded-[10px] ">
          <thead>
            <tr>
              <th className="border p-[9px] border-[#828282] rounded-tl-[10px] ">
                Name
              </th>
              <th className="border p-[9px] border-[#828282]">Size (KB)</th>
              <th className="border p-[9px] border-[#828282]">Type</th>
              <th className="border p-[9px] border-[#828282] rounded-tr-[10px]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file, index) => (
              <tr key={file.id}>
                <td
                  className={`border p-[9px] border-[#828282] ${
                    index === uploadedFiles.length - 1 ? "rounded-bl-[10px]" : ""
                  }`}
                >
                  {file.name}
                </td>
                <td className="border p-[9px] border-[#828282]">{file.size}</td>
                <td className="border p-[9px] border-[#828282]">{file.type}</td>
                <td
                  className={`border p-[9px] border-[#828282] ${
                    index === uploadedFiles.length - 1 ? "rounded-br-[10px]" : ""
                  }`}
                >
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="text-white bg-red-500 border-none rounded-[4px] py-[5px] px-[10px] cursor-pointer"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FileUpload;
