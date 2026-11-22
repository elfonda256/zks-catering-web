import localFont from "next/font/local";

/**
 * Public-site typefaces, self-hosted (SIL OFL 1.1, licences in this folder).
 * Saira Semi Condensed for headings, Barlow for body copy.
 */
export const headingFont = localFont({
  src: [
    { path: "./saira-semi-condensed-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./saira-semi-condensed-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-saira",
  display: "swap",
});

export const bodyFont = localFont({
  src: [
    { path: "./barlow-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./barlow-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./barlow-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./barlow-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-barlow",
  display: "swap",
});

/**
 * Admin-console typefaces, self-hosted variable fonts (SIL OFL 1.1).
 * Plus Jakarta Sans for the interface, JetBrains Mono for order codes and figures.
 * Not preloaded: the public pages never use them, and the browser only
 * downloads a face once an element inside `.admin-theme` asks for it.
 */
export const adminSansFont = localFont({
  src: "./plus-jakarta-sans-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-jakarta",
  display: "swap",
  preload: false,
});

export const adminMonoFont = localFont({
  src: "./jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});
