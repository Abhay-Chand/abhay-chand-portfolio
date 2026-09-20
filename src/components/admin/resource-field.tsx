"use client";

import { useRef, useState } from "react";
import type { FieldConfig } from "@/lib/resource-ui";

type Props = {
  field: FieldConfig;
  value: unknown;
  onChange: (value: unknown) => void;
};

export function ResourceField({ field, value, onChange }: Props) {
  switch (field.type) {
    case "text":
      return (
        <TextField
          id={field.key}
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
        />
      );
    case "textarea":
      return (
        <textarea
          id={field.key}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full rounded border border-line bg-white/60 px-3 py-2 text-sm leading-relaxed"
        />
      );
    case "boolean":
      return (
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            id={field.key}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4"
          />
          Enabled
        </label>
      );
    case "select":
      return (
        <select
          id={field.key}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded border border-line bg-white/60 px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Select…
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    case "stringList":
      return (
        <StringListField
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />
      );
    case "linksObject":
      return (
        <LinksObjectField
          value={
            value && typeof value === "object"
              ? (value as { github?: string; live?: string; other?: string })
              : {}
          }
          onChange={onChange}
        />
      );
    case "image":
      return (
        <UploadField
          kind="image"
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
        />
      );
    case "file":
      return (
        <UploadField
          kind="file"
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
}

function TextField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border border-line bg-white/60 px-3 py-2 text-sm"
    />
  );
}

function StringListField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function addItem() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      <ul className="space-y-1.5 mb-2">
        {value.map((item, i) => (
          <li
            key={`${item}-${i}`}
            className="flex items-center justify-between gap-2 text-sm rounded border border-line px-3 py-1.5 bg-white/40"
          >
            <span className="min-w-0 break-words">{item}</span>
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-slate hover:text-ink shrink-0"
              aria-label={`Remove ${item}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          placeholder="Add an item and press Enter"
          className="flex-1 rounded border border-line bg-white/60 px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={addItem}
          className="rounded border border-ink px-3 py-2 text-sm hover:bg-ink hover:text-paper transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function LinksObjectField({
  value,
  onChange,
}: {
  value: { github?: string; live?: string; other?: string };
  onChange: (v: { github?: string; live?: string; other?: string }) => void;
}) {
  return (
    <div className="space-y-2">
      {(["github", "live", "other"] as const).map((key) => (
        <div key={key}>
          <label htmlFor={`link-${key}`} className="block text-xs text-slate mb-1 capitalize">
            {key}
          </label>
          <input
            id={`link-${key}`}
            type="text"
            value={value[key] ?? ""}
            onChange={(e) => onChange({ ...value, [key]: e.target.value })}
            className="w-full rounded border border-line bg-white/60 px-3 py-2 text-sm"
            placeholder="https://…"
          />
        </div>
      ))}
    </div>
  );
}

function UploadField({
  kind,
  value,
  onChange,
}: {
  kind: "image" | "file";
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Upload failed.");
      return;
    }

    const data = await res.json();
    onChange(data.url);
  }

  return (
    <div>
      {kind === "image" && value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="h-24 w-24 object-cover rounded border border-line mb-2"
        />
      )}
      {kind === "file" && value && (
        <a href={value} target="_blank" rel="noreferrer" className="text-sm underline block mb-2">
          Current file: {value.split("/").pop()}
        </a>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded border border-ink px-3 py-2 text-sm hover:bg-ink hover:text-paper transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm text-slate hover:opacity-70"
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={kind === "image" ? "image/jpeg,image/png,image/webp" : "application/pdf"}
        onChange={handleFileSelected}
        className="hidden"
      />
      {error && (
        <p role="alert" className="text-sm text-red-700 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
