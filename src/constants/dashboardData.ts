/** Dashboard widgets — Asquarify team fallbacks */

export const dashboardKpis = {
  totalEmployees: { value: 8, trend: "Core team · 2026", positive: true },
  newJoiners: { value: 6, trend: "Since Jan 2026 launch", positive: true },
  onLeave: { value: 0, trend: "All hands on deck", positive: true },
  activeEmployees: { value: 8, trend: "Junagadh + remote", positive: true },
};

export const departmentEngagement = [
  { label: "Engineering", value: 62, color: "#0066FF" },
  { label: "Leadership", value: 25, color: "#8B5CF6" },
  { label: "Creative", value: 13, color: "#F59E0B" },
];

export const attendanceTrend = {
  present: [5, 6, 7, 6, 7, 8, 7, 8, 7, 8],
  absent: [0, 1, 0, 1, 0, 0, 1, 0, 0, 0],
  labels: ["1", "5", "10", "15", "20", "25"],
};

export const upcomingEvents = [
  { id: "E1", title: "Ne Family — UAT review", when: "Thu 4 PM" },
  { id: "E2", title: "Bakali harvest stand-up", when: "Mon 11 AM" },
  { id: "E3", title: "Founders sync · Junagadh", when: "Wed 6 PM" },
];

export const noticeBoard = [
  { id: "N1", title: "Ne Family release window — 28 May", date: "15 May 2026" },
  { id: "N2", title: "Bakali peak season hours", date: "01 Jun 2026" },
  { id: "N3", title: "Hubstaff compliance — every Friday", date: "Ongoing" },
];
