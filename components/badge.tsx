import { FC, useMemo } from "react";
import { status } from "./table/hot-table";
import { HotRendererProps } from "@handsontable/react";

type BadgeProps = {
  value?: (typeof status)[number];
};

const colors: Record<(typeof status)[number], string> = {
  open: "bg-gray-200",
  inprogress: "bg-yellow-400",
  done: "bg-lime-500",
  blocked: "bg-red-500",
  cancelled: "bg-gray-400",
};

const Badge: FC<HotRendererProps> = ({ value }: BadgeProps) => {
  const bgColor = useMemo(() => colors[value ?? "open"], [value]);
  return (
    <div className="flex py-1 w-full ">
      <div
        className={`${bgColor} w-full px-1 py-0.5 items-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-primary-foreground hover:opacity-80`}
      >
        {value}
      </div>
    </div>
  );
};

export default Badge;
