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

export const Route = createFileRoute("/add-product")({
  head: () => ({ meta: [{ title: "Add Product — SmartKhata" }] }),
  component: AddProduct,
});

const schema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  category: z.string().min(2),
  unit: z.string().min(1),
  stock: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
  cost: z.coerce.number().min(0),
});
type V = z.infer<typeof schema>;

function AddProduct() {
  const navigate = useNavigate();
  const form = useForm<V>({ resolver: zodResolver(schema), defaultValues: { name: "", sku: "", category: "", unit: "pcs" } });
  const onSubmit = (v: V) => { toast.success(`Added ${v.name}`); navigate({ to: "/inventory" }); };

  return (
    <>
      <PageHeader title="Add Product" breadcrumbs={[{ label: "Home", to: "/" }, { label: "Inventory", to: "/inventory" }, { label: "Add" }]} />
      <Card className="p-6 max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2"><Label>Product name *</Label><Input {...form.register("name")} placeholder="e.g. Basmati Rice 1kg" /></div>
          <div className="space-y-1.5"><Label>SKU *</Label><Input {...form.register("sku")} placeholder="SKU-2001" /></div>
          <div className="space-y-1.5"><Label>Category *</Label><Input {...form.register("category")} placeholder="Grocery" /></div>
          <div className="space-y-1.5"><Label>Unit</Label><Input {...form.register("unit")} placeholder="pcs / kg / ltr" /></div>
          <div className="space-y-1.5"><Label>Stock *</Label><Input type="number" {...form.register("stock")} /></div>
          <div className="space-y-1.5"><Label>Cost (₹)</Label><Input type="number" {...form.register("cost")} /></div>
          <div className="space-y-1.5"><Label>Selling price (₹)</Label><Input type="number" {...form.register("price")} /></div>
          <div className="sm:col-span-2 flex gap-2 pt-2">
            <Button type="submit">Save product</Button>
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/inventory" })}>Cancel</Button>
          </div>
        </form>
      </Card>
    </>
  );
}
