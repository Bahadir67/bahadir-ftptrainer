export type ChartData = {
  type: 'line' | 'bar' | 'area';
  title: string;
  data: Record<string, number | string>[];
  dataKeys: { key: string; color: string; name?: string }[];
  xAxisKey: string;
};

export type ConversationMessage = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  createdAt: string;
  chart?: ChartData;
};

export type DashboardData = {
  title: string;
  duration: string;
  tss: number;
  type: string;
  status: string;
};

export type ConversationData = {
  messages: ConversationMessage[];
  dashboard: DashboardData;
};

export type DailySummaryEntry = {
  date: string;
  summary: string;
  messageCount: number;
  createdAt: string;
};

export type WeeklySummaryEntry = {
  weekStart: string;
  weekEnd: string;
  summary: string;
  messageCount: number;
  createdAt: string;
};

export type SummaryCollection<T> = {
  entries: T[];
  rollingSummary?: string;
  updatedAt: string;
};
