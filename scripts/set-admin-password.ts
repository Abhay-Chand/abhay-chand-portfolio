/**
 * Update the admin login credentials from .env
 *
 * Required:
 *   ADMIN_EMAIL
 *   ADMIN_PASSWORD
 */
import "dotenv/config";


import { db } from "../src/db";
import { admins } from "../src/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the .env file."
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = db.select().from(admins).limit(1).all();

  if (existing.length === 0) {
    db.insert(admins)
      .values({
        id: randomUUID(),
        email: normalizedEmail,
        passwordHash,
      })
      .run();

    console.log(`Created admin account: ${normalizedEmail}`);
  } else {
    db.update(admins)
      .set({
        email: normalizedEmail,
        passwordHash,
      })
      .where(eq(admins.id, existing[0].id))
      .run();

    console.log(`Admin credentials updated: ${normalizedEmail}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});