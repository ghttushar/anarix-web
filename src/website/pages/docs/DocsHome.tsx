import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { Section, Eyebrow, H1, Lead } from "../../components/primitives";
import { AanChatSurface } from "../../components/AanChatSurface";
import { DOCS_BY_CATEGORY } from "./content";

export default function DocsHome() {
  return (
    <Section className="!pt-16">
      <Eyebrow>
        <BookOpen className="h-3.5 w-3.5" /> Documentation
      </Eyebrow>
      <H1 className="mt-4 max-w-3xl">Everything you need to operate Anarix.</H1>
      <Lead className="mt-5">
        Reference for every module, the Aan safety model, and power-user tools. Aan is on every doc
        page if you'd rather just ask.
      </Lead>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          {Object.entries(DOCS_BY_CATEGORY).map(([cat, docs]) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{cat}</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {docs.map((d) => (
                  <Link
                    key={d.slug}
                    to={`/website/docs/${d.slug}`}
                    className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-foreground">{d.title}</div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {d.intro}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AanChatSurface
            variant="compact"
            contextHint="documentation overview"
            suggestedQuestions={["How do rules work?", "What's in Profitability?", "Connect Amazon"]}
          />
        </aside>
      </div>
    </Section>
  );
}
