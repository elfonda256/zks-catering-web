import test from "node:test";
import assert from "node:assert/strict";
import { EXPIRY_GRACE_MS, expiryCutoffs } from "../src/lib/order-expiry.ts";

/** WIB wall-clock time as an instant (WIB = UTC+7). */
const wib = (iso: string) => new Date(`${iso}+07:00`);

/** Mirrors the unconfirmed-order query: expired when the event is before the cutoff. */
const unconfirmedExpired = (eventDate: Date, now: Date) => eventDate < expiryCutoffs(now).unconfirmedEventBefore;

test("unconfirmed order stays valid until H-1 23:59 WIB plus grace", () => {
  const event = wib("2026-11-25T10:00:00");
  assert.equal(unconfirmedExpired(event, wib("2026-11-24T23:59:00")), false);
  assert.equal(unconfirmedExpired(event, wib("2026-11-25T01:59:00")), false);
  assert.equal(unconfirmedExpired(event, wib("2026-11-25T02:00:00")), true);
});

test("an early-morning event uses the same H-1 deadline as a late one", () => {
  const now = wib("2026-11-25T02:00:00");
  assert.equal(unconfirmedExpired(wib("2026-11-25T00:30:00"), now), true);
  assert.equal(unconfirmedExpired(wib("2026-11-25T23:30:00"), now), true);
  assert.equal(unconfirmedExpired(wib("2026-11-26T00:30:00"), now), false);
});

test("payment cutoff is the deadline plus grace", () => {
  const now = wib("2026-11-24T12:00:00");
  assert.equal(expiryCutoffs(now).paymentDueBefore.getTime(), now.getTime() - EXPIRY_GRACE_MS);
});
