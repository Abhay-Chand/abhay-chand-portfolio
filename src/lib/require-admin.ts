import { NextResponse } from "next/server";
import { getSession } from "./session";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return { session: null, unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, unauthorized: null };
}
