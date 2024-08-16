import { toCurrency } from "@/utils/utils";

const formatNumber = (value: number) => Intl.NumberFormat().format(value);

export const TableSummary: React.FC<{
  total: number[];
  average: number[];
  min: number[];
  max: number[];
}> = ({ total, average, max, min }) => {
  return (
    <div className="flex flex-col w-full items-end text-right mt-5 pr-4">
      <div className="w-full grid grid-cols-4 pr-0 h-8 items-center border-b pb-10">
        <h2 className="w-full pb-2 text-2xl font-semibold">Summary</h2>
        <div className="font-bold">Hours</div>
        <div className="font-bold">Rate</div>
        <div className="font-bold">Cost</div>
      </div>
      <div className="grid grid-cols-4 pr-2 h-8 items-center">
        <div className="font-bold">Total</div>
        {total.map((value, index) => (
          <div key={index} className="w-40">
            {index === 0 ? formatNumber(value) : toCurrency(value)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 pr-2 h-8 items-center">
        <div className="font-bold">Average</div>
        {average.map((value, index) => (
          <div key={index} className="w-40">
            {index === 0 ? formatNumber(value) : toCurrency(value)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 pr-2 h-8 items-center">
        <div className="font-bold">Min</div>
        {min.map((value, index) => (
          <div key={index} className="w-40">
            {index === 0 ? formatNumber(value) : toCurrency(value)}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 pr-2 h-8 items-center">
        <div className="font-bold">Max</div>
        {max.map((value, index) => (
          <div key={index} className="w-40">
            {index === 0 ? formatNumber(value) : toCurrency(value)}
          </div>
        ))}
      </div>
    </div>
  );
};
