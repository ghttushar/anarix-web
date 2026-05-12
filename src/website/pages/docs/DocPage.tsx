import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Section } from "../../components/primitives";
import { AanChatSurface } from "../../components/AanChatSurface";
import { DOCS, DOCS_BY_CATEGORY } from "./content";

export default function DocPage() {
  const { slug } = useParams();
  const doc = DOCS.find((d) => d.slug === slug);

  if (!doc) {
    return (
      <Section>
        <div className="text-sm text-muted-foreground">
          Doc not found.{" "}
          <Link to="/website/docs" className="text-primary hover:underline">
            Back to docs
          </Link>
          .
        </div>
      </Section>
    );
  }

  return (
    <Section className="!pt-12">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr_340px]">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <Link
            to="/website/docs"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> All docs
          </Link>
          <nav className="mt-6 space-y-5">
            {Object.entries(DOCS_BY_CATEGORY).map(([cat, docs]) => (
              <div key={cat}>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {cat}
                </div>
                <ul className="mt-2 space-y-1">
                  {docs.map((d) => (
                    <li key={d.slug}>
                      <Link
                        to={`/website/docs/${d.slug}`}
                        className={`block rounded-md px-2 py-1.5 text-sm transition-colors ${
                          d.slug === doc.slug
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/5"
                        }`}
                      >
                        {d.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Body */}
        <article className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/website/docs" className="hover:text-foreground">
              Docs
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span>{doc.category}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{doc.title}</span>
          </div>
          <h1 className="mt-3 font-[Satoshi] text-4xl font-semibold tracking-tight text-foreground">
            {doc.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{doc.intro}</p>

          <div className="mt-10 space-y-10">
            {doc.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="font-[Satoshi] text-xl font-semibold text-foreground">{s.heading}</h2>
                <div className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground">{s.body}</div>
                {s.steps && (
                  <ol className="mt-4 max-w-2xl space-y-2">
                    {s.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-foreground">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary tabular-nums">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </div>
        </article>

        {/* Aan widget */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <AanChatSurface
            variant="compact"
            contextHint={doc.topicHint}
            suggestedQuestions={[
              `Explain ${doc.title.toLowerCase()}`,
              "Show me the related screen",
              "What's the safety model?",
            ]}
          />
        </aside>
      </div>
    </Section>
  );
}
