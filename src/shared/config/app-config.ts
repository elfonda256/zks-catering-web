/**
 * Enterprise Application Configuration
 */

export const appConfig = {
  env: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  currency: {
    locale: "id-ID",
    code: "IDR",
    symbol: "Rp",
  },
  pagination: {
    defaultPageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
  },
  leadTime: {
    minimumStandardDays: 1,
    minimumLargeOrderDays: 3,
    largeOrderThresholdQty: 500,
  },
};
