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

export const Route = createFileRoute("/add-customer")({
  head: () => ({ meta: [{ title: "Add Customer — SmartKhata" }] }),
  component: AddCustomer,
});

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().min(10, "Enter a valid phone"),
  address: z.string().optional(),
  openingBalance: z.coerce.number().optional(),
});
type FormValues = z.infer<typeof schema>;

function AddCustomer() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", phone: "", address: "" } });

  const onSubmit = (v: FormValues) => {
    toast.success(`Added ${v.name}`);
    navigate({ to: "/customers" });
  };

  return (
    <>
      <PageHeader title="Add Customer" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Customers", to: "/customers" }, { label: "Add" }]} />
      <Card className="p-6 max-w-xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Name *</Label>
            <Input {...form.register("name")} placeholder="e.g. Ramesh Kumar" />
            {form.formState.errors.name && <p className="text-xs text-[color:var(--color-danger)]">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Phone *</Label>
            <Input {...form.register("phone")} placeholder="+91 98765 43210" />
            {form.formState.errors.phone && <p className="text-xs text-[color:var(--color-danger)]">{form.formState.errors.phone.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Address</Label>
            <Textarea {...form.register("address")} placeholder="Shop / home address" />
          </div>
          <div className="space-y-1.5">
            <Label>Opening balance (₹)</Label>
            <Input type="number" {...form.register("openingBalance")} placeholder="0" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">Save customer</Button>
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/customers" })}>Cancel</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
