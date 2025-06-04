CREATE TYPE "public"."type_attribute_data_type" AS ENUM('string', 'number', 'boolean', 'list');--> statement-breakpoint
CREATE TABLE "containers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"barcodeId" text NOT NULL,
	"parentId" uuid,
	"isArea" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "containers_barcodeId_unique" UNIQUE("barcodeId")
);
--> statement-breakpoint
CREATE TABLE "container_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"containerId" uuid NOT NULL,
	"imageId" uuid NOT NULL,
	"imageOrder" smallint,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "container_images_containerId_imageId_unique" UNIQUE("containerId","imageId")
);
--> statement-breakpoint
CREATE TABLE "container_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"containerId" uuid NOT NULL,
	"itemId" uuid NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "container_items_containerId_itemId_unique" UNIQUE("containerId","itemId")
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fileName" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "images_fileName_unique" UNIQUE("fileName")
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"externalUrl" text,
	"itemTypeId" uuid,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"typeAttributeId" uuid NOT NULL,
	"itemId" uuid NOT NULL,
	"textValue" text,
	"numericValue" double precision,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "item_attributes_typeAttributeId_itemId_unique" UNIQUE("typeAttributeId","itemId")
);
--> statement-breakpoint
CREATE TABLE "item_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"itemId" uuid NOT NULL,
	"imageId" uuid NOT NULL,
	"imageOrder" smallint,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "item_images_itemId_imageId_unique" UNIQUE("itemId","imageId")
);
--> statement-breakpoint
CREATE TABLE "item_tags" (
	"itemId" uuid NOT NULL,
	"tagId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "item_tags_itemId_tagId_pk" PRIMARY KEY("itemId","tagId")
);
--> statement-breakpoint
CREATE TABLE "item_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text,
	"value" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"color" varchar(7),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "type_attributes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"itemTypeId" uuid NOT NULL,
	"displayOrder" integer NOT NULL,
	"title" text NOT NULL,
	"dataType" "type_attribute_data_type" DEFAULT 'string' NOT NULL,
	"textDefaultValue" text,
	"numericDefaultValue" double precision,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "type_attributes_itemTypeId_title_unique" UNIQUE("itemTypeId","title")
);
--> statement-breakpoint
ALTER TABLE "containers" ADD CONSTRAINT "container_parent_id_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."containers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "container_images" ADD CONSTRAINT "container_images_containerId_containers_id_fk" FOREIGN KEY ("containerId") REFERENCES "public"."containers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "container_images" ADD CONSTRAINT "container_images_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "container_items" ADD CONSTRAINT "container_items_containerId_containers_id_fk" FOREIGN KEY ("containerId") REFERENCES "public"."containers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "container_items" ADD CONSTRAINT "container_items_itemId_items_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_itemTypeId_item_types_id_fk" FOREIGN KEY ("itemTypeId") REFERENCES "public"."item_types"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_attributes" ADD CONSTRAINT "item_attributes_typeAttributeId_type_attributes_id_fk" FOREIGN KEY ("typeAttributeId") REFERENCES "public"."type_attributes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_attributes" ADD CONSTRAINT "item_attributes_itemId_items_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_itemId_items_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_images" ADD CONSTRAINT "item_images_imageId_images_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."images"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_itemId_items_id_fk" FOREIGN KEY ("itemId") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_tagId_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "type_attributes" ADD CONSTRAINT "type_attributes_itemTypeId_item_types_id_fk" FOREIGN KEY ("itemTypeId") REFERENCES "public"."item_types"("id") ON DELETE no action ON UPDATE no action;