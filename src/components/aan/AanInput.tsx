import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useAan } from "./AanContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Square, X, Paperclip, ChevronDown, Check, Zap, Brain, Cpu, Gauge } from "lucide-react";
import { AanGlyph } from "./AanGlyph";
import { AanMascot } from "./AanMascot";
import { useAanPresence } from "./AanPresenceContext";
import { useBranding } from "@/contexts/BrandingContext";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const isReportRequest = (message: string): boolean => {
  const lower = message.toLowerCase();
  return lower.includes("report") || lower.includes("generate report") || lower.includes("create report") || lower.includes("performance report") || lower.includes("last 7 days") || lower.includes("weekly report") || lower.includes("data visualization");
};

const isAuditRequest = (message: string): boolean => {
  const lower = message.toLowerCase();
  return lower.includes("audit") || lower.includes("health") || lower.includes("account health") || lower.includes("review") || lower.includes("analyze account") || lower.includes("paragraph") || lower.includes("summary");
};

const getReportSummary = () => `I've analyzed your Amazon advertising data for the last 7 days. Here's what I found:

**Performance Summary:**
• Total Ad Spend: $10,973.60
• Total Ad Sales: $36,955.24
• Overall ROAS: 3.37x

**Top Performers:**
Your best performing campaign is "SP | Bamboo | 8 inch | Queen" with a 6.01x ROAS, followed by "SB | Bed in a Box Mattress" at 6.19x ROAS. These campaigns are efficiently converting ad spend into sales.

**Opportunities:**
Consider optimizing "SP | Bamboo | Queen" (1.88x ROAS) and "SP | Bamboo | 8 inch | Twin" (2.04x ROAS) which are underperforming relative to your account average.

Generating full report with data visualizations...`;

const getAuditSummary = () => `I've completed a comprehensive audit of your Amazon account. Here's what I found:

**Overall Health Score: 78/100**

Your account shows strong fundamentals with a few areas requiring attention. The most critical issue is your advertising efficiency, where I've identified significant wasted spend on non-converting keywords.

Key findings include 15 high-spend, zero-conversion keywords that should be paused immediately, 23 products missing optimized backend search terms, and 8 products priced 5-10% higher than top competitors.

On the positive side, all products have sufficient inventory health for the next 45 days.

Running full audit analysis...`;

const mockResponses = [
  {
    content: "I've analyzed your campaign performance. Based on the data, I recommend adjusting the bid for your top-performing keywords. Here's a draft of the changes:",
    draft: {
      id: "draft-1",
      type: "bid_change" as const,
      title: "Keyword Bid Optimization",
      description: "Increase bids on high-performing keywords to capture more impressions during peak hours.",
      changes: [
        { field: "wireless earbuds", before: "$1.35", after: "$1.65" },
        { field: "bluetooth headphones", before: "$1.15", after: "$1.45" },
        { field: "smart home devices", before: "$1.25", after: "$1.50" },
      ],
      status: "pending" as const,
    },
  },
  {
    content: "I found some underperforming campaigns that could be paused to improve overall ROAS. Would you like me to prepare a draft?",
    draft: undefined,
  },
  {
    content: "Your TACoS has improved by 3.2% this week. The main contributors are your Electronics and Kitchen Appliances ad groups. Keep up the good work!",
    draft: undefined,
  },
];

const PROMPT_SUGGESTIONS = [
  "Optimize my top spending campaigns",
  "Show me wasted spend analysis",
  "Compare this week vs last week",
  "Which keywords should I pause?",
  "Find budget reallocation opportunities",
];

const AI_MODELS = [
  { id: "gemini-flash", name: "Gemini 3 Flash", description: "Fast responses, great for most tasks", icon: Zap },
  { id: "gemini-pro", name: "Gemini 2.5 Pro", description: "Complex reasoning & analysis", icon: Brain },
  { id: "gpt-5", name: "GPT-5", description: "Powerful all-rounder", icon: Cpu },
  { id: "gpt-5-mini", name: "GPT-5 Mini", description: "Balanced speed & quality", icon: Gauge },
];

