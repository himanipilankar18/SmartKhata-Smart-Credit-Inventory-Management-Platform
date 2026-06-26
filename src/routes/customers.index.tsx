import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, Plus, ArrowUpDown, Filter } from "lucide-react";
import { customerService } from "@/services";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusPill } from "@/components/shared/StatusPill";
import { EmptyState } from "@/components/shared/EmptyState";
import { ListSkeleton } from "@/components/shared/Loaders";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatINR, formatRelative, initials } from "@/lib/format";

export const Route = createFileRoute("/customers/")({
  head: () => ({ meta: [{ title: "Customers — SmartKhata" }] }),
  component: CustomersPage,
});

function CustomersPage() {
  const { data, isLoading } = useQuery({ queryKey: ["customers"], queryFn: customerService.list });
  const [q, setQ] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [filter, setFilter] = useState<"all" | "due" | "clear">("all");

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (q) list = list.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q));
    if (filter === "due") list = list.filter(c => c.outstanding > 0);
    if (filter === "clear") list = list.filter(c => c.outstanding <= 0);
    return [...list].sort((a, b) => sortDesc ? b.outstanding - a.outstanding : a.outstanding - b.outstanding);
  }, [data, q, sortDesc, filter]);

  return (
    <>
      <PageHeader
        title="Customers"
        description={`${data?.length ?? 0} customers in your ledger`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Customers" }]}
        actions={<Link to="/add-customer"><Button className="gap-1.5"><Plus className="h-4 w-4" />Add Customer</Button></Link>}
      />

      <Card className="p-4 mb-4 gap-3">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by name or phone" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div className="flex gap-1">
            {(["all","due","clear"] as const).map(f => (
              <Button key={f} variant={filter===f?"default":"outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => setSortDesc(s => !s)} className="gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5" />Outstanding
          </Button>
        </div>
      </Card>

      {isLoading ? <ListSkeleton rows={8} /> : filtered.length === 0 ? (
        <Card><EmptyState icon={Filter} title="No customers match" description="Try adjusting your search or filter." /></Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map(c => (
              <Link key={c.id} to="/customers/$id" params={{ id: c.id }} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors">
                <Avatar className="h-10 w-10"><AvatarFallback className="text-xs bg-primary-light text-accent-foreground">{initials(c.name)}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{c.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{c.phone} · {c.address}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-sm font-semibold tabular-nums ${c.outstanding > 0 ? "text-[color:var(--color-danger)]" : "text-[color:var(--color-success)]"}`}>
                    {formatINR(c.outstanding)}
                  </div>
                  <div className="flex items-center gap-1.5 justify-end mt-0.5">
                    <StatusPill tone={c.outstanding > 0 ? "danger" : "success"}>{c.outstanding > 0 ? "Due" : "Settled"}</StatusPill>
                    <span className="text-[11px] text-muted-foreground hidden sm:inline">{formatRelative(c.lastActivity)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
