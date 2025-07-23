"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import { CheckCircle, Zap, Shield, Clock, ArrowRight, Sparkles } from "lucide-react";

export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the beta API endpoint for production
      const response = await fetch('/api/waitlist-beta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setName("");
        setEmail("");
        toast.success('You have been added to the waitlist!');
      } else {
        toast.error(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100 dark:from-gray-900 dark:via-background dark:to-gray-900 transition-colors px-4 relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-600/5 pointer-events-none" />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo and Branding */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Latchkey Logo"
              width={64}
              height={64}
              className="mr-3"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-gradient-to-r from-primary to-blue-600 bg-clip-text">
              Latchkey
            </h1>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Join the <span className="text-transparent bg-gradient-to-r from-primary to-blue-600 bg-clip-text">Waitlist</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground text-center mb-6 font-medium">
            Provision CI/CD Pipelines Instantly
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="w-5 h-5 text-primary" />
            <p className="text-primary font-semibold text-lg">
              Be the first to experience the future of DevOps
            </p>
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 backdrop-blur border border-border/50">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">Lightning Fast</p>
              <p className="text-xs text-muted-foreground">5min setup</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 backdrop-blur border border-border/50">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">Enterprise Security</p>
              <p className="text-xs text-muted-foreground">SOC 2 compliant</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 backdrop-blur border border-border/50">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">99.9% Uptime</p>
              <p className="text-xs text-muted-foreground">Always reliable</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-background/50 backdrop-blur border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Welcome to the Future! 🚀
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Thank you for joining our waitlist. You'll be among the first to experience Latchkey when we launch.
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-primary font-medium">
                    Keep an eye on your inbox for exclusive updates and early access invitations!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-muted-foreground">
                    Get early access and help shape the future of CI/CD automation
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 text-lg bg-background border-border focus:border-primary transition-colors"
                    />
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="h-12 text-lg bg-background border-border focus:border-primary transition-colors"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                        <span>Joining waitlist...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Join Waitlist</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </form>
                
                <div className="text-center pt-4">
                  <p className="text-xs text-muted-foreground">
                    No spam, ever. Unsubscribe with one click.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Bottom messaging */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Trusted by developers at leading companies worldwide
          </p>
        </div>
      </div>
    </main>
  );
} 