interface AttachedFile {
  name: string;
  size: number;
  type: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function AanInput() {
  const { addMessage, setGenerationState, messages, selectedModel, setSelectedModel, pendingPrompt, setPendingPrompt, isGenerating, generationType, setInputFocused } = useAan();
  const { newBranding } = useBranding();
  const { registerAnchor } = useAanPresence();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [suggestionVisible, setSuggestionVisible] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [inputAnchorEl, setInputAnchorEl] = useState<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Register the top-left input slot as the resting anchor for the travelling Aan presence
  useEffect(() => {
    if (!newBranding) return;
    registerAnchor("input", inputAnchorEl, 44);
    return () => registerAnchor("input", null);
  }, [newBranding, inputAnchorEl, registerAnchor]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (suggestionTimerRef.current) clearTimeout(suggestionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === "assistant" && !isLoading) {
      setSuggestionIndex(Math.floor(Math.random() * PROMPT_SUGGESTIONS.length));
      suggestionTimerRef.current = setTimeout(() => {
        setShowSuggestion(true);
        requestAnimationFrame(() => setSuggestionVisible(true));
      }, 500);
    }
    return () => {
      if (suggestionTimerRef.current) clearTimeout(suggestionTimerRef.current);
    };
  }, [messages, isLoading]);

