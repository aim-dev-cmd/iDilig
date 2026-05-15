import { pgTable, serial, text, timestamp, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const soilReadings = pgTable("soil_readings", {
  id: serial().primaryKey(),
  moisture: real("moisture").notNull(),
  temperature: real("temperature").notNull(),
  location: text("location").notNull(),
  notes: text("notes"),
  recordedBy: text("recorded_by").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow(),
});
