/** PKR currency formatter — returns "PKR 16,000" or "Rs 16,000" depending on settings. */
export function formatPKR(amount: number | string, currencySymbol = "PKR"): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (Number.isNaN(n)) return `${currencySymbol} 0`;
  const formatted = new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(Math.round(n));
  return `${currencySymbol} ${formatted}`;
}

/** Strip "PKR "/currency prefix to get a number. */
export function parseAmount(input: string | number | null | undefined): number {
  if (input == null) return 0;
  if (typeof input === "number") return input;
  return Number(String(input).replace(/[^\d.-]/g, "")) || 0;
}
