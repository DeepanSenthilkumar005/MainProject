import React from "react";
import { GoBeaker } from "react-icons/go";

function ReadyPage() {
  return (
    <div className="w-full md:w-3/4 flex items-center flex-col gap-4 shadow-lg p-4 rounded-md border-gray-700">
      <GoBeaker className="p-3 text-8xl text-blue-400 bg-blue-100/70 rounded-full" />
      <p className="font-bold text-2xl font-mono">Ready to Analysis</p>
      <p className="text-justify hyphens-auto text-lg text-gray-400 font-mono">
        Enter the text or the File to begon the AI content detection process.
        Your result will be appear here.
      </p>
    </div>
  );
}

export default ReadyPage;