  // Consume pending prompt from Insights or Ask Aan tooltip
  useEffect(() => {
    if (pendingPrompt) {
      setInput(pendingPrompt);
      setPendingPrompt(null);
    }
  }, [pendingPrompt, setPendingPrompt]);
  const handleStop = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; }
    setGenerationState(false, null, 0);
    setIsLoading(false);
    addMessage("Generation stopped.", "assistant");
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setShowSuggestion(false);
    setSuggestionVisible(false);
    setAttachedFiles([]);
    addMessage(userMessage, "user");

    if (isReportRequest(userMessage)) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addMessage(getReportSummary(), "assistant");
      setIsLoading(false);
      setGenerationState(true, "report", 0);
      let progress = 0;
      progressIntervalRef.current = setInterval(() => {
        progress += 100 / 30;
        if (progress >= 100) { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); progress = 100; }
        setGenerationState(true, "report", progress);
      }, 1000);
      timerRef.current = setTimeout(() => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setGenerationState(false, null, 0);
        addMessage("**Report Ready!** Click below to view the full report with data visualizations.", "assistant", {
          id: "report-" + Date.now(), type: "report" as const, title: "Last 7 Days Campaign Performance",
          description: "Amazon • Performance overview with data visualizations",
          changes: [{ field: "Total Ad Spend", before: "N/A", after: "$10,973.60" }, { field: "Total Ad Sales", before: "N/A", after: "$36,955.24" }, { field: "Overall ROAS", before: "N/A", after: "3.37x" }],
          status: "pending" as const,
        });
      }, 30000);
      return;
    }

    if (isAuditRequest(userMessage)) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      addMessage(getAuditSummary(), "assistant");
      setIsLoading(false);
      setGenerationState(true, "audit", 0);
      let progress = 0;
      progressIntervalRef.current = setInterval(() => {
        progress += 100 / 30;
        if (progress >= 100) { if (progressIntervalRef.current) clearInterval(progressIntervalRef.current); progress = 100; }
        setGenerationState(true, "audit", progress);
      }, 1000);
      timerRef.current = setTimeout(() => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setGenerationState(false, null, 0);
        addMessage("**Audit Complete!** Click below to view the full health report.", "assistant", {
          id: "audit-" + Date.now(), type: "audit" as const, title: "Account Health Audit",
          description: "Health Score: 78/100 • Risk Level: Low",
          changes: [{ field: "Health Score", before: "N/A", after: "78/100" }, { field: "Wasted Spend", before: "N/A", after: "$2,341 (-15%)" }],
          status: "pending" as const,
        });
      }, 30000);
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    addMessage(randomResponse.content, "assistant", randomResponse.draft);
    setIsLoading(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSuggestionClick = () => {
    setInput(PROMPT_SUGGESTIONS[suggestionIndex]);
    setShowSuggestion(false);
    setSuggestionVisible(false);
  };

  const handleDismissSuggestion = () => {
    setSuggestionVisible(false);
    setTimeout(() => setShowSuggestion(false), 200);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles: AttachedFile[] = Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const currentModel = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  return (
    <div className="shrink-0 bg-background">
      <div className="px-4 pb-4 pt-3">
        <div className="relative">
          {/* Aan presence slot - sits above the input, left-aligned. Reserves height even when no suggestion is active. */}
          {newBranding && (
            <div className="flex items-center gap-3 pl-3 mb-2 h-[52px]">
              <div
                ref={setInputAnchorEl}
                data-aan-anchor="input"
                className="w-[52px] h-[52px] flex items-center justify-center shrink-0"
              />
              {showSuggestion && (
                <div
                  className={cn(
                    "flex-1 min-w-0 transition-all duration-300 ease-out",
                    suggestionVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-1"
                  )}
                >
                  <button
                    onClick={handleSuggestionClick}
                    className="group inline-flex max-w-full items-center gap-2 text-left"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 shrink-0">Suggested</span>
                    <span className="text-xs font-medium text-primary text-[#f26e76] group-hover:underline truncate">
                      {PROMPT_SUGGESTIONS[suggestionIndex]}
                    </span>
                  </button>
                  <button
                    onClick={handleDismissSuggestion}
                    className="ml-2 p-0.5 rounded hover:bg-muted text-muted-foreground transition-colors"
                    aria-label="Dismiss suggestion"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Legacy suggestion notch (old branding only) */}
          {!newBranding && showSuggestion && (
            <div
              className={cn(
                "absolute bottom-full left-0 right-0 origin-bottom transition-all duration-300 ease-out",
                suggestionVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-1 scale-[0.98]"
              )}
            >
              <div className="mx-0 flex overflow-hidden rounded-t-lg border border-b-0 border-border bg-card/90 shadow-sm">
                <div className="w-[3px] shrink-0 bg-gradient-to-b from-primary to-accent" />
                <div className="flex items-center gap-2.5 px-3 py-2.5 flex-1 min-w-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/10 shrink-0">
                    <AanGlyph state="listening" className="h-3.5 w-3.5 text-primary text-[#f26e76]" />
                  </div>
                  <button onClick={handleSuggestionClick} className="flex-1 text-left min-w-0 cursor-pointer group">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-0.5">Suggested</span>
                    <span className="block text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors truncate">
                      {PROMPT_SUGGESTIONS[suggestionIndex]}
                    </span>
                  </button>
                  <button onClick={handleDismissSuggestion} className="p-1 rounded-md hover:bg-muted cursor-pointer transition-colors shrink-0">
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attached files chips */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {attachedFiles.map((file, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs text-foreground">
                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <span className="text-muted-foreground">{formatFileSize(file.size)}</span>
                  <button onClick={() => removeFile(i)} className="p-0.5 rounded hover:bg-foreground/10 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input container */}
          <div className="relative flex items-end gap-0 rounded-lg border border-border bg-card focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            {/* Attachment button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 p-2.5 pb-3 text-muted-foreground hover:text-foreground transition-colors"
              title="Attach files"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.csv,.xlsx,.xls,.doc,.docx,.txt,.json"
              onChange={handleFileSelect}
              className="hidden"
            />

            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => { setIsFocused(true); setInputFocused(true); }}
              onBlur={() => { setIsFocused(false); setInputFocused(input.trim().length > 0); }}
              placeholder="Ask Aan anything..."
              className="min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-12 pl-0"
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2">
              {isLoading ? (
                <Button size="icon" variant="destructive" onClick={handleStop} className="h-8 w-8 rounded-lg" title="Stop generation">
                  <Square className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button size="icon" onClick={handleSend} disabled={!input.trim()} className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-30">
                  <Send className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Model selector + disclaimer */}
        <div className="mt-2 flex items-center justify-between">
          <Popover open={modelOpen} onOpenChange={setModelOpen}>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                <currentModel.icon className="h-3 w-3" />
                <span className="font-medium">{currentModel.name}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" side="top" className="w-64 p-1.5 z-[70]">
              <div className="space-y-0.5">
                {AI_MODELS.map((model) => {
                  const Icon = model.icon;
                  const isSelected = selectedModel === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => { setSelectedModel(model.id); setModelOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors",
                        isSelected ? "bg-primary/10 text-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium">{model.name}</div>
                        <div className="text-[10px] text-muted-foreground">{model.description}</div>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary text-[#f26e76] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
          <p className="text-[10px] text-muted-foreground font-thin mx-0">
            Aan can make mistakes.
          </p>
        </div>
      </div>
    </div>
  );
}
