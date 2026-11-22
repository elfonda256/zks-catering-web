/** Serializable supplier data passed from the server page to the client view. */

export interface SupplierRow {
  id: number;
  name: string;
  contactName: string | null;
  phone: string | null;
  area: string | null;
  paymentTerms: string | null;
  isActive: boolean;
  /** Ingredients that name this supplier as their main supplier. */
  ingredients: { name: string; categoryName: string }[];
}
