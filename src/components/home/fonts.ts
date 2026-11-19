import localFont from "next/font/local";

/** Barlow Condensed (SIL OFL 1.1, see ./fonts/OFL.txt), self-hosted for homepage display type. */
export const displayFont = localFont({
  src: [
    { path: "./fonts/barlow-condensed-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/barlow-condensed-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-barlow-condensed",
  display: "swap",
});
