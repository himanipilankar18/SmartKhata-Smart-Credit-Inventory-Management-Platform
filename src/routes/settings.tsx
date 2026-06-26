import { createFileRoute } from "@tanstack/react-router";
import { Store, Palette, Bell, Globe, DatabaseBackup, Info, IndianRupee } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUIStore } from "@/store/ui";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — SmartKhata" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useUIStore();
  return (
    <>
      <PageHeader title="Settings" description="Manage your shop, preferences and account" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Settings" }]} />

      <Tabs defaultValue="business">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="business" className="gap-1.5"><Store className="h-3.5 w-3.5" />Business</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5"><Palette className="h-3.5 w-3.5" />Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="currency" className="gap-1.5"><IndianRupee className="h-3.5 w-3.5" />Currency</TabsTrigger>
          <TabsTrigger value="language" className="gap-1.5"><Globe className="h-3.5 w-3.5" />Language</TabsTrigger>
          <TabsTrigger value="backup" className="gap-1.5"><DatabaseBackup className="h-3.5 w-3.5" />Backup</TabsTrigger>
          <TabsTrigger value="about" className="gap-1.5"><Info className="h-3.5 w-3.5" />About</TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="mt-4">
          <Card className="p-6 gap-4 max-w-2xl">
            <h2 className="font-semibold">Business details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Shop name</Label><Input defaultValue="Sharma General Store" /></div>
              <div className="space-y-1.5"><Label>Owner</Label><Input defaultValue="Ramesh Sharma" /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
              <div className="space-y-1.5"><Label>GSTIN</Label><Input placeholder="22AAAAA0000A1Z5" /></div>
              <div className="sm:col-span-2 space-y-1.5"><Label>Address</Label><Input defaultValue="14, MG Road, Indore" /></div>
            </div>
            <div><Button>Save changes</Button></div>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-4">
          <Card className="p-6 gap-4 max-w-2xl">
            <h2 className="font-semibold">Theme</h2>
            <div className="flex gap-2">
              {(["light","dark","system"] as const).map(t => (
                <Button key={t} variant={theme===t?"default":"outline"} onClick={() => setTheme(t)} className="capitalize">{t}</Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">System matches your device. Your choice is remembered on this device.</p>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="p-6 gap-4 max-w-2xl">
            <h2 className="font-semibold">Notification preferences</h2>
            {["Payment received","Low stock alerts","Daily summary","Customer follow-ups"].map(label => (
              <div key={label} className="flex items-center justify-between py-1">
                <span className="text-sm">{label}</span><Switch defaultChecked />
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="currency" className="mt-4">
          <Card className="p-6 max-w-2xl"><p className="text-sm">Default currency: <strong>INR (₹)</strong></p></Card>
        </TabsContent>
        <TabsContent value="language" className="mt-4">
          <Card className="p-6 max-w-2xl"><p className="text-sm">Language: <strong>English</strong> · Hindi support coming soon.</p></Card>
        </TabsContent>
        <TabsContent value="backup" className="mt-4">
          <Card className="p-6 gap-3 max-w-2xl">
            <h2 className="font-semibold">Backup & restore</h2>
            <p className="text-xs text-muted-foreground">Last backup: Today, 2:14 AM</p>
            <div className="flex gap-2"><Button>Backup now</Button><Button variant="outline">Restore</Button></div>
          </Card>
        </TabsContent>
        <TabsContent value="about" className="mt-4">
          <Card className="p-6 max-w-2xl gap-2">
            <h2 className="font-semibold">SmartKhata</h2>
            <p className="text-sm text-muted-foreground">Smart Credit & Inventory Management Platform</p>
            <p className="text-xs text-muted-foreground">Version 1.0.0 · © 2026 SmartKhata</p>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
