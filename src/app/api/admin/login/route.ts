import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const rows = db.select().from(admins).where(eq(admins.email, email)).all();
  const admin = rows[0];

  // Constant-shape response whether or not the account exists, to avoid
  // leaking which emails are registered.
  const valid = admin ? await bcrypt.compare(password, admin.passwordHash) : false;

  if (!admin || !valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession(admin.id);
  return NextResponse.json({ ok: true });
}
