"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import type { ProcurementItem } from "../types";

export interface EditableLine {
  key: number;
  ingredientId: number | "";
  quantity: string;
  price: string;
}

interface LineEditorProps {
  items: ProcurementItem[];
  initialLines?: { ingredientId: number; quantity: number; unitPrice: number }[];
  /** Shows a unit price per line (PO); a PR only asks for quantities. */
  withPrice: boolean;
  disabled?: boolean;
}

const FIELD =
  "h-10 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm text-stone-900 focus:border-brand-500 focus:outline-none focus:ring-3 focus:ring-brand-500/15 disabled:bg-stone-50";

let nextKey = 1;

function toEditable(line: { ingredientId: number; quantity: number; unitPrice: number }): EditableLine {
  return { key: nextKey++, ingredientId: line.ingredientId, quantity: String(line.quantity), price: String(line.unitPrice) };
}

const emptyLine = (): EditableLine => ({ key: nextKey++, ingredientId: "", quantity: "", price: "" });

/** Rows of ingredient, quantity and (optionally) price, posted as parallel lineIngredient/lineQuantity/linePrice fields. */
export function LineEditor({ items, initialLines, withPrice, disabled }: LineEditorProps) {
  const [lines, setLines] = useState<EditableLine[]>(() =>
    initialLines && initialLines.length > 0 ? initialLines.map(toEditable) : [emptyLine()]
  );
  const byId = new Map(items.map((item) => [item.id, item]));
  const categories = [...new Set(items.map((item) => item.categoryName))];

  function update(key: number, patch: Partial<EditableLine>) {
    setLines((current) => current.map((line) => (line.key === key ? { ...line, ...patch } : line)));
  }

  function selectIngredient(key: number, value: string) {
    const ingredientId = value ? Number(value) : "";
    const item = ingredientId === "" ? undefined : byId.get(ingredientId);
    update(key, { ingredientId, ...(withPrice && item ? { price: String(item.lastPrice) } : {}) });
  }

  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="text-[14px] font-medium text-stone-700">Bahan</legend>
      {lines.map((line, index) => {
        const item = line.ingredientId === "" ? undefined : byId.get(line.ingredientId);
        return (
          <div key={line.key} className={`grid gap-2 items-end ${withPrice ? "grid-cols-[1fr_6rem_8rem_auto]" : "grid-cols-[1fr_7rem_auto]"}`}>
            <label className="block">
              <span className="sr-only">Bahan baris {index + 1}</span>
              <select
                name="lineIngredient"
                value={line.ingredientId}
                onChange={(e) => selectIngredient(line.key, e.target.value)}
                className={`${FIELD} cursor-pointer`}
              >
                <option value="">Pilih bahan</option>
                {categories.map((category) => (
                  <optgroup key={category} label={category}>
                    {items
                      .filter((i) => i.categoryName === category)
                      .map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.name} ({i.code})
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">Jumlah baris {index + 1}</span>
              <input
                name="lineQuantity"
                inputMode="decimal"
                value={line.quantity}
                onChange={(e) => update(line.key, { quantity: e.target.value })}
                placeholder={item?.unit ?? "Jumlah"}
                className={`${FIELD} text-right tabular-nums`}
              />
            </label>
            {withPrice && (
              <label className="block">
                <span className="sr-only">Harga satuan baris {index + 1} (Rp)</span>
                <input
                  name="linePrice"
                  inputMode="numeric"
                  value={line.price}
                  onChange={(e) => update(line.key, { price: e.target.value })}
                  placeholder="Rp / satuan"
                  className={`${FIELD} text-right tabular-nums`}
                />
              </label>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={() => setLines((current) => (current.length > 1 ? current.filter((l) => l.key !== line.key) : [emptyLine()]))}
              aria-label={`Hapus baris ${index + 1}`}
            >
              Hapus
            </Button>
          </div>
        );
      })}
      <Button type="button" variant="secondary" onClick={() => setLines((current) => [...current, emptyLine()])}>
        Tambah baris
      </Button>
    </fieldset>
  );
}
