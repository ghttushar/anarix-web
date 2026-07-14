import { motion } from "framer-motion";
import { CheckCircle, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/website/components/PageLayout";
import { useState } from "react";

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

const benefits = [
  "See the platform live with your data",
  "Get a custom growth strategy",
  "Learn how top brands scale with Anarix",
  "No commitment, no pressure",
];

const Demo = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Generate next 14 days
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1);
    return d;
  }).filter(d => d.getDay() !== 0 && d.getDay() !== 6); // exclude weekends

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Schedule a <span className="text-gradient-primary">Demo</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            30 minutes. Zero pressure. See how Anarix transforms your advertising.
          </p>
        </motion.div>

        {!submitted ? (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left - Calendar */}
            <motion.div
              className="lg:col-span-3 p-6 rounded-2xl border border-border bg-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> Select a Date
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Choose an available date for your demo.</p>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {dates.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(i)}
                    className={`p-3 rounded-xl text-center transition-all duration-200 ${
                      selectedDate === i
                        ? "bg-primary text-primary-foreground shadow-medium"
                        : "bg-muted/50 hover:bg-accent text-foreground border border-border"
                    }`}
                  >
                    <div className="text-[10px] uppercase text-inherit opacity-70">
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-lg font-bold">{d.getDate()}</div>
                    <div className="text-[10px] opacity-70">
                      {d.toLocaleDateString("en-US", { month: "short" })}
                    </div>
                  </button>
                ))}
              </div>

              {selectedDate !== null && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Available Times (ET)
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedTime === t
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-foreground hover:bg-accent border border-border"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right - Confirmation + form */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {selectedDate !== null && selectedTime ? (
                <div className="p-6 rounded-2xl border border-border bg-card shadow-soft">
                  <h3 className="font-bold text-foreground mb-4">Confirm Your Demo</h3>
                  <div className="p-3 rounded-xl bg-accent/50 mb-4 text-sm">
                    <div className="font-medium text-foreground">
                      {dates[selectedDate].toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </div>
                    <div className="text-muted-foreground">{selectedTime} ET • 30 min</div>
                  </div>
                  <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-3">
                    <input required placeholder="Full Name" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    <input required type="email" placeholder="Work Email" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    <input required placeholder="Company" className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    <Button type="submit" className="w-full rounded-pill h-11 bg-primary text-primary-foreground btn-shine">
                      Confirm Booking
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-border bg-card">
                  <h3 className="font-bold text-foreground mb-4">Why schedule a demo?</h3>
                  <ul className="space-y-3">
                    {benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="max-w-md mx-auto p-12 rounded-2xl border border-border bg-card shadow-medium text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-foreground mb-2">You're All Set!</h3>
            <p className="text-muted-foreground text-sm mb-1">
              Your demo is booked for{" "}
              <span className="font-medium text-foreground">
                {selectedDate !== null && dates[selectedDate].toLocaleDateString("en-US", { month: "long", day: "numeric" })} at {selectedTime} ET
              </span>
            </p>
            <p className="text-muted-foreground text-sm">We'll send a calendar invite shortly.</p>
          </motion.div>
        )}
      </div>
    </PageLayout>
  );
};

export default Demo;
