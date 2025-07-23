import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingFinalCTA() {
  return (
    <section className="w-full py-16 px-4 bg-primary transition-colors">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-primary-foreground">Ready to get started?</h2>
        <p className="text-lg text-primary-foreground/80 mb-8">Sign up for the waitlist and launch your first pipeline in minutes.</p>
        <Button asChild className="px-8 py-3 text-lg font-semibold rounded-lg final-cta-btn">
          <Link href="/waitlist">Join Waitlist</Link>
        </Button>
      </div>
    </section>
  );
} 