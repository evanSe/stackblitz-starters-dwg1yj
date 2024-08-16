import { useHotEditor } from "@handsontable/react";
import { ChangeEvent, useMemo, useRef } from "react";
import { Calendar } from "../ui/calendar";
import { splitDates } from "@/utils/splitDates";

const DateEditor = () => {
  const editorRef = useRef<HTMLInputElement>(null);
  const { value, setValue, finishEditing } = useHotEditor<string>({
    onOpen: () => {
      if (editorRef.current) {
        editorRef.current.style.display = "flex";
      }
    },
    onClose: () => {
      if (editorRef.current) {
        editorRef.current.style.display = "none";
      }
    },
    onPrepare: (_row, _column, _prop, TD) => {
      if (editorRef.current) {
        const { width, height, left, top } = TD.getBoundingClientRect();
        editorRef.current.style.width = `${width}px`;
        editorRef.current.style.height = `${height + 1}px`;
        editorRef.current.style.left = `${left + window.pageXOffset}px`;
        editorRef.current.style.top = `${top - 1 + window.pageYOffset}px`;
      }
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // setValue(event.target.valueAsNumber);
  };

  const handleFinish = () => {
    finishEditing();
  };

  const stopPropagation = (event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      ref={editorRef}
      // onChange={handleChange}
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      // onMouseUp={handleFinish}
      // onKeyDown={handleFinish}
      // onSelect={stopPropagation as any}
      className="z-[999] hidden absolute"
    >
      <div className="w-auto p-0 rounded-md border bg-white h-80">
        <Calendar
          key={value}
          className="flex"
          // initialFocus
          mode="range"
          defaultMonth={splitDates(value ?? "").from}
          selected={splitDates(value ?? "") ?? undefined}
          onSelect={(newDates) => {
            if (newDates) {
              setValue(
                `${newDates.from?.getTime() ?? ""};;${
                  newDates.to?.getTime() ?? ""
                }`
              );
            }
          }}
          numberOfMonths={2}
        />
      </div>
    </div>
  );
};

export default DateEditor;
