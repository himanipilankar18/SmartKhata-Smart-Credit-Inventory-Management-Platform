import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
  head: () => ({ meta: [{ title: "Products — SmartKhata" }] }),
  component: () => <Navigate to="/inventory" />,
});
