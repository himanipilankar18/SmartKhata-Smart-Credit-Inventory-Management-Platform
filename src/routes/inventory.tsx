import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus, Search, Package, AlertTriangle } from "lucide-react";
import { inventoryService } from "@/services";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { ListSkeleton } from "@/components/shared/Loaders";
import { StatusPill } from "@/components/shared/StatusPill";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory — SmartKhata" }] }),
  component: InventoryPage,
});

function InventoryPage() {
  const { data, isLoading } = useQuery({ queryKey: ["inventory"], queryFn: inventoryService.list });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(() => ["all", ...Array.from(new Set((data ?? []).map(p => p.category)))], [data]);
  const filtered = useMemo(() => {
    let list = data ?? [];
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.includes(q));
    if (cat !== "all") list = list.filter(p => p.category === cat);
    return list;
  }, [data, q, cat]);

  const lowStock = (data ?? []).filter(p => p.stock < p.reorderLevel).length;
  const inventoryValue = (data ?? []).reduce((s, p) => s + p.cost * p.stock, 0);

  return (
    <>
      <PageHeader
        title="Inventory"
        description={`${data?.length ?? 0} products tracked`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Inventory" }]}
        actions={<Link to="/add-product"><Button className="gap-1.5"><Plus className="h-4 w-4" />Add Product</Button></Link>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="Total products" value={data?.length ?? 0} icon={Package} tone="info" />
        <StatCard label="Low stock" value={lowStock} icon={AlertTriangle} tone="warning" />
        <StatCard label="Inventory value" value={formatINR(inventoryValue)} icon={Package} tone="success" />
        <StatCard label="Categories" value={categories.length - 1} icon={Package} />
      </div>

      <Card className="p-4 mb-4 gap-3">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by name or SKU" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {categories.map(c => (
              <Button key={c} variant={cat===c?"default":"outline"} size="sm" onClick={() => setCat(c)} className="capitalize whitespace-nowrap">{c}</Button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading ? <ListSkeleton rows={6} /> : filtered.length === 0 ? (
        <Card><EmptyState icon={Package} title="No products" description="Add your first product to start tracking inventory." /></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(p => {
            const low = p.stock < p.reorderLevel;
            return (
              <Link key={p.id} to="/products/$id" params={{ id: p.id }}>
                <Card className="p-4 gap-2 hover:border-primary/60 transition-colors h-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.sku} · {p.category}</div>
                    </div>
                    <StatusPill tone={low ? "warning" : "success"}>{low ? "Low" : "OK"}</StatusPill>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div>
                      <div className="text-[11px] text-muted-foreground">Stock</div>
                      <div className="font-semibold tabular-nums">{p.stock} {p.unit}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground">Price</div>
                      <div className="font-semibold tabular-nums">{formatINR(p.price)}</div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
