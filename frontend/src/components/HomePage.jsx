import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import ResultBox from "./ResultBox";
import ReadyPage from "./ReadyPage";

function HomePage() {
  const [text, setText] = useState("");
  const [enableBtn, setEnableBtn] = useState(false);
  const [analyse, setAnalyse] = useState(false);
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("Browse file");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "Browse file");
  };

  useEffect(() => {
    if (text.length > 10) {
      setEnableBtn(true);
    } else {
      setEnableBtn(false);
    }
  }, [text]);

  function handleClick() {
    setAnalyse(true);
    handleClear();
  }

  function handleClear() {
    setText("");
    setFileName("Browse file");
    fileRef = null;
  }

  return (
    <div className="md:max-h-screen h-fit w-full p-2 flexflex-col">
      <header className="w-full text-center">
        <h1 className="text-3xl font-bold text-[#000000] h-[5vh] md:h-fit top-0 sticky mb-6">
          AI Content Detector
        </h1>
      </header>
      <div className="content bg-white/60 grid md:grid-cols-2 grid-cols-1 gap-4 w-full h-full md:h-[90vh] rounded-md">
        <div className="left w-full h-[90vh] md:h-full gap-2 flex flex-col p-4 justify-between shadow">
          {/* Text for the INput */}
          <div className="inputByText w-full h-1/3 gap-2 p-4 ">
            <label htmlFor="textInput" className="text-gray-400 text-xl">
              Paste your text here :
            </label>
            <br />
            <textarea
              name="textInputs"
              onChange={(e) => setText(e.target.value)}
              value={text}
              id="textInputs"
              placeholder="Paste your text here (Minimum 100 words)........."
              className="p-2 rounded-xl w-full h-full bg-[#f6f6f8] border-2 border-gray-200"
            />
          </div>
          {/* Or text will comes here */}
          <p className="text-center md:m-2 text-2xl text-gray-600 font-mono">
            or
          </p>
          {/* File Upload will comes here */}
          <div
            className={`${
              text.length > 0 ? "cursor-not-allowed" : ""
            } inputByFile w-full h-1/3 gap-2 p-4 rounded-xl  bg-[#f6f6f8] border-2 border-gray-400 border-dotted`}
          >
            <div className="Text text-center flex flex-col justify-items-center">
              <p className="font-semibold font-mono text-xl">
                Drag and Drop a file
              </p>
              <p className="font-mono text-gray-600">
                Supports: .txt, .pdf, .docx, .md
              </p>
              {/* File come here for the upload need to add the drag and drop functionality */}
              {/* <input type="file" className="bg-gray-500" placeholder="Browse File" name="" id="" /> */}
              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              {/* Custom button */}
              <button
                onClick={() => {
                  if (text.length > 0)
                    toast.error("Clear the text in the text Area");
                  else fileRef.current.click();
                }}
                className={`p-2 bg-gray-300 rounded-md ${
                  text.length > 0 ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {fileName}
              </button>
            </div>
          </div>
          <div className="btn flex w-full gap-2">
            <button
              type="button"
              onClick={handleClick}
              className={`${
                enableBtn
                  ? "bg-blue-400 cursor-pointer hover:bg-blue-500"
                  : "bg-gray-400 cursor-not-allowed"
              } duration-200 transition-all ease-in-out rounded-md p-2 w-2/3`}
            >
              Analyze Content
            </button>
            <button
              type="button"
              className={`bg-gray-400 cursor-pointer rounded-md p-2 w-1/3 ${
                text.length > 0 ? "bg-red-500 text-white" : ""
              }`}
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="right w-full h-[95vh] md:h-full gap-2 flex flex-col p-4 text-center my-auto justify-center m-auto items-center ">
          {analyse ? <ResultBox /> : <ReadyPage />}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
