import { FC, useMemo } from "react";
import { HotRendererProps } from "@handsontable/react";

const Color: FC<HotRendererProps> = ({ value, TD }) => {
  const color = useMemo(() => {
    if (value > 0 && value < 125) {
      return `rgb(5 150 105)`;
    } else if (value >= 125 && value < 150) {
      return `rgb(16 185 129)`;
    } else if (value >= 150 && value < 175) {
      return `rgb(110 231 183)`;
    } else if (value >= 175 && value <= 250) {
      return `rgb(209 250 229)`;
    } else {
      return "";
    }
  }, [value]);

  return (
    <div className="relative">
      <div
        className="absolute w-full"
        style={{
          background: color,
          width: TD.clientWidth,
          height: TD.clientHeight,
          left: "-4px",
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default Color;
