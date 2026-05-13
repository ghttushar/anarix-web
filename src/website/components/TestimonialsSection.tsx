import { useRef, useState } from "react";
import { Play, Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const TESTIMONIALS = [
  {
    quote:
      "Anarix helped us rethink how we approach growth on Walmart-from a conversion-first mindset to a true full-funnel strategy. By unlocking visibility at the top of the funnel and executing with precision throughout the shopper journey, they turned an underperforming SKU into a meaningful omnichannel growth driver. The impact on both new customer acquisition and total sales has been exceptional.",
    author: "Firat Ozkan",
    role: "Co-Founder, CMO & CSO",
    company: "Mount-It!",
  },
  {
    quote:
      "Since partnering with Anarix, I have seen tremendous improvements in our business. The dedication of their team to ensuring our success is unmatched as we have seen strong sales growth and dramatically improved spend efficiencies.",
    author: "James Ellington",
    role: "Sr. Director of Sales, Retail Division",
    company: "Drive Medical",
  },
];

const VIDEO_TESTIMONIAL = {
  // Drop the actual file at /public/testimonials/video.mp4 (and poster.jpg) to enable.
  src: "/testimonials/video.mp4",
  poster: "/testimonials/poster.jpg",
  quote:
    "Since partnering with Anarix, I have seen tremendous improvements in our business. The dedication of their team to ensuring our success is unmatched as we have seen strong sales growth and dramatically improved spend efficiencies.",
  author: "Featured customer story",
  role: "Watch the full conversation",
};

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollReveal();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    videoRef.current?.play();
    setPlaying(true);
  };

  return (
    <section ref={ref} className="py-24 px-6 bg-accent/30">
      <div className="max-w-6xl mx-auto">
        <div
          className={`mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            Important voices
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-[1.1]">
            Not many testimonials. <span className="text-gradient-primary">The ones that matter.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            We grow quietly with operators who measure us in revenue, not screenshots. Here's
            what a few of them have said.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quote 1 - wide */}
          <article
            className={`lg:col-span-7 p-8 rounded-2xl bg-card border border-border shadow-soft transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: isVisible ? "60ms" : "0ms" }}
          >
            <Quote className="w-8 h-8 text-primary/40 mb-4" />
            <p className="text-foreground text-base sm:text-lg leading-relaxed mb-6">
              "{TESTIMONIALS[0].quote}"
            </p>
            <div className="border-t border-border pt-4">
              <div className="text-sm font-semibold text-foreground">{TESTIMONIALS[0].author}</div>
              <div className="text-xs text-muted-foreground">
                {TESTIMONIALS[0].role} · {TESTIMONIALS[0].company}
              </div>
            </div>
          </article>

          {/* Quote 2 - narrow */}
          <article
            className={`lg:col-span-5 p-8 rounded-2xl bg-gradient-to-br from-primary/8 to-accent/40 border border-border shadow-soft transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: isVisible ? "140ms" : "0ms" }}
          >
            <Quote className="w-8 h-8 text-primary/40 mb-4" />
            <p className="text-foreground text-sm sm:text-base leading-relaxed mb-6">
              "{TESTIMONIALS[1].quote}"
            </p>
            <div className="border-t border-border pt-4">
              <div className="text-sm font-semibold text-foreground">{TESTIMONIALS[1].author}</div>
              <div className="text-xs text-muted-foreground">
                {TESTIMONIALS[1].role} · {TESTIMONIALS[1].company}
              </div>
            </div>
          </article>

          {/* Video testimonial - full width */}
          <article
            className={`lg:col-span-12 rounded-2xl bg-card border border-border shadow-soft overflow-hidden transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: isVisible ? "220ms" : "0ms" }}
          >
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-video md:aspect-auto bg-foreground/5">
                <video
                  ref={videoRef}
                  src={VIDEO_TESTIMONIAL.src}
                  poster={VIDEO_TESTIMONIAL.poster}
                  controls={playing}
                  className="absolute inset-0 w-full h-full object-cover"
                  preload="metadata"
                />
                {!playing && (
                  <button
                    onClick={play}
                    className="absolute inset-0 flex items-center justify-center bg-foreground/20 hover:bg-foreground/10 transition-colors group"
                    aria-label="Play testimonial"
                  >
                    <span className="w-16 h-16 rounded-full bg-background/95 flex items-center justify-center shadow-strong group-hover:scale-105 transition-transform">
                      <Play className="w-7 h-7 text-primary translate-x-0.5" fill="currentColor" />
                    </span>
                  </button>
                )}
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Quote className="w-8 h-8 text-primary/40 mb-4" />
                <p className="text-foreground text-base leading-relaxed mb-6">
                  "{VIDEO_TESTIMONIAL.quote}"
                </p>
                <div className="border-t border-border pt-4">
                  <div className="text-sm font-semibold text-foreground">{VIDEO_TESTIMONIAL.author}</div>
                  <div className="text-xs text-muted-foreground">{VIDEO_TESTIMONIAL.role}</div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
