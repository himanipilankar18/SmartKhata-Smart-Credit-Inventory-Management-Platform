import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customers } from "@/data/mocks";

export const Route = createFileRoute("/add-transaction")({
  head: () => ({ meta: [{ title: "New Entry — SmartKhata" }] }),
  component: AddTransaction,
});

const schema = z.object({
  type: z.enum(["credit","payment","sale","expense"]),
  customerId: z.string().min(1),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  note: z.string().optional(),
});
type V = z.infer<typeof schema>;

function AddTransaction() {
  const navigate = useNavigate();
  const form = useForm<V>({ resolver: zodResolver(schema), defaultValues: { type: "credit", customerId: "", note: "" } });
  const onSubmit = (v: V) => { toast.success(`Recorded ${v.type} of ₹${v.amount}`); navigate({ to: "/transactions" }); };

  return (
    <>
      <PageHeader title="New Entry" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Transactions", to: "/transactions" }, { label: "New" }]} />
      <Card className="p-6 max-w-xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Type</Label>
            <div className="grid grid-cols-4 gap-2">
              {(["credit","payment","sale","expense"] as const).map(t => {
                const active = form.watch("type") === t;
                return (
                  <button type="button" key={t} onClick={() => form.setValue("type", t)}
                    className={`text-xs capitalize py-2 rounded-md border transition-colors ${active ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-muted"}`}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Customer</Label>
            <Select onValueChange={(v) => form.setValue("customerId", v)}>
              <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>
                {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {form.formState.errors.customerId && <p className="text-xs text-[color:var(--color-danger)]">Required</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Amount (₹)</Label>
            <Input type="number" {...form.register("amount")} placeholder="0" />
            {form.formState.errors.amount && <p className="text-xs text-[color:var(--color-danger)]">{form.formState.errors.amount.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Note</Label>
            <Textarea {...form.register("note")} placeholder="Optional note" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">Save entry</Button>
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/" })}>Cancel</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
