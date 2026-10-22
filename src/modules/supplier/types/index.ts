/**
 * Enterprise Supplier Relationship Management (SRM) Types
 */

export type SupplierStatus =
  | "PREFERRED" // Preferred Partner
  | "APPROVED" // Approved Vendor
  | "PENDING_VERIFICATION" // Pending Verification
  | "CONTRACT_RENEWAL" // Contract Renewal
  | "INACTIVE" // Inactive
  | "BLACKLISTED" // Blacklisted (only if blocked)
  | "ACTIVE" // Legacy alias for APPROVED
  | "REVIEW" // Legacy alias for PENDING_VERIFICATION
  | "SUSPENDED" // Legacy alias for BLACKLISTED
  | "PROBATION"; // Legacy alias for CONTRACT_RENEWAL

export type SupplierTier = "GOLD" | "SILVER" | "BRONZE";

export type ComplianceDocType =
  | "BUSINESS_LICENSE"
  | "NPWP"
  | "NIB"
  | "HALAL_CERTIFICATE"
  | "ISO_CERTIFICATE"
  | "FOOD_SAFETY_CERTIFICATE"
  | "INSURANCE"
  | "CONTRACT";

export interface ComplianceDoc {
  id: string;
  docType: ComplianceDocType;
  title: string;
  docNumber: string;
  issuer: string;
  expiryDate: string;
  status: "VALID" | "EXPIRING_SOON" | "EXPIRED";
  reminderDays: number;
  fileSize: string;
  uploadedAt: string;
}

export interface MonthlyPerformanceTrend {
  month: string;
  onTimePct: number;
  qualityScore: number;
  fulfillmentPct: number;
}

export interface SupplierPerformance {
  onTimeDeliveryPct: number;
  orderFulfillmentPct: number;
  avgLeadTimeDays: number;
  qualityRating: number; // 0.0 - 5.0
  complaintRatePct: number;
  avgResponseTimeHours: number;
  priceStabilityScore: number; // 0 - 100
  monthlyTrends: MonthlyPerformanceTrend[];
}

export interface PurchaseHistoryRecord {
  id: string;
  poNumber: string;
  orderDate: string;
  deliveryDate: string;
  itemsCount: number;
  itemsSummary: string;
  totalValue: number;
  status: "COMPLETED" | "IN_DELIVERY" | "WAITING_APPROVAL" | "CANCELLED";
}

export type CommunicationType = "CALL" | "EMAIL" | "MEETING" | "COMPLAINT" | "CORRECTIVE_ACTION";

export interface CommunicationLogEntry {
  id: string;
  type: CommunicationType;
  timestamp: string;
  subject: string;
  notes: string;
  initiator: string;
  followUpDate?: string;
}

export interface SupplierScorecard {
  qualityScore: number; // 0-100 (weight 30%)
  deliveryScore: number; // 0-100 (weight 25%)
  priceScore: number; // 0-100 (weight 20%)
  serviceScore: number; // 0-100 (weight 15%)
  complianceScore: number; // 0-100 (weight 10%)
  overallScore: number; // 0-100
  tier: SupplierTier;
}

export interface SupplierRisk {
  expiredDocuments: boolean;
  lateDeliveries: boolean;
  highComplaintRate: boolean;
  priceIncreaseRisk: boolean;
  inactiveSupplier: boolean;
  singleSourceRisk: boolean;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  advisories: string[];
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  category: string;
  address: string;
  city: string;
  picName: string;
  picRole: string;
  phone: string;
  email: string;
  website: string;
  npwp: string;
  nib: string;
  taxStatus: "PKP" | "NON_PKP";
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
  paymentTerms: string;
  leadTime: string;
  deliverySchedule: string;
  status: SupplierStatus;
  performance: SupplierPerformance;
  scorecard: SupplierScorecard;
  risk: SupplierRisk;
  documents: ComplianceDoc[];
  purchaseHistory: PurchaseHistoryRecord[];
  communicationLogs: CommunicationLogEntry[];
}

export interface SupplierDirectoryFilter {
  searchQuery: string;
  category: string;
  status: string;
  tier: string;
}
