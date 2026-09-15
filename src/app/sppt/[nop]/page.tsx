"use client";

import * as React from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getSpptByNop, Sppt } from "@/services/api";
import { formatNopDotted } from "@/lib/validators";
import { formatLuas } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SpptDetailSkeleton } from "@/components/skeletons/SpptDetailSkeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Separator } from "@/components/ui/Separator";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function SpptDetailPage() {
  const params = useParams<{ nop: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const nop = params.nop as string;
  const tahun = searchParams.get("tahun") ?? undefined;

  const [data, setData] = React.useState<Sppt[] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getSpptByNop(nop, tahun)
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Gagal"))
      .finally(() => setLoading(false));
  }, [nop, tahun]);

  if (loading) return <SpptDetailSkeleton />;
  if (error)
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button className="mt-3" variant="outline" onClick={() => router.back()}>
          Kembali
        </Button>
      </div>
    );
  if (!data || data.length === 0)
    return <div className="p-8 text-center text-sm text-muted-foreground">Tidak ada data</div>;

  const row = data[0];

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft /> Kembali
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Detail SPPT
          </CardTitle>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-lg bg-foreground px-2.5 py-1 font-mono text-xs text-background">
              {formatNopDotted(nop)}
            </span>
            {tahun && <Badge>Tahun {tahun}</Badge>}
            <Badge variant="outline">{data.length} record</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border py-2">
              <span className="text-muted-foreground">Nama WP</span>
              <span className="text-right font-medium">{row.NmWp || row.nm_wp || "-"}</span>
            </div>
            <div className="flex justify-between gap-4 border-b border-border py-2">
              <span className="text-muted-foreground">Tahun</span>
              <span>{row.NamaTahun || row.nama_tahun || tahun || "-"}</span>
            </div>
            <div className="py-2">
              <p className="text-xs text-muted-foreground">Alamat WP</p>
              <p className="mt-0.5">{row.AlamatWp || (row as unknown as { alamatWp?: string }).alamatWp || "-"}</p>
            </div>
            <Separator />
            <div className="py-2">
              <p className="text-xs text-muted-foreground">Alamat Objek</p>
              <p className="mt-0.5">{row.AlamatObjek || (row as unknown as { alamatObjek?: string }).alamatObjek || "-"}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-secondary/60 p-3">
                <p className="text-xs text-muted-foreground">Luas Bumi</p>
                <p className="font-semibold">{formatLuas((row.LuasBumi ?? (row as unknown as { luasBumi?: number }).luasBumi ?? null) as number | null)}</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/60 p-3">
                <p className="text-xs text-muted-foreground">Luas Bangunan</p>
                <p className="font-semibold">{formatLuas((row.LuasBangunan ?? (row as unknown as { luasBangunan?: number }).luasBangunan ?? null) as number | null)}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button asChild size="sm">
              <Link href={`/hasil_data?nop=${nop}&tahun=${tahun ?? row.NamaTahun ?? row.nama_tahun ?? ""}`}>
                Buka Hasil Data
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/sppt">Ke Data SPPT</Link>
            </Button>
          </div>

          {data.length > 1 && (
            <>
              <CardDescription>Histori tahun untuk NOP ini</CardDescription>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NOP</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Tahun</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{formatNopDotted(String(r.Nop || r.nop))}</TableCell>
                      <TableCell>{r.NmWp || r.nm_wp}</TableCell>
                      <TableCell>{r.NamaTahun || r.nama_tahun}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
