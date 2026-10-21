/**
 * Centralized API Client & Service base for ZKS Enterprise ERP.
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
  timestamp: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${url}`);
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return { data, success: true, timestamp: new Date().toISOString() };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : "Unknown API error",
        success: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async post<T, B = unknown>(url: string, body: B): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${this.baseUrl}${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      return { data, success: true, timestamp: new Date().toISOString() };
    } catch (err: unknown) {
      return {
        error: err instanceof Error ? err.message : "Unknown API error",
        success: false,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export const apiClient = new ApiClient();
