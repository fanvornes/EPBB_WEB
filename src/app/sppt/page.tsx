"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSpptList } from "@/services/api";
import { Sppt } from "@/services/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SpptListSkeleton } from "@/components/skeletons/SpptListSkeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { formatLuas } from "@/lib/format";
import { formatNopDotted } from "@/lib/validators";
import { ChevronLeft, ChevronRight, Table2, Search, Eye } from "lucide-react";
import Link from "next/link";

export default function DataSpptPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");

  const [data, setData] = React.useState<Sppt[]>([]);
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(true);

  const fetchPage = React.useCallback(
    async (p: number) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getSpptList({ page: p, pageSize });
        setData(res);
        setHasMore(res.length === pageSize);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal memuat data");
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [pageSize],
  );

  React.useEffect(() => {
    fetchPage(page);
  }, [page, fetchPage]);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Table2 className="h-5 w-5 text-primary" />
            Data SPPT
          </h1>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/pencarian">
            <Search /> Pencarian
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <span>Halaman {page}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {data.length} record
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 p-0">
          {loading ? (
            <SpptListSkeleton />
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => fetchPage(page)}
              >
                Coba lagi
              </Button>
            </div>
          ) : data.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Tidak ada data. Pastikan backend berjalan.
            </div>
          ) : (
            <Table className="rounded-none border-0">
              <TableHeader>
                <TableRow>
                  <TableHead>NOP</TableHead>
                  <TableHead>Nama WP</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead>Alamat Objek</TableHead>
                  <TableHead>Luas</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, idx) => {
                  const nop = (row.Nop || row.nop || "") as string;
                  const tahun = (row.NamaTahun ||
                    row.nama_tahun ||
                    "") as string;
                  const isHighlight = highlight !== null && nop === highlight;
                  return (
                    <TableRow
                      key={idx}
                      data-state={isHighlight ? "selected" : undefined}
                      className="cursor-pointer"
                      onClick={() => {
                        if (nop && tahun)
                          router.push(`/hasil_data?nop=${nop}&tahun=${tahun}`);
                        else if (nop) router.push(`/sppt/${nop}`);
                      }}
                    >
                      <TableCell className="font-mono text-xs">
                        {nop ? formatNopDotted(nop) : "-"}
                      </TableCell>
                      <TableCell>{row.NmWp || row.nm_wp ||"-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tahun || "-"}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate">
                        {
                          (row.AlamatObjek ||
                            (row as unknown as { alamatObjek?: string })
                              .alamatObjek ||
                            "-") as string
                        }
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatLuas(
                          (row.LuasBumi ??
                            (row as unknown as { luasBumi?: number })
                              .luasBumi ??
                            null) as number | null,
                        )}{" "}
                        /{" "}
                        {formatLuas(
                          (row.LuasBangunan ??
                            (row as unknown as { luasBangunan?: number })
                              .luasBangunan ??
                            null) as number | null,
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (nop && tahun)
                              router.push(`/sppt/${nop}?tahun=${tahun}`);
                            else if (nop) router.push(`/sppt/${nop}`);
                          }}
                        >
                          <Eye /> Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          <div className="flex items-center justify-between border-t border-border bg-secondary/40 p-3">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft /> Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              Halaman <b>{page}</b> · pageSize {pageSize}{" "}
              {hasMore ? "" : "· halaman terakhir"}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight />
            </Button>
          </div>
        </CardContent>
      </Card>

      <CardDescription className="text-center text-[11px]">
        Klik baris untuk buka Hasil Data 1 pihak (NOP+tahun). Endpoint:{" "}
        <code className="rounded bg-secondary px-1 py-0.5">
          GET /api/Sppt?page=&pageSize=
        </code>{" "}
        · SARGable, AsNoTracking.
      </CardDescription>
    </div>
  );
}
