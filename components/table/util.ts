import Handsontable from "handsontable";

type AddClassesToRows = (
  TD: HTMLTableCellElement,
  row: number,
  column: number,
  prop: number | string,
  value: any,
  cellProperties: Handsontable.CellProperties
) => void;

export const addClassesToRows: AddClassesToRows = (
  TD,
  row,
  _column,
  _prop,
  _value,
  cellProperties
) => {
  const parentElement = TD.parentElement;

  if (parentElement === null) {
    return;
  }

  // Add class to selected rows
  if (cellProperties.instance.getDataAtRowProp(row, "0")) {
    Handsontable.dom.addClass(parentElement, "selected");
  } else {
    Handsontable.dom.removeClass(parentElement, "selected");
  }
};

type DrawCheckboxInRowHeaders = (
  this: Handsontable,
  row: number,
  TH: HTMLTableCellElement
) => void;

export const drawCheckboxInRowHeaders: DrawCheckboxInRowHeaders =
  function drawCheckboxInRowHeaders(row, TH) {
    const input = document.createElement("input");

    input.type = "checkbox";

    if (row >= 0 && this.getDataAtRowProp(row, "0")) {
      Handsontable.dom.addClass(TH, "selected");
      input.checked = true;
    } else {
      Handsontable.dom.removeClass(TH, "selected");
    }

    if (TH.firstChild?.childNodes.length === 1) {
      TH.firstChild?.appendChild(input);
    }
  };

type ChangeCheckboxCell = (
  this: Handsontable,
  event: MouseEvent,
  coords: { row: number; col: number }
) => void;

export const changeCheckboxCell: ChangeCheckboxCell =
  function changeCheckboxCell(event, coords) {
    const target = event.target as HTMLInputElement;

    if (coords.col === -1 && event.target && target.nodeName === "INPUT") {
      event.preventDefault(); // Handsontable will render checked/unchecked checkbox by it own.

      this.setDataAtRowProp(coords.row, "0", !target.checked);
    }
  };
