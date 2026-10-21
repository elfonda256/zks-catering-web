/**
 * Common shared types across all ERP domains.
 */

export type SortDirection = "asc" | "desc";

export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BaseEntity {
  id: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface DateRangeFilter {
  startDate: string;
  endDate: string;
}

export type OperationalStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "COMPLETED" | "CANCELLED" | "ARCHIVED";
