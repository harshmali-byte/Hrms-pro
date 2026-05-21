/** Dashboard widgets — aligned with reference HRMS admin UI */

export const dashboardKpis = {
  totalEmployees: { value: 1248, trend: "+12.5% from last month", positive: true },
  newJoiners: { value: 32, trend: "+3.3% from last month", positive: true },
  onLeave: { value: 45, trend: "-5.2% from last month", positive: false },
  activeEmployees: { value: 1203, trend: "+10.1% from last month", positive: true },
};

export const departmentEngagement = [
  { label: "Finance", value: 22, color: "#4F6BED" },
  { label: "Development", value: 35, color: "#10B981" },
  { label: "BDE", value: 18, color: "#F97316" },
  { label: "UI/Design", value: 15, color: "#8B5CF6" },
  { label: "Others", value: 10, color: "#64748B" },
];

export const attendanceTrend = {
  present: [28, 32, 30, 38, 42, 40, 45, 38, 44, 48],
  absent: [12, 10, 14, 11, 9, 13, 10, 15, 11, 9],
  labels: ["1", "5", "10", "15", "20", "25"],
};

export const upcomingEvents = [
  { id: "E1", title: "Team Meeting", when: "Today, 10:00 AM" },
  { id: "E2", title: "HR Policy Update", when: "Tomorrow, 2:00 PM" },
  { id: "E3", title: "Training Session", when: "18 May, 11:00 AM" },
];

export const noticeBoard = [
  { id: "N1", title: "Office will remain closed on 15th Aug", date: "12 May 2026" },
  { id: "N2", title: "New Leave Policy is live", date: "10 May 2026" },
  { id: "N3", title: "Q2 performance reviews start next week", date: "08 May 2026" },
];
