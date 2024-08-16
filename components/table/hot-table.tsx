"use client";

import React, { useEffect, useState } from "react";
import { registerAllModules } from "handsontable/registry";
import { HyperFormula } from "hyperformula";
import "handsontable/dist/handsontable.css";
import "@handsontable/pikaday/css/pikaday.css";
import TruncatedText from "@/components/truncated-text";
import Badge from "@/components/badge";
import Color from "@/components/color";
import Person from "@/components/person";
import { CellChange, ChangeSource, RowObject } from "handsontable/common";
import {
  addClassesToRows,
  changeCheckboxCell,
  drawCheckboxInRowHeaders,
} from "./util";
import { TableSummary } from "./table-summary";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  IconArrowsSort,
  IconColumns3,
  IconFileTypePdf,
  IconTableExport,
  IconX,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { exportToPDF } from "@/utils/pdf";
import ProgressRenderer from "../Progress/progress-renderer";
import ProgressEditor from "../Progress/progress-editor";
import { Data, upsertTask } from "@/utils/dexie";
import HotTable, { HotColumn, HotTableRef } from "@handsontable/react";
import TextAreaEditor from "../TextArea/TextAreaEditor";
import DateRenderer from "../date/date-renderer";
import DateEditor from "../date/date-editor";
import { CardHeader, CardTitle } from "../ui/card";

registerAllModules();

//  create an external HyperFormula instance
const hf = HyperFormula.buildEmpty({
  licenseKey: "internal-use-in-handsontable",
});

const team = ["development", "sales", "marketing", "design"] as const;
export const status = [
  "open",
  "inprogress",
  "done",
  "blocked",
  "cancelled",
] as const;

type Team = (typeof team)[number];
type Status = (typeof status)[number];
type TaskId = `${string}-${number}`;

type HiddenColumn = {
  index: number;
  displayName: string;
  hidden: boolean;
};

