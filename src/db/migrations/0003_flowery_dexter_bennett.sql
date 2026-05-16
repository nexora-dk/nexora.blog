CREATE TABLE "gallery_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_src" text NOT NULL,
	"alt" varchar(160) NOT NULL,
	"title" varchar(120) NOT NULL,
	"location" varchar(120) NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"source_key" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "gallery_photos_source_key_idx" ON "gallery_photos" USING btree ("source_key");--> statement-breakpoint
CREATE INDEX "gallery_photos_is_visible_idx" ON "gallery_photos" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "gallery_photos_is_featured_idx" ON "gallery_photos" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "gallery_photos_sort_order_idx" ON "gallery_photos" USING btree ("sort_order");