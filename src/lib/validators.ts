export const isValidNop = (nop: string) => /^\d{18}$/.test(nop.trim());

export const isValidTahun = (tahun: string) => {
  if (!tahun) return true; // optional for some contexts, but Pencarian will require it
  if (!/^\d{4}$/.test(tahun)) return false;
  const n = Number(tahun);
  return n >= 2000 && n <= 2029;
};

export const isValidTahunRequired = (tahun: string) => {
  if (!tahun) return false;
  return isValidTahun(tahun);
};

export const NOP_SEGMENTS = [
  { key: "kdPropinsi", label: "KdPropinsi", length: 2 },
  { key: "kdDati2", label: "KdDati2", length: 2 },
  { key: "kdKecamatan", label: "KdKecamatan", length: 3 },
  { key: "kdKelurahan", label: "KdKelurahan", length: 3 },
  { key: "kdBlok", label: "KdBlok", length: 3 },
  { key: "noUrut", label: "NoUrut", length: 4 },
  { key: "kdJnsOp", label: "KdJnsOp", length: 1 },
] as const;

export const NOP_TOTAL_LENGTH = 18;

export const splitNopSegments = (nop: string): string[] => {
  const digits = nop.replace(/\D/g, "").slice(0, NOP_TOTAL_LENGTH);
  const out: string[] = [];
  let i = 0;
  for (const seg of NOP_SEGMENTS) {
    out.push(digits.slice(i, i + seg.length));
    i += seg.length;
  }
  return out;
};

export const joinNopSegments = (parts: string[]): string =>
  parts.join("").replace(/\D/g, "").slice(0, NOP_TOTAL_LENGTH);

export const formatNopDotted = (nop: string): string => {
  const digits = nop.replace(/\D/g, "").slice(0, NOP_TOTAL_LENGTH);
  if (digits.length !== NOP_TOTAL_LENGTH) return nop;
  return splitNopSegments(digits).join(".");
};

/** Alias lama — kini semua titik (12.71.010.001.001.0010.0). */
export const formatNopDisplay = formatNopDotted;
