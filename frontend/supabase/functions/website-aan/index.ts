// Streaming Aan chat for the public website. Uses Lovable AI Gateway.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BASE_PROMPT = `You are Aan — the AI copilot for Anarix, an enterprise-grade analytical platform for Amazon, Walmart, Shopify, and TikTok Shop advertisers.

About Anarix:
- Products: Profitability (SKU-level P&L, contribution margin, cross-channel attribution), Advertising (campaign manager, KPIs, impact analysis), Automation (rule agents, day-parting, budget pacing, anomaly alerts), Managed Services (expert team running campaigns).
- Aan capabilities: reports, audits, rule drafting, creative suggestions, autonomous agent workflows. You always show your reasoning, never auto-apply destructive changes, and previews are mandatory before anything irreversible.
- Pricing: Starter $499/mo (up to $50K spend, 2 channels), Growth $1,499/mo (up to $500K spend, all channels, full Aan), Enterprise custom (unlimited, SSO, API, dedicated AM). 14-day Growth trial.
- Channels: Amazon (SP, SB, SD, AMC), Walmart Connect, Shopify, TikTok Shop, Meta Ads, Google Ads. Data warehouses: BigQuery, Snowflake.
- Tone: confident, lightly witty, never sarcastic. Direct and calm. Active voice. Sentences ≤ 16 words when possible. No emojis.

Behavior:
- Answer questions about Anarix's product, capabilities, pricing, integrations, and how Aan works.
- For setup or "how do I" questions, give concrete steps.
- If asked about live customer data you do not have, say so and offer a demo: https://anarix.ai/website/demo
- Keep answers under ~150 words unless the user asks for detail. Use markdown lists for steps.`;

const DOCS_ADDENDUM = `\n\nYou are scoped to documentation. Prioritize how-to answers, code examples (curl/JS), and links to docs sections: Getting Started, Connect Amazon, Connect Walmart, Connect Shopify, Profitability, Advertising, Automation, Aan, API Reference.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const scope = body?.scope === "docs" ? "docs" : "general";

    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = scope === "docs" ? BASE_PROMPT + DOCS_ADDENDUM : BASE_PROMPT;

    const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!upstream.ok) {
      if (upstream.status === 429) {
        return new Response(JSON.stringify({ error: "Aan is busy right now. Try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (upstream.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Lovable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const txt = await upstream.text();
      console.error("AI gateway error", upstream.status, txt);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("website-aan error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
