/**
 * Asquarify — company profile, team, and projects (UI + login hints).
 */

export const ASQUARIFY = {
  legalName: "Asquarify Technologies",
  displayName: "Asquarify",
  tagline: "Proficient in automation — paced and accurate delivery.",
  founded: "2026",
  headquarters: "Junagadh, Gujarat, India",
  address: "Junagadh, Gujarat 362001, India",
  industry: "Software & Automation",
  website: "https://asquarify.com",
  emailDomain: "asquarify.co",
} as const;

export const DEMO_LOGINS = {
  employee: "harsh.mali@asquarify.co",
  admin: "bhargav.purohit@asquarify.co",
  password: "demo123",
} as const;

export const ASQUARIFY_PROJECTS = [
  {
    id: "ne-family",
    name: "Ne Family",
    subtitle: "England insurance system",
    description:
      "End-to-end policy and claims workflows for the UK market — secure, compliant, and built for scale.",
    status: "In delivery" as const,
    accent: "#0066FF",
    region: "United Kingdom",
  },
  {
    id: "bakali",
    name: "Bakali",
    subtitle: "Fresh mango shop",
    description:
      "Seasonal e-commerce for farm-fresh mangoes — catalog, orders, and logistics tuned for peak harvest.",
    status: "Live" as const,
    accent: "#F59E0B",
    region: "India",
  },
  {
    id: "hrms",
    name: "Asquarify HRMS",
    subtitle: "People & operations hub",
    description:
      "Internal workforce platform — attendance, leave, payroll, and Hubstaff-aligned productivity.",
    status: "Active" as const,
    accent: "#10B981",
    region: "Global remote",
  },
] as const;
