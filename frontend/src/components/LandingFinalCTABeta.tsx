import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Rocket, Bell, Star, Zap } from "lucide-react";

export function LandingFinalCTABeta() {
  return (
    <section className="w-full py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-blue-500/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Beta Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Rocket className="w-4 h-4" />
          Limited Beta Access Available
        </div>

        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-foreground leading-tight">
          Be Among the First to Experience{" "}
          <span className="text-transparent bg-gradient-to-r from-primary to-blue-600 bg-clip-text">
            the Future
          </span>
        </h2>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Join our exclusive beta waitlist and help shape the most intuitive CI/CD platform ever built. 
          Early access, free testing, and lifetime benefits await.
        </p>

        {/* Beta Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-background/50 backdrop-blur border border-border/50 hover:border-primary/50 transition-colors group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary/30 group-hover:to-blue-500/30 transition-colors">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">VIP Early Access</h3>
              <p className="text-sm text-muted-foreground">Get exclusive access weeks before public launch</p>
            </CardContent>
          </Card>
          
          <Card className="bg-background/50 backdrop-blur border border-border/50 hover:border-primary/50 transition-colors group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-colors">
                <Zap className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Free Beta Testing</h3>
              <p className="text-sm text-muted-foreground">Full access to all features during beta period</p>
            </CardContent>
          </Card>
          
          <Card className="bg-background/50 backdrop-blur border border-border/50 hover:border-primary/50 transition-colors group">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-colors">
                <Bell className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Shape the Product</h3>
              <p className="text-sm text-muted-foreground">Direct input on features and user experience</p>
            </CardContent>
          </Card>
        </div>

        {/* Main CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-8 mb-8">
          <div className="mb-6">
            <div className="text-2xl font-bold text-foreground mb-2">🚀 Ready to Transform Your Deployments?</div>
            <p className="text-muted-foreground">Join hundreds of developers already on the waitlist</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group text-primary-foreground bg-primary hover:bg-primary/90">
              <Link href="/beta/waitlist" className="flex items-center gap-2">
                Secure Your Beta Spot
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              ✓ No spam, ever • ✓ Unsubscribe anytime • ✓ Beta updates only
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-background"></div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-green-600 border-2 border-background"></div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-background"></div>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 border-2 border-background"></div>
            </div>
            <span>Join 500+ developers waiting</span>
          </div>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Active development in progress</span>
          </div>
        </div>
      </div>
    </section>
  );
}