"use client";

import { useState, useTransition } from "react";
import { saveRecipeAction } from "@/app/admin/production/actions";
import { formatQuantity } from "@/modules/inventory/stock";
import { LineEditor } from "@/modules/procurement/components/LineEditor";
import type { ProcurementItem } from "@/modules/procurement/types";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import { formatRupiah } from "@/shared/utils/formatters";
import { costPerPortion } from "../rules";
import type { RecipeRow } from "../types";

/** Food cost above this share of the selling price is flagged. */
const FOOD_COST_TARGET = 0.5;

interface RecipesViewProps {
  recipes: RecipeRow[];
  items: ProcurementItem[];
}

export function RecipesView({ recipes, items }: RecipesViewProps) {
  const [selected, setSelected] = useState<RecipeRow | null>(null);
  const [editing, setEditing] = useState<RecipeRow | null>(null);

  const columns: DataColumn<RecipeRow>[] = [
    {
      key: "name",
      header: "Paket",
      mobile: "title",
      cell: (recipe) => (
        <button
          type="button"
          onClick={() => setSelected(recipe)}
          className="text-left font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900 cursor-pointer"
        >
          {recipe.name}
        </button>
      ),
    },
    {
      key: "lines",
      header: "Bahan",
      mobile: "subtitle",
      width: "max-w-sm",
      cell: (recipe) => (
        <span className="text-stone-600">{recipe.lines.length > 0 ? recipe.lines.map((l) => l.ingredientName).join(", ") : "Resep belum diisi"}</span>
      ),
    },
    { key: "price", header: "Harga jual", align: "right", isNumeric: true, cell: (recipe) => formatRupiah(recipe.price) },
    {
      key: "cost",
      header: "Biaya bahan",
      align: "right",
      isNumeric: true,
      cell: (recipe) => (recipe.lines.length > 0 ? formatRupiah(Math.round(costPerPortion(recipe.lines))) : "—"),
    },
    {
      key: "ratio",
      header: "Food cost",
      align: "right",
      mobile: "status",
      cell: (recipe) => {
        if (recipe.lines.length === 0) return <Badge variant="draft">Belum ada</Badge>;
        const ratio = costPerPortion(recipe.lines) / recipe.price;
        return <Badge variant={ratio <= FOOD_COST_TARGET ? "completed" : "low_stock"}>{Math.round(ratio * 100)}%</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <DataList rows={recipes} columns={columns} rowKey={(r) => String(r.price)} />
      <p className="text-[13px] text-stone-600">
        Food cost = biaya bahan per porsi (harga beli terakhir) dibagi harga jual. Target di bawah {Math.round(FOOD_COST_TARGET * 100)}%.
      </p>

      {selected && (
        <RecipeDialog
          recipe={selected}
          onClose={() => setSelected(null)}
          onEdit={() => {
            setEditing(selected);
            setSelected(null);
          }}
          canEdit={items.length > 0}
        />
      )}
      {editing && <RecipeFormDialog recipe={editing} items={items} onClose={() => setEditing(null)} />}
    </div>
  );
}

function RecipeDialog({ recipe, onClose, onEdit, canEdit }: { recipe: RecipeRow; onClose: () => void; onEdit: () => void; canEdit: boolean }) {
  const [portions, setPortions] = useState(100);
  const valid = Number.isInteger(portions) && portions > 0;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={recipe.name}
      subtitle={recipe.description}
      maxWidth="2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
          <Button onClick={onEdit} disabled={!canEdit}>
            {recipe.lines.length > 0 ? "Ubah resep" : "Isi resep"}
          </Button>
        </>
      }
    >
      {recipe.lines.length === 0 ? (
        <p className="text-[13px] text-stone-600">
          {canEdit ? "Resep paket ini belum diisi." : "Tambahkan bahan di Katalog bahan dulu, lalu isi resepnya di sini."}
        </p>
      ) : (
        <>
          <Input
            label="Hitung kebutuhan untuk"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={portions || ""}
            onChange={(e) => setPortions(Number(e.target.value))}
            helperText="Jumlah porsi"
            className="max-w-[10rem]"
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bahan</TableHead>
                <TableHead align="right">Per porsi</TableHead>
                <TableHead align="right">Total</TableHead>
                <TableHead align="right">Biaya</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipe.lines.map((line) => {
                const total = valid ? line.quantityPerPortion * portions : 0;
                return (
                  <TableRow key={line.ingredientId}>
                    <TableCell className="font-medium text-stone-900">{line.ingredientName}</TableCell>
                    <TableCell align="right" isNumeric>
                      {formatQuantity(line.quantityPerPortion, line.unit)}
                    </TableCell>
                    <TableCell align="right" isNumeric>
                      {formatQuantity(Math.round(total * 1000) / 1000, line.unit)}
                    </TableCell>
                    <TableCell align="right" isNumeric>
                      {formatRupiah(Math.round(total * line.lastPrice))}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={3} className="font-semibold text-stone-900">
                  Total biaya bahan
                </TableCell>
                <TableCell align="right" isNumeric className="font-semibold">
                  {formatRupiah(Math.round(valid ? costPerPortion(recipe.lines) * portions : 0))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
    </Modal>
  );
}

function RecipeFormDialog({ recipe, items, onClose }: { recipe: RecipeRow; items: ProcurementItem[]; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await saveRecipeAction(form);
      if (result.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <Modal
      isOpen
      onClose={() => !isPending && onClose()}
      title={`Resep ${recipe.name}`}
      subtitle="Jumlah bahan untuk satu porsi, dalam satuan bahan (contoh 0,12 kg beras)."
      maxWidth="2xl"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isPending}>
            Batal
          </Button>
          <Button type="submit" form="recipe-form" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan resep"}
          </Button>
        </>
      }
    >
      <form id="recipe-form" onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="packagePrice" value={recipe.price} />
        <LineEditor
          items={items}
          withPrice={false}
          disabled={isPending}
          initialLines={recipe.lines.map((l) => ({ ingredientId: l.ingredientId, quantity: l.quantityPerPortion, unitPrice: 0 }))}
        />
        {error && (
          <p role="alert" className="text-[13px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[8px] px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
