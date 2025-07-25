"use client";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignInButton } from "@clerk/nextjs";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="w-full fixed top-0 left-0 z-40 bg-background border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo left */}
        <Link href="/" className="flex items-center gap-2">
          <Logo width={40} height={40} />
          <span className="font-bold text-xl text-foreground">Latchkey</span>
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
        {/* CTA and Sign In right */}
        <div className="hidden md:flex items-center gap-2">
          <SignInButton mode="modal">
            <Button variant="outline" className="px-5 py-2 rounded-lg text-base shadow-none">
              Sign In
            </Button>
          </SignInButton>
          <Button asChild className="px-5 py-2 rounded-lg text-base shadow-none">
            <Link href="/waitlist">Join Waitlist</Link>
          </Button>
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded hover:bg-primary/10"
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
        <div className="md:hidden bg-background border-t border-border px-4 pb-4">
          <div className="flex flex-col gap-4 mt-2">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition font-medium text-lg"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <SignInButton mode="modal">
              <Button variant="outline" className="w-full mt-2">
                Sign In
              </Button>
            </SignInButton>
            <Button asChild className="w-full">
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
} 