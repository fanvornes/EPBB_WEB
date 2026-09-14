export const formatRupiah = (value?: number | string | null) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatNumber = (value?: number | string | null) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat("id-ID").format(num);
};

export const formatLuas = (value?: number | null) =>
  value == null ? "-" : `${formatNumber(value)} m²`;

export { cn } from "./utils";
