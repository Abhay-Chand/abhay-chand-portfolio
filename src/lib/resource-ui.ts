export type FieldType =
  | "text"
  | "textarea"
  | "boolean"
  | "image"
  | "file"
  | "stringList"
  | "linksObject"
  | "select";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  helpText?: string;
  required?: boolean;
};

export type ResourceUIConfig = {
  label: string;
  labelPlural: string;
  singleton: boolean;
  orderable: boolean;
  titleField: string; // field used to represent an item in the list view
  subtitleField?: string;
  fields: FieldConfig[];
};

export const RESOURCE_UI: Record<string, ResourceUIConfig> = {
  profile: {
    label: "Profile",
    labelPlural: "Profile",
    singleton: true,
    orderable: false,
    titleField: "name",
    fields: [
      { key: "name", label: "Full name", type: "text", required: true },
      { key: "title", label: "Professional title", type: "text", required: true },
      { key: "tagline", label: "Tagline (shown as the homepage headline)", type: "textarea", required: true },
      { key: "bio", label: "Bio", type: "textarea", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "yearsActive", label: "Active since", type: "text", helpText: "e.g. 2026 — Present" },
      { key: "photoUrl", label: "Photo", type: "image" },
      { key: "resumeUrl", label: "Resume (PDF)", type: "file" },
      { key: "email", label: "Contact email", type: "text", helpText: "Shown on the site once set." },
      { key: "githubUrl", label: "GitHub URL", type: "text" },
      { key: "linkedinUrl", label: "LinkedIn URL", type: "text" },
      { key: "focusAreas", label: "Focus areas", type: "stringList" },
    ],
  },
  experience: {
    label: "Experience",
    labelPlural: "Experience",
    singleton: false,
    orderable: true,
    titleField: "role",
    subtitleField: "org",
    fields: [
      { key: "role", label: "Role / title", type: "text", required: true },
      { key: "org", label: "Organization", type: "text", required: true },
      { key: "startDate", label: "Start date", type: "text", helpText: "e.g. 2026-06", required: true },
      { key: "endDate", label: "End date", type: "text", helpText: "Leave blank if this is your current role" },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "highlights", label: "Highlights", type: "stringList" },
      { key: "published", label: "Published", type: "boolean" },
    ],
  },
  projects: {
    label: "Project",
    labelPlural: "Projects",
    singleton: false,
    orderable: true,
    titleField: "title",
    subtitleField: "category",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", helpText: "URL-friendly identifier, e.g. my-project", required: true },
      {
        key: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "ai", label: "AI / GenAI" },
          { value: "data", label: "Data Analytics" },
        ],
        required: true,
      },
      { key: "summary", label: "Summary", type: "textarea", required: true },
      { key: "problem", label: "Problem", type: "textarea" },
      { key: "solution", label: "Solution", type: "textarea" },
      { key: "architecture", label: "Architecture", type: "textarea" },
      { key: "challenges", label: "Challenges", type: "textarea" },
      { key: "outcome", label: "Outcome", type: "textarea" },
      { key: "techStack", label: "Tech stack", type: "stringList" },
      { key: "links", label: "Links", type: "linksObject" },
      { key: "coverImageUrl", label: "Cover image", type: "image" },
      { key: "featured", label: "Featured", type: "boolean" },
      { key: "published", label: "Published", type: "boolean" },
    ],
  },
  skills: {
    label: "Skill group",
    labelPlural: "Skills",
    singleton: false,
    orderable: true,
    titleField: "name",
    fields: [
      { key: "name", label: "Group name", type: "text", required: true, helpText: "e.g. GenAI & LLM Systems" },
      { key: "skills", label: "Skills", type: "stringList" },
      { key: "published", label: "Published", type: "boolean" },
    ],
  },
  certifications: {
    label: "Certification",
    labelPlural: "Certifications",
    singleton: false,
    orderable: true,
    titleField: "name",
    subtitleField: "issuer",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "issuer", label: "Issuer", type: "text", required: true },
      { key: "dateEarned", label: "Date earned", type: "text", helpText: "e.g. 2026-02" },
      { key: "url", label: "Credential URL", type: "text" },
      { key: "published", label: "Published", type: "boolean" },
    ],
  },
  achievements: {
    label: "Achievement",
    labelPlural: "Achievements",
    singleton: false,
    orderable: true,
    titleField: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "dateEarned", label: "Date", type: "text", helpText: "e.g. 2025-11" },
      { key: "url", label: "URL", type: "text" },
      { key: "published", label: "Published", type: "boolean" },
    ],
  },
};

export const RESOURCE_ORDER = [
  "profile",
  "experience",
  "projects",
  "skills",
  "certifications",
  "achievements",
];
