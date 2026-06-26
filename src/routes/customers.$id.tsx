import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone, MessageCircle, MapPin, Plus, Receipt, FileText } from "lucide-react";
import { customerService, transactionService } from "@/services";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { ListSkeleton } from "@/components/shared/Loaders";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatINR, formatDate, initials } from "@/lib/format";

export const Route = createFileRoute("/customers/$id")({
  head: () => ({ meta: [{ title: "Customer — SmartKhata" }] }),
  component: CustomerDetail,
});

function CustomerDetail() {
  const { id } = Route.useParams();
  const customer = useQuery({ queryKey: ["customer", id], queryFn: () => customerService.get(id) });
  const tx = useQuery({ queryKey: ["customer-tx", id], queryFn: () => transactionService.byCustomer(id) });

  if (customer.isLoading) return <ListSkeleton rows={6} />;
  if (!customer.data) return <EmptyState title="Customer not found" />;

  const c = customer.data;
  return (
    <>
      <PageHeader
        title={c.name}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Customers", to: "/customers" }, { label: c.name }]}
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5"><MessageCircle className="h-4 w-4" />Remind</Button>
            <Link to="/add-transaction"><Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Entry</Button></Link>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-5 gap-4 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14"><AvatarFallback className="bg-primary-light text-accent-foreground">{initials(c.name)}</AvatarFallback></Avatar>
            <div className="min-w-0">
              <div className="font-semibold truncate">{c.name}</div>
              <StatusPill tone={c.outstanding > 0 ? "danger" : "success"}>{c.outstanding > 0 ? `${formatINR(c.outstanding)} due` : "Settled"}</StatusPill>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{c.phone}</div>
            <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{c.address}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outline" className="gap-1.5"><Phone className="h-4 w-4" />Call</Button>
            <Button size="sm" variant="outline" className="gap-1.5"><MessageCircle className="h-4 w-4" />WhatsApp</Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Outstanding" value={formatINR(c.outstanding)} tone="danger" />
            <StatCard label="Total credit" value={formatINR(c.totalCredit)} tone="info" />
            <StatCard label="Total paid" value={formatINR(c.totalPaid)} tone="success" />
          </div>

          <Card className="p-5 gap-3">
            <Tabs defaultValue="transactions">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="transactions" className="mt-4">
                {tx.isLoading ? <ListSkeleton /> : tx.data?.length === 0 ? (
                  <EmptyState icon={Receipt} title="No transactions yet" />
                ) : (
                  <div className="divide-y divide-border">
                    {tx.data?.map(t => (
                      <div key={t.id} className="flex items-center gap-3 py-3">
                        <div className="h-9 w-9 rounded-md bg-muted grid place-items-center"><Receipt className="h-4 w-4 text-muted-foreground" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium capitalize">{t.type}</div>
                          <div className="text-xs text-muted-foreground truncate">{t.note} · {formatDate(t.date)}</div>
                        </div>
                        <div className={`text-sm font-semibold tabular-nums shrink-0 ${t.type === "payment" ? "text-[color:var(--color-success)]" : ""}`}>
                          {t.type === "payment" ? "+" : ""}{formatINR(t.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="payments" className="mt-4">
                <EmptyState icon={Receipt} title="Payment history" description="Detailed payment timeline appears here." />
              </TabsContent>
              <TabsContent value="notes" className="mt-4">
                <EmptyState icon={FileText} title="No notes" description="Add internal notes for this customer." />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  );
}
