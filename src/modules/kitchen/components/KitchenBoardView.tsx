"use client";

import { useState, useTransition } from "react";
import { advanceProductionAction, disposeSampleAction, recordSafetyCheckAction, recordSampleAction } from "@/app/admin/production/actions";
import { CONTROL_POINTS, getControlPoint, isWithinLimit, limitText } from "@/modules/production/control-points";
import { ProductionOrderDialog } from "@/modules/production/components/ProductionOrderDialog";
import { KITCHEN_COLUMNS, PRODUCTION_STATUS } from "@/modules/production/status";
import type { FoodSampleRow, ProductionRow, SafetyCheckRow } from "@/modules/production/types";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { SelectField } from "@/shared/components/ui/SelectField";
import { formatDateTime } from "@/shared/utils/formatters";

const SAFETY_COLUMNS: DataColumn<SafetyCheckRow>[] = [
  {
    key: "point",
    header: "Titik cek",
    mobile: "title",
    cell: (c) => (
      <>
        <span className="font-medium text-stone-900">{c.point}</span>
        {c.productionCode && <span className="block font-mono text-[12px] text-stone-500">{c.productionCode}</span>}
      </>
    ),
  },
  { key: "time", header: "Waktu", mobile: "subtitle", cell: (c) => `${formatDateTime(c.createdAt)} · ${c.checkedBy}` },
  { key: "reading", header: "Hasil", align: "right", isNumeric: true, cell: (c) => c.reading },
  { key: "limit", header: "Batas", cell: (c) => c.limit },
  { key: "action", header: "Tindakan koreksi", wide: true, cell: (c) => <span className="text-[13px] text-stone-600">{c.correctiveAction ?? "—"}</span> },
  {
    key: "status",
    header: "Status",
    mobile: "status",
    cell: (c) => (
      <Badge variant={c.ok ? "completed" : "critical"} dot>
        {c.ok ? "Sesuai" : "Perlu tindakan"}
      </Badge>
    ),
  },
];

interface KitchenBoardViewProps {
  orders: ProductionRow[];
  checks: SafetyCheckRow[];
  samples: FoodSampleRow[];
  /** Server time (ISO), so "due for disposal" is computed the same way on every render. */
  now: string;
}

/** Once cooked, a sample of the food is kept from every production order. */
const SAMPLE_STATUSES = new Set(["COOKING", "PACKING", "READY"]);

