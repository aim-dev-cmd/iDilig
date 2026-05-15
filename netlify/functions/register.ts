import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { fname, lname, username, email, phone, password } = await req.json();

  if (!fname || !lname || !username || !email || !phone || !password) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existing.length > 0) {
    return Response.json(
      { error: "Username already taken. Please choose a different username." },
      { status: 409 }
    );
  }

  await db.insert(users).values({
    firstName: fname,
    lastName: lname,
    username,
    email,
    phone,
    password,
  });

  return Response.json({ message: "Account created successfully!" }, { status: 201 });
};

export const config: Config = {
  path: "/api/register",
};
