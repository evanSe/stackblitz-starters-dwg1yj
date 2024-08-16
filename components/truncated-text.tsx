import { HotRendererProps } from "@handsontable/react";
import { FC } from "react";

type TruncatedTextProps = {
  value?: string;
  ellipsis?: boolean;
} & HotRendererProps;

const TruncatedText: FC<TruncatedTextProps> = ({ value, ellipsis = true }) => (
  <div
    className={`${
      ellipsis ? "text-ellipsis" : "text-truncate"
    } overflow-hidden whitespace-nowrap`}
  >
    {value}
  </div>
);

export default TruncatedText;
