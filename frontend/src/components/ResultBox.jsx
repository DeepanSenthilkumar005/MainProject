import Speedometer from "./Speedometer";

export default function ResultBox({ result, text }) {
  const wordCount = text ? (text.match(/\b\w+\b/g) || []).length : 0;
  const sentenceCount = text ? text.split(/[.!?]+/).filter(sent => sent.trim().length > 0).length : 0;
  const readingTime = Math.ceil(wordCount / 200); // minutes

  return (
    <div className="w-full md:w-3/4 flex items-center flex-col gap-4 shadow-lg p-4 rounded-md border-gray-700">
      <p className="font-mono font-bold text-gray-600 text-left w-full">Analysis Results</p>
      <div className="Analysic Graph">
        <Speedometer value={result ? result.ai_generated_percent : 0} />
      </div>
      <p className="font-mono text-lg">Prediction: {result ? result.prediction : 'Analyzing...'}</p>
      <hr />
      <div className="grid grid-cols-2 p-4 gap-4 font-mono font-semibold">
        <div className="wordCount">
          <p className=" text-gray-500">Word Count</p>
          {wordCount}
        </div>
        <div className="sentenceCount">
          <p className=" text-gray-500">Sentence Count</p>
          {sentenceCount}
        </div>
        <div className="readingTime">
          <p className=" text-gray-500">Reading Time (min)</p>
          {readingTime}
        </div>
        <div className="model">
          <p className=" text-gray-500">Model</p>
          RoBERTa AI Detector
        </div>
      </div>
      {result && (
        <div className="probabilities">
          <p>AI Generated: {result.ai_generated_percent}%</p>
          <p>Human Written: {result.human_written_percent}%</p>
        </div>
      )}
    </div>
  );
}
