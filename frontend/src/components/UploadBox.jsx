import React, { useState } from "react";

function UploadBox() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    // if (!file || !result) {
    //   alert("Please select a file first!");
    //   return;
    // }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        setResult("❌ Error: " + data.error);
      } else {
        setResult(data.content);
      }
    } catch (error) {
      setResult("❌ Upload failed: " + error.message);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
    }
  };

  const handleAnalyze = async () => {
    if (!result) {
      alert("No text available to analyze!");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      alert("❌ Analysis failed: " + error.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl flex justify-center font-semibold text-[#f4fafe] mb-4">
        Upload your content
      </h2>

      <div className="w-full flex flex-col items-center mx-auto justify-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <input
          type="file"
          className="w-full mb-4 cursor-pointer"
          onChange={handleFileChange}
        />
        or
        <textarea
          className="w-full h-32 p-2 border border-gray-300 rounded mb-4 mt-4"
          placeholder="Or paste your text here..."
          value={result}
          onChange={(e) => setResult(e.target.value)}
        ></textarea>
        <button
          onClick={handleUpload}
          className="w-full cursor-pointer bg-[#44727f] text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Upload
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded max-h-screen overflow-y-auto w-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Extracted Text:</h3>
            <button
              onClick={handleCopy}
              className="text-sm bg-gray-700 text-white py-1 px-3 rounded hover:bg-gray-900"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="whitespace-pre-wrap">{result}</p>
        </div>
      )}

      <button
        onClick={handleAnalyze}
        className="mt-4 bg-gray-700 text-white py-2 px-4 rounded"
      >
        Compare from Text
      </button>

      {analysis && (
        <div className="mt-6 p-4 bg-white rounded shadow-md">
          <h3 className="font-semibold mb-2">Analysis Result:</h3>
          <p>Prediction: {analysis.prediction}</p>
          <p>AI-generated: {analysis.ai_generated_percent}%</p>
          <p>Human-written: {analysis.human_written_percent}%</p>
        </div>
      )}
    </div>
  );
}

export default UploadBox;
