import { useHotEditor } from "@handsontable/react";
import { ChangeEvent, useRef } from "react";

const ProgressEditor = () => {
  const editorRef = useRef<HTMLInputElement>(null);
  const { value, setValue, finishEditing } = useHotEditor<number>({
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
    setValue(event.target.valueAsNumber);
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
      className="z-[999] hidden absolute bg-white border-2 border-[#5292F7] p-1 px-2.5 "
    >
      <input
        className="w-full"
        type="range"
        id="progress"
        name="progress"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        onClick={stopPropagation}
        onMouseDown={stopPropagation}
        onMouseUp={handleFinish}
        onKeyDown={handleFinish}
      />
    </div>
  );
};

export default ProgressEditor;
