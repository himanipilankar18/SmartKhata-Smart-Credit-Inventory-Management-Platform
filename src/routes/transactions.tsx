import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus, Search, Receipt, TrendingDown, TrendingUp, CreditCard } from "lucide-react";
import { transactionService } from "@/services";
import { PageHeader } from "@/components/shared/PageHeader";
import { ListSkeleton } from "@/components/shared/Loaders";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusPill } from "@/components/shared/StatusPill";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatINR, formatDate, initials } from "@/lib/format";

export const Route = createFileRoute("/transactions")({
  head: () => ({ meta: [{ title: "Transactions — SmartKhata" }] }),
  component: TransactionsPage,
});

const TYPES = ["all", "credit", "payment", "sale", "expense"] as const;

function TransactionsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["transactions"], queryFn: transactionService.list });
  const [q, setQ] = useState("");
  const [type, setType] = useState<typeof TYPES[number]>("all");

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (q) list = list.filter(t => t.customerName.toLowerCase().includes(q.toLowerCase()) || t.note.toLowerCase().includes(q.toLowerCase()));
    if (type !== "all") list = list.filter(t => t.type === type);
    return list;
  }, [data, q, type]);

  const totals = useMemo(() => {
    const list = data ?? [];
    return {
      sales: list.filter(t => t.type === "sale").reduce((s, t) => s + t.amount, 0),
      payments: list.filter(t => t.type === "payment").reduce((s, t) => s + t.amount, 0),
      credit: list.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0),
      expenses: list.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  }, [data]);

  return (
    <>
      <PageHeader
        title="Transactions"
        description="All sales, payments, credit and expenses"
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Transactions" }]}
        actions={<Link to="/add-transaction"><Button className="gap-1.5"><Plus className="h-4 w-4" />New Entry</Button></Link>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><TrendingUp className="h-3.5 w-3.5 text-[color:var(--color-success)]" />Sales</div>
          <div className="text-xl font-semibold tabular-nums">{formatINR(totals.sales)}</div>
        </Card>
        <Card className="p-4 gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><CreditCard className="h-3.5 w-3.5 text-[color:var(--color-info)]" />Payments</div>
          <div className="text-xl font-semibold tabular-nums">{formatINR(totals.payments)}</div>
        </Card>
        <Card className="p-4 gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Receipt className="h-3.5 w-3.5 text-[color:var(--color-warning)]" />Credit</div>
          <div className="text-xl font-semibold tabular-nums">{formatINR(totals.credit)}</div>
        </Card>
        <Card className="p-4 gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><TrendingDown className="h-3.5 w-3.5 text-[color:var(--color-danger)]" />Expenses</div>
          <div className="text-xl font-semibold tabular-nums">{formatINR(totals.expenses)}</div>
        </Card>
      </div>

      <Card className="p-4 mb-4 gap-3">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by customer or note" value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {TYPES.map(t => (
              <Button key={t} variant={type===t?"default":"outline"} size="sm" onClick={() => setType(t)} className="capitalize">{t}</Button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading ? <ListSkeleton rows={10} /> : filtered.length === 0 ? (
        <Card><EmptyState icon={Receipt} title="No transactions" description="Adjust filters or record a new transaction." /></Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.slice(0, 50).map(t => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar className="h-9 w-9"><AvatarFallback className="text-[11px] bg-muted">{initials(t.customerName)}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{t.customerName}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.note}</div>
                </div>
                <div className="hidden sm:block"><StatusPill tone={t.type==="payment"?"success":t.type==="expense"?"danger":t.type==="credit"?"warning":"info"}>{t.type}</StatusPill></div>
                <div className="text-right shrink-0">
                  <div className={`text-sm font-semibold tabular-nums ${t.type==="payment"?"text-[color:var(--color-success)]":t.type==="expense"?"text-[color:var(--color-danger)]":""}`}>
                    {t.type==="payment"?"+":t.type==="expense"?"-":""}{formatINR(t.amount)}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{formatDate(t.date)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
