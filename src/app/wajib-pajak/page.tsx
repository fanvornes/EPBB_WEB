"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSpptByNop, Sppt } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { formatNopDotted } from "@/lib/validators";
import { Users, Search } from "lucide-react";
import Link from "next/link";

export default function WajibPajakPage() {
  const searchParams = useSearchParams();
  const nop = searchParams.get("nop");
  const tahun = searchParams.get("tahun");

  const [data, setData] = useState<Sppt[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!nop || nop.length !== 18) return;
    setLoading(true);
    getSpptByNop(nop, tahun || undefined)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal"))
      .finally(() => setLoading(false));
  }, [nop, tahun]);

  if (!nop || nop.length !== 18) {
    return (
      <div className="mx-auto max-w-2xl">
        <Card className="border-amber-300/60 bg-amber-50">
          <CardContent className="p-8 text-center">
            <Users className="mx-auto h-8 w-8 text-amber-600" />
            <h2 className="mt-3 font-semibold">Wajib Pajak – Read Only</h2>
            <p className="mt-1 text-sm text-muted-foreground">Halaman ini menampilkan data WP untuk NOP terpilih. Silakan cari NOP dulu.</p>
            <Button asChild className="mt-4">
              <Link href="/pencarian">
                <Search /> Ke Pencarian
              </Link>
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Backend read-only: akan ambil dari <code>DatSubjekPajak</code> via join NOP → Objek → Subjek saat endpoint tersedia. Saat ini ditampilkan dari SPPT (NmWp, AlamatWp).
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading)
    return (
      <div className="mx-auto max-w-4xl space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
      </div>
    );
  if (error) return <div className="p-8 text-center text-sm text-destructive">{error}</div>;

  const sppt = data?.[0];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="flex items-center gap-2 text-xl font-bold">
        <Users className="h-5 w-5 text-primary" /> Wajib Pajak
      </h1>
      <p className="text-xs text-muted-foreground">
        Read-only · Data untuk NOP{" "}
        <span className="rounded bg-foreground px-2 py-0.5 font-mono text-xs text-background">
          {formatNopDotted(nop)}
        </span>{" "}
        {tahun && (
          <Badge variant="outline" className="ml-1">Tahun {tahun}</Badge>
        )}{" "}
        · Real-time DB
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Detail Wajib Pajak (dari SPPT)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-border py-2">
            <span className="text-muted-foreground">Nama WP</span>
            <span className="text-right font-medium">{sppt?.NmWp || sppt?.nm_wp || "-"}</span>
          </div>
          <div className="py-2">
            <p className="text-xs text-muted-foreground">Alamat WP</p>
            <p className="mt-0.5">{sppt?.AlamatWp || (sppt as unknown as { alamatWp?: string })?.alamatWp || "-"}</p>
          </div>
          <div className="flex justify-between border-b border-border py-2">
            <span className="text-muted-foreground">NOP Terkait</span>
            <span className="font-mono text-xs">{formatNopDotted(nop)}</span>
          </div>
          <p className="rounded-lg border border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
            Endpoint rill: <code>GET /api/WajibPajak?nop=</code> (join DatObjekPajak → DatSubjekPajak) belum tersedia – placeholder ini pakai data SPPT.
          </p>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={`/hasil_data?nop=${nop}&tahun=${tahun ?? ""}`}>
                Lihat Hasil Data
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {data && data.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Histori SPPT untuk WP ini</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NOP</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Nama WP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">{formatNopDotted(String(r.Nop || r.nop))}</TableCell>
                    <TableCell>{r.NamaTahun || r.nama_tahun}</TableCell>
                    <TableCell>{r.NmWp || r.nm_wp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
