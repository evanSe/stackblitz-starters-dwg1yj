import { HotRendererProps } from "@handsontable/react";
import { FC } from "react";

const getInitials = (fullName: string) => {
  const allNames = fullName.trim().split(" ");
  const initials = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`;
    }
    return acc;
  }, "");
  return initials;
};

const Person: FC<HotRendererProps> = ({ value }) => (
  <div className="flex text-ellipsis overflow-hidden whitespace-nowrap gap-2 pt-1 items-center">
    <span className="relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full">
      <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 font-semibold">
        {getInitials(value ?? "")}
      </div>
    </span>
    {value}
  </div>
);

export default Person;
