CREATE TABLE "users" (
	"id" serial PRIMARY KEY,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"username" text NOT NULL UNIQUE,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
