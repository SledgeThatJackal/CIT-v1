import {
  ContainerItemTable,
  ItemAttributeTable,
  ItemImageTable,
  ItemTagTable,
} from "@/drizzle/schema";
import { ExtractTablesWithRelations } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgTransaction } from "drizzle-orm/pg-core";

export async function createItemAttributes(
  trx: PgTransaction<
    NodePgQueryResultHKT,
    typeof import("c:/Users/aland/Documents/cit_prototype/src/drizzle/schema"),
    ExtractTablesWithRelations<
      typeof import("c:/Users/aland/Documents/cit_prototype/src/drizzle/schema")
    >
  >,
  totalItemAttributes: number,
  values: {
    typeAttributeId: string;
    itemId: string;
    textValue: string | null;
    numericValue: number | null;
  }[]
) {
  const newItemAttributes = await trx
    .insert(ItemAttributeTable)
    .values(values)
    .returning();

  if (
    newItemAttributes == null
    // newItemAttributes.length !== totalItemAttributes
  )
    trx.rollback();
}

export async function createContainerItems(
  trx: PgTransaction<
    NodePgQueryResultHKT,
    typeof import("c:/Users/aland/Documents/cit_prototype/src/drizzle/schema"),
    ExtractTablesWithRelations<
      typeof import("c:/Users/aland/Documents/cit_prototype/src/drizzle/schema")
    >
  >,
  containerItemsLength: number,
  values: {
    containerId: string;
    itemId: string;
    quantity: number;
  }[]
) {
  const newContainerItems = await trx
    .insert(ContainerItemTable)
    .values(values)
    .returning();

  if (
    newContainerItems == null ||
    newContainerItems.length !== containerItemsLength
  )
    trx.rollback();
}

export async function createItemImages(
  trx: PgTransaction<
    NodePgQueryResultHKT,
    typeof import("c:/Users/aland/Documents/cit_prototype/src/drizzle/schema"),
    ExtractTablesWithRelations<
      typeof import("c:/Users/aland/Documents/cit_prototype/src/drizzle/schema")
    >
  >,
  itemImagesLength: number,
  values: {
    imageId: string;
    itemId: string;
    imageOrder: number;
  }[]
) {
  const newItemImages = await trx
    .insert(ItemImageTable)
    .values(values)
    .returning();

  if (newItemImages == null || newItemImages.length !== itemImagesLength)
    trx.rollback();
}

export async function createItemTags(
  trx: PgTransaction<
    NodePgQueryResultHKT,
    typeof import("c:/Users/aland/Documents/cit_prototype/src/drizzle/schema"),
    ExtractTablesWithRelations<
      typeof import("c:/Users/aland/Documents/cit_prototype/src/drizzle/schema")
    >
  >,
  tagsLength: number,
  values: {
    itemId: string;
    tagId: string;
  }[]
) {
  const newTags = await trx.insert(ItemTagTable).values(values).returning();

  if (newTags == null || newTags.length !== tagsLength) trx.rollback();
}

export function processItemAttributes(
  itemAttributes?: {
    typeAttributeId: string;
    textValue?: string;
    numericValue?: string;
    duplicate?: boolean;
    dataType?: string;
  }[]
) {
  return (
    itemAttributes?.map((itemAttribute) => {
      let currentValues: string[] | undefined;
      const dataType = itemAttribute.dataType!;

      if (itemAttribute.duplicate) {
        currentValues =
          dataType === "string"
            ? itemAttribute.textValue?.split("|")
            : itemAttribute.numericValue?.split("|");
      } else {
        const value =
          dataType === "string"
            ? itemAttribute.textValue
            : itemAttribute.numericValue;

        currentValues = value ? [value] : undefined;
      }

      if (!currentValues)
        throw new Error("Attribute value should not be undefined");

      return {
        dataType,
        typeAttributeId: itemAttribute.typeAttributeId,
        values: currentValues,
        index: 0,
      };
    }) ?? []
  );
}

export function createDuplicateItemAttributes(
  attributeValues: {
    dataType: string;
    typeAttributeId: string;
    values: string[];
    index: number;
  }[],
  index: number,
  itemId: string,
  itemAttributes: {
    itemId: string;
    typeAttributeId: string;
    numericValue: number | null;
    textValue: string | null;
  }[]
) {
  const currentValue = attributeValues[index]!;

  const value: {
    itemId: string;
    typeAttributeId: string;
    numericValue: number | null;
    textValue: string | null;
  } = {
    itemId,
    typeAttributeId: currentValue.typeAttributeId,
    numericValue: null,
    textValue: null,
  };

  if (currentValue?.dataType.startsWith("s"))
    value.textValue = currentValue.values[currentValue.index] ?? null;
  else value.numericValue = Number(currentValue.values[currentValue.index]);

  currentValue.index = (currentValue.index + 1) % currentValue.values.length;

  itemAttributes.push(value);

  if (index < attributeValues.length - 1)
    createDuplicateItemAttributes(
      attributeValues,
      index + 1,
      itemId,
      itemAttributes
    );

  return itemAttributes;
}

export const getTotal = (arr: { values: string[] }[]) =>
  arr.reduce((acc, current) => acc * current.values.length, 1);
