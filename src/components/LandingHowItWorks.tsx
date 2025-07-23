import { Card, CardContent } from "@/components/ui/card";
import { Github, Settings, Rocket } from "lucide-react";

const steps = [
  {
    icon: <Github className="w-8 h-8 text-primary" />,
    title: "Connect GitHub",
    desc: "Sign in and connect your GitHub account securely using OAuth and our GitHub App.",
  },
  {
    icon: <Settings className="w-8 h-8 text-primary" />,
    title: "Select & Configure",
    desc: "Pick a repository, choose your project type, runner, and storage. Preview before launch.",
  },
  {
    icon: <Rocket className="w-8 h-8 text-primary" />,
    title: "Provision Pipeline",
    desc: "Click launch and we’ll provision your pipeline, set up workflows, and notify you when ready.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="w-full py-16 px-4 bg-background transition-colors">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-foreground">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <Card key={i} className="bg-background border-0 shadow flex flex-col items-center p-6">
              <div className="mb-4">{s.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-foreground text-center">{s.title}</h3>
              <CardContent className="text-foreground/80 text-center p-0">
                {s.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 