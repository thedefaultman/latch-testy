import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const companies = [
  { name: "GitHub", logo: "🐙" },
  { name: "Vercel", logo: "▲" },
  { name: "Stripe", logo: "💳" },
  { name: "Shopify", logo: "🛍️" },
  { name: "Discord", logo: "🎮" },
  { name: "Linear", logo: "📐" }
];

const testimonials = [
  {
    text: "SaaS Pipeline cut our deployment time from 2 hours to 5 minutes. The team collaboration features are incredible.",
    author: "Sarah Chen",
    role: "VP Engineering",
    company: "TechCorp",
    avatar: "👩‍💻",
    rating: 5
  },
  {
    text: "Finally, a CI/CD solution that just works. No complex YAML, no debugging pipelines for hours. Pure magic.",
    author: "Marcus Rodriguez",
    role: "DevOps Lead", 
    company: "StartupXYZ",
    avatar: "👨‍💼",
    rating: 5
  },
  {
    text: "The security features and compliance support saved us months of implementation. Enterprise-ready from day one.",
    author: "Emily Watson",
    role: "CTO",
    company: "FinanceApp",
    avatar: "👩‍🔬",
    rating: 5
  }
];

const stats = [
  { number: "10,000+", label: "Pipelines Deployed", icon: "🚀" },
  { number: "99.9%", label: "Uptime Achieved", icon: "⚡" },
  { number: "500+", label: "Teams Onboarded", icon: "👥" },
  { number: "50M+", label: "Deployments Run", icon: "📊" }
];

export function LandingSocialProof() {
  return (
    <section className="w-full py-24 px-4 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        
        {/* Company Logos */}
        <div className="text-center mb-16">
          <p className="text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">
            Trusted by development teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
            {companies.map((company, i) => (
              <div key={i} className="flex items-center gap-2 text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-3xl">{company.logo}</span>
                <span className="text-xl">{company.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Don't just take our word for it
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from the teams who've transformed their deployment workflow with SaaS Pipeline
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="relative bg-background/50 backdrop-blur border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, starI) => (
                    <Star key={starI} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">
                      {testimonial.author}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-6 bg-muted/50 px-8 py-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-sm text-muted-foreground">SOC 2 Certified</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🔒</span>
              </div>
              <span className="text-sm text-muted-foreground">GDPR Compliant</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">⚡</span>
              </div>
              <span className="text-sm text-muted-foreground">99.9% SLA</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}