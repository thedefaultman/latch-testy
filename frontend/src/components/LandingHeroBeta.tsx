import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { 
  Zap, 
  Shield, 
  GitBranch, 
  Clock,
  CheckCircle2,
  Users,
  ArrowRight,
  Play,
  Code,
  Rocket
} from "lucide-react";

export function LandingHeroBeta() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-br from-background via-background to-muted/20 transition-colors relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div className="text-center lg:text-left">
          {/* Beta Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            Coming Soon - Join the Beta
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-foreground leading-tight">
            The Future of 
            <span className="text-transparent bg-gradient-to-r from-primary to-blue-600 bg-clip-text">
              {" "}CI/CD Automation
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl lg:max-w-none">
            We're building the most intuitive CI/CD pipeline provisioning platform. 
            Deploy GitHub Actions workflows in seconds, not hours. 
          </p>

          {/* Coming Soon Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <span className="text-sm text-muted-foreground">One-click provisioning</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <span className="text-sm text-muted-foreground">Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <span className="text-sm text-muted-foreground">Multi-cloud support</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <span className="text-sm text-muted-foreground">Team collaboration</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <Button asChild size="lg" className="px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group">
              <Link href="/beta/waitlist" className="flex items-center gap-2">
                Join Beta Waitlist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg rounded-xl group">
              <Link href="#features" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Learn More
              </Link>
            </Button>
          </div>

          {/* Development Progress */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
            <div className="text-center lg:text-left">
              <div className="text-2xl font-bold text-primary">Q2 2025</div>
              <div className="text-sm text-muted-foreground">Expected launch</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl font-bold text-green-600">Beta</div>
              <div className="text-sm text-muted-foreground">Early access</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl font-bold text-blue-600">Free</div>
              <div className="text-sm text-muted-foreground">Beta testing</div>
            </div>
          </div>
        </div>

        {/* Right Visual - Dashboard Preview */}
        <div className="relative">
          {/* Dashboard Preview Card */}
          <Card className="p-1 bg-gradient-to-br from-background to-muted/50 shadow-2xl border-0">
            <div className="bg-background rounded-lg p-6 relative overflow-hidden">
              {/* Browser Header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full inline-block">
                    app.latchkey.dev/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">My Pipelines</h3>
                    <p className="text-sm text-muted-foreground">Manage your CI/CD workflows</p>
                  </div>
                  <Button size="sm" className="gap-2">
                    <GitBranch className="w-4 h-4" />
                    New Pipeline
                  </Button>
                </div>

                {/* Pipeline Cards */}
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">frontend-app</div>
                      <div className="text-xs text-muted-foreground">Next.js • Last run 2 min ago</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">2m 45s</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">api-service</div>
                      <div className="text-xs text-muted-foreground">Node.js • Running now</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">1m 23s</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">mobile-app</div>
                      <div className="text-xs text-muted-foreground">React Native • Last run 1 hour ago</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">4m 12s</span>
                    </div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">98.5%</div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">24</div>
                    <div className="text-xs text-muted-foreground">Active Pipelines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">1.2k</div>
                    <div className="text-xs text-muted-foreground">Total Runs</div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-4 right-4 opacity-20">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-10">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </Card>

          {/* Floating Beta Badge */}
          <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            ✨ Beta Preview
          </div>

          {/* Floating Timeline Badge */}
          <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
            <Rocket className="w-3 h-3" />
            Coming Q2 2025
          </div>
        </div>
      </div>
    </section>
  );
}