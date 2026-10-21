/**
 * Utility to combine conditional classnames cleanly without external dependencies.
 */
export function cn(...inputs: unknown[]): string {
  return inputs.filter(Boolean).join(" ");
}
