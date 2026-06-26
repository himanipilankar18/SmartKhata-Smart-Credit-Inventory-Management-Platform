import { type ReactNode, useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, Receipt, Package, BarChart3, Bell, Settings,
  Wallet, Plus, Search, Moon, Sun, Menu, ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { applyTheme, useUIStore } from "@/store/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/products", label: "Products", icon: Wallet },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

const MOBILE_NAV = NAV.slice(0, 5);

function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  return (
    <Button
      variant="ghost" size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </Button>
  );
}

function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-[width] duration-200 sticky top-0 h-screen",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="h-16 flex items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold shrink-0">S</div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">SmartKhata</div>
            <div className="text-[11px] text-muted-foreground truncate">Credit & Inventory</div>
          </div>
        )}
      </div>
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const active = isActive(item.to, item.exact);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-primary-light text-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost" size="sm"
          className="w-full justify-start gap-2"
          onClick={toggleSidebar}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
          {!sidebarCollapsed && <span>Collapse</span>}
        </Button>
      </div>
    </aside>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur border-b border-border flex items-center gap-3 px-4 md:px-6">
      <div className="md:hidden h-8 w-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-bold">S</div>
      <div className="md:hidden font-semibold">SmartKhata</div>

      <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search customers, products, transactions..." className="pl-9 h-9 bg-muted/50 border-transparent" />
        </div>
      </div>

      <div className="flex-1 md:flex-none" />

      <Link to="/add-transaction" className="hidden sm:inline-flex">
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Quick Entry</span>
        </Button>
      </Link>
      <ThemeToggle />
      <Link to="/notifications" className="relative">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-danger text-white border-0">3</Badge>
      </Link>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs bg-primary-light text-accent-foreground">SK</AvatarFallback>
      </Avatar>
    </header>
  );
}

function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      <Link to="/add-transaction" className="md:hidden fixed bottom-20 right-4 z-40">
        <motion.div whileTap={{ scale: 0.92 }}>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </motion.div>
      </Link>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-card border-t border-border h-16 grid grid-cols-5">
        {MOBILE_NAV.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link key={item.to} to={item.to} className="flex flex-col items-center justify-center gap-1 text-[10px]">
              <item.icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
              <span className={cn(active ? "text-primary font-medium" : "text-muted-foreground")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { theme } = useUIStore();
  useEffect(() => {
    applyTheme(theme);
    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const cb = () => applyTheme("system");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 pb-20 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-6 max-w-7xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
