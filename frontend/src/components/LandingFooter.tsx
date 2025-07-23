export function LandingFooter() {
  return (
    <footer className="w-full py-8 px-4 bg-background border-t border-border transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-foreground text-sm">&copy; {new Date().getFullYear()} Latchkey. All rights reserved.</div>
        <div className="flex gap-6 text-foreground text-sm">
          <a href="#features" className="hover:text-green-600">Features</a>
          <a href="#how-it-works" className="hover:text-green-600">How it works</a>
          <a href="/dashboard" className="hover:text-green-600">Dashboard</a>
        </div>
      </div>
    </footer>
  );
} 