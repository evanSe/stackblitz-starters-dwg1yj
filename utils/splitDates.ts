import { DateRange } from "react-day-picker";

export function splitDates(dateString: string): DateRange {
  const [fromStr, toStr] = dateString.split(";;");

  if (!fromStr) return {to: undefined, from: undefined};

  const from = new Date(parseInt(fromStr, 10));
  return {
    from,
    to: toStr ? new Date(parseInt(toStr, 10)) : undefined,
  };
}
