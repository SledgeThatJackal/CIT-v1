ALTER TABLE "item_tags" DROP CONSTRAINT "item_tags_itemId_items_id_fk";
--> statement-breakpoint
ALTER TABLE "item_tags" DROP CONSTRAINT "item_tags_tagId_tags_id_fk";
--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_itemId_items_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_tagId_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;