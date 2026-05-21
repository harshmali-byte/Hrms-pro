import type { LeaveType } from "./index";

export interface CompanyProfile {
  legalName: string;
  displayName: string;
  address: string;
  country: string;
  industry: string;
  website?: string | null;
  taxId?: string | null;
}

export interface LeavePolicy {
  id: string;
  name: string;
  type: LeaveType;
  daysPerYear: number;
  carryForwardLimit: number;
  isPaid: boolean;
  minNoticeDays: number;
  requiresApproval: boolean;
  active: boolean;
  description?: string | null;
}

export interface HrRole {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  permissions: string[];
  isSystem: boolean;
}

export interface PermissionItem {
  key: string;
  label: string;
  group: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: "offer" | "policy" | "letter" | "form" | "other";
  description?: string | null;
  version: string;
  updatedAt: string;
}

export interface OrgPreferences {
  locale: string;
  country: string;
  currency: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  leaveReminders: boolean;
  payrollAlerts: boolean;
  policyUpdates: boolean;
}

export interface AuditLogEntry {
  id: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: string | null;
  createdAt: string;
}

export interface ConfigSummary {
  companyDisplayName: string;
  localeLabel: string;
}
