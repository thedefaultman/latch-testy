import { Server, Timer, Globe, Headphones } from "lucide-react";

const pillars = [
  {
    icon: <Server className="w-7 h-7 text-primary" />,
    title: "99.9% Uptime",
    desc: "Reliable infrastructure you can trust, 24/7/365.",
  },
  {
    icon: <Timer className="w-7 h-7 text-primary" />,
    title: "30s Avg Build",
    desc: "Lightning-fast builds keep your team productive.",
  },
  {
    icon: <Globe className="w-7 h-7 text-primary" />,
    title: "Global Runners",
    desc: "Deploy and test from anywhere in the world.",
  },
  {
    icon: <Headphones className="w-7 h-7 text-primary" />,
    title: "Pro Support",
    desc: "Expert help, whenever you need it.",
  },
];

export function LandingWhyChooseUs() {
  return (
    <section className="w-full py-16 px-4 bg-background transition-colors">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-foreground">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {pillars.map((p, i) => (
            <div key={i} className="flex flex-col items-center bg-background rounded-lg shadow p-6">
              <div className="mb-3">{p.icon}</div>
              <div className="text-xl font-semibold text-foreground mb-1">{p.title}</div>
              <div className="text-foreground/80 text-sm">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 