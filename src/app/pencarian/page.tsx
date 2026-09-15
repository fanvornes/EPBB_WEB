"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  ArrowRight,
  Stamp,
  Info,
  ScrollText,
} from "lucide-react";
import { getSpptByNop, Sppt } from "@/services/api";
import {
  isValidNop,
  isValidTahunRequired,
  formatNopDotted,
} from "@/lib/validators";
import { NopSegmentedInput } from "@/components/NopSegmentedInput";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

export default function PencarianPage() {
  const router = useRouter();
  const [nop, setNop] = React.useState("");
  const [tahun, setTahun] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<Sppt[] | null>(null);

  const nopValid = isValidNop(nop);
  const tahunValid = isValidTahunRequired(tahun);
  const canSearch = nopValid && tahunValid;

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSearch) {
      if (!nopValid) setError("Lengkapi NOP sampai 18 digit (7 bagian).");
      else if (!tahunValid) setError("Tahun harus 4 digit 2020-2026.");
      return;
    }
    setLoading(true);
    setError(null);
    setPreview(null);
    try {
      const result = await getSpptByNop(nop.trim(), tahun.trim());
      if (result.length === 0) {
        setError(
          "Data dengan NOP & tahun tersebut tidak ditemukan (real-time DB).",
        );
        return;
      }
      setPreview(result);
      setTimeout(() => {
        router.push(`/hasil_data?nop=${nop.trim()}&tahun=${tahun.trim()}`);
      }, 300);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mencari SPPT";
      try {
        const parsed = JSON.parse(msg);
        setError(parsed.message || msg);
      } catch {
        if (msg.includes("404") || msg.includes("tidak ditemukan")) {
          setError("Data dengan NOP & tahun tersebut tidak ditemukan.");
        } else setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="h-1 bg-primary" />
        <div className="flex flex-col justify-between gap-6 p-6 lg:flex-row lg:items-center lg:p-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              <Stamp className="h-3.5 w-3.5" />
              Badan Keuangan
            </div>
            <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
              Pencarian SPPT
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Isi <b>NOP per bagiannya</b> lalu <b>tahun</b>.
            </p>
          </div>
          <div className="hidden h-20 w-20 items-center justify-center rounded-xl bg-primary lg:flex">
            <Search className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Cari Data SPPT
            </CardTitle>
            <CardDescription>
              12.71.010.001.001.0010.0 titik memisahkan tiap kode wilayah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label>NOP isi per bagian</Label>
                <NopSegmentedInput
                  value={nop}
                  onChange={(v) => {
                    setNop(v);
                    setError(null);
                    setPreview(null);
                  }}
                  disabled={loading}
                  autoFocusFirst
                />
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`text-xs ${nop.length === 0 ? "text-muted-foreground" : nopValid ? "text-primary" : "text-destructive"}`}
                  >
                    {nop.length === 0
                      ? "Wajib 18 digit"
                      : `${nop.length}/18 ${nopValid ? "· lengkap" : "· belum lengkap"}`}
                  </span>
                  {nop.length > 0 && (
                    <span className="truncate font-mono text-xs text-muted-foreground">
                      {nopValid ? formatNopDotted(nop) : `${nop}…`}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tahun" className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Tahun Pajak (2020-2026)
                </Label>
                <Input
                  id="tahun"
                  value={tahun}
                  onChange={(e) => {
                    setTahun(e.target.value.replace(/\D/g, "").slice(0, 4));
                    setError(null);
                  }}
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="Contoh: 2024"
                />
                {tahun && !tahunValid && (
                  <p className="text-xs text-destructive">
                    Tahun harus 2020-2026
                  </p>
                )}
              </div>

              {error && (
                <div className="flex gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <Button
                  type="submit"
                  disabled={!canSearch || loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search />
                      Cari & Lihat Hasil
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNop("");
                    setTahun("");
                    setError(null);
                    setPreview(null);
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>

            {preview && preview.length > 0 && (
              <div className="mt-6 rounded-xl border border-primary/30 bg-accent/50 p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Stamp className="h-3.5 w-3.5" />
                  Ditemukan {preview.length} record – membuka lembar hasil...
                </p>
                <Table className="mt-3 bg-card">
                  <TableHeader>
                    <TableRow>
                      <TableHead>NOP</TableHead>
                      <TableHead>Nama WP</TableHead>
                      <TableHead>Tahun</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.slice(0, 3).map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs">
                          {formatNopDotted(String(r.Nop || r.nop || "-"))}
                        </TableCell>
                        <TableCell>{r.NmWp || r.nm_wp || "-"}</TableCell>
                        <TableCell>
                          {r.NamaTahun || r.nama_tahun || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() =>
                    router.push(`/hasil_data?nop=${nop}&tahun=${tahun}`)
                  }
                >
                  Buka Hasil Data <ArrowRight />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Cara penggunaan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  3
                </span>
                <p className="text-foreground/80">
                  Klik cari. Lembar <b>hasil_data</b> terbuka berisi satu berkas
                  NOP.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/60">
            <CardContent className="pt-5">
              <p className="flex items-center gap-1.5 text-xs font-semibold">
                <ScrollText className="h-3.5 w-3.5" /> Arti tiap bagian
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-muted-foreground">
                <li>
                  KdPropinsi (2) + KdDati2 (2) wilayah provinsi/kabupaten.
                </li>
                <li>KdKecamatan (3) + KdKelurahan (3) + KdBlok (3).</li>
                <li>NoUrut (4) + KdJnsOp (1) nomor urut dan jenis objek.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
