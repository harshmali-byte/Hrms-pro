import {
  CompanyProfile,
  LeavePolicy,
  HrRole,
  DocumentTemplate,
  OrgPreferences,
  AuditLog,
  OrgEvent,
  Notice,
} from "../models/index.js";

export async function seedConfigData() {
  await CompanyProfile.upsert({
    id: "default",
    legalName: "Asquarify Technologies",
    displayName: "Asquarify",
    address: "Junagadh, Gujarat 362001, India",
    country: "India",
    industry: "Software & Automation",
    website: "https://asquarify.com",
    taxId: "GSTIN24ASQUARIFY1Z",
  });

  const policies = [
    {
      id: "LP-CASUAL",
      name: "Casual leave",
      type: "casual",
      daysPerYear: 12,
      carryForwardLimit: 3,
      isPaid: true,
      minNoticeDays: 1,
      requiresApproval: true,
      active: true,
      description: "Short personal time — Junagadh team & remote-friendly.",
    },
    {
      id: "LP-SICK",
      name: "Sick leave",
      type: "sick",
      daysPerYear: 10,
      carryForwardLimit: 0,
      isPaid: true,
      minNoticeDays: 0,
      requiresApproval: true,
      active: true,
      description: "Medical rest; notify your lead on the same day.",
    },
    {
      id: "LP-EARNED",
      name: "Earned leave",
      type: "earned",
      daysPerYear: 18,
      carryForwardLimit: 8,
      isPaid: true,
      minNoticeDays: 5,
      requiresApproval: true,
      active: true,
      description: "Planned time off — align with project milestones (Ne Family, Bakali).",
    },
    {
      id: "LP-UNPAID",
      name: "Unpaid leave",
      type: "unpaid",
      daysPerYear: 0,
      carryForwardLimit: 0,
      isPaid: false,
      minNoticeDays: 3,
      requiresApproval: true,
      active: true,
      description: "Extended leave without pay — founder approval required.",
    },
  ];
  for (const p of policies) {
    await LeavePolicy.upsert(p);
  }

  const roles = [
    {
      id: "ROLE-ADMIN",
      name: "Founder / HR Admin",
      slug: "hr-admin",
      description: "Full access — Bhargav & leadership.",
      permissions: [
        "employees.view",
        "employees.edit",
        "leave.view",
        "leave.approve",
        "payroll.view",
        "payroll.run",
        "config.view",
        "config.edit",
        "reports.view",
      ],
      isSystem: true,
    },
    {
      id: "ROLE-MANAGER",
      name: "Tech Lead",
      slug: "manager",
      description: "Aftab & senior devs — team leave and delivery.",
      permissions: ["employees.view", "leave.view", "leave.approve", "payroll.view", "reports.view"],
      isSystem: true,
    },
    {
      id: "ROLE-EMPLOYEE",
      name: "Team member",
      slug: "employee",
      description: "Self-service attendance, leave, and payslips.",
      permissions: ["employees.view", "leave.view"],
      isSystem: true,
    },
  ];
  for (const r of roles) {
    await HrRole.upsert(r);
  }

  const templates = [
    {
      id: "DT-OFFER",
      name: "Offer letter",
      category: "offer",
      description: "Asquarify full-time offer — automation-first culture.",
      version: "2026.1",
      updatedAtLabel: "01 Jan 2026",
    },
    {
      id: "DT-WFH",
      name: "Remote & Hubstaff policy",
      category: "policy",
      description: "Core hours, Hubstaff tracking, and client delivery standards.",
      version: "1.0",
      updatedAtLabel: "10 Feb 2026",
    },
    {
      id: "DT-EXP",
      name: "Experience letter",
      category: "letter",
      description: "Issued on separation with project summary.",
      version: "1.0",
      updatedAtLabel: "01 Jan 2026",
    },
    {
      id: "DT-NDA",
      name: "Client NDA — Ne Family / Bakali",
      category: "form",
      description: "Standard NDA for insurance and commerce clients.",
      version: "2026",
      updatedAtLabel: "15 Mar 2026",
    },
  ];
  for (const t of templates) {
    await DocumentTemplate.upsert(t);
  }

  const events = [
    { id: "E1", title: "Ne Family — UAT review", whenLabel: "Thu 4 PM · Engineering", sortOrder: 1 },
    { id: "E2", title: "Bakali harvest stand-up", whenLabel: "Mon 11 AM · Creative + Eng", sortOrder: 2 },
    { id: "E3", title: "Founders sync", whenLabel: "Wed 6 PM · Junagadh HQ", sortOrder: 3 },
  ];
  for (const e of events) await OrgEvent.upsert(e);

  const notices = [
    { id: "NB1", title: "Ne Family release window", dateLabel: "28 May 2026", sortOrder: 1 },
    { id: "NB2", title: "Bakali — peak season hours", dateLabel: "01 Jun 2026", sortOrder: 2 },
    { id: "NB3", title: "Hubstaff compliance check", dateLabel: "Every Friday", sortOrder: 3 },
  ];
  for (const n of notices) await Notice.upsert(n);

  await OrgPreferences.upsert({
    id: "default",
    locale: "en-IN",
    country: "India",
    currency: "INR",
    timezone: "Asia/Kolkata",
    emailNotifications: true,
    pushNotifications: true,
    leaveReminders: true,
    payrollAlerts: true,
    policyUpdates: true,
  });

  const auditCount = await AuditLog.count();
  if (auditCount === 0) {
    const seedAudits = [
      {
        id: "AUD-SEED-01",
        userName: "System",
        action: "seed",
        resource: "database",
        details: "Asquarify HRMS demo data loaded",
        offsetMs: 0,
      },
      {
        id: "AUD-SEED-02",
        userName: "Bhargav Purohit",
        action: "login",
        resource: "auth",
        details: "Founder admin signed in",
        offsetMs: -3600000,
      },
      {
        id: "AUD-SEED-03",
        userName: "Aftab Alam",
        action: "update",
        resource: "project",
        resourceId: "ne-family",
        details: "Ne Family claims module marked ready for UAT",
        offsetMs: -86400000,
      },
    ];
    for (const a of seedAudits) {
      await AuditLog.create({
        id: a.id,
        userId: null,
        userName: a.userName,
        action: a.action,
        resource: a.resource,
        resourceId: a.resourceId ?? null,
        details: a.details,
        createdAt: new Date(Date.now() + a.offsetMs),
      });
    }
  }

  console.log("Configuration data seeded (Asquarify).");
}
