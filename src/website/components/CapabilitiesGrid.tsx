import { Link } from "react-router-dom";
import { BarChart3, Megaphone, Bot, Users, Sparkles, FileText } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import { MiniPnLCard } from "./MiniPnLCard";
import { Reveal } from "./Reveal";

interface Cap {
  icon: React.ReactNode;
  title: string;
  body: string;
  to: string;
  extra?: React.ReactNode;
}

const CAPS: Cap[] = [
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Profitability",
    body: "See contribution margin at SKU level. Reconcile fees, ad spend, and returns into a single live P&L.",
    to: "/website/products/profitability",
    extra: <MiniPnLCard />,
  },
  {
    icon: <Megaphone className="h-5 w-5" />,
    title: "Advertising",
    body: "Control every campaign with precision. Bids, budgets, and pacing surfaced in one operational view.",
    to: "/website/products/advertising",
  },
  {
    icon: <Bot className="h-5 w-5" />,
    title: "Automation",
    body: "Approve, schedule, and audit every action your rules take. No silent changes, no surprise spend.",
    to: "/website/products/automation",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Managed Services",
    body: "A senior operator team embedded with yours. Strategy, daily ops, and reporting handled.",
    to: "/website/products/managed-services",
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "Aan AI",
    body: "Ask questions in plain English. Generate audits, draft rules, and explain every change.",
    to: "/website/aan-ai",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "Documentation",
    body: "Every screen, every rule, every workflow — documented and searchable.",
    to: "/website/documentation",
  },
];

export function CapabilitiesGrid() {
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel>Platform Capabilities</SectionLabel>
          <h2 className="mt-3 text-center font-[Satoshi] text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            The Anarix Operating System
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-muted-foreground">
            Advertising, analytics, automation, and intelligence — unified in one operational system.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CAPS.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <Link
                to={c.to}
                className="group block h-full rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {c.icon}
                </div>
                <h3 className="mt-4 font-[Satoshi] text-xl font-semibold text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                {c.extra}
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
