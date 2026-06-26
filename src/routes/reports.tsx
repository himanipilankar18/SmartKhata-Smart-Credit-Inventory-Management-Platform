import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { Download, Calendar } from "lucide-react";
import { reportService } from "@/services";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListSkeleton } from "@/components/shared/Loaders";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — SmartKhata" }] }),
  component: ReportsPage,
});

const COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4", "#84cc16", "#f97316"];

function ReportsPage() {
  const trend = useQuery({ queryKey: ["r-trend"], queryFn: reportService.salesTrend });
  const cat = useQuery({ queryKey: ["r-cat"], queryFn: reportService.categoryBreakdown });

  if (trend.isLoading || cat.isLoading) return <ListSkeleton rows={6} />;

  return (
    <>
      <PageHeader
        title="Reports"
        description="Sales, collections and inventory insights"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Reports" }]}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><Calendar className="h-4 w-4" />Last 14 days</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" />Export</Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 gap-3">
          <div>
            <h2 className="font-semibold">Sales vs Collection</h2>
            <p className="text-xs text-muted-foreground">Daily totals over the period</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trend.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="sales" fill="#16a34a" radius={[4,4,0,0]} />
                <Bar dataKey="collection" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 gap-3">
          <div>
            <h2 className="font-semibold">Sales trend</h2>
            <p className="text-xs text-muted-foreground">Smoothed line of daily sales</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="sales" stroke="#16a34a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 gap-3">
          <div>
            <h2 className="font-semibold">Collection growth</h2>
            <p className="text-xs text-muted-foreground">Area view of collections</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend.data}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="collection" stroke="#3b82f6" fill="url(#ag)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 gap-3">
          <div>
            <h2 className="font-semibold">Category breakdown</h2>
            <p className="text-xs text-muted-foreground">Revenue share by category</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={cat.data} dataKey="value" nameKey="category" outerRadius={90} innerRadius={50}>
                  {cat.data?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} formatter={(v: number) => formatINR(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
}
