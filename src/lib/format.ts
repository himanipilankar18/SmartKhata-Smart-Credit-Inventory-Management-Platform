export const formatINR = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export const formatNumber = (n: number) => n.toLocaleString("en-IN");

export const formatDate = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const formatRelative = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  const diffMs = Date.now() - date.getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d2 = Math.floor(h / 24);
  if (d2 < 30) return `${d2}d ago`;
  return formatDate(date);
};

export const initials = (name: string) =>
  name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
