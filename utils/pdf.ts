import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { split } from "postcss/lib/list";
import { splitDates } from "./splitDates";
import { format } from "date-fns";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Row colors
export const exportToPDF = ({
  data,
  colHeader,
}: {
  rowHeader: (string | number)[];
  colHeader: (string | number)[];
  data: any[];
}) => {
  // @ts-ignore
  pdfMake
    .createPdf({
      pageOrientation: "landscape",
      content: [
        {
          table: {
            headerRows: 1,
            widths: "auto",
            // @ts-ignore
            body: [
              [{ text: "" }, ...colHeader.map((header) => ({ text: header }))],
              ...data.map((row, index) => {
                const transformedData = [{ text: index }, ...row];
                const date = splitDates(transformedData[5]);
                transformedData[5] = `${format(
                  date.from ?? "",
                  "LLL dd, y"
                )} to ${format(date.to ?? "", "LLL dd, y")}`;
                return transformedData;
              }),
            ],
            heights: "auto",
          },
        },
      ],
    })
    .download();
};
