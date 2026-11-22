"use client";

import { useState, useTransition } from "react";
import { decideRequestAction } from "@/app/admin/procurement/actions";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { DetailList } from "@/shared/components/ui/DetailList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Input } from "@/shared/components/ui/Input";
import { KpiCard } from "@/shared/components/ui/KpiCard";
import { KpiGrid } from "@/shared/components/ui/KpiGrid";
import { ListToolbar } from "@/shared/components/ui/ListToolbar";
import { Modal } from "@/shared/components/ui/Modal";
import { formatDate, formatDateTime, formatRupiah } from "@/shared/utils/formatters";
import { lineTotal } from "../documents";
import { PR_STATUS } from "../status";
import type { ProcurementOptions, RequestRow, RequestStatus } from "../types";
import { LinesTable } from "./LinesTable";
import { OrderFormDialog } from "./OrderFormDialog";
import { RequestFormDialog } from "./RequestFormDialog";

type RequestTab = "semua" | RequestStatus;

interface PurchaseRequestsViewProps {
  requests: RequestRow[];
  options: ProcurementOptions;
}

export function PurchaseRequestsView({ requests, options }: PurchaseRequestsViewProps) {
  const [tab, setTab] = useState<RequestTab>("semua");
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<RequestRow | null>(null);
  const [ordering, setOrdering] = useState<RequestRow | null>(null);

  const waiting = requests.filter((r) => r.status === "PENDING");
  const approved = requests.filter((r) => r.status === "APPROVED");

  const q = query.toLowerCase().trim();
  const rows = requests.filter(
    (r) =>
      (tab === "semua" || r.status === tab) &&
      (!q || [r.code, r.requestedBy, r.reason, ...r.lines.map((l) => l.ingredientName)].some((f) => f.toLowerCase().includes(q)))
  );

  const columns: DataColumn<RequestRow>[] = [
    {
      key: "code",
      header: "Nomor",
      mobile: "title",
      cell: (r) => (
        <button
          type="button"
          onClick={() => setSelected(r)}
          className="whitespace-nowrap font-mono font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900 cursor-pointer"
        >
          {r.code}
        </button>
      ),
    },
    { key: "lines", header: "Bahan", mobile: "subtitle", width: "max-w-xs", cell: (r) => r.lines.map((l) => l.ingredientName).join(", ") },
    {
      key: "by",
      header: "Diajukan",
      cell: (r) => (
        <>
          {formatDate(r.createdAt)}
          <span className="block text-[12px] text-stone-500">{r.requestedBy}</span>
        </>
      ),
    },
    { key: "needed", header: "Dibutuhkan", cell: (r) => formatDate(r.neededBy) },
    { key: "cost", header: "Perkiraan biaya", align: "right", isNumeric: true, cell: (r) => formatRupiah(lineTotal(r.lines)) },
    {
      key: "status",
      header: "Status",
      mobile: "status",
      cell: (r) => (
        <Badge variant={PR_STATUS[r.status].variant} dot>
          {PR_STATUS[r.status].label}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <KpiGrid label="Ringkasan permintaan" columns={3}>
        <KpiCard label="Menunggu persetujuan" tone="warning" value={waiting.length} subtext={formatRupiah(waiting.reduce((s, r) => s + lineTotal(r.lines), 0))} />
        <KpiCard label="Disetujui, belum PO" tone="brand" value={approved.length} subtext="Siap dibuatkan PO" />
        <KpiCard label="Total permintaan" value={requests.length} subtext="200 terbaru" />
      </KpiGrid>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
        <div className="flex-1">
          <ListToolbar
            tabs={[
              { id: "semua", label: "Semua", count: requests.length },
              ...(Object.keys(PR_STATUS) as RequestStatus[]).map((status) => ({
                id: status,
                label: PR_STATUS[status].label,
                count: requests.filter((r) => r.status === status).length,
              })),
            ]}
            tab={tab}
            onTabChange={setTab}
            query={query}
            onQueryChange={setQuery}
            searchPlaceholder="Cari nomor, bahan, atau peminta"
          />
        </div>
        <Button onClick={() => setCreating(true)} disabled={options.items.length === 0}>
          Buat permintaan
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={requests.length === 0 ? "Belum ada permintaan pembelian" : "Tidak ada permintaan"}
          description={
            options.items.length === 0
              ? "Tambahkan bahan di Katalog bahan dulu, lalu ajukan permintaan di sini."
              : requests.length === 0
                ? "Dapur atau gudang mengajukan bahan yang perlu dibeli; admin menyetujui lalu membuat PO."
                : "Tidak ada permintaan yang cocok dengan filter ini."
          }
        />
      ) : (
        <DataList rows={rows} columns={columns} rowKey={(r) => String(r.id)} />
      )}

      {creating && <RequestFormDialog items={options.items} onClose={() => setCreating(false)} />}
      {selected && (
        <RequestDialog
          request={selected}
          onClose={() => setSelected(null)}
          onOrder={() => {
            setOrdering(selected);
            setSelected(null);
          }}
        />
      )}
      {ordering && <OrderFormDialog options={options} request={ordering} onClose={() => setOrdering(null)} />}
    </div>
  );
}

