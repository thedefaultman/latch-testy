import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    features: ["100 pipeline runs", "1 concurrent build", "Community support"],
    cta: "Join Waitlist",
    highlight: false,
    href: "/waitlist",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    features: ["2,000 pipeline runs", "5 concurrent builds", "Priority support", "Advanced analytics"],
    cta: "Join Waitlist",
    highlight: true,
    href: "/waitlist",
  },
  {
    name: "Enterprise",
    price: "Contact",
    period: "",
    features: ["Unlimited runs", "Unlimited concurrency", "Dedicated support", "Custom SLAs"],
    cta: "Contact Sales",
    highlight: false,
    href: "/contact",
  },
];

export function LandingPricing() {
  return (
    <section className="w-full py-16 px-4 bg-background transition-colors">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-foreground">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <Card
              key={tier.name}
              className={`flex flex-col items-center p-8 border-2 ${tier.highlight ? "border-primary shadow-lg scale-105 z-10" : "border-border"} bg-background transition`}
            >
              <div className="text-2xl font-bold mb-2 text-foreground">{tier.name}</div>
              <div className="text-4xl font-extrabold mb-2 text-primary">{tier.price}<span className="text-lg font-normal text-foreground/70">{tier.period}</span></div>
              <CardContent className="flex-1 flex flex-col gap-2 text-foreground/80 p-0 mb-6">
                {tier.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-2 justify-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                    <span>{f}</span>
                  </div>
                ))}
              </CardContent>
              <Button asChild className={`w-full mt-4 ${tier.highlight ? "bg-primary text-primary-foreground" : "bg-background text-foreground border border-border"}`}>
                <a href={tier.href}>{tier.cta}</a>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 