import ReactSpeedometer from "react-d3-speedometer";

export default function Speedometer({ value }) {
  return (
    <ReactSpeedometer
      value={value}
      minValue={0}
      maxValue={100}
      width={300}
      height={200}

      // smoother arc
      segments={200}

      // 20 gradient stops (must match segmentColors.length)
      customSegmentStops={[
        0, 5, 10, 15, 20, 25, 30, 35, 40, 45,
        50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100
      ]}

      // 20 gradient colors (smooth transition)
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
        "#FF0000"
      ]}

      needleColor="black"
      needleTransitionDuration={1500}
      needleTransition="easeElastic"
    />
  );
}
