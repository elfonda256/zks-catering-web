import test from "node:test";
import assert from "node:assert/strict";
import { formatDate, formatDateTime } from "../src/shared/utils/formatters.ts";

test("formatDateTime selalu memakai WIB, apa pun zona waktu server", () => {
  // 22 Nov 2026 pukul 17.30 UTC = 23 Nov 2026 pukul 00.30 WIB
  const value = "2026-11-22T17:30:00Z";
  assert.match(formatDate(value), /23/);
  assert.match(formatDateTime(value), /00[.:]30 WIB$/);
});
