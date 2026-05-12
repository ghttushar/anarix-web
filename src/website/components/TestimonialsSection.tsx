import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    quote: "Anarix consolidated our entire Amazon and Walmart strategy into one view. We saved 15 hours a week.",
    author: "Marketing Director",
    company: "DTC Brand",
    color: "from-primary/10 to-periwinkle-light/40",
  },
  {
    quote: "The AI copilot caught a bid inefficiency that was costing us $12K/month. Paid for itself in a week.",
    author: "VP of Growth",
    company: "Consumer Electronics",
    color: "from-accent to-periwinkle-light/30",
  },
  {
    quote: "Finally, a team that understands both the tech and the business side of e-commerce.",
    author: "Founder & CEO",
    company: "Health & Wellness Brand",
    color: "from-periwinkle-light/50 to-accent/40",
  },
  {
    quote: "Our TACoS went from 22% to 15% in 90 days. The data clarity alone was worth it.",
    author: "E-commerce Manager",
    company: "Food & Beverage",
    color: "from-primary/8 to-accent",
  },
  {
    quote: "We switched from three different tools. Anarix does it all, and the support team is incredible.",
    author: "Operations Lead",
    company: "Home & Garden",
    color: "from-accent/50 to-periwinkle-light/30",
  },
  {
    quote: "Aan AI is like having a senior analyst on call 24/7. Game changer for our Amazon business.",
    author: "Brand Manager",
    company: "Beauty & Personal Care",
    color: "from-periwinkle-light/40 to-primary/8",
  },
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 px-6 bg-accent/30">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-gradient-primary">Partners</span> Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl bg-gradient-to-br ${t.color} border border-border/50 shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:shadow-medium ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: isVisible ? `${i * 80}ms` : "0ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <p className="text-foreground text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <div className="text-sm font-semibold text-foreground">{t.author}</div>
                <div className="text-xs text-muted-foreground">{t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
