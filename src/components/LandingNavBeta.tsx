"use client";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#why-choose-us", label: "Why Latchkey" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNavBeta() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="w-full fixed top-0 left-0 z-40 bg-background border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Logo left */}
        <Link href="/beta" className="flex items-center gap-2 flex-shrink-0">
          <Logo width={40} height={40} />
          <span className="font-bold text-lg sm:text-xl text-foreground">Latchkey</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">BETA</span>
        </Link>
        {/* Desktop nav links center */}
        <div className="hidden md:flex flex-1 justify-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary transition font-medium px-2"
            >
              {link.label}
            </a>
          ))}
        </div>
        {/* CTA right */}
        <div className="hidden md:flex items-center gap-2">
          <Button asChild className="px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base shadow-none min-h-[44px]">
            <Link href="/beta/waitlist">Join Beta Waitlist</Link>
          </Button>
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-12 h-12 rounded hover:bg-primary/10 flex-shrink-0"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Open navigation menu"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-foreground">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 sm:px-6 pb-4">
          <div className="flex flex-col gap-4 mt-4">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition font-medium text-lg py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Button asChild className="w-full mt-4 min-h-[48px] text-base">
              <Link href="/beta/waitlist">Join Beta Waitlist</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}