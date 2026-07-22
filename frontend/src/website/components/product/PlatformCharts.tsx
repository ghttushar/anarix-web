import { motion } from "framer-motion";
import { BarChart3, Sparkles } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";

const roasData = [
  { week: "W1", roas: 3.2, acos: 31 },
  { week: "W2", roas: 3.5, acos: 28 },
  { week: "W3", roas: 3.1, acos: 32 },
  { week: "W4", roas: 3.8, acos: 26 },
  { week: "W5", roas: 4.2, acos: 24 },
  { week: "W6", roas: 4.0, acos: 25 },
  { week: "W7", roas: 4.5, acos: 22 },
  { week: "W8", roas: 4.7, acos: 21 },
];

const spendData = [
  { channel: "Sponsored Products", spend: 18420 },
  { channel: "Sponsored Brands", spend: 8350 },
  { channel: "Sponsored Display", spend: 4210 },
  { channel: "DSP", spend: 12800 },
  { channel: "Walmart", spend: 3150 },
];

const PlatformCharts = () => (
  <section className="py-24 bg-card/10 border-t border-border/40">
    <div className="max-w-7xl mx-auto px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
          <BarChart3 className="w-3.5 h-3.5" /> Analytics
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
          Data you can{" "}
          <span className="text-gradient-primary">actually act on.</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Not dashboards that look pretty and tell you nothing. Every metric comes with context, trend, and a recommended action.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          className="p-6 rounded-2xl border border-border/40 bg-card/30"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="text-sm font-semibold text-foreground">ROAS &amp; ACoS Trend</div>
              <div className="text-xs text-muted-foreground">Last 8 weeks</div>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" /> ROAS
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> ACoS %
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roasData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line yAxisId="left" type="monotone" dataKey="roas" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
                <Line yAxisId="right" type="monotone" dataKey="acos" stroke="hsl(160 60% 45%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(160 60% 45%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="p-6 rounded-2xl border border-border/40 bg-card/30"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="text-sm font-semibold text-foreground">Ad Spend by Channel</div>
              <div className="text-xs text-muted-foreground">Current month</div>
            </div>
            <div className="text-xs text-muted-foreground">Total: $46,930</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="channel" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={130} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Spend"]}
                />
                <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-2 p-6 rounded-2xl border border-border/40 bg-card/30"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="text-sm font-semibold text-foreground">Revenue &amp; Margin Trajectory</div>
              <div className="text-xs text-muted-foreground">Projected vs actual · Last 12 months</div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={Array.from({ length: 12 }, (_, i) => ({
                  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
                  actual: 120 + Math.sin(i * 0.8) * 30 + i * 18 + (i % 3) * 10,
                  projected: 150 + i * 22,
                  margin: 35 - i * 0.5 + Math.cos(i * 0.6) * 8,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="projected" stroke="hsl(var(--muted-foreground) / 0.3)" strokeDasharray="4 3" fill="hsl(var(--muted-foreground) / 0.05)" />
                <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={2} fill="hsl(var(--primary) / 0.1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-primary" /> Actual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded bg-muted-foreground/30 border-dashed" /> Projected
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PlatformCharts;
