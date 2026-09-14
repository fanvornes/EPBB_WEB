/**
 * API Service layer for communicating with the .NET 8 backend
 *
 * BASE_URL: Point this to your .NET API host (e.g., http://192.168.22.10:5000 or /api)
 * The .NET API runs on: http://192.168.22.10:1434 (based on backend Program.cs)
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5179/api";

// ==================== SPPT (Sppt) API ====================

// Sync dengan backend Sppt_controller DTO:
// return Ok(result.Select(s => new { nama_wp = s.NmWpSppt, nama_tahun = s.ThnPajakSppt, nop = concat 18 digit }))
export interface Sppt {
  Nop?: string;
  NmWp?: string;
  NamaTahun?: string;
  AlamatWp?: string;      // baru: JlnWpSppt
  AlamatObjek?: string;   // baru: JlnOpSppt
  LuasBumi?: number;      // baru: LuasBumiSppt (double -> number)
  LuasBangunan?: number;  // baru: LuasBngSppt (double -> number)
  // fallback lama (jika masih dipakai)
  nop?: string;
  nm_wp?: string;
  nama_tahun?: string;
}

export interface SpptQueryParams {
  nop?: string;
  tahun?: number | string;
}

// Fetch SPPT list with pagination (real DB, no cache)
export const getSpptList = async (params?: {
  page?: number;
  pageSize?: number;
}): Promise<Sppt[]> => {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 20;
  const url = `${BASE_URL}/Sppt?page=${page}&pageSize=${pageSize}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(body || `Failed to fetch SPPT list`);
  }
  return response.json();
};

// Fetch SPPT by NOP with optional year filter (real DB, no cache)
export const getSpptByNop = async (
  nop: string,
  tahun?: number | string,
): Promise<Sppt[]> => {
  // GET api/Sppt/with-nop/{nop}?tahun={tahun}  (Sppt_controller: [Route("api/[controller]")])
  const url = `${BASE_URL}/Sppt/with-nop/${nop}${tahun ? `?tahun=${tahun}` : ""}`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(body || `Failed to fetch SPPT for NOP: ${nop}`);
  }
  return response.json();
};

// ==================== Placeholder types (read-only, backend belum ada) ====================
export interface WajibPajak {
  subjekPajakId: string;
  nmWp: string;
  jalanWp: string;
  kotaWp?: string;
  npwp?: string;
  totalObjek?: number;
}

export interface ObjekPajak {
  nop: string;
  jalanOp: string;
  totalLuasBumi: number;
  totalLuasBng: number;
  kelurahan?: string;
  kecamatan?: string;
}
