import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { soilReadings } from "../../db/schema.js";
import { sql, desc } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const [metrics] = await db
    .select({
      totalReadings: sql<number>`count(*)::int`,
      avgMoisture: sql<number>`round(avg(${soilReadings.moisture})::numeric, 2)`,
      avgTemperature: sql<number>`round(avg(${soilReadings.temperature})::numeric, 2)`,
      minMoisture: sql<number>`min(${soilReadings.moisture})`,
      maxMoisture: sql<number>`max(${soilReadings.moisture})`,
      minTemperature: sql<number>`min(${soilReadings.temperature})`,
      maxTemperature: sql<number>`max(${soilReadings.temperature})`,
      uniqueLocations: sql<number>`count(distinct ${soilReadings.location})::int`,
      uniqueRecorders: sql<number>`count(distinct ${soilReadings.recordedBy})::int`,
      firstReading: sql<string>`min(${soilReadings.recordedAt})`,
      lastReading: sql<string>`max(${soilReadings.recordedAt})`,
    })
    .from(soilReadings);

  const recentLogs = await db
    .select({
      id: soilReadings.id,
      moisture: soilReadings.moisture,
      temperature: soilReadings.temperature,
      location: soilReadings.location,
      recordedBy: soilReadings.recordedBy,
      recordedAt: soilReadings.recordedAt,
    })
    .from(soilReadings)
    .orderBy(desc(soilReadings.recordedAt))
    .limit(20);

  const locationBreakdown = await db
    .select({
      location: soilReadings.location,
      count: sql<number>`count(*)::int`,
      avgMoisture: sql<number>`round(avg(${soilReadings.moisture})::numeric, 2)`,
      avgTemperature: sql<number>`round(avg(${soilReadings.temperature})::numeric, 2)`,
    })
    .from(soilReadings)
    .groupBy(soilReadings.location);

  return Response.json({
    metrics,
    recentLogs,
    locationBreakdown,
  });
};

export const config: Config = {
  path: "/api/logs-metrics",
};
