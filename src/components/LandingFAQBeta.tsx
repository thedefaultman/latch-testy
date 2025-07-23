import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { HelpCircle, Rocket, Clock, Shield, CreditCard, Users } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    q: "When will Latchkey be available?",
    a: "We're targeting a Q4 2025 launch for our public beta. Beta testers who join our waitlist will get early access weeks before the public release.",
    icon: <Clock className="w-5 h-5 text-primary" />
  },
  {
    q: "What will be included in the beta?",
    a: "The beta will include our core pipeline provisioning engine, support for major frameworks (React, Node.js, Python, etc.), and basic GitHub Actions integration. Advanced features like team collaboration and enterprise integrations will be added throughout the beta period.",
    icon: <Rocket className="w-5 h-5 text-blue-500" />
  },
  {
    q: "Is the beta free to use?",
    a: "Yes! Beta testers get completely free access to test all features and provide feedback. You'll also receive exclusive early-bird pricing when we launch commercially.",
    icon: <CreditCard className="w-5 h-5 text-green-500" />
  },
  {
    q: "How secure will the platform be?",
    a: "Security is our top priority from day one. We're building with enterprise-grade encryption, SOC 2 compliance planning, and zero-trust architecture. Your code and data will be protected with bank-level security.",
    icon: <Shield className="w-5 h-5 text-green-500" />
  },
  {
    q: "Can I provide feedback during the beta?",
    a: "Absolutely! We're building this platform with our community. Beta testers will have direct access to our development team through dedicated feedback channels, and your input will directly shape the final product.",
    icon: <Users className="w-5 h-5 text-purple-500" />
  },
  {
    q: "What happens to my pipelines after beta?",
    a: "All pipelines created during beta will seamlessly transition to the production platform. You won't lose any configurations or need to rebuild your workflows.",
    icon: <HelpCircle className="w-5 h-5 text-blue-500" />
  },
  {
    q: "What frameworks will be supported at launch?",
    a: "We're starting with the most popular: React, Next.js, Node.js, Python, Java, Go, Rust, and Docker. Additional framework support will be added based on community feedback during beta.",
    icon: <Rocket className="w-5 h-5 text-orange-500" />
  },
  {
    q: "How do I stay updated on development progress?",
    a: "Join our waitlist for regular updates, development milestones, and exclusive previews. We'll also share progress updates on our social channels and through our newsletter.",
    icon: <Clock className="w-5 h-5 text-pink-500" />
  }
];

export function LandingFAQBeta() {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-muted/20 to-background transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <HelpCircle className="w-4 h-4" />
            Beta Questions & Answers
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Everything you need to know{" "}
            <span className="text-transparent bg-gradient-to-r from-primary to-blue-600 bg-clip-text">
              about the beta
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Get answers about our development timeline, beta access, and what to expect
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-background/80 backdrop-blur rounded-2xl border border-border/50 p-4 sm:p-6 md:p-8 shadow-lg dark:bg-gray-900/80 dark:border-gray-800/50">
          <Accordion type="multiple" className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem 
                key={i}
                value={faq.q} 
                className="border border-border/50 rounded-xl px-4 sm:px-6 py-2 bg-background/60 backdrop-blur hover:bg-background/80 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 dark:bg-gray-800/60 dark:hover:bg-gray-800/80 dark:border-gray-700/50"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="shrink-0">
                      {faq.icon}
                    </div>
                    <span className="text-base sm:text-lg font-semibold text-foreground">
                      {faq.q}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 sm:pb-6 pl-8 sm:pl-12">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <p className="text-muted-foreground mb-6">
            Have more questions about the beta? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/beta/waitlist" 
              className="px-6 sm:px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl min-h-[48px] text-base inline-flex items-center justify-center"
            >
              Join Beta Waitlist
            </Link>
            <a 
              href="mailto:contact@latchkey.dev" 
              className="px-6 sm:px-8 py-3 border border-border text-foreground rounded-xl font-semibold hover:bg-muted/50 transition-colors min-h-[48px] text-base inline-flex items-center justify-center"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}