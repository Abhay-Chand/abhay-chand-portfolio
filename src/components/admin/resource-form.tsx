"use client";

import { useState } from "react";
import type { ResourceUIConfig } from "@/lib/resource-ui";
import { ResourceField } from "./resource-field";

export function ResourceForm({
  config,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  config: ResourceUIConfig;
  initialValues: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    for (const field of config.fields) {
      if (field.required && !String(values[field.key] ?? "").trim()) {
        setError(`${field.label} is required.`);
        return;
      }
    }

    setSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-line p-5 bg-white/30">
      {config.fields.map((field) => (
        <div key={field.key}>
          <label htmlFor={field.key} className="block text-sm font-medium mb-1.5">
            {field.label}
            {field.required && <span className="text-signal-data"> *</span>}
          </label>
          {field.helpText && <p className="text-xs text-slate mb-1.5">{field.helpText}</p>}
          <ResourceField
            field={field}
            value={values[field.key]}
            onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
          />
        </div>
      ))}

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink text-paper px-5 py-2 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-slate hover:opacity-70"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
