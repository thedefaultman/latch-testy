"use client";
import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Sidebar state is managed in the sidebar itself, so just add margin for both states
  // For simplicity, use a fixed margin (w-64 or w-20)
  // In a real app, you might want to sync collapsed state via context
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardSidebar />
      <main className="ml-64 transition-all duration-200 p-6">
        {children}
      </main>
    </div>
  );
} 