import Link from "next/link";

export function LandingFooterBeta() {
  return (
    <footer className="w-full py-8 px-4 bg-background border-t border-border transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-foreground text-sm">
          &copy; {new Date().getFullYear()} Latchkey. All rights reserved. • Currently in Beta Development
        </div>
        <div className="flex gap-6 text-foreground text-sm">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
          <Link href="/beta/waitlist" className="hover:text-primary transition-colors">Join Waitlist</Link>
        </div>
      </div>
    </footer>
  );
}