export type DashboardWidgetType = "metric" | "status" | "card" | "progress";

export type DashboardWidgetTone = "default" | "primary" | "success" | "warning" | "danger" | "info";

export interface DashboardWidgetAction {
  type: "navigate";
  target: string;
}

export interface DashboardWidgetTrend {
  text: string;
  positive: boolean;
}

export interface DashboardWidgetProgress {
  current: number;
  total: number;
}

export interface DashboardWidget {
  id: string;
  type: DashboardWidgetType;
  title: string;
  value: string;
  subtitle?: string;
  tone?: DashboardWidgetTone;
  icon?: string;
  trend?: DashboardWidgetTrend;
  progress?: DashboardWidgetProgress;
  action?: DashboardWidgetAction;
}

export interface DashboardWidgetsResponse {
  widgets: DashboardWidget[];
}
