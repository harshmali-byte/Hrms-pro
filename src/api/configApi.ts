import { apiFetch } from "./client";
import type {
  AuditLogEntry,
  CompanyProfile,
  ConfigSummary,
  DocumentTemplate,
  HrRole,
  LeavePolicy,
  OrgPreferences,
  PermissionItem,
} from "@/types/config";

export function fetchConfigSummary() {
  return apiFetch<ConfigSummary>("/config/summary");
}

export function fetchCompanyProfile() {
  return apiFetch<CompanyProfile>("/config/company");
}

export function updateCompanyProfile(data: Partial<CompanyProfile>) {
  return apiFetch<CompanyProfile>("/config/company", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function fetchLeavePolicies() {
  return apiFetch<LeavePolicy[]>("/config/leave-policies");
}

export function createLeavePolicy(
  data: Omit<LeavePolicy, "id"> & { id?: string },
) {
  return apiFetch<LeavePolicy>("/config/leave-policies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateLeavePolicy(
  id: string,
  data: Partial<LeavePolicy> & { syncBalances?: boolean },
) {
  return apiFetch<LeavePolicy>(`/config/leave-policies/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteLeavePolicy(id: string) {
  return apiFetch<{ ok: boolean }>(`/config/leave-policies/${id}`, {
    method: "DELETE",
  });
}

export function fetchPermissions() {
  return apiFetch<PermissionItem[]>("/config/permissions");
}

export function fetchHrRoles() {
  return apiFetch<HrRole[]>("/config/roles");
}

export function updateHrRole(
  id: string,
  data: { permissions?: string[]; description?: string; name?: string },
) {
  return apiFetch<HrRole>(`/config/roles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function fetchDocumentTemplates() {
  return apiFetch<DocumentTemplate[]>("/config/templates");
}

export function createDocumentTemplate(data: {
  name: string;
  category?: DocumentTemplate["category"];
  description?: string;
  version?: string;
}) {
  return apiFetch<DocumentTemplate>("/config/templates", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateDocumentTemplate(
  id: string,
  data: Partial<Pick<DocumentTemplate, "name" | "category" | "description" | "version">>,
) {
  return apiFetch<DocumentTemplate>(`/config/templates/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}   

export function deleteDocumentTemplate(id: string) {
  return apiFetch<{ ok: boolean }>(`/config/templates/${id}`, { method: "DELETE" });
}

export function fetchOrgPreferences() {
  return apiFetch<OrgPreferences>("/config/preferences");
}

export function updateOrgPreferences(data: Partial<OrgPreferences>) {
  return apiFetch<OrgPreferences>("/config/preferences", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function fetchAuditLog(limit = 50) {
  return apiFetch<AuditLogEntry[]>(`/config/audit-log?limit=${limit}`);
}
