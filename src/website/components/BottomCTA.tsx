import { Link } from "react-router-dom";

export function BottomCTA() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-12 text-center md:p-16">
        <h2 className="font-[Satoshi] text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Get your free margin audit
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          See exactly where your marketplace P&amp;L is leaking. Takes 30 seconds.
        </p>
        <div className="mt-8">
          <Link
            to="/website/demo"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Schedule a Demo
          </Link>
        </div>
      </div>
    </section>
  );
}
