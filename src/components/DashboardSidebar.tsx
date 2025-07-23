"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Home, Plus, List, Github } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: "Create Pipeline",
    href: "/dashboard/new",
    icon: <Plus className="w-5 h-5" />,
  },
  {
    label: "My Pipelines",
    href: "/dashboard/pipelines",
    icon: <List className="w-5 h-5" />,
  },
  {
    label: "Install GitHub App",
    href: "/install-github-app",
    icon: <Github className="w-5 h-5" />,
  },
];

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  return (
    <aside className={`h-screen fixed top-0 left-0 z-50 bg-background border-r border-border flex flex-col transition-all duration-200 ${collapsed ? "w-20" : "w-64"}`}> 
      {/* Collapse button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className={`font-bold text-lg text-foreground transition-all ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>Dashboard</span>
        <button
          className="ml-auto p-2 rounded hover:bg-primary/10"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-foreground">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>
      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg mx-2 my-1 transition font-medium ${
                collapsed ? "justify-center px-0" : ""
              } ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-foreground hover:bg-primary/10"
              }`}
              title={item.label}
            >
              {item.icon}
              <span className={`transition-all ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>{item.label}</span>
            </Link>
          );
        })}
        <div className="flex-1" />
        <div className="border-t border-border my-2 mx-2" />
        <div className={`flex items-center gap-3 px-4 py-3 mb-4 ${collapsed ? "justify-center px-0" : ""}`}>
          <UserButton afterSignOutUrl="/" />
          <span className={`transition-all text-foreground text-sm ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>Account</span>
        </div>
      </nav>
    </aside>
  );
} 