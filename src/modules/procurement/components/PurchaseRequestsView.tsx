"use client";

import { useState } from "react";
import { PURCHASE_REQUESTS, getIngredient, relativeDay, type PurchaseRequest } from "@/modules/sample-data";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DetailList } from "@/shared/components/ui/DetailList";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { Modal } from "@/shared/components/ui/Modal";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { formatRupiah } from "@/shared/utils/formatters";
import { PR_STATUS } from "../status";
import { LinesTable } from "./LinesTable";
import { lineTotal } from "../lines";

export function PurchaseRequestsView() {
  const [selected, setSelected] = useState<PurchaseRequest | null>(null);
  const waiting = PURCHASE_REQUESTS.filter((pr) => pr.status === "menunggu");

  const columns: DataColumn<PurchaseRequest>[] = [
    { key: "id", header: "Nomor", mobile: "title", cell: (pr) => (
        <button
          type="button"
          onClick={() => setSelected(pr)}
          className="whitespace-nowrap font-mono font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 cursor-pointer"
        >
          {pr.id}
        </button>
      ) },
    {
      key: "lines",
      header: "Bahan",
      mobile: "subtitle",
      width: "max-w-xs",
      cell: (pr) => pr.lines.map((line) => getIngredient(line.code).name).join(", "),
    },
    {
      key: "day",
      header: "Diajukan",
      cell: (pr) => (
        <>
          {relativeDay(pr.day)}
          <span className="block text-[12px] text-slate-500">{pr.requestedBy}</span>
        </>
      ),
    },
    { key: "needed", header: "Dibutuhkan", cell: (pr) => relativeDay(pr.day + pr.neededInDays) },
    { key: "cost", header: "Perkiraan biaya", align: "right", isNumeric: true, cell: (pr) => formatRupiah(lineTotal(pr.lines)) },
    {
      key: "status",
      header: "Status",
      mobile: "status",
      cell: (pr) => (
        <Badge variant={PR_STATUS[pr.status].variant} dot>
          {PR_STATUS[pr.status].label}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <KpiGrid label="Ringkasan permintaan" columns={3}>
        <KpiCard label="Menunggu persetujuan" value={waiting.length} subtext={formatRupiah(waiting.reduce((s, pr) => s + lineTotal(pr.lines), 0))} />
        <KpiCard label="Sudah jadi PO" value={PURCHASE_REQUESTS.filter((pr) => pr.poId).length} subtext="Diteruskan ke supplier" />
        <KpiCard label="Total permintaan" value={PURCHASE_REQUESTS.length} subtext="Minggu ini" />
      </KpiGrid>

      <DataList rows={PURCHASE_REQUESTS} columns={columns} rowKey={(pr) => pr.id} />

      {selected && (
        <Modal
          isOpen
          onClose={() => setSelected(null)}
          title={`Permintaan ${selected.id}`}
          subtitle={`${selected.requestedBy} · ${relativeDay(selected.day)}`}
          maxWidth="2xl"
          footer={
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Tutup
            </Button>
          }
        >
          <DetailList
            items={[
              { label: "Status", value: <Badge variant={PR_STATUS[selected.status].variant}>{PR_STATUS[selected.status].label}</Badge> },
              { label: "Dibutuhkan", value: relativeDay(selected.day + selected.neededInDays) },
              { label: "Alasan", value: selected.reason },
              { label: "PO", value: selected.poId ?? "Belum dibuat" },
            ]}
          />
          <p className="text-[12px] text-slate-500">Harga memakai harga beli terakhir sebagai perkiraan.</p>
          <LinesTable lines={selected.lines} />
        </Modal>
      )}
    </div>
  );
}
