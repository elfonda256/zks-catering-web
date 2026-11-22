"use client";

import { useState } from "react";
import {
  LOCATIONS,
  STOCK_OPNAMES,
  formatQty,
  getIngredient,
  relativeDay,
  type StockOpname,
} from "@/modules/sample-data";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Modal } from "@/shared/components/ui/Modal";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { formatRupiah } from "@/shared/utils/formatters";

function varianceValue(opname: StockOpname): number {
  return opname.lines.reduce((sum, line) => {
    if (line.countedQty === null) return sum;
    return sum + (line.countedQty - line.systemQty) * getIngredient(line.code).price;
  }, 0);
}

export function StockOpnameView() {
  const [selected, setSelected] = useState<StockOpname | null>(null);

  const columns: DataColumn<StockOpname>[] = [
    { key: "id", header: "Nomor", mobile: "title", cell: (o) => (
        <button
          type="button"
          onClick={() => setSelected(o)}
          className="whitespace-nowrap font-mono font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900 cursor-pointer"
        >
          {o.id}
        </button>
      ) },
    { key: "day", header: "Tanggal", mobile: "subtitle", cell: (o) => `${relativeDay(o.day)} · ${LOCATIONS[o.location].name}` },
    { key: "count", header: "Bahan dihitung", align: "right", isNumeric: true, cell: (o) => o.lines.length },
    {
      key: "variance",
      header: "Nilai selisih",
      align: "right",
      isNumeric: true,
      cell: (o) => (o.status === "selesai" ? formatRupiah(varianceValue(o)) : "—"),
    },
    {
      key: "status",
      header: "Status",
      mobile: "status",
      cell: (o) => (
        <Badge variant={o.status === "selesai" ? "completed" : "pending"} dot>
          {o.status === "selesai" ? "Selesai" : "Dijadwalkan"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <DataList rows={STOCK_OPNAMES} columns={columns} rowKey={(o) => o.id} />

      {selected && (
        <Modal
          isOpen
          onClose={() => setSelected(null)}
          title={`Stock opname ${selected.id}`}
          subtitle={`${LOCATIONS[selected.location].name} · ${relativeDay(selected.day)} · ${selected.countedBy}`}
          maxWidth="2xl"
          footer={
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Tutup
            </Button>
          }
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bahan</TableHead>
                <TableHead align="right">Sistem</TableHead>
                <TableHead align="right">Fisik</TableHead>
                <TableHead align="right">Selisih</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selected.lines.map((line) => {
                const item = getIngredient(line.code);
                const diff = line.countedQty === null ? null : line.countedQty - line.systemQty;
                return (
                  <TableRow key={line.code}>
                    <TableCell>
                      <span className="font-medium text-stone-900">{item.name}</span>
                      {line.note && <span className="block text-[12px] text-stone-500">{line.note}</span>}
                    </TableCell>
                    <TableCell align="right" isNumeric>
                      {formatQty(line.systemQty, item.unit)}
                    </TableCell>
                    <TableCell align="right" isNumeric>
                      {line.countedQty === null ? "Belum dihitung" : formatQty(line.countedQty, item.unit)}
                    </TableCell>
                    <TableCell align="right" isNumeric className={diff && diff < 0 ? "text-rose-700" : undefined}>
                      {diff === null ? "—" : formatQty(diff, item.unit)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Modal>
      )}
    </div>
  );
}
