import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  CheckCircle, 
  Shield, 
  Cloud, 
  Users,
  Zap,
  GitBranch,
  Timer,
  Award,
  TrendingUp
} from "lucide-react";

const features = [
  {
    icon: <Zap className="w-10 h-10" />,
    title: "Lightning Fast Setup",
    desc: "Deploy production-ready CI/CD pipelines in under 5 minutes. No configuration files, no complex setups.",
    gradient: "from-yellow-400 to-orange-500",
    accent: "text-yellow-600 dark:text-yellow-400"
  },
  {
    icon: <Shield className="w-10 h-10" />,
    title: "Enterprise Security",
    desc: "Bank-grade encryption, OAuth integration, and SOC 2 compliance. Your code stays secure, always.",
    gradient: "from-green-400 to-emerald-500", 
    accent: "text-green-600 dark:text-green-400"
  },
  {
    icon: <Cloud className="w-10 h-10" />,
    title: "Multi-Cloud Native",
    desc: "Deploy to AWS, GCP, Azure, or your private cloud. One interface, unlimited possibilities.",
    gradient: "from-blue-400 to-cyan-500",
    accent: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: <Users className="w-10 h-10" />,
    title: "Team Collaboration", 
    desc: "Built for teams. Manage permissions, track deployments, and collaborate seamlessly.",
    gradient: "from-purple-400 to-pink-500",
    accent: "text-purple-600 dark:text-purple-400"
  },
  {
    icon: <GitBranch className="w-10 h-10" />,
    title: "Smart Workflows",
    desc: "AI-powered pipeline optimization. Automatic testing, intelligent caching, and smart deployments.",
    gradient: "from-indigo-400 to-blue-500",
    accent: "text-indigo-600 dark:text-indigo-400"
  },
  {
    icon: <Timer className="w-10 h-10" />,
    title: "Real-time Monitoring",
    desc: "Live pipeline status, detailed logs, and instant notifications. Never miss a deployment again.",
    gradient: "from-red-400 to-pink-500",
    accent: "text-red-600 dark:text-red-400"
  },
  {
    icon: <Award className="w-10 h-10" />,
    title: "99.9% Uptime SLA",
    desc: "Enterprise-grade reliability with guaranteed uptime. Your deployments run when you need them.",
    gradient: "from-amber-400 to-yellow-500",
    accent: "text-amber-600 dark:text-amber-400"
  },
  {
    icon: <TrendingUp className="w-10 h-10" />,
    title: "Advanced Analytics",
    desc: "Deep insights into deployment performance, success rates, and team productivity metrics.",
    gradient: "from-teal-400 to-green-500",
    accent: "text-teal-600 dark:text-teal-400"
  }
];

export function LandingFeatures() {
  return (
    <section className="w-full py-24 px-4 bg-gradient-to-b from-background to-muted/20 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Everything you need to{" "}
            <span className="text-transparent bg-gradient-to-r from-primary to-blue-600 bg-clip-text">
              ship faster
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From one-click provisioning to enterprise-grade security, we've built every feature 
            your team needs to succeed in modern software delivery.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Card 
              key={i} 
              className="group relative bg-background/50 backdrop-blur border border-border/50 hover:border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <CardHeader className="pb-4">
                {/* Icon with Gradient Background */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </CardContent>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-gradient-to-br ${feature.gradient} transition-opacity duration-300 pointer-events-none`} />
            </Card>
          ))}
        </div>

        {/* Bottom CTA - Hidden for now, will enable when free trial and demo are ready */}
        {/* <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Ready to experience the future of CI/CD?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>
            <button className="px-8 py-3 border border-border text-foreground rounded-xl font-semibold hover:bg-muted/50 transition-colors">
              Schedule Demo
            </button>
          </div>
        </div> */}
      </div>
    </section>
  );
}