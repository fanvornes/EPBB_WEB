"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSpptByNop, Sppt } from "@/services/api";
import { formatNopDotted } from "@/lib/validators";
import { formatLuas, formatRupiah } from "@/lib/format";
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
import {
  Building2,
  User,
  MapPin,
  Calendar,
  Search,
  Home,
  LandPlot,
  CreditCard,
  ArrowRight,
  AlertTriangle,
  FileText,
  Clock,
  Stamp,
} from "lucide-react";
import Link from "next/link";

type StatTone = "neutral" | "terracotta" | "success";

const TONE_STYLES: Record<StatTone, string> = {
  neutral: "bg-secondary text-muted-foreground",
  terracotta: "bg-accent text-accent-foreground",
  success: "bg-[#1d7a4f]/10 text-[#1d7a4f]",
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "neutral",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  tone?: StatTone;
}) {
  return (
    <Card className="overflow-hidden transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1.5 break-words text-xl font-bold leading-tight">
              {value}
            </p>
            {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${TONE_STYLES[tone]}`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonBlock({ className }: { className: string }) {
  return <Skeleton className={className} />;
}

export default function HasilDataPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nop = searchParams.get("nop") ?? "";
  const tahun = searchParams.get("tahun") ?? "";

  const hasQuery = nop.length === 18 && tahun.length === 4;

  const [data, setData] = React.useState<Sppt[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!hasQuery) return;
    setLoading(true);
    setError(null);
    getSpptByNop(nop, tahun)
      .then((res) => {
        if (res.length === 0)
          setError("Data tidak ditemukan untuk NOP & tahun tersebut.");
        else setData(res);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Gagal memuat hasil data"),
      )
      .finally(() => setLoading(false));
  }, [nop, tahun, hasQuery]);

  const sppt = data?.[0];

  if (!hasQuery) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">
              Belum ada pencarian
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Halaman ini menampilkan hasil{" "}
              <b>1 NOP saja</b>. Silakan cari NOP &
              tahun terlebih dahulu di menu Pencarian.
              <br />
              Data diambil real-time dari database (tanpa cache).
            </p>
            <Button
              className="mt-5 gap-2"
              onClick={() => router.push("/pencarian")}
            >
              <Search className="h-4 w-4" /> Ke Pencarian SPPT
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <SkeletonBlock className="h-28" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-28" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <SkeletonBlock className="h-64" />
          <SkeletonBlock className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <AlertTriangle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-3 font-semibold text-primary">
              Gagal memuat data
            </h2>
            <p className="mt-1 text-sm text-muted-foreground break-words">{error}</p>
            <div className="mt-5 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/pencarian`)}
              >
                Kembali ke Pencarian
              </Button>
              <Button onClick={() => window.location.reload()}>
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sppt) return null;

  const alamatWp = String(
    (sppt as unknown as Record<string, unknown>)["AlamatWp"] ??
      (sppt as unknown as Record<string, unknown>)["alamatWp"] ??
      "-",
  );
  const alamatObjek = String(
    (sppt as unknown as Record<string, unknown>)["AlamatObjek"] ??
      (sppt as unknown as Record<string, unknown>)["alamatObjek"] ??
      "-",
  );
  const luasBumi =
    ((sppt as unknown as Record<string, unknown>)["LuasBumi"] as
      | number
      | undefined) ??
    ((sppt as unknown as Record<string, unknown>)["luasBumi"] as
      | number
      | undefined);
  const luasBng =
    ((sppt as unknown as Record<string, unknown>)["LuasBangunan"] as
      | number
      | undefined) ??
    ((sppt as unknown as Record<string, unknown>)["luasBangunan"] as
      | number
      | undefined);

  const raw: Record<string, unknown> = sppt as unknown as Record<
    string,
    unknown
  >;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Register hero — nomor NOP sebagai identitas arsip */}
      <div className="relative overflow-hidden rounded-xl border border-rule bg-paper p-5 lg:p-6">
        <div className="absolute inset-x-0 top-0 h-1 bg-seal" />
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-cap">
              <Stamp className="h-3.5 w-3.5 text-seal" />
              <span>Lembar hasil pencarian</span>
              <span className="opacity-50">·</span>
              <span>Real-time DB</span>
            </div>
            <h1 className="text-xl font-bold text-ink lg:text-2xl">
              {sppt.NmWp || sppt.nm_wp || (raw["nmWp"] as string) || "-"}
            </h1>
            <p
              className="font-mono font-bold tracking-[0.08em] text-ink break-all"
              style={{ fontSize: "clamp(1.1rem, 3.4vw, 1.7rem)", lineHeight: 1.25 }}
            >
              {formatNopDotted(nop)}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                Tahun {sppt.NamaTahun || sppt.nama_tahun || tahun}
              </Badge>
              <Badge variant="success">
                {data?.length ?? 0} record untuk NOP ini
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/sppt?highlight=${nop}`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                Lihat di Data SPPT <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/pencarian")}
            >
              Ganti Pencarian
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={LandPlot}
          label="Luas Bumi"
          value={formatLuas((luasBumi as number) ?? null)}
          sub="Total luas tanah objek"
          tone="terracotta"
        />
        <StatCard
          icon={Home}
          label="Luas Bangunan"
          value={formatLuas((luasBng as number) ?? null)}
          sub="Total luas bangunan"
          tone="terracotta"
        />
        <StatCard
          icon={CreditCard}
          label="NJOP"
          value={
            raw["njopSppt"] || raw["NjopSppt"]
              ? formatRupiah((raw["njopSppt"] ?? raw["NjopSppt"]) as number)
              : alamatObjek !== "-"
                ? "Lihat detail"
                : "-"
          }
          sub="Nilai Jual Objek Pajak"
          tone="success"
        />
        <StatCard
          icon={Clock}
          label="Tahun Pajak"
          value={String(sppt.NamaTahun || sppt.nama_tahun || tahun)}
          tone="neutral"
        />
      </div>

      {/* Detail grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Informasi Wajib Pajak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-y border-border py-2.5">
              <span className="text-muted-foreground">Nama WP</span>
              <span className="text-right font-medium">
                {sppt.NmWp || sppt.nm_wp || "-"}
              </span>
            </div>
            <div className="flex justify-between gap-4 border-b border-border py-2.5">
              <span className="text-muted-foreground">NOP</span>
              <span className="rounded bg-secondary px-2 py-1 font-mono text-xs">
                {formatNopDotted(nop)}
              </span>
            </div>
            <div className="py-2.5">
              <p className="mb-1 text-xs text-muted-foreground">Alamat WP</p>
              <p className="flex gap-2 leading-relaxed">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                {alamatWp}
              </p>
            </div>
            {typeof raw["npwpSppt"] === "string" && raw["npwpSppt"] && (
              <div className="flex justify-between gap-4 border-t border-border py-2.5">
                <span className="text-muted-foreground">NPWP</span>
                <span className="font-mono text-xs">
                  {String(raw["npwpSppt"])}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Informasi Objek Pajak
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="py-2.5">
              <p className="mb-1 text-xs text-muted-foreground">Alamat Objek</p>
              <p className="flex gap-2 leading-relaxed">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {alamatObjek}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-lg border border-border bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Luas Bumi</p>
                <p className="font-semibold">
                  {formatLuas((luasBumi as number) ?? null)}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Luas Bangunan</p>
                <p className="font-semibold">
                  {formatLuas((luasBng as number) ?? null)}
                </p>
              </div>
            </div>
            {data && data.length > 1 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Histori tahun untuk NOP ini ({data.length} record)
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {data.map((d, i) => {
                    const t = d.NamaTahun || d.nama_tahun || "-";
                    const active = String(t) === String(tahun);
                    return (
                      <Link
                        key={i}
                        href={`/hasil_data?nop=${nop}&tahun=${t}`}
                        className={`rounded-full px-2.5 py-1 text-sm transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-card hover:bg-accent"
                        }`}
                      >
                        {t}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Ringkasan SPPT (tahun {tahun})
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Data real-time dari{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-xs">
              GET /api/Sppt/with-nop/{nop}?tahun={tahun}
            </code>{" "}
            · Tidak menampilkan ribuan row.
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NOP</TableHead>
                <TableHead>Nama WP</TableHead>
                <TableHead>Tahun</TableHead>
                <TableHead>Alamat Objek</TableHead>
                <TableHead className="text-right">Luas Bumi</TableHead>
                <TableHead className="text-right">Luas Bng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data &&
                data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs">
                      {formatNopDotted(String(row.Nop || row.nop || nop))}
                    </TableCell>
                    <TableCell>{row.NmWp || row.nm_wp || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          String(row.NamaTahun || row.nama_tahun) === tahun
                            ? "success"
                            : "outline"
                        }
                      >
                        {row.NamaTahun || row.nama_tahun || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate">
                      {((row as unknown as Record<string, unknown>)[
                        "AlamatObjek"
                      ] as string) ||
                        ((row as unknown as Record<string, unknown>)[
                          "alamatObjek"
                        ] as string) ||
                        alamatObjek}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatLuas(
                        (((row as unknown as Record<string, unknown>)[
                          "LuasBumi"
                        ] ??
                          (row as unknown as Record<string, unknown>)[
                            "luasBumi"
                          ] ??
                          luasBumi) as number | null) ?? null,
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatLuas(
                        (((row as unknown as Record<string, unknown>)[
                          "LuasBangunan"
                        ] ??
                          (row as unknown as Record<string, unknown>)[
                            "luasBangunan"
                          ] ??
                          luasBng) as number | null) ?? null,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
