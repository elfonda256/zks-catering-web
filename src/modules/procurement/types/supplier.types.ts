/**
 * Supplier entity types for Procurement & AVL.
 */

export interface SupplierEntity {
  id: string;
  code: string;
  name: string;
  category: string;
  picName: string;
  phone: string;
  email: string;
  address: string;
  taxNumber: string;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  ratingScore: number;
  onTimeDeliveryPct: number;
  isActive: boolean;
}
