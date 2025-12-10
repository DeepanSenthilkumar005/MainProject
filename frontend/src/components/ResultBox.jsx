import Speedometer from "./Speedometer";

export default function ResultBox({ result }) {
  return (
    <div className="w-full md:w-3/4 flex items-center flex-col gap-4 shadow-lg p-4 rounded-md border-gray-700">
      <p className="font-mono font-bold text-gray-600 text-left w-full">Analysis Results</p>
      <div className="Analysic Graph">
        <Speedometer value={50} />
      </div>
      <p className="font-mono font-bold text-gray-600 w-full">Result : This text appears 100% AI Generated based on our detection model.</p>
      <hr />
      <div className="grid grid-cols-2 p-4 gap-4 font-mono font-semibold">
        <div className="wordCount">
          <p className=" text-gray-500">Word Count</p>
          123
        </div>
        <div className="wordCount">
          <p className=" text-gray-500">Sentence Count</p>
          123
        </div>
        <div className="wordCount">
          <p className=" text-gray-500">Reading</p>
          123
        </div>
        <div className="wordCount">
          <p className=" text-gray-500">MOdel</p>
          dummy
        </div>

      </div>
    </div>
  );
}
