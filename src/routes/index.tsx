import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Wallet, Landmark, AlertCircle, TrendingUp, TrendingDown,
  Package, Users, Plus, ArrowRight, Receipt, UserPlus, PackagePlus,
} from "lucide-react";
import { dashboardService } from "@/services";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatGridSkeleton, ListSkeleton } from "@/components/shared/Loaders";
import { StatusPill } from "@/components/shared/StatusPill";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatINR, formatRelative, initials } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — SmartKhata" }] }),
  component: Dashboard,
});

function Dashboard() {
  const summary = useQuery({ queryKey: ["summary"], queryFn: dashboardService.getSummary });
  const recent = useQuery({ queryKey: ["recent-tx"], queryFn: dashboardService.getRecentTransactions });
  const followUps = useQuery({ queryKey: ["followups"], queryFn: dashboardService.getFollowUps });

  return (
    <>
      <PageHeader
        title="Good morning, Ramesh"
        description="Here's what's happening in your shop today."
        actions={
          <Link to="/add-transaction">
            <Button className="gap-1.5"><Plus className="h-4 w-4" />New Entry</Button>
          </Link>
        }
      />

      {summary.isLoading || !summary.data ? (
        <StatGridSkeleton n={4} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Cash in hand" value={formatINR(summary.data.cashInHand)} icon={Wallet} tone="success" delay={0} />
          <StatCard label="Bank balance" value={formatINR(summary.data.bankBalance)} icon={Landmark} tone="info" delay={0.05} />
          <StatCard label="Outstanding" value={formatINR(summary.data.totalOutstanding)} icon={AlertCircle} tone="danger" hint={`${summary.data.followUps} need follow-up`} delay={0.1} />
          <StatCard label="Today's sales" value={formatINR(summary.data.todaySales)} icon={TrendingUp} tone="success" delay={0.15} />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {summary.data && (
          <>
            <StatCard label="Today collection" value={formatINR(summary.data.todayCollection)} icon={TrendingUp} tone="success" />
            <StatCard label="Today expenses" value={formatINR(summary.data.todayExpenses)} icon={TrendingDown} tone="warning" />
            <StatCard label="Low stock" value={summary.data.lowStockCount} icon={Package} tone="warning" hint="Items below reorder level" />
            <StatCard label="Follow-ups" value={summary.data.followUps} icon={Users} tone="info" hint="Customers to contact" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-5 lg:col-span-2 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Recent transactions</h2>
              <p className="text-xs text-muted-foreground">Latest activity from the ledger</p>
            </div>
            <Link to="/transactions"><Button variant="ghost" size="sm" className="gap-1">View all <ArrowRight className="h-3 w-3" /></Button></Link>
          </div>
          {recent.isLoading ? <ListSkeleton rows={5} /> : (
            <div className="divide-y divide-border -mx-2">
              {recent.data?.map(t => (
                <div key={t.id} className="flex items-center gap-3 px-2 py-3">
                  <Avatar className="h-9 w-9"><AvatarFallback className="text-[11px] bg-muted">{initials(t.customerName)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{t.customerName}</div>
                    <div className="text-xs text-muted-foreground truncate">{t.note}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-sm font-semibold tabular-nums ${t.type === "payment" ? "text-[color:var(--color-success)]" : t.type === "expense" ? "text-[color:var(--color-danger)]" : ""}`}>
                      {t.type === "payment" ? "+" : t.type === "expense" ? "-" : ""}{formatINR(t.amount)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">{formatRelative(t.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="p-5 gap-3">
            <h2 className="font-semibold">Quick actions</h2>
            <div className="grid grid-cols-1 gap-2">
              <Link to="/add-transaction"><Button variant="outline" className="w-full justify-start gap-2"><Receipt className="h-4 w-4 text-primary" /> Record transaction</Button></Link>
              <Link to="/add-customer"><Button variant="outline" className="w-full justify-start gap-2"><UserPlus className="h-4 w-4 text-primary" /> Add customer</Button></Link>
              <Link to="/add-product"><Button variant="outline" className="w-full justify-start gap-2"><PackagePlus className="h-4 w-4 text-primary" /> Add product</Button></Link>
            </div>
          </Card>

          <Card className="p-5 gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Follow-ups</h2>
              <Link to="/customers"><Button variant="ghost" size="sm" className="text-xs">All</Button></Link>
            </div>
            {followUps.isLoading ? <ListSkeleton rows={4} /> : (
              <div className="space-y-2">
                {followUps.data?.map(c => (
                  <Link key={c.id} to="/customers/$id" params={{ id: c.id }} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                    <Avatar className="h-8 w-8"><AvatarFallback className="text-[11px] bg-muted">{initials(c.name)}</AvatarFallback></Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <StatusPill tone="danger">{formatINR(c.outstanding)} due</StatusPill>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
