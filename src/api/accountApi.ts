import type {
  AccountOverview,
  AccountSettings,
  Employee,
  EmployeeDocument,
  EmployeeDocumentCategory,
  PrivacyPreferences,
  SupportTicket,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/types";
import { apiFetch } from "./client";

export function fetchAccountOverview() {
  return apiFetch<AccountOverview>("/account/overview");
}

export function updateMyProfile(input: Partial<Pick<Employee, "name" | "phone" | "location" | "reportsTo">>) {
  return apiFetch<Employee>("/account/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function createDocument(input: {
  title: string;
  category: EmployeeDocumentCategory;
  fileUrl?: string;
  notes?: string;
}) {
  return apiFetch<EmployeeDocument>("/account/documents", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateDocument(
  id: string,
  input: {
    title: string;
    category: EmployeeDocumentCategory;
    fileUrl?: string;
    notes?: string;
  },
) {
  return apiFetch<EmployeeDocument>(`/account/documents/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteDocument(id: string) {
  await apiFetch(`/account/documents/${id}`, { method: "DELETE" });
}

export function updatePrivacy(
  input: PrivacyPreferences & { currentPassword?: string; newPassword?: string },
) {
  return apiFetch<PrivacyPreferences>("/account/privacy", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function createSupportTicket(input: {
  subject: string;
  message: string;
  priority: SupportTicketPriority;
}) {
  return apiFetch<SupportTicket>("/account/support", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateSupportTicket(
  id: string,
  input: {
    subject: string;
    message: string;
    priority: SupportTicketPriority;
    status: SupportTicketStatus;
  },
) {
  return apiFetch<SupportTicket>(`/account/support/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteSupportTicket(id: string) {
  await apiFetch(`/account/support/${id}`, { method: "DELETE" });
}

export function updateAccountSettings(input: AccountSettings) {
  return apiFetch<AccountSettings>("/account/settings", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
