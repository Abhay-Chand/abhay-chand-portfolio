import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-admin";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

const MAX_SIZE_BYTES = {
  image: 8 * 1024 * 1024,
  video: 50 * 1024 * 1024,
  file: 8 * 1024 * 1024,
};

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, WebP, PDF, MP4, WebM, or QuickTime." },
      { status: 400 }
    );
  }

  const kind = file.type.startsWith("video/") ? "video" : file.type === "application/pdf" ? "file" : "image";
  if (file.size > MAX_SIZE_BYTES[kind]) {
    return NextResponse.json(
      { error: `File is too large (max ${kind === "video" ? "50 MB" : "8 MB"}).` },
      { status: 400 }
    );
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const filename = `${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
