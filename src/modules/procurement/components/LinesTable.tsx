import { formatQuantity } from "@/modules/inventory/stock";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/Table";
import { formatRupiah } from "@/shared/utils/formatters";
import { lineTotal } from "../documents";
import type { DocumentLine, OrderLineRow } from "../types";

interface LinesTableProps {
  lines: (DocumentLine | OrderLineRow)[];
}

/** Ingredient lines with quantity, unit price and subtotal; PO lines also show what has arrived. */
export function LinesTable({ lines }: LinesTableProps) {
  const showReceived = lines.some((line) => "receivedQuantity" in line);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bahan</TableHead>
          <TableHead align="right">Jumlah</TableHead>
          {showReceived && <TableHead align="right">Diterima</TableHead>}
          <TableHead align="right">Harga satuan</TableHead>
          <TableHead align="right">Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lines.map((line) => (
          <TableRow key={line.ingredientId}>
            <TableCell className="font-medium text-stone-900">{line.ingredientName}</TableCell>
            <TableCell align="right" isNumeric>
              {formatQuantity(line.quantity, line.unit)}
            </TableCell>
            {showReceived && (
              <TableCell align="right" isNumeric>
                {"receivedQuantity" in line ? formatQuantity(line.receivedQuantity, line.unit) : "—"}
              </TableCell>
            )}
            <TableCell align="right" isNumeric>
              {formatRupiah(line.unitPrice)}
            </TableCell>
            <TableCell align="right" isNumeric>
              {formatRupiah(Math.round(line.quantity * line.unitPrice))}
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={showReceived ? 4 : 3} className="font-semibold text-stone-900">
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
