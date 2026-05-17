CREATE TABLE "friend_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"avatar_url" text NOT NULL,
	"blog_url" text NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"source_key" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "friend_links_source_key_idx" ON "friend_links" USING btree ("source_key");--> statement-breakpoint
CREATE INDEX "friend_links_is_visible_idx" ON "friend_links" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "friend_links_sort_order_idx" ON "friend_links" USING btree ("sort_order");