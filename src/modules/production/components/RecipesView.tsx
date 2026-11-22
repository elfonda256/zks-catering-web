"use client";

import { useState } from "react";
import { RECIPES, formatQty, getIngredient, type Recipe } from "@/modules/sample-data";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Modal } from "@/shared/components/ui/Modal";
import { SampleDataNotice } from "@/shared/components/ui/SampleDataNotice";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import { DataList, type DataColumn } from "@/shared/components/ui/DataList";
import { formatRupiah } from "@/shared/utils/formatters";
import { costPerPortion } from "../recipes";

/** Food cost above this share of the selling price is flagged. */
const FOOD_COST_TARGET = 0.5;

export function RecipesView() {
  const [selected, setSelected] = useState<Recipe | null>(null);

  const columns: DataColumn<Recipe>[] = [
    {
      key: "name",
      header: "Paket",
      mobile: "title",
      cell: (recipe) => (
        <button
          type="button"
          onClick={() => setSelected(recipe)}
          className="text-left font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 cursor-pointer"
        >
          {recipe.name}
        </button>
      ),
    },
    { key: "menu", header: "Menu minggu ini", mobile: "subtitle", width: "max-w-sm", cell: (recipe) => <span className="text-slate-600">{recipe.menu}</span> },
    { key: "price", header: "Harga jual", align: "right", isNumeric: true, cell: (recipe) => formatRupiah(recipe.packagePrice) },
    { key: "cost", header: "Biaya bahan", align: "right", isNumeric: true, cell: (recipe) => formatRupiah(Math.round(costPerPortion(recipe))) },
    {
      key: "ratio",
      header: "Food cost",
      align: "right",
      mobile: "status",
      cell: (recipe) => {
        const ratio = costPerPortion(recipe) / recipe.packagePrice;
        return <Badge variant={ratio <= FOOD_COST_TARGET ? "completed" : "low_stock"}>{Math.round(ratio * 100)}%</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <SampleDataNotice />

      <DataList rows={RECIPES} columns={columns} rowKey={(r) => r.id} />
      <p className="text-[13px] text-slate-600">
        Food cost = biaya bahan per porsi dibagi harga jual. Target di bawah {Math.round(FOOD_COST_TARGET * 100)}%.
      </p>

      {selected && <RecipeDialog recipe={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function RecipeDialog({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const [portions, setPortions] = useState(100);
  const valid = Number.isInteger(portions) && portions > 0;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={recipe.name}
      subtitle={recipe.menu}
      maxWidth="2xl"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Tutup
        </Button>
      }
    >
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
          {recipe.perPortion.map((line) => {
            const item = getIngredient(line.code);
            const total = valid ? line.qty * portions : 0;
            return (
              <TableRow key={line.code}>
                <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                <TableCell align="right" isNumeric>
                  {formatQty(line.qty, item.unit)}
                </TableCell>
                <TableCell align="right" isNumeric>
                  {formatQty(total, item.unit)}
                </TableCell>
                <TableCell align="right" isNumeric>
                  {formatRupiah(Math.round(total * item.price))}
                </TableCell>
              </TableRow>
            );
          })}
          <TableRow>
            <TableCell colSpan={3} className="font-semibold text-slate-900">
              Total biaya bahan
            </TableCell>
            <TableCell align="right" isNumeric className="font-semibold">
              {formatRupiah(Math.round(valid ? costPerPortion(recipe) * portions : 0))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Modal>
  );
}
