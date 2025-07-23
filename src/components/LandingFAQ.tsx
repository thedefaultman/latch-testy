import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle, Shield, Clock, GitBranch, CreditCard, Users } from "lucide-react";

const faqs = [
  {
    q: "How quickly can I set up my first pipeline?",
    a: "Most teams have their first pipeline running in under 5 minutes. Our one-click provisioning automatically generates optimized GitHub Actions workflows for your project type - no YAML knowledge required.",
    icon: <Clock className="w-5 h-5 text-primary" />
  },
  {
    q: "Is my code and data secure?",
    a: "Absolutely. We use bank-grade encryption, never store your code permanently, and are SOC 2 certified. Your GitHub tokens are encrypted at rest and in transit, and we only access what's needed for pipeline provisioning.",
    icon: <Shield className="w-5 h-5 text-green-500" />
  },
  {
    q: "What's included in the 99.9% uptime SLA?",
    a: "Pro and Enterprise plans include guaranteed 99.9% uptime with automatic failover, real-time monitoring, and instant notifications. If we don't meet our SLA, you get service credits automatically.",
    icon: <HelpCircle className="w-5 h-5 text-blue-500" />
  },
  {
    q: "Do you support private repositories?",
    a: "Yes! We fully support both public and private GitHub repositories. Your private repos remain private - we only create and manage the GitHub Actions workflows within your repository.",
    icon: <GitBranch className="w-5 h-5 text-purple-500" />
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can cancel your subscription at any time from your dashboard with just one click. No cancellation fees, no questions asked. Your pipelines will continue running until the end of your billing period.",
    icon: <CreditCard className="w-5 h-5 text-orange-500" />
  },
  {
    q: "How does team collaboration work?",
    a: "Invite unlimited team members with role-based permissions. Teams can share pipelines, manage deployments together, and get unified notifications. Perfect for dev teams, DevOps, and engineering managers.",
    icon: <Users className="w-5 h-5 text-indigo-500" />
  },
  {
    q: "What happens to my existing GitHub Actions workflows?",
    a: "We don't touch your existing workflows. SaaS Pipeline creates new, optimized workflows alongside your current setup. You can migrate gradually or run both systems in parallel.",
    icon: <GitBranch className="w-5 h-5 text-teal-500" />
  },
  {
    q: "Is there a free trial?",
    a: "Yes! All new users get a 14-day free trial with full access to Pro features. No credit card required to start. Experience the power of one-click pipeline provisioning risk-free.",
    icon: <CreditCard className="w-5 h-5 text-pink-500" />
  }
];

export function LandingFAQ() {
  return (
    <section className="w-full py-24 px-4 bg-gradient-to-b from-muted/20 to-background transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Got questions?{" "}
            <span className="text-transparent bg-gradient-to-r from-primary to-blue-600 bg-clip-text">
              We've got answers
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about SaaS Pipeline, from setup to security
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-background/80 backdrop-blur rounded-2xl border border-border/50 p-8 shadow-lg dark:bg-gray-900/80 dark:border-gray-800/50">
          <Accordion type="multiple" className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i}
                value={faq.q} 
                className="border border-border/50 rounded-xl px-6 py-2 bg-background/60 backdrop-blur hover:bg-background/80 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 dark:bg-gray-800/60 dark:hover:bg-gray-800/80 dark:border-gray-700/50"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">
                      {faq.icon}
                    </div>
                    <span className="text-lg font-semibold text-foreground">
                      {faq.q}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 pl-12">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Still have questions? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
              Contact Support
            </button>
            <button className="px-8 py-3 border border-border text-foreground rounded-xl font-semibold hover:bg-muted/50 transition-colors">
              Schedule Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}