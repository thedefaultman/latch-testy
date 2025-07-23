"use client";
import { useState } from "react";

const reviews = [
  {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Alex Johnson",
    company: "Indie Games Studio",
    text: "Latchkey made our CI/CD setup effortless. We shipped faster and with more confidence than ever before!",
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Priya Patel",
    company: "CloudWorks",
    text: "The onboarding was seamless and the support team is top-notch. Highly recommend for any SaaS team!",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    name: "Chris Lee",
    company: "DevOps Pro",
    text: "Global runners and blazing fast builds. Latchkey is a game changer for distributed teams.",
  },
];

export function LandingReviews() {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((idx + 1) % reviews.length);
  const prev = () => setIdx((idx - 1 + reviews.length) % reviews.length);
  const review = reviews[idx];
  return (
    <section className="w-full py-16 px-4 bg-background transition-colors">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10 text-foreground">What Our Users Say</h2>
        <div className="flex flex-col items-center">
          <div className="bg-background rounded-lg shadow p-8 max-w-xl w-full mb-6 border border-border">
            <img src={review.avatar} alt={review.name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
            <div className="text-lg text-foreground font-semibold mb-1">{review.name}</div>
            <div className="text-sm text-primary mb-3">{review.company}</div>
            <div className="text-foreground/80 text-base">“{review.text}”</div>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition">
              <span className="sr-only">Previous</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={next} className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-primary/10 transition">
              <span className="sr-only">Next</span>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 