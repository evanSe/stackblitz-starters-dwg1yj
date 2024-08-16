import { splitDates } from "@/utils/splitDates";
import { HotRendererProps } from "@handsontable/react";
import { format } from "date-fns";
import { FC, useMemo } from "react";

const DateRenderer: FC<Omit<HotRendererProps, "value"> & { value: string }> = ({
  value,
}) => {
  const date = useMemo(() => splitDates(value), [value]);

  return (
    <div className="flex w-full items-center  ">
      {date?.from ? (
        date.to ? (
          <>
            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
          </>
        ) : (
          format(date.from, "LLL dd, y")
        )
      ) : (
        <span>Pick a date</span>
      )}
    </div>
  );
};

export default DateRenderer;
