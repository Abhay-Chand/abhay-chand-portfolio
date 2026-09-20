"use client";

import { useCallback, useEffect, useState } from "react";
import { RESOURCE_UI } from "@/lib/resource-ui";
import { ResourceForm } from "./resource-form";

type Item = Record<string, unknown> & { id: string };

export function ResourceManager({ resource }: { resource: string }) {
  const config = RESOURCE_UI[resource];
  const [items, setItems] = useState<Item[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/content/${resource}`);
    if (!res.ok) {
      setError("Could not load content.");
      return;
    }
    const data = await res.json();
    setItems(data.items);
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  if (!items) {
    return <p className="text-slate text-sm">Loading…</p>;
  }

  // Singleton resource: skip the list view entirely, edit the one row directly.
  if (config.singleton) {
    const item = items[0];
    if (!item) return <p className="text-slate text-sm">No profile row found.</p>;
    return (
      <ResourceForm
        config={config}
        initialValues={item}
        submitLabel="Save changes"
        onSubmit={async (values) => {
          const res = await fetch(`/api/admin/content/${resource}/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error ?? "Save failed.");
          }
          await load();
        }}
      />
    );
  }

  const editingItem = editingId && editingId !== "new" ? items.find((i) => i.id === editingId) : null;
  const emptyValues: Record<string, unknown> = Object.fromEntries(
    config.fields.map((f) => [
      f.key,
      f.type === "boolean" ? true : f.type === "stringList" ? [] : f.type === "linksObject" ? {} : "",
    ])
  );

  async function move(id: string, direction: -1 | 1) {
    const index = items!.findIndex((i) => i.id === id);
    const swapWith = index + direction;
    if (swapWith < 0 || swapWith >= items!.length) return;
    const reordered = [...items!];
    [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];
    setItems(reordered);
    await fetch(`/api/admin/content/${resource}/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((i) => i.id) }),
    }).catch(() => {});
  }

  async function togglePublished(item: Item) {
    const res = await fetch(`/api/admin/content/${resource}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });
    if (res.ok) await load();
  }

  async function toggleFeatured(item: Item) {
    const res = await fetch(`/api/admin/content/${resource}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured }),
    });
    if (res.ok) await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/content/${resource}/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <div>
      {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

      {editingId === "new" && (
        <div className="mb-8">
          <ResourceForm
            config={config}
            initialValues={emptyValues}
            submitLabel="Create"
            onCancel={() => setEditingId(null)}
            onSubmit={async (values) => {
              const res = await fetch(`/api/admin/content/${resource}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });
              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error ?? "Create failed.");
              }
              setEditingId(null);
              await load();
            }}
          />
        </div>
      )}

      {editingItem && (
        <div className="mb-8">
          <ResourceForm
            config={config}
            initialValues={editingItem}
            submitLabel="Save changes"
            onCancel={() => setEditingId(null)}
            onSubmit={async (values) => {
              const res = await fetch(`/api/admin/content/${resource}/${editingItem.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });
              if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error ?? "Save failed.");
              }
              setEditingId(null);
              await load();
            }}
          />
        </div>
      )}

      {!editingId && (
        <button
          type="button"
          onClick={() => setEditingId("new")}
          className="mb-6 rounded-full bg-ink text-paper px-5 py-2 text-sm hover:opacity-90 transition-opacity"
        >
          Add {config.label.toLowerCase()}
        </button>
      )}

      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 rounded border border-line px-4 py-3 bg-white/30"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{String(item[config.titleField] ?? "Untitled")}</p>
              {config.subtitleField && (
                <p className="text-xs text-slate truncate">{String(item[config.subtitleField] ?? "")}</p>
              )}
              <div className="flex gap-2 mt-1">
                {"published" in item && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      item.published ? "text-signal-ai bg-signal-ai-tint" : "text-slate bg-white/60"
                    }`}
                  >
                    {item.published ? "Published" : "Unpublished"}
                  </span>
                )}
                {"featured" in item && item.featured ? (
                  <span className="text-xs px-1.5 py-0.5 rounded text-signal-data bg-signal-data-tint">
                    Featured
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-sm">
              {config.orderable && (
                <>
                  <button
                    type="button"
                    onClick={() => move(item.id, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="disabled:opacity-30 hover:opacity-70"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(item.id, 1)}
                    disabled={index === items.length - 1}
                    aria-label="Move down"
                    className="disabled:opacity-30 hover:opacity-70"
                  >
                    ↓
                  </button>
                </>
              )}
              {"published" in item && (
                <button type="button" onClick={() => togglePublished(item)} className="hover:opacity-70">
                  {item.published ? "Unpublish" : "Publish"}
                </button>
              )}
              {"featured" in item && (
                <button type="button" onClick={() => toggleFeatured(item)} className="hover:opacity-70">
                  {item.featured ? "Unfeature" : "Feature"}
                </button>
              )}
              <button type="button" onClick={() => setEditingId(item.id)} className="hover:opacity-70">
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="text-red-700 hover:opacity-70"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && <p className="text-slate text-sm">Nothing here yet.</p>}
      </ul>
    </div>
  );
}
