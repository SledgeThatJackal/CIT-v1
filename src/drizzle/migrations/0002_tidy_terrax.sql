ALTER TABLE "item_attributes" DROP CONSTRAINT "item_attributes_typeAttributeId_type_attributes_id_fk";
--> statement-breakpoint
ALTER TABLE "item_attributes" DROP CONSTRAINT "item_attributes_itemId_items_id_fk";
--> statement-breakpoint
ALTER TABLE "type_attributes" DROP CONSTRAINT "type_attributes_itemTypeId_item_types_id_fk";
--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "color" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "item_attributes" ADD CONSTRAINT "item_attributes_typeAttributeId_type_attributes_id_fk" FOREIGN KEY ("typeAttributeId") REFERENCES "public"."type_attributes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_attributes" ADD CONSTRAINT "item_attributes_itemId_items_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_attributes" ADD CONSTRAINT "type_attributes_itemTypeId_item_types_id_fk" FOREIGN KEY ("itemTypeId") REFERENCES "public"."item_types"("id") ON DELETE cascade ON UPDATE no action;