/** Today's production as a kitchen board, plus today's food-safety checks. */
export function KitchenBoardView({ orders, checks, samples, now }: KitchenBoardViewProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [sampling, setSampling] = useState<ProductionRow | null>(null);
  const [boardError, setBoardError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  const selected = orders.find((o) => o.id === selectedId) ?? null;
  const failed = checks.filter((check) => !check.ok);

  function advance(order: ProductionRow) {
    // Starting to cook takes stock, so it goes through the detail dialog with its needs list.
    if (order.status === "PREPARING") {
      setSelectedId(order.id);
      return;
    }
    setBoardError(null);
    setPendingId(order.id);
    startTransition(async () => {
      const result = await advanceProductionAction(order.id);
      if (result.error) setBoardError(result.error);
      setPendingId(null);
    });
  }

  return (
    <div className="space-y-6">
      {boardError && (
        <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
          {boardError}
        </p>
      )}

      {orders.length === 0 ? (
        <EmptyState title="Tidak ada produksi hari ini" description="Produksi yang dijadwalkan untuk hari ini muncul di sini per tahap." />
      ) : (
        <section aria-label="Antrean dapur hari ini" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {KITCHEN_COLUMNS.map((status) => {
            const column = orders.filter((o) => o.status === status);
            return (
              <div key={status} className="rounded-[12px] border border-stone-200 bg-white">
                <h2 className="flex items-center justify-between border-b border-stone-100 px-4 py-3 text-[13px] font-semibold text-stone-900">
                  {PRODUCTION_STATUS[status].label}
                  <span className="tabular-nums text-stone-400">{column.length}</span>
                </h2>
                <ul className="space-y-3 p-3">
                  {column.length === 0 && <li className="px-1 py-2 text-[13px] text-stone-400">Kosong</li>}
                  {column.map((o) => (
                    <li key={o.id} className="rounded-[8px] border border-stone-200 bg-stone-50 p-3 text-[13px]">
                      <button type="button" onClick={() => setSelectedId(o.id)} className="text-left cursor-pointer">
                        <span className="block font-mono text-[12px] text-stone-500 underline decoration-stone-300 underline-offset-4">{o.code}</span>
                        <span className="mt-1 block font-semibold text-stone-900">{o.packageName}</span>
                      </button>
                      <p className="text-stone-700">{o.portions} porsi</p>
                      <p className="mt-2 text-[12px] text-stone-500">
                        Kirim {o.deliveryTime} · {o.destination}
                      </p>
                      {SAMPLE_STATUSES.has(o.status) && (
                        <p className={`mt-2 text-[12px] ${o.sample ? "text-emerald-700" : "font-medium text-amber-700"}`}>
                          {o.sample ? `Sampel di ${o.sample.storageLocation}` : "Sampel belum disimpan"}
                        </p>
                      )}
                      {SAMPLE_STATUSES.has(o.status) && !o.sample && (
                        <Button size="sm" variant="secondary" className="mt-2 w-full" onClick={() => setSampling(o)}>
                          Simpan sampel
                        </Button>
                      )}
                      {PRODUCTION_STATUS[status].action && (
                        <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => advance(o)} disabled={pendingId === o.id}>
                          {pendingId === o.id ? "Menyimpan..." : PRODUCTION_STATUS[status].action}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      <section aria-labelledby="safety-title" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="safety-title" className="text-[15px] font-semibold text-stone-900">
              Cek keamanan pangan hari ini
            </h2>
            {failed.length > 0 && (
              <Badge variant="critical" dot>
                {failed.length} perlu tindakan
              </Badge>
            )}
          </div>
          <Button variant="secondary" onClick={() => setChecking(true)}>
            Catat cek
          </Button>
        </div>
        {checks.length === 0 ? (
          <p className="text-[13px] text-stone-600">Belum ada cek hari ini. Catat suhu chiller, freezer, dan suhu inti masakan.</p>
        ) : (
          <DataList rows={checks} columns={SAFETY_COLUMNS} rowKey={(c) => String(c.id)} />
        )}
      </section>

      <SamplesSection samples={samples} now={now} />

      {selected && <ProductionOrderDialog order={selected} onClose={() => setSelectedId(null)} />}
      {checking && <SafetyCheckDialog orders={orders} onClose={() => setChecking(false)} />}
      {sampling && <SampleDialog order={sampling} onClose={() => setSampling(null)} />}
    </div>
  );
}

function SafetyCheckDialog({ orders, onClose }: { orders: ProductionRow[]; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(CONTROL_POINTS[0].key);
  const [value, setValue] = useState("");
  const [customResult, setCustomResult] = useState("");
  const cp = getControlPoint(key);
  const numeric = Number(value.replace(",", ".").replace("−", "-"));
  const outOfLimit = cp ? value.trim() !== "" && Number.isFinite(numeric) && !isWithinLimit(cp, numeric) : customResult === "fail";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await recordSafetyCheckAction(form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title="Catat cek keamanan pangan"
      subtitle="Titik kendali baku dinilai otomatis dari batasnya; hasil di luar batas wajib diberi tindakan koreksi."
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="safety-form" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </>
      }
    >
      <form id="safety-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField name="controlPoint" label="Titik kendali" required value={key} onChange={(e) => setKey(e.target.value)}>
          {CONTROL_POINTS.map((point) => (
            <option key={point.key} value={point.key}>
              {point.name} ({limitText(point)})
            </option>
          ))}
          <option value="custom">Lainnya (isi bebas)</option>
        </SelectField>
        <SelectField
          name="productionOrderId"
          label="Untuk produksi"
          defaultValue=""
          helperText={cp?.scope === "production" ? "Wajib untuk cek masakan." : undefined}
        >
          <option value="">Umum (bukan satu produksi)</option>
          {orders.map((o) => (
            <option key={o.id} value={o.id}>
              {o.code} · {o.packageName}
            </option>
          ))}
        </SelectField>

        {cp ? (
          <Input
            id="chk-value"
            name="value"
            label={`Hasil ukur (${cp.unit})`}
            required
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={cp.min !== undefined ? String(cp.min + 3) : String(cp.max)}
            helperText={`Batas aman ${limitText(cp)}`}
            autoFocus
          />
        ) : (
          <>
            <Input id="chk-point" name="point" label="Titik cek" required maxLength={80} placeholder="Suhu air cuci alat" autoFocus />
            <Input id="chk-reading" name="reading" label="Hasil ukur" required maxLength={40} placeholder="80 °C" />
            <Input id="chk-limit" name="limit" label="Batas aman" required maxLength={40} placeholder="≥ 77 °C" />
            <SelectField name="result" label="Hasil" required value={customResult} onChange={(e) => setCustomResult(e.target.value)}>
              <option value="" disabled>
                Pilih
              </option>
              <option value="ok">Sesuai batas</option>
              <option value="fail">Di luar batas, perlu tindakan</option>
            </SelectField>
          </>
        )}
        <Input id="chk-by" name="checkedBy" label="Dicek oleh" required maxLength={60} placeholder="Kepala dapur" />

        {outOfLimit && (
          <div className="sm:col-span-2 space-y-2">
            <p role="status" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
              Di luar batas aman. Tulis apa yang dilakukan, misalnya dimasak ulang sampai suhu tercapai atau dipindah ke freezer lain.
            </p>
            <Input id="chk-action" name="correctiveAction" label="Tindakan koreksi" required minLength={5} maxLength={300} />
          </div>
        )}
        {error && (
          <p role="alert" className="sm:col-span-2 text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}

function SampleDialog({ order, onClose }: { order: ProductionRow; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await recordSampleAction(order.id, form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title={`Simpan sampel ${order.code}`}
      subtitle={`${order.packageName} · ${order.portions} porsi. Satu porsi lengkap, tertutup, berlabel kode produksi.`}
      maxWidth="lg"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="sample-form" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </>
      }
    >
      <form id="sample-form" onSubmit={handleSubmit} className="space-y-4">
        <Input id="smp-loc" name="storageLocation" label="Disimpan di" required maxLength={60} defaultValue="Chiller sampel" />
        <Input id="smp-note" name="note" label="Catatan" maxLength={200} placeholder="Opsional" />
        {error && (
          <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}

function SamplesSection({ samples, now }: { samples: FoodSampleRow[]; now: string }) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function dispose(sample: FoodSampleRow) {
    setError(null);
    setPendingId(sample.id);
    startTransition(async () => {
      const result = await disposeSampleAction(sample.id);
      if (result.error) setError(result.error);
      setPendingId(null);
    });
  }

  const columns: DataColumn<FoodSampleRow>[] = [
    {
      key: "code",
      header: "Produksi",
      mobile: "title",
      cell: (s) => (
        <>
          <span className="font-mono font-medium text-stone-900">{s.productionCode}</span>
          <span className="block text-[12px] text-stone-500">{s.packageName}</span>
        </>
      ),
    },
    { key: "where", header: "Disimpan di", mobile: "subtitle", cell: (s) => `${s.storageLocation} · ${formatDateTime(s.storedAt)}` },
    { key: "until", header: "Simpan sampai", cell: (s) => formatDateTime(s.keepUntil) },
    {
      key: "status",
      header: "Status",
      mobile: "status",
      cell: (s) =>
        s.disposedAt ? (
          <Badge variant="neutral">Dimusnahkan</Badge>
        ) : s.keepUntil <= now ? (
          <Button size="sm" variant="secondary" onClick={() => dispose(s)} disabled={pendingId === s.id}>
            {pendingId === s.id ? "Menyimpan..." : "Musnahkan"}
          </Button>
        ) : (
          <Badge variant="reserved">Disimpan</Badge>
        ),
    },
  ];

  return (
    <section aria-labelledby="samples-title" className="space-y-3">
      <h2 id="samples-title" className="text-[15px] font-semibold text-stone-900">
        Sampel makanan
      </h2>
      {error && (
        <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
          {error}
        </p>
      )}
      {samples.length === 0 ? (
        <p className="text-[13px] text-stone-600">Belum ada sampel. Simpan satu porsi dari setiap produksi setelah matang.</p>
      ) : (
        <DataList rows={samples} columns={columns} rowKey={(s) => String(s.id)} />
      )}
      <p className="text-[12px] text-stone-500">Sampel disimpan untuk pemeriksaan bila terjadi keracunan makanan, lalu dimusnahkan setelah masa simpannya.</p>
    </section>
  );
}
