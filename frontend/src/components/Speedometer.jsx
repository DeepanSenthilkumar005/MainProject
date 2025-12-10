import { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";

// Smooth animation helper
function animate({ from, to, duration, onUpdate, onComplete }) {
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = from + (to - from) * progress;
    onUpdate(value);

    if (progress < 1) requestAnimationFrame(frame);
    else onComplete?.();
  }

  requestAnimationFrame(frame);
}

export default function Speedometer({ value }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    animate({
      from: 0,
      to: value,
      duration: 700,
      onUpdate: setDisplayValue,
      onComplete: () => {
        // Reveal the text AFTER animation finishes
        setTimeout(() => setShowText(true), 300);
      }
    });
  }, [value]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      
      {/* GAUGE */}
      <ReactSpeedometer
        value={displayValue}
        minValue={0}
        maxValue={100}
        width={300}
        height={200}
        segments={200}
        currentValueText={`${Math.round(displayValue)}%`}
        customSegmentStops={[
          0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
          50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100
        ]}
        segmentColors={[
          "#00FF00", "#33FF00", "#66FF00", "#99FF00", "#CCFF00",
          "#FFFF00", "#FFEB00", "#FFD700", "#FFC300", "#FFAF00",
          "#FF9A00", "#FF8500", "#FF7000", "#FF5A00", "#FF4400",
          "#FF2E00", "#FF1900", "#FF0F00", "#FF0500", "#FF0000",
        ]}
        needleColor="black"
        needleTransitionDuration={1500}
        needleTransition="easeElastic"
      />

      {/* RESULT TEXT (fade-in) */}
      <p
        className={`font-mono font-bold text-gray-600 text-lg transition-opacity duration-700 ${
          showText ? "opacity-100" : "opacity-0"
        }`}
      >
        Result : This text appears {Math.round(displayValue)}% AI Generated based on our detection model.
      </p>
    </div>
  );
}
