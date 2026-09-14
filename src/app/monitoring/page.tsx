"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { useSearchParams } from "next/navigation";
import { BarChart3, MapPinned, Calendar, CreditCard, TrendingUp } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Data contoh untuk preview tampilan.
// Akan diganti agregasi real DB saat endpoint GET /api/Monitoring/summary tersedia.
const dummyWilayah = [
  { key: "kec-a", name: "Kec. A", sppt: 124, lunas: 98 },
  { key: "kec-b", name: "Kec. B", sppt: 89, lunas: 61 },
  { key: "kec-c", name: "Kec. C", sppt: 156, lunas: 132 },
  { key: "kec-d", name: "Kec. D", sppt: 72, lunas: 45 },
];

const dummyStatus = [
  { name: "Lunas", value: 336, color: "#1d4d3b" },
  { name: "Belum Bayar", value: 105, color: "#a85c05" },
  { name: "Tunggakan", value: 20, color: "#a63a2e" },
];

const dummyTahun = [
  { tahun: "2020", jumlah: 420 },
  { tahun: "2021", jumlah: 445 },
  { tahun: "2022", jumlah: 461 },
  { tahun: "2023", jumlah: 480 },
  { tahun: "2024", jumlah: 512 },
];

const selectClass =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function MonitoringPage() {
  const searchParams = useSearchParams();
  const nop = searchParams.get("nop");
  const tahun = searchParams.get("tahun");

  const [filterWilayah, setFilterWilayah] = React.useState("semua");
  const [filterTahun, setFilterTahun] = React.useState(tahun ?? "2024");
  const [filterStatus, setFilterStatus] = React.useState("semua");
  const [applied, setApplied] = React.useState({
    wilayah: "semua",
    tahun: tahun ?? "2024",
    status: "semua",
  });

  const rows =
    applied.wilayah === "semua"
      ? dummyWilayah
      : dummyWilayah.filter((r) => r.key === applied.wilayah);

  const totalSppt = rows.reduce((a, r) => a + r.sppt, 0);
  const totalLunas = rows.reduce((a, r) => a + r.lunas, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold">
          <BarChart3 className="h-5 w-5 text-primary" />
          Monitoring Pajak
          <Badge variant="outline">Data contoh</Badge>
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Statistik per wilayah, tahun, status pembayaran · Real-time DB (GroupBy) saat backend siap.
          {nop && (
            <span className="ml-2 rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-xs">
              Filter NOP: {nop.slice(0, 6)}...
            </span>
          )}
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1">
                <MapPinned className="h-3.5 w-3.5" /> Wilayah
              </Label>
              <select
                value={filterWilayah}
                onChange={(e) => setFilterWilayah(e.target.value)}
                className={selectClass}
              >
                <option value="semua">Semua Kecamatan</option>
                <option value="kec-a">Kec. A</option>
                <option value="kec-b">Kec. B</option>
                <option value="kec-c">Kec. C</option>
                <option value="kec-d">Kec. D</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Tahun
              </Label>
              <select
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
                className={selectClass}
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1">
                <CreditCard className="h-3.5 w-3.5" /> Status
              </Label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={selectClass}
              >
                <option value="semua">Semua Status</option>
                <option value="lunas">Lunas</option>
                <option value="belum">Belum Bayar</option>
                <option value="tunggakan">Tunggakan</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={() =>
                  setApplied({ wilayah: filterWilayah, tahun: filterTahun, status: filterStatus })
                }
              >
                <TrendingUp /> Terapkan
              </Button>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Filter terhubung ke endpoint rill: <code className="rounded bg-secondary px-1 py-0.5">GET /api/Monitoring/summary?kecamatan=&tahun=&status=</code> (EF GroupBy, CountAsync real-time).
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Total SPPT (filter)</p>
            <p className="text-2xl font-bold">{totalSppt}</p>
            <p className="text-xs text-primary">Tahun {applied.tahun}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Realisasi Lunas</p>
            <p className="text-2xl font-bold">{totalLunas}</p>
            <p className="text-xs text-muted-foreground">
              {totalSppt > 0 ? Math.round((totalLunas / totalSppt) * 100) : 0}% dari total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">Belum Lunas</p>
            <p className="text-2xl font-bold text-destructive">{totalSppt - totalLunas}</p>
            <p className="text-xs text-muted-foreground">Perlu tindak lanjut</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">SPPT per Kecamatan ({applied.tahun})</CardTitle>
            <CardDescription>Bar chart – real DB: SELECT KdKecamatan, COUNT(*) GROUP BY</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rows}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="sppt" fill="#1d4d3b" radius={[6, 6, 0, 0]} name="Total SPPT" />
                  <Bar dataKey="lunas" fill="#a85c05" radius={[6, 6, 0, 0]} name="Lunas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Status Pembayaran</CardTitle>
            <CardDescription>Donut – StatusPembayaranSppt (Sppt.cs:96)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dummyStatus} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                    {dummyStatus.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tren Tahunan</CardTitle>
          <CardDescription>Tren 5 tahun terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dummyTahun}>
                <XAxis dataKey="tahun" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#1d4d3b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tabel Agregasi (Contoh)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kecamatan</TableHead>
                <TableHead>Total SPPT</TableHead>
                <TableHead>Lunas</TableHead>
                <TableHead>Belum</TableHead>
                <TableHead>% Lunas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.sppt}</TableCell>
                  <TableCell>{r.lunas}</TableCell>
                  <TableCell>{r.sppt - r.lunas}</TableCell>
                  <TableCell>{Math.round((r.lunas / r.sppt) * 100)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
