import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Quote, Sparkles } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import firatImg from "@/assets/testimonials/firat.png";
import jamesImg from "@/assets/testimonials/james.jpg";
import nausilImg from "@/assets/testimonials/nausil.png";

const TESTIMONIALS = [
  {
    quote: "Anarix helped us rethink how we approach growth on Walmart — from a conversion-first mindset to a true full-funnel strategy. By unlocking visibility at the top of the funnel and executing with precision throughout the shopper journey, they turned an underperforming SKU into a meaningful omnichannel growth driver.",
    author: "Firat Ozkan",
    role: "Co-Founder, CMO & CSO",
    company: "Mount-It!",
    image: firatImg,
  },
];

const BOTTOM_TESTIMONIAL = {
  quote: "Since partnering with Anarix, I have seen tremendous improvements in our business. The dedication of their team to ensuring our success is unmatched as we have seen strong sales growth and dramatically improved spend efficiencies.",
  author: "James Ellington",
  role: "Sr. Director of Sales, Retail Division",
  company: "Drive Medical",
  image: jamesImg,
};

const VIDEO_TESTIMONIAL = {
  src: "/testimonials/video.mp4",
  quote: "Working with Anarix has been a game changer. In just my second month, I've already seen a 20–22% increase in sales. They're rebuilding my website, helping grow my Amazon presence, and now expanding into Walmart and TikTok Shop.",
  author: "Nausil Zaheer (Nas)",
  role: "Owner, Karma Organics",
  image: nausilImg,
};

const LOGO_WALL = ["Mount-It!", "Drive Medical", "Aurelius", "Northwind", "Halcyon", "Verata"];

const TestimonialsWrapper = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.play();
    setPlaying(true);
  };

  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-background to-accent/10" />

      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          className="mb-16 max-w-4xl"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            <Sparkles className="w-3.5 h-3.5" /> Proof
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1] mb-4">
            These are brands who started{" "}
            <span className="text-gradient-primary">exactly where you are.</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Managing everything themselves, or stuck with an agency that wasn&apos;t delivering. Here&apos;s what happened when they handed it over.
          </p>
        </motion.div>

        {/* Logo wall */}
        <motion.div
          className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-14 pb-8 border-b border-border/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/60">
            Trusted by operators at
          </span>
          {LOGO_WALL.map((b) => (
            <span key={b} className="text-sm font-semibold text-foreground/45 hover:text-foreground/80 transition-colors tracking-tight">
              {b}
            </span>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quote 1 */}
          <motion.article
            className="lg:col-span-7 relative p-10 rounded-3xl bg-card border border-border shadow-soft hover:shadow-medium transition-all duration-500 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.25), transparent 70%)" }}
            />
            <Quote className="w-12 h-12 text-primary/30 mb-5" strokeWidth={1.5} />
            <p className="font-display text-2xl sm:text-[28px] text-foreground leading-[1.35] tracking-tight mb-8">
              &ldquo;{TESTIMONIALS[0].quote}&rdquo;
            </p>
            <div className="flex items-center gap-3 border-t border-border pt-5">
              <Avatar className="h-10 w-10">
                <AvatarImage src={TESTIMONIALS[0].image} alt={TESTIMONIALS[0].author} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-periwinkle text-primary-foreground font-bold">
                  {TESTIMONIALS[0].author[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold text-foreground">{TESTIMONIALS[0].author}</div>
                <div className="text-xs text-muted-foreground">{TESTIMONIALS[0].role} · {TESTIMONIALS[0].company}</div>
              </div>
            </div>
          </motion.article>

          {/* Video testimonial */}
          <motion.article
            className="lg:col-span-5 relative rounded-3xl border border-border shadow-medium overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "linear-gradient(140deg, hsl(var(--foreground)) 0%, hsl(var(--primary)) 100%)",
            }}
          >
            <div className="relative aspect-[9/16] bg-foreground/20">
              <video
                ref={videoRef}
                src={VIDEO_TESTIMONIAL.src}
                controls={playing}
                playsInline
                onEnded={() => setPlaying(false)}
                className="absolute inset-0 w-full h-full object-cover"
                preload="metadata"
              />
              {!playing && (
                <button
                  onClick={play}
                  className="absolute inset-0 flex items-center justify-center bg-foreground/30 hover:bg-foreground/20 transition-colors group"
                  aria-label="Play testimonial"
                >
                  <span className="relative w-20 h-20 rounded-full bg-background/95 flex items-center justify-center shadow-strong group-hover:scale-105 transition-transform">
                    <span className="absolute inset-0 rounded-full opacity-60 blur-md"
                      style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--periwinkle)))" }}
                    />
                    <Play className="relative w-8 h-8 text-primary translate-x-0.5" fill="currentColor" />
                  </span>
                </button>
              )}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-pill bg-background/85 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground">
                Customer Story
              </div>
            </div>
            <div className="p-6 flex flex-col gap-5 text-background">
              <p className="text-base sm:text-lg leading-[1.5] italic opacity-95">
                &ldquo;{VIDEO_TESTIMONIAL.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-background/15">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={VIDEO_TESTIMONIAL.image} alt={VIDEO_TESTIMONIAL.author} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-periwinkle to-primary text-primary-foreground font-bold">
                    {VIDEO_TESTIMONIAL.author[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold">{VIDEO_TESTIMONIAL.author}</div>
                  <div className="text-xs opacity-70">{VIDEO_TESTIMONIAL.role}</div>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Bottom full-width quote */}
          <motion.article
            className="lg:col-span-12 relative p-10 sm:p-14 rounded-3xl bg-card border border-border shadow-soft overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--periwinkle) / 0.4), transparent 70%)" }}
            />
            <Quote className="w-10 h-10 text-primary/30 mb-5" strokeWidth={1.5} />
            <p className="font-display text-xl sm:text-2xl text-foreground leading-[1.45] tracking-tight mb-8 max-w-4xl">
              &ldquo;{BOTTOM_TESTIMONIAL.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3 border-t border-border pt-5">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={BOTTOM_TESTIMONIAL.image} alt={BOTTOM_TESTIMONIAL.author} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-periwinkle to-primary text-primary-foreground font-bold">
                  {BOTTOM_TESTIMONIAL.author[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-semibold text-foreground">{BOTTOM_TESTIMONIAL.author}</div>
                <div className="text-xs text-muted-foreground">{BOTTOM_TESTIMONIAL.role} · {BOTTOM_TESTIMONIAL.company}</div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsWrapper;