export const Table: React.FC<{
  data: Data[];
  width?: string | number;
  height?: string | number;
}> = ({ data, width, height }) => {
  console.log("data", data);
  const [sort, setSort] = useState<{
    column?: keyof Data[][number] | "task_cost";
    order: "ascending" | "descending";
  }>({ order: "ascending" });

  const [hiddenColumns, setHiddenColumns] = useState<
    Record<keyof Data[][number] | "task_cost", HiddenColumn>
  >({
    task_id: { index: 0, displayName: "Public Id", hidden: true },
    task_name: { index: 1, displayName: "💼 Task name", hidden: false },
    long_description: {
      index: 2,
      displayName: "📝 Long description",
      hidden: false,
    },
    creation_date: { index: 3, displayName: "Creation date", hidden: false },
    team: { index: 4, displayName: "Team", hidden: false },
    progress: { index: 5, displayName: "Progress", hidden: false },
    assignee: { index: 6, displayName: "Assignee", hidden: false },
    estimated_hours: {
      index: 7,
      displayName: "Estimated hours",
      hidden: false,
    },
    average_rate: { index: 8, displayName: "Average rate", hidden: false },
    task_cost: { index: 9, displayName: "Task cost", hidden: false },
    status: { index: 10, displayName: "Status", hidden: false },
  });

  const [calculatedValues, setCalculatedValues] = useState({
    total: [0, 0, 0],
    average: [0, 0, 0],
    min: [0, 0, 0],
    max: [0, 0, 0],
  });
  const tableRef = React.useRef<HotTableRef>(null);
  // hot directly references what we pass in, so we need to clone
  const [tableData] = React.useState<Data[]>(
    JSON.parse(
      JSON.stringify(
        data.map((task, index) => ({
          ...task,
          task_cost: `=Round(H${index + 1}*I${index + 1})`,
        }))
      )
    )
  );

  const handleAfterChange = async (
    changes: CellChange[] | null,
    source: ChangeSource
  ) => {
    if ((source !== "updateData" && changes) || source === "loadData")
      calculateStatistics();

    if (source === "loadData" || !changes) return;

    for (const [row, prop, oldVal, newVal] of changes) {
      if (typeof prop !== "string") return;
      const id = (
        tableRef.current?.hotInstance?.getSourceDataAtRow(
          tableRef.current?.hotInstance?.toPhysicalRow(row)
        ) as RowObject
      ).task_id;

      await upsertTask(id, prop as any, newVal);
    }
  };

  const calculateStatistics = () => {
    const getColumnSum = (col: string) =>
      hf.calculateFormula(
        `=ROUND(SUM(${col}1:${col}${tableData.length}))`,
        hf.getSheetId("Sheet1")!
      ) as number;

    const getColumnAverage = (col: string) =>
      hf.calculateFormula(
        `=ROUND(AVERAGE(${col}1:${col}${tableData.length}))`,
        hf.getSheetId("Sheet1")!
      ) as number;

    const getColumnMin = (col: string) =>
      hf.calculateFormula(
        `=ROUND(MIN(${col}1:${col}${tableData.length}))`,
        hf.getSheetId("Sheet1")!
      ) as number;

    const getColumnMax = (col: string) =>
      hf.calculateFormula(
        `=ROUND(MAX(${col}1:${col}${tableData.length}))`,
        hf.getSheetId("Sheet1")!
      ) as number;

    setCalculatedValues({
      total: [getColumnSum("H"), getColumnSum("I"), getColumnSum("J")],
      average: [
        getColumnAverage("H"),
        getColumnAverage("I"),
        getColumnAverage("J"),
      ],
      min: [getColumnMin("H"), getColumnMin("I"), getColumnMin("J")],
      max: [getColumnMax("H"), getColumnMax("I"), getColumnMax("J")],
    });
  };

  useEffect(() => {
    if (!sort.column) {
      tableRef.current?.hotInstance?.getPlugin("columnSorting").clearSort();
      return;
    }

    tableRef.current?.hotInstance?.getPlugin("columnSorting").sort({
      column: hiddenColumns[sort.column as keyof Data[][number]].index,
      sortOrder: sort.order === "ascending" ? "asc" : "desc",
    });
  }, [sort]);

  return (
    <>
      <CardHeader className="grid grid-cols-4 gap-4 ml-auto z-50 px-0">
        <CardTitle className="mt-2">Tasks</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 flex mt-0">
              <IconTableExport /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Button
              className="w-full gap-2"
              variant="outline"
              onClick={() => {
                const instance = tableRef.current?.hotInstance;
                if (!instance) return;

                const values = {
                  rowHeader: instance.getRowHeader(),
                  colHeader: instance.getColHeader(),
                  data: instance.getData(),
                };
                exportToPDF(values);
              }}
            >
              <IconFileTypePdf /> Pdf
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className=" gap-2 flex">
              <IconArrowsSort /> Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex gap-2">
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={sort.column}
                  onValueChange={(value) => {
                    setSort({ ...sort, column: value as keyof Data[][number] });
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pick a column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(hiddenColumns)
                        .filter((column) => !column.hidden)
                        .map((column, index) => (
                          // TODO: getting value can be much better
                          <SelectItem
                            key={column.index}
                            value={Object.keys(hiddenColumns)[index]}
                          >
                            {column.displayName}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={sort.order}
                  onValueChange={(value) =>
                    setSort({
                      ...sort,
                      order: value as "ascending" | "descending",
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="ascending">Ascending</SelectItem>
                      <SelectItem value="descending">Descending</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {sort.column && (
                <Button
                  variant="ghost"
                  onClick={() => setSort({ ...sort, column: undefined })}
                >
                  <IconX />
                </Button>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className=" gap-2 flex">
              <IconColumns3 /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.values(hiddenColumns).map((column, index) => (
              <DropdownMenuCheckboxItem
                key={column.index}
                className="capitalize"
                checked={!column.hidden}
                onCheckedChange={(value) => {
                  setHiddenColumns({
                    ...hiddenColumns,
                    [Object.keys(hiddenColumns)[index]]: {
                      ...column,
                      hidden: !value,
                    },
                  });
                }}
              >
                {column.displayName}
                {/* {column.id} */}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <div>
        <HotTable
          className="z-0"
          ref={tableRef}
          afterChange={handleAfterChange}
          width={width}
          height={height}
          // hack to fix custom renders height not calc correctly
          rowHeights={33}
          data={tableData}
          // width={"auto"}
          formulas={{
            engine: hf,
            sheetName: "Sheet1",
          }}
          columnSorting
          autoRowSize={false}
          autoColumnSize={false}
          colHeaders={[
            "Public Id",
            "💼 Task name",
            "📝 Long description",
            "Progress",
            "Creation date",
            "Team",
            "Assignee",
            "Estimated hours",
            "Average rate",
            "Task cost",
            "Status",
          ]}
          dropdownMenu={true}
          hiddenColumns={{
            columns: Object.entries(hiddenColumns)
              .filter(([key, value]) => value.hidden)
              .map(([key, value]) => value.index),
          }}
          contextMenu={true}
          filters={true}
          rowHeaders={true}
          autoWrapCol={true}
          autoWrapRow={true}
          manualRowMove={true}
          beforeRenderer={addClassesToRows}
          afterGetRowHeader={drawCheckboxInRowHeaders}
          afterOnCellMouseDown={changeCheckboxCell}
          licenseKey="non-commercial-and-evaluation"
        >
          <HotColumn data="task_id" hidden />
          <HotColumn data="task_name" width={150} />
          <HotColumn
            data="long_description"
            width={150}
            editor={TextAreaEditor}
            renderer={TruncatedText}
          />
          <HotColumn
            data="progress"
            width={150}
            renderer={ProgressRenderer}
            editor={ProgressEditor}
          />
          <HotColumn
            renderer={DateRenderer}
            editor={DateEditor}
            type="text"
            // dateFormat={"YYYY-MM-DD HH:mm:ss"}
            data="creation_date"
            // correctFormat
            width={200}
          />
          <HotColumn data="team" width={100} />
          <HotColumn data="assignee" width={208} renderer={Person} />
          <HotColumn
            data="estimated_hours"
            type="numeric"
            width={208}
            renderer={Color}
          />
          <HotColumn
            width={208}
            data="average_rate"
            type="numeric"
            numericFormat={{
              pattern: {
                output: "currency",
                average: true,
              },
              culture: "en-US",
            }}
          />
          <HotColumn
            width={208}
            data="task_cost"
            type="numeric"
            readOnly
            numericFormat={{
              pattern: "$0,0",
              culture: "en-US",
            }}
          />
          <HotColumn
            data="status"
            width={208}
            type="dropdown"
            strict
            allowInvalid={false}
            source={["open", "inprogress", "done", "blocked", "cancelled"]}
            renderer={Badge}
          />
        </HotTable>
      </div>

      <TableSummary
        total={calculatedValues.total}
        average={calculatedValues.average}
        min={calculatedValues.min}
        max={calculatedValues.max}
      />
    </>
  );
};
