ALTER TABLE "friend_links" ADD COLUMN "status" varchar(20) DEFAULT 'approved' NOT NULL;--> statement-breakpoint
CREATE INDEX "friend_links_status_idx" ON "friend_links" USING btree ("status");--> statement-breakpoint
CREATE INDEX "friend_links_public_idx" ON "friend_links" USING btree ("status","is_visible","sort_order");