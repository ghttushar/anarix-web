import { Section, Eyebrow, H1, H2, Lead, FeatureCard } from "../components/primitives";
import { AanChatSurface } from "../components/AanChatSurface";
import { AanMascot } from "@/components/aan/AanMascot";
import { ShieldCheck, GitPullRequest, Sparkles, History, Search, FileText } from "lucide-react";

export default function AanPage() {
  return (
    <>
      <Section className="!pt-16 !pb-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow>Aan, by Anarix</Eyebrow>
            <H1 className="mt-5">
              The AI that <span className="text-primary">drafts</span>, never decides for you.
            </H1>
            <Lead className="mt-5">
              Aan reads your data, diagnoses what's off, explains the reasoning in plain language,
              and drafts actions you approve. It's a co-pilot designed for operators who can't
              afford a silent mistake.
            </Lead>
          </div>
          <div className="relative flex justify-center">
            <div className="rounded-3xl border border-border bg-card p-10">
              <AanMascot state="working" size={200} interactive floating progress={62} />
            </div>
          </div>
        </div>
      </Section>

      <Section className="!py-16 bg-secondary/5">
        <Eyebrow>States</Eyebrow>
        <H2 className="mt-4">State is shape.</H2>
        <Lead className="mt-4">Aan's geometry tells you what it's doing — instantly, peripherally.</Lead>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { state: "idle", label: "Idle / anchor", body: "Diamond, resting." },
            { state: "listening", label: "Listening", body: "Circle. Eyes track your cursor." },
            { state: "thinking", label: "Thinking", body: "Cube with a liquid swirl inside." },
            { state: "working", label: "Working", body: "Bar that fills with progress." },
          ].map((s) => (
            <div key={s.state} className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="flex h-32 items-center justify-center">
                <AanMascot state={s.state as any} size={72} interactive={false} progress={s.state === "working" ? 65 : 0} />
              </div>
              <div className="mt-4 text-sm font-semibold text-foreground">{s.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.body}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <Eyebrow>Try it</Eyebrow>
        <H2 className="mt-4">Talk to Aan.</H2>
        <Lead className="mt-4">A live mock — same mascot, same motion, same patterns as inside the app.</Lead>
        <div className="mt-8 max-w-3xl">
          <AanChatSurface variant="hero" />
        </div>
      </Section>

      <Section className="!py-16 bg-secondary/5">
        <Eyebrow>Capabilities</Eyebrow>
        <H2 className="mt-4">What Aan can do.</H2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={<Search className="h-5 w-5" />} title="Diagnose" body="Pinpoint what changed and why — across spend, conversion, inventory, and competitor moves." />
          <FeatureCard icon={<GitPullRequest className="h-5 w-5" />} title="Draft" body="Write rules, audiences, reports, negatives — in your voice, with reasoning attached." />
          <FeatureCard icon={<Sparkles className="h-5 w-5" />} title="Explain" body="Translate spreadsheet logic into plain English. Show the math behind every recommendation." />
          <FeatureCard icon={<ShieldCheck className="h-5 w-5" />} title="Preview" body="Every irreversible action shows expected impact before you apply." />
          <FeatureCard icon={<History className="h-5 w-5" />} title="Audit" body="Every applied rule is logged with diff and rationale. One-click revert." />
          <FeatureCard icon={<FileText className="h-5 w-5" />} title="Report" body="Generate weekly, monthly, or ad-hoc reports as documents — not slide decks." />
        </div>
      </Section>
    </>
  );
}
