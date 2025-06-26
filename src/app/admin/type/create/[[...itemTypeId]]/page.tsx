import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { TypeAttributeDataType } from "@/drizzle/schema";
import ClientWrapper from "@/features/types/components/Wrapper";
import { getTypeIdTag } from "@/features/types/db/cache/type";
import { Metadata } from "next";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";

type Props = {
  params: Promise<{ itemTypeId?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { itemTypeId } = await params;
  const type = await getType(itemTypeId?.[0]);

  const title =
    type !== undefined ? `Updating ${type.name}` : "Creating New Type";

  return {
    title,
  };
}

export default async function TypeCreate({
  params,
}: {
  params: Promise<{ itemTypeId?: string }>;
}) {
  const { itemTypeId } = await params;
  const type = await getType(itemTypeId?.[0]);

  return (
    <div className="container mx-auto py-10">
      <PageHeader title="Type Creation">
        <Button variant="destructiveOutline" asChild>
          <Link href="/type">Cancel</Link>
        </Button>
      </PageHeader>
      <div className="relative overflow-hidden">
        <ClientWrapper type={type} />
      </div>
    </div>
  );
}

async function getType(id?: string) {
  "use cache";

  if (!id) return undefined;

  cacheTag(getTypeIdTag(id));

  return db.query.ItemTypeTable.findFirst({
    where: (ItemTypeTable, { eq }) => eq(ItemTypeTable.id, id),
    columns: {
      id: true,
      name: true,
    },
    with: {
      typeAttributes: {
        columns: {
          createdAt: false,
          updatedAt: false,
        },
      },
    },
  }) as unknown as {
    id: string;
    name: string;
    typeAttributes?: {
      id: string;
      itemTypeId?: string;
      displayOrder: number;
      dataType: TypeAttributeDataType;
      textDefaultValue?: string;
      numericDefaultValue?: number;
      title: string;
    }[];
  };
}
