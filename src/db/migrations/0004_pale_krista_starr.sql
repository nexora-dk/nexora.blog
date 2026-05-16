CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"status" varchar(80) NOT NULL,
	"category" varchar(120) NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"href" text,
	"repo_href" text,
	"development_time" varchar(80) NOT NULL,
	"cover_image_url" text,
	"cover_blob_key" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"source_key" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "projects_source_key_idx" ON "projects" USING btree ("source_key");--> statement-breakpoint
CREATE INDEX "projects_is_visible_idx" ON "projects" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "projects_is_featured_idx" ON "projects" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "projects_sort_order_idx" ON "projects" USING btree ("sort_order");