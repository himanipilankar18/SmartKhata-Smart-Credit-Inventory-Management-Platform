import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
export const Route = createFileRoute("/products/")({
  head: () => ({ meta: [{ title: "Products — SmartKhata" }] }),
  component: () => <Navigate to="/inventory" />,
});
// Keep Link import-friendly tree-shake-safe
void Link;
