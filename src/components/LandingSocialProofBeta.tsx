import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Code, Zap, Shield, Users, GitBranch } from "lucide-react";

const technologies = [
  { name: "GitHub Actions", icon: "🐙", description: "Native integration" },
  { name: "Docker", icon: "🐳", description: "Container support" },
  { name: "AWS", icon: "☁️", description: "Cloud deployment" },
  { name: "Vercel", icon: "▲", description: "Edge functions" },
  { name: "Node.js", icon: "🟢", description: "Backend apps" },
  { name: "React", icon: "⚛️", description: "Frontend apps" }
];

const features = [
  {
    icon: <Code className="w-8 h-8 text-primary" />,
    title: "Smart Pipeline Generation",
    description: "AI-powered workflow creation based on your project structure and requirements."
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    title: "Lightning Fast Setup",
    description: "From repository to deployment in under 5 minutes with zero configuration."
  },
  {
    icon: <Shield className="w-8 h-8 text-green-500" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance features built from day one."
  }
];

export function LandingSocialProofBeta() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        
        {/* Beta Announcement */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            Currently in Development
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Building the Future of{" "}
            <span className="text-transparent bg-gradient-to-r from-primary to-blue-600 bg-clip-text">
              CI/CD Automation
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            We're crafting a revolutionary platform that will transform how development teams deploy and manage their applications
          </p>
        </div>

        {/* Technology Integration Preview */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">
            Seamless integration with your favorite tools
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {technologies.map((tech, i) => (
              <div key={i} className="text-center group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-background/50 backdrop-blur border border-border/50 rounded-xl flex items-center justify-center mb-2 sm:mb-3 mx-auto group-hover:border-primary/50 transition-colors">
                  <span className="text-xl sm:text-2xl">{tech.icon}</span>
                </div>
                <div className="text-xs sm:text-sm font-medium text-foreground mb-1">{tech.name}</div>
                <div className="text-xs text-muted-foreground">{tech.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, i) => (
            <Card key={i} className="bg-background/50 backdrop-blur border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Development Progress */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-12 sm:mb-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 rounded-full bg-green-500" />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-600 mb-1">Core Engine</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-1">UI Platform</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500/50" />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600 mb-1">Integrations</div>
            <div className="text-sm text-muted-foreground">Next Phase</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/30" />
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600 mb-1">Enterprise</div>
            <div className="text-sm text-muted-foreground">Planned</div>
          </div>
        </div>

        {/* Beta Benefits */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-gradient-to-r from-primary/10 to-blue-500/10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">Beta Access</div>
                <div className="text-xs text-muted-foreground">Free early testing</div>
              </div>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">Shape the Product</div>
                <div className="text-xs text-muted-foreground">Direct feedback channel</div>
              </div>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">Launch Benefits</div>
                <div className="text-xs text-muted-foreground">Exclusive early pricing</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}