import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import {
  getResourceById,
  updateResource,
  deleteResource,
  reorderResource,
  RESOURCES,
} from "@/lib/admin-repo";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { resource, id } = await params;
  if (!RESOURCES[resource]) {
    return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Special case: PATCH .../[resource]/reorder with { orderedIds: string[] }
  if (id === "reorder") {
    if (!Array.isArray(body.orderedIds)) {
      return NextResponse.json({ error: "orderedIds must be an array" }, { status: 400 });
    }
    try {
      reorderResource(resource, body.orderedIds);
      return NextResponse.json({ ok: true });
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 });
    }
  }

  const existing = getResourceById(resource, id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const updated = updateResource(resource, id, body);
    return NextResponse.json({ item: updated });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { resource, id } = await params;
  if (!RESOURCES[resource]) {
    return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  }

  const existing = getResourceById(resource, id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    deleteResource(resource, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
