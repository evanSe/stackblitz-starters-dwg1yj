import { HotRendererProps } from "@handsontable/react";
import { FC } from "react";

const RangeEditor: FC<HotRendererProps> = ({ value }) => (
  <div className="flex py-2 w-full">
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      role="progressbar"
      data-state="indeterminate"
      className="relative h-4 overflow-hidden rounded-full bg-[#e9e8e6] w-full mx-2 "
    >
      <div
        data-state="indeterminate"
        className="h-full w-full flex-1 bg-orange-400 transition-all"
        style={{ transform: `translateX(${(value ?? 0) - 100}%)` }}
      ></div>
    </div>
  </div>
);

export default RangeEditor;
