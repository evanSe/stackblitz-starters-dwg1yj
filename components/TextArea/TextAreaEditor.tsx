import { useHotEditor } from "@handsontable/react";
import { ChangeEvent, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";

const TextAreaEditor = () => {
  const [open, setOpen] = useState(false);
  const { value, setValue, finishEditing } = useHotEditor<string>({
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
  });

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleFinish = () => {
    finishEditing();
  };

  const stopPropagation = (event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={(state) => {
      if (!state) {
        handleFinish();
      }
    }} >
      <DialogContent onClick={stopPropagation} onMouseDown={stopPropagation}>
        <DialogHeader>
          <DialogTitle>Long description</DialogTitle>
          <DialogDescription>
            Edit the long description of the selected cell
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <Textarea value={value} onChange={handleChange} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TextAreaEditor;
