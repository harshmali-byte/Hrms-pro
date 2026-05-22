import { apiFetch } from "./client";
import type { DocumentTemplate } from "@/types/config";

export function fetchEmployeeTemplates(): Promise<DocumentTemplate[]> {
  return apiFetch<DocumentTemplate[]>("/content/templates");
}
