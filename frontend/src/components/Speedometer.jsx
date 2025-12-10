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

  useEffect(() => {
    // Smooth 0 → value animation
    animate({
      from: 0,
      to: value,
      duration: 700, // adjust if needed
      onUpdate: setDisplayValue,
    });
  }, [value]);

  return (
    <ReactSpeedometer
      value={displayValue}
      minValue={0}
      maxValue={100}
      width={300}
      height={200}
      segments={200}
      customSegmentStops={[
        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85,
        90, 95, 100,
      ]}
      segmentColors={[
        "#00FF00",
        "#33FF00",
        "#66FF00",
        "#99FF00",
        "#CCFF00",
        "#FFFF00",
        "#FFEB00",
        "#FFD700",
        "#FFC300",
        "#FFAF00",
        "#FF9A00",
        "#FF8500",
        "#FF7000",
        "#FF5A00",
        "#FF4400",
        "#FF2E00",
        "#FF1900",
        "#FF0F00",
        "#FF0500",
        "#FF0000",
      ]}
      needleColor="black"
      // needleTransitionDuration={0} // we animate manually
      needleTransitionDuration={1500}
      needleTransition="easeElastic"
    />
  );
}
