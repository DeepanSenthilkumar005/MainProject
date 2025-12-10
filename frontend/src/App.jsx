import { useState } from "react";
import UploadBox from "./components/UploadBox";
import ResultBox from "./components/ResultBox";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import {Toaster} from "react-hot-toast"
export default function App() {
  return (
    <div className="min-h-screen bg-[#e4e4e4] flex flex-col items-center">
    <Toaster position="top-right" reverseOrder={false} />
      <HomePage />
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadBox />} />
          <Route path="/result" element={<ResultBox />} />
        </Routes>
      </BrowserRouter> */}
      {/* <UploadBox /> */}
    </div>
  );
}
