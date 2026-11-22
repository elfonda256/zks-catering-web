import type { ReactNode } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";

export interface DataColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  isNumeric?: boolean;
  /** Column width on desktop, e.g. "w-[20%]". */
  width?: string;
  /**
   * Place on the phone card: "title" (top left), "status" (top right), "subtitle" (under the title),
   * "detail" (label–value grid, the default), or "hidden".
   */
  mobile?: "title" | "status" | "subtitle" | "detail" | "hidden";
  /** On phones, give a long detail value the full card width. */
  wide?: boolean;
}

interface DataListProps<T> {
  rows: T[];
  columns: DataColumn<T>[];
  rowKey: (row: T) => string;
  /** Fixed column widths keep stacked tables (one per group) aligned. */
  fixed?: boolean;
}

/** A table on tablets and desktops, a list of cards on phones, from one column definition. */
export function DataList<T>({ rows, columns, rowKey, fixed = false }: DataListProps<T>) {
  const byPlace = (place: NonNullable<DataColumn<T>["mobile"]>) =>
    columns.filter((c) => (c.mobile ?? "detail") === place);
  const [title] = byPlace("title");
  const status = byPlace("status");
  const subtitles = byPlace("subtitle");
  const details = byPlace("detail");

  return (
    <>
      <div className="hidden md:block">
        <Table className={fixed ? "table-fixed" : undefined}>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key} align={c.align} className={c.width}>
                  {c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={rowKey(row)}>
                {columns.map((c) => (
                  <TableCell key={c.key} align={c.align} isNumeric={c.isNumeric}>
                    {c.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="rounded-[12px] border border-slate-200 bg-white p-4 text-[14px]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                {title && <div className="font-medium text-slate-900">{title.cell(row)}</div>}
                {subtitles.map((c) => (
                  <div key={c.key} className="text-[13px] text-slate-600">
                    {c.cell(row)}
                  </div>
                ))}
              </div>
              {status.map((c) => (
                <div key={c.key} className="shrink-0">
                  {c.cell(row)}
                </div>
              ))}
            </div>
            {details.length > 0 && (
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-3">
                {details.map((c) => (
                  <div key={c.key} className={c.wide ? "col-span-2 min-w-0" : "min-w-0"}>
                    <dt className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{c.header}</dt>
                    <dd className={`mt-1 text-slate-800 ${c.isNumeric ? "tabular-nums" : ""}`}>{c.cell(row)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
