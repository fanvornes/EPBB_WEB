"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSpptByNop, Sppt } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ObjekSkeleton } from "@/components/skeletons/ObjekSkeleton";
import { formatLuas } from "@/lib/format";
import { formatNopDotted } from "@/lib/validators";
import { MapPinned, Search } from "lucide-react";
import Link from "next/link";

export default function ObjekPajakPage() {
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
            <MapPinned className="mx-auto h-8 w-8 text-amber-600" />
            <h2 className="mt-3 font-semibold">Objek Pajak – Read Only</h2>
            <p className="mt-1 text-sm text-muted-foreground">Menampilkan lokasi, luas tanah/bangunan, NJOP untuk NOP terpilih.</p>
            <Button asChild className="mt-4">
              <Link href="/pencarian">
                <Search /> Ke Pencarian
              </Link>
            </Button>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Backend: <code>DatObjekPajak</code> (JalanOp, TotalLuasBumi/Bng, NjopBumi/Bng) & <code>DatOpBangunan</code>. Placeholder pakai SPPT.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) return <ObjekSkeleton />;
  if (error) return <div className="p-8 text-center text-sm text-destructive">{error}</div>;

  const sppt = data?.[0];
  const luasBumi = (sppt?.LuasBumi ?? (sppt as unknown as { luasBumi?: number })?.luasBumi) as number | undefined;
  const luasBng = (sppt?.LuasBangunan ?? (sppt as unknown as { luasBangunan?: number })?.luasBangunan) as number | undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="flex items-center gap-2 text-xl font-bold">
        <MapPinned className="h-5 w-5 text-primary" /> Objek Pajak
      </h1>
      <p className="text-xs text-muted-foreground">
        Read-only · NOP{" "}
        <span className="rounded bg-foreground px-2 py-0.5 font-mono text-xs text-background">
          {formatNopDotted(nop)}
        </span>{" "}
        {tahun && (
          <Badge variant="outline" className="ml-1">Tahun {tahun}</Badge>
        )}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Informasi Objek Pajak (dari SPPT)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="py-2">
            <p className="text-xs text-muted-foreground">Alamat Objek</p>
            <p className="mt-0.5 font-medium">{sppt?.AlamatObjek || (sppt as unknown as { alamatObjek?: string })?.alamatObjek || "-"}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border bg-secondary/60 p-3">
              <p className="text-xs text-muted-foreground">Luas Bumi</p>
              <p className="font-semibold">{formatLuas(luasBumi ?? null)}</p>
            </div>
            <div className="rounded-lg border border-border bg-secondary/60 p-3">
              <p className="text-xs text-muted-foreground">Luas Bangunan</p>
              <p className="font-semibold">{formatLuas(luasBng ?? null)}</p>
            </div>
          </div>
          <p className="rounded-lg border border-border bg-secondary/60 p-3 text-xs text-muted-foreground">
            Data lengkap (Koordinat, ZNT, JPB, foto) berasal dari <code>DatObjekPajak</code> + <code>DatOpBumi/Bangunan</code>. Endpoint <code>GET /api/ObjekPajak?nop=</code> akan ditambah di backend.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link href={`/hasil_data?nop=${nop}&tahun=${tahun ?? ""}`}>
              Lihat Hasil Data
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
