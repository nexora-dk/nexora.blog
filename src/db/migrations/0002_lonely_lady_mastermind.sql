CREATE TABLE "thinking" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"published_at" varchar(50) NOT NULL,
	"time" varchar(20),
	"mood" varchar(50),
	"is_visible" boolean DEFAULT true NOT NULL,
	"source_key" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"source_key" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collection_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"href" text,
	"icon_type" varchar(20) NOT NULL,
	"icon_name" varchar(80),
	"icon_src" text,
	"icon_alt" varchar(120),
	"icon_class_name" varchar(255),
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"source_key" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_group_id_collection_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."collection_groups"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "thinking_source_key_idx" ON "thinking" USING btree ("source_key");--> statement-breakpoint
CREATE UNIQUE INDEX "collection_groups_slug_idx" ON "collection_groups" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "collection_groups_source_key_idx" ON "collection_groups" USING btree ("source_key");--> statement-breakpoint
CREATE INDEX "collection_groups_sort_order_idx" ON "collection_groups" USING btree ("sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "collection_items_source_key_idx" ON "collection_items" USING btree ("source_key");--> statement-breakpoint
CREATE INDEX "collection_items_group_id_idx" ON "collection_items" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "collection_items_is_visible_idx" ON "collection_items" USING btree ("is_visible");--> statement-breakpoint
CREATE INDEX "collection_items_sort_order_idx" ON "collection_items" USING btree ("sort_order");