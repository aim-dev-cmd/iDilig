CREATE TABLE "soil_readings" (
	"id" serial PRIMARY KEY,
	"moisture" real NOT NULL,
	"temperature" real NOT NULL,
	"location" text NOT NULL,
	"notes" text,
	"recorded_by" text NOT NULL,
	"recorded_at" timestamp DEFAULT now()
);
