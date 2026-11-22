import test from "node:test";
import assert from "node:assert/strict";
import { CONTROL_POINTS, getControlPoint, isWithinLimit, limitText } from "../src/modules/production/control-points.ts";
import { parseSafetyCheckInput, parseSampleInput } from "../src/modules/production/validation.ts";

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

test("batas titik kendali dan teksnya", () => {
  const chiller = getControlPoint("chiller")!;
  const freezer = getControlPoint("freezer")!;
  const core = getControlPoint("cooking-core")!;
  assert.ok(isWithinLimit(chiller, 3) && !isWithinLimit(chiller, 6) && !isWithinLimit(chiller, -1));
  assert.ok(isWithinLimit(freezer, -19) && !isWithinLimit(freezer, -15));
  assert.ok(isWithinLimit(core, 75) && !isWithinLimit(core, 74.9));
  assert.equal(limitText(chiller), "0–5 °C");
  assert.equal(limitText(freezer), "≤ −18 °C");
  assert.equal(limitText(core), "≥ 75 °C");
  assert.equal(new Set(CONTROL_POINTS.map((cp) => cp.key)).size, CONTROL_POINTS.length);
});

test("server menilai hasil ukur titik kendali, bukan petugas", () => {
  const ok = parseSafetyCheckInput(form({ controlPoint: "freezer", value: "-19,5", checkedBy: "Kepala dapur", result: "fail" }));
  assert.ok(ok.ok);
  assert.equal(ok.value.ok, true);
  assert.equal(ok.value.reading, "−19,5 °C");
  assert.equal(ok.value.limit, "≤ −18 °C");
  assert.equal(ok.value.correctiveAction, null);
});

test("hasil di luar batas wajib diberi tindakan koreksi", () => {
  const base = { controlPoint: "hot-holding", value: "55", checkedBy: "Juru masak", productionOrderId: "4" };
  assert.equal(parseSafetyCheckInput(form(base)).ok, false);
  const fixed = parseSafetyCheckInput(form({ ...base, correctiveAction: "Dipanaskan ulang sampai 70 °C" }));
  assert.ok(fixed.ok && fixed.value.ok === false && fixed.value.correctiveAction === "Dipanaskan ulang sampai 70 °C");
});

test("cek masakan wajib dikaitkan ke produksi; angka harus wajar", () => {
  assert.equal(parseSafetyCheckInput(form({ controlPoint: "cooking-core", value: "80", checkedBy: "Juru masak" })).ok, false);
  assert.equal(parseSafetyCheckInput(form({ controlPoint: "chiller", value: "tiga", checkedBy: "Kepala dapur" })).ok, false);
  assert.equal(parseSafetyCheckInput(form({ controlPoint: "chiller", value: "3.25", checkedBy: "Kepala dapur" })).ok, false);
  assert.equal(parseSafetyCheckInput(form({ controlPoint: "nope", value: "3", checkedBy: "Kepala dapur" })).ok, false);
});

test("cek bebas tetap bisa dipakai untuk titik lain", () => {
  const custom = parseSafetyCheckInput(
    form({ controlPoint: "custom", point: "Suhu air bilas", reading: "80 °C", limit: "≥ 77 °C", result: "ok", checkedBy: "Kepala dapur" })
  );
  assert.ok(custom.ok && custom.value.controlPoint === null && custom.value.value === null);
});

test("parseSampleInput wajib tempat simpan", () => {
  assert.deepEqual(parseSampleInput(form({ storageLocation: "Chiller sampel" })), { ok: true, value: { storageLocation: "Chiller sampel", note: null } });
  assert.equal(parseSampleInput(form({ storageLocation: "" })).ok, false);
});
