import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { soilReadings } from "../../db/schema.js";
import { desc } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method === "GET") {
    const rows = await db
      .select()
      .from(soilReadings)
      .orderBy(desc(soilReadings.recordedAt))
      .limit(100);

    return Response.json(rows);
  }

  if (req.method === "POST") {
    const { moisture, temperature, location, notes, recordedBy } = await req.json();

    if (moisture == null || temperature == null || !location || !recordedBy) {
      return Response.json(
        { error: "Moisture, temperature, location, and recordedBy are required." },
        { status: 400 },
      );
    }

    const [row] = await db
      .insert(soilReadings)
      .values({
        moisture: Number(moisture),
        temperature: Number(temperature),
        location,
        notes: notes || null,
        recordedBy,
      })
      .returning();

    return Response.json(row, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/readings",
};
