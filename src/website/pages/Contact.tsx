import { useState } from "react";
import { Send, Mail, MessageSquare, Calendar } from "lucide-react";
import { Section, Eyebrow, H1, Lead } from "../components/primitives";
import { AanChatSurface } from "../components/AanChatSurface";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Section className="!pt-16">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <H1 className="mt-4">Let's talk.</H1>
          <Lead className="mt-5">
            Book a 20-minute demo, ask a sales question, or just say hi. We answer within one
            business day.
          </Lead>

          <div className="mt-8 space-y-3">
            <ContactRow icon={<Calendar className="h-4 w-4" />} label="Book a demo" value="cal.com/anarix/demo" />
            <ContactRow icon={<Mail className="h-4 w-4" />} label="Sales" value="hello@anarix.com" />
            <ContactRow icon={<MessageSquare className="h-4 w-4" />} label="Support" value="support@anarix.com" />
          </div>

          {submitted ? (
            <div className="mt-8 rounded-2xl border border-primary/40 bg-primary/5 p-6">
              <div className="text-sm font-semibold text-foreground">Got it — thank you.</div>
              <p className="mt-2 text-sm text-muted-foreground">
                We'll be in touch shortly. In the meantime, Aan is right there if you want to
                explore.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="mt-8 rounded-2xl border border-border bg-card p-6 space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Name" name="name" />
                <Field label="Work email" name="email" type="email" />
                <Field label="Company" name="company" />
                <Field label="Marketplace" name="mp" placeholder="Amazon, Walmart, both" />
              </div>
              <Field label="What are you trying to solve?" name="msg" textarea />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Send <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <AanChatSurface
            variant="hero"
            suggestedQuestions={[
              "What does a demo look like?",
              "How fast is onboarding?",
              "Pricing",
            ]}
          />
        </div>
      </div>
    </Section>
  );
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-medium text-foreground">{value}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          placeholder={placeholder}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
      )}
    </label>
  );
}
