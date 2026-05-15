import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";
import { eq, and } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { username, password } = await req.json();

  if (!username || !password) {
    return Response.json({ error: "Username and password are required." }, { status: 400 });
  }

  const results = await db
    .select({
      id: users.id,
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
    })
    .from(users)
    .where(and(eq(users.username, username), eq(users.password, password)))
    .limit(1);

  if (results.length === 0) {
    return Response.json(
      { error: "Invalid username or password. Please try again." },
      { status: 401 }
    );
  }

  return Response.json({
    message: "Login successful!",
    user: results[0],
  });
};

export const config: Config = {
  path: "/api/login",
};
