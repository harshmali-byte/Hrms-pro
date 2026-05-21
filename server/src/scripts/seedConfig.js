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
import { formatPostedDate, newId } from "../utils/dates.js";

export async function seedConfigData() {
  await CompanyProfile.upsert({
    id: "default",
    legalName: "Organiq Private Limited",
    displayName: "Organiq Pvt. Ltd.",
    address: "91 Springboard, Koramangala, Bengaluru 560034",
    country: "India",
    industry: "Technology",
    website: "https://organiq.co",
    taxId: "GSTIN29ORG1234Z1",
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
      description: "Short personal errands and unplanned time off.",
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
      description: "Medical rest; doctor note required for 3+ consecutive days.",
    },
    {
      id: "LP-EARNED",
      name: "Earned leave",
      type: "earned",
      daysPerYear: 18,
      carryForwardLimit: 10,
      isPaid: true,
      minNoticeDays: 7,
      requiresApproval: true,
      active: true,
      description: "Planned vacations; accrues monthly after probation.",
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
      description: "Extended leave without pay; manager and HR approval required.",
    },
  ];
  for (const p of policies) {
    await LeavePolicy.upsert(p);
  }

  const roles = [
    {
      id: "ROLE-ADMIN",
      name: "HR Admin",
      slug: "hr-admin",
      description: "Full access to HRMS configuration and approvals.",
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
      name: "People Manager",
      slug: "manager",
      description: "Manage team leave and view personnel.",
      permissions: ["employees.view", "leave.view", "leave.approve", "payroll.view", "reports.view"],
      isSystem: true,
    },
    {
      id: "ROLE-EMPLOYEE",
      name: "Employee",
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
      description: "Standard full-time offer with CTC breakdown.",
      version: "2.1",
      updatedAtLabel: "10 May 2026",
    },
    {
      id: "DT-WFH",
      name: "WFH policy",
      category: "policy",
      description: "Hybrid work policy effective June 2026.",
      version: "1.4",
      updatedAtLabel: "14 May 2026",
    },
    {
      id: "DT-EXP",
      name: "Experience letter",
      category: "letter",
      description: "Issued on separation with tenure summary.",
      version: "1.0",
      updatedAtLabel: "01 Jan 2026",
    },
    {
      id: "DT-TAX",
      name: "Form 16",
      category: "form",
      description: "Annual tax certificate for payroll year.",
      version: "FY26",
      updatedAtLabel: "12 Apr 2026",
    },
  ];
  for (const t of templates) {
    await DocumentTemplate.upsert(t);
  }

  const events = [
    { id: "E1", title: "Town hall", whenLabel: "Fri 4 PM · Main hall", sortOrder: 1 },
    { id: "E2", title: "Design critique", whenLabel: "Mon 11 AM · Zoom", sortOrder: 2 },
    { id: "E3", title: "Benefits Q&A", whenLabel: "Wed 3 PM · People lounge", sortOrder: 3 },
  ];
  for (const e of events) await OrgEvent.upsert(e);

  const notices = [
    { id: "NB1", title: "Hybrid policy update", dateLabel: "14 May 2026", sortOrder: 1 },
    { id: "NB2", title: "Security training due", dateLabel: "18 May 2026", sortOrder: 2 },
    { id: "NB3", title: "Office maintenance", dateLabel: "20 May 2026", sortOrder: 3 },
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
        details: "Initial demo data loaded",
        offsetMs: 0,
      },
      {
        id: "AUD-SEED-02",
        userName: "John Doe",
        action: "login",
        resource: "auth",
        details: "Admin signed in",
        offsetMs: -3600000,
      },
      {
        id: "AUD-SEED-03",
        userName: "Priya Sharma",
        action: "update",
        resource: "leave_policy",
        resourceId: "LP-CASUAL",
        details: "Casual leave carry-forward set to 3 days",
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

  console.log("Configuration data seeded.");
}
