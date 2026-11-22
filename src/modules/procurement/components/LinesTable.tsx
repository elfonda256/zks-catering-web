import { formatQty, getIngredient } from "@/modules/sample-data";
import { lineTotal, type PricedLine } from "../lines";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import { formatRupiah } from "@/shared/utils/formatters";

interface LinesTableProps {
  lines: PricedLine[];
}

/** Ingredient lines with quantity, unit price and subtotal, for PR and PO dialogs. */
export function LinesTable({ lines }: LinesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bahan</TableHead>
          <TableHead align="right">Jumlah</TableHead>
          <TableHead align="right">Harga satuan</TableHead>
          <TableHead align="right">Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lines.map((line) => {
          const item = getIngredient(line.code);
          const price = line.price ?? item.price;
          return (
            <TableRow key={line.code}>
              <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
              <TableCell align="right" isNumeric>
                {formatQty(line.qty, item.unit)}
              </TableCell>
              <TableCell align="right" isNumeric>
                {formatRupiah(price)}
              </TableCell>
              <TableCell align="right" isNumeric>
                {formatRupiah(line.qty * price)}
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell colSpan={3} className="font-semibold text-slate-900">
            Total
          </TableCell>
          <TableCell align="right" isNumeric className="font-semibold">
            {formatRupiah(lineTotal(lines))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
