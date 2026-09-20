import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { listResource, createResource, RESOURCES } from "@/lib/admin-repo";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { resource } = await params;
  if (!RESOURCES[resource]) {
    return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  }

  try {
    return NextResponse.json({ items: listResource(resource) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const { resource } = await params;
  if (!RESOURCES[resource]) {
    return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const created = createResource(resource, body);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
