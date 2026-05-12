const QUOTES = [
  { quote: "Anarix consolidated our entire Amazon and Walmart strategy into one view. We saved 15 hours a week.", role: "Marketing Director", brand: "DTC Brand" },
  { quote: "The AI copilot caught a bid inefficiency that was costing us $12K/month. Paid for itself in a week.", role: "VP of Growth", brand: "Consumer Electronics" },
  { quote: "Finally, a team that understands both the tech and the business side of e-commerce.", role: "Founder & CEO", brand: "Health & Wellness Brand" },
  { quote: "Our TACoS went from 22% to 15% in 90 days. The data clarity alone was worth it.", role: "E-commerce Manager", brand: "Food & Beverage" },
  { quote: "We switched from three different tools. Anarix does it all, and the support team is incredible.", role: "Operations Lead", brand: "Home & Garden" },
  { quote: "Aan AI is like having a senior analyst on call 24/7. Game changer for our Amazon business.", role: "Brand Manager", brand: "Beauty & Personal Care" },
];

export function Testimonials() {
  return (
    <section className="relative px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center font-[Satoshi] text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          What Our Partners Say
        </h2>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {QUOTES.map((q) => (
            <figure key={q.quote} className="rounded-2xl border border-border bg-card p-6">
              <blockquote className="text-base leading-relaxed text-foreground">
                "{q.quote}"
              </blockquote>
              <figcaption className="mt-5 border-t border-border/60 pt-4">
                <div className="text-sm font-medium text-foreground">{q.role}</div>
                <div className="text-xs text-muted-foreground">{q.brand}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
