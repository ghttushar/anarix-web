export type MeetingTaskStatus = "pending" | "in_progress" | "done" | "cancelled" | "blocked";

export interface MeetingTask {
  id: string;
  bundleId?: string;
  title: string;
  assignee: string;
  due?: string;
  status: MeetingTaskStatus;
  done?: boolean;
}

export interface MeetingBundle {
  id: string;
  title: string;
  when: string;
  source: string;
  participants: string[];
  tasks: MeetingTask[];
  ts: number;
  recording?: string;
  decisions: string[];
  callouts: string[];
}

export type MeetingItemStatus = "pending" | "done" | "skipped";

export interface MeetingTaskBundle {
  id: string;
  meetingTitle: string;
  meetingWhen: string;
  meetingAttendees: string[];
  decisions: string[];
  callouts: string[];
  tasks: {
    id: string;
    owner: string;
    task: string;
    due: string;
    status: MeetingItemStatus;
  }[];
}

export type QuestionStatus = "open" | "answered" | "dismissed";

export interface AanQuestion {
  id: string;
  question: string;
  answer?: string;
  status: QuestionStatus;
  createdAt: number;
  answeredAt?: number;
  askedBy: string;
}
