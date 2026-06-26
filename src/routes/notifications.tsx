import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Bell, CheckCheck, CreditCard, Package, Settings as SettingsIcon, Clock } from "lucide-react";
import { notificationService } from "@/services";
import { PageHeader } from "@/components/shared/PageHeader";
import { ListSkeleton } from "@/components/shared/Loaders";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — SmartKhata" }] }),
  component: NotificationsPage,
});

const ICONS = {
  payment: CreditCard, stock: Package, system: SettingsIcon, reminder: Clock,
};

function NotificationsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["notifications"], queryFn: notificationService.list });
  const [tab, setTab] = useState("all");
  const list = (data ?? []).filter(n => tab === "all" ? true : tab === "unread" ? !n.read : n.category === tab);

  return (
    <>
      <PageHeader
        title="Notifications"
        description={`${(data ?? []).filter(n => !n.read).length} unread`}
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Notifications" }]}
        actions={<Button variant="outline" size="sm" className="gap-1.5"><CheckCheck className="h-4 w-4" />Mark all read</Button>}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="payment">Payments</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="reminder">Reminders</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-4">
          {isLoading ? <ListSkeleton /> : list.length === 0 ? (
            <Card><EmptyState icon={Bell} title="No notifications" /></Card>
          ) : (
            <Card className="p-0 overflow-hidden">
              <div className="divide-y divide-border">
                {list.map(n => {
                  const Icon = ICONS[n.category];
                  return (
                    <div key={n.id} className={cn("flex items-start gap-3 px-4 py-3", !n.read && "bg-primary-light/40")}>
                      <div className="h-9 w-9 rounded-md bg-muted grid place-items-center shrink-0"><Icon className="h-4 w-4 text-muted-foreground" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">{n.title}</span>
                          {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{n.body}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground shrink-0">{formatRelative(n.date)}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
