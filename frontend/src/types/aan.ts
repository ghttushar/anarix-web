export type ScenarioSeverity = "critical" | "opportunity" | "fyi";
export type ScenarioDomain = "campaign" | "retail" | "workspace" | "briefing";

export interface EvidenceRow {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "positive" | "negative" | "neutral";
}

export interface ExecutionStep {
  label: string;
  detail?: string;
  durationMs: number;
}

export interface DiffField {
  field: string;
  before: string;
  after: string;
}

export interface MeetingActionItem {
  owner: string;
  due: string;
  task: string;
  done?: boolean;
}

export interface MeetingRef {
  title: string;
  when: string;
  attendees: string[];
  decisions: string[];
  actionItems: MeetingActionItem[];
  callouts: string[];
  notes?: string;
}

export interface ScenarioTemplate {
  id: string;
  domain: ScenarioDomain;
  severity: ScenarioSeverity;
  icon: string;
  title: string;
  subtitle: string;
  marketplace: string;
  impact: string;
  confidence: number;
  tags?: string[];
  signal: string;
  evidence: EvidenceRow[];
  sources: string[];
  reasoning: string[];
  workspaceContext?: {
    kind: "slack" | "email" | "meeting" | "doc";
    who: string;
    when: string;
    quote: string;
  };
  meetingRef?: MeetingRef;
  recommendation: string;
  actionLabel: string;
  editable?: { label: string; kind: "number" | "text" | "select"; current: string; options?: string[] };
  steps: ExecutionStep[];
  diff: DiffField[];
  fulfillmentNote: string;
}