function RequestDialog({ request, onClose, onOrder }: { request: RequestRow; onClose: () => void; onOrder: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");

  function decide(decision: "approve" | "reject") {
    const form = new FormData();
    form.set("decision", decision);
    form.set("decisionNote", note);
    setError(null);
    startTransition(async () => {
      const result = await decideRequestAction(request.id, form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  const footer =
    request.status === "PENDING" ? (
      rejecting ? (
        <>
          <Button variant="secondary" onClick={() => setRejecting(false)} disabled={isPending}>
            Kembali
          </Button>
          <Button variant="danger" onClick={() => decide("reject")} disabled={isPending || !note.trim()}>
            {isPending ? "Menyimpan..." : "Tolak permintaan"}
          </Button>
        </>
      ) : (
        <>
          <Button variant="secondary" onClick={() => setRejecting(true)} disabled={isPending}>
            Tolak
          </Button>
          <Button onClick={() => decide("approve")} disabled={isPending}>
            {isPending ? "Menyimpan..." : "Setujui"}
          </Button>
        </>
      )
    ) : request.status === "APPROVED" ? (
      <>
        <Button variant="secondary" onClick={onClose}>
          Tutup
        </Button>
        <Button onClick={onOrder}>Buat PO</Button>
      </>
    ) : (
      <Button variant="secondary" onClick={onClose}>
        Tutup
      </Button>
    );

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title={`Permintaan ${request.code}`}
      subtitle={`${request.requestedBy} · ${formatDateTime(request.createdAt)}`}
      maxWidth="2xl"
      footer={footer}
    >
      <DetailList
        items={[
          { label: "Status", value: <Badge variant={PR_STATUS[request.status].variant}>{PR_STATUS[request.status].label}</Badge> },
          { label: "Dibutuhkan", value: formatDate(request.neededBy) },
          { label: "Alasan", value: request.reason },
          ...(request.decisionNote ? [{ label: "Catatan keputusan", value: request.decisionNote }] : []),
          { label: "PO", value: request.orderCode ?? "Belum dibuat" },
          { label: "Dicatat oleh", value: request.createdBy ?? "—" },
        ]}
      />
      <p className="text-[12px] text-stone-500">Harga memakai harga beli terakhir sebagai perkiraan.</p>
      <LinesTable lines={request.lines} />
      {rejecting && (
        <Input
          id="pr-reject-note"
          label="Alasan penolakan"
          required
          maxLength={200}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          autoFocus
        />
      )}
      {error && (
        <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
          {error}
        </p>
      )}
    </Modal>
  );
}
