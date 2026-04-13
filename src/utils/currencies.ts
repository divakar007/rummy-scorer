import { Currency } from "../types/game";

export const CURRENCIES: { code: Currency; symbol: string; name: string }[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
];

export function getCurrencySymbol(currency: Currency): string {
  const currencyInfo = CURRENCIES.find((c) => c.code === currency);
  return currencyInfo?.symbol ?? "$";
}

export function getCurrencyName(currency: Currency): string {
  const currencyInfo = CURRENCIES.find((c) => c.code === currency);
  return currencyInfo?.name ?? "Currency";
}
