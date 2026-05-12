import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageSquare, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/website/components/PageLayout";

const Contact = () => (
  <PageLayout>
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left — creative illustration area */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Gradient illustration area */}
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-accent to-primary/5 p-12 overflow-hidden min-h-[400px] flex flex-col justify-center">
            {/* Floating icons */}
            {[
              { icon: MessageSquare, x: "15%", y: "20%", delay: 0 },
              { icon: Mail, x: "70%", y: "15%", delay: 0.5 },
              { icon: Globe, x: "80%", y: "65%", delay: 1 },
              { icon: Send, x: "20%", y: "75%", delay: 1.5 },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="absolute w-10 h-10 rounded-xl bg-background/80 shadow-soft flex items-center justify-center"
                style={{ left: item.x, top: item.y }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3 + i * 0.5, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
              >
                <item.icon className="w-5 h-5 text-primary" />
              </motion.div>
            ))}

            <div className="relative z-10">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Get in <span className="text-gradient-primary">Touch</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">We'd love to hear from you.</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/80 backdrop-blur-sm">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">hello@anarix.ai</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/80 backdrop-blur-sm">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">New York, NY</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/80 backdrop-blur-sm">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-sm text-foreground">+1 (555) 000-0000</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.form
          className="space-y-5 pt-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Send us a message</h2>
          <p className="text-sm text-muted-foreground mb-6">We typically respond within 24 hours.</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow" placeholder="Jane" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
              <input className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow" placeholder="Doe" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow" placeholder="you@company.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
            <input className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow" placeholder="How can we help?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
            <textarea rows={5} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow resize-none" placeholder="Tell us more..." />
          </div>
          <Button type="submit" className="w-full rounded-xl h-11 bg-primary text-primary-foreground btn-shine">
            Send Message <Send className="w-4 h-4 ml-1" />
          </Button>
        </motion.form>
      </div>
    </div>
  </PageLayout>
);

export default Contact;
