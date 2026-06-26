import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Edit, TrendingUp } from "lucide-react";
import { inventoryService } from "@/services";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { ListSkeleton } from "@/components/shared/Loaders";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatINR, formatRelative } from "@/lib/format";

export const Route = createFileRoute("/products/$id")({
  head: () => ({ meta: [{ title: "Product — SmartKhata" }] }),
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery({ queryKey: ["product", id], queryFn: () => inventoryService.get(id) });
  if (isLoading) return <ListSkeleton rows={5} />;
  if (!data) return <EmptyState title="Product not found" />;
  const low = data.stock < data.reorderLevel;
  const margin = data.price - data.cost;

  return (
    <>
      <PageHeader
        title={data.name}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Inventory", to: "/inventory" }, { label: data.name }]}
        actions={<Button variant="outline" size="sm" className="gap-1.5"><Edit className="h-4 w-4" />Edit</Button>}
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 gap-3 lg:col-span-1">
          <div className="h-32 rounded-md bg-muted grid place-items-center">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <div className="font-semibold">{data.name}</div>
            <div className="text-xs text-muted-foreground">{data.sku}</div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <StatusPill tone="info">{data.category}</StatusPill>
            <StatusPill tone={low ? "warning" : "success"}>{low ? "Low stock" : "In stock"}</StatusPill>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Stock" value={`${data.stock} ${data.unit}`} tone={low ? "warning" : "success"} />
            <StatCard label="Selling price" value={formatINR(data.price)} tone="info" />
            <StatCard label="Cost" value={formatINR(data.cost)} />
            <StatCard label="Margin" value={formatINR(margin)} tone="success" />
          </div>

          <Card className="p-5 gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Recent stock activity</h2>
              <span className="text-xs text-muted-foreground">Updated {formatRelative(data.updatedAt)}</span>
            </div>
            <div className="divide-y divide-border -mx-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-3">
                  <div className="h-8 w-8 rounded-md bg-muted grid place-items-center"><TrendingUp className="h-4 w-4 text-muted-foreground" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{i % 2 ? "Stock received" : "Sale"}</div>
                    <div className="text-xs text-muted-foreground">{i % 2 ? "+20 units from supplier" : "-2 units sold"}</div>
                  </div>
                  <div className="text-xs text-muted-foreground shrink-0">{i + 1}d ago</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
