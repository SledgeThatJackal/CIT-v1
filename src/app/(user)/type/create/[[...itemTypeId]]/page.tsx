import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/drizzle/db";
import { TypeAttributeDataType } from "@/drizzle/schema";
import TypeForm from "@/features/types/components/TypeForm";
import { getTypeIdTag } from "@/features/types/db/cache/type";
import { Metadata } from "next";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { Suspense } from "react";

type MetadataProps = {
  params: Promise<{ itemTypeId?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { itemTypeId } = await params;
  const type = await getType(itemTypeId?.[0]);

  const title =
    type !== undefined ? `Updating ${type.name}` : "Creating New Type";

  return {
    title,
  };
}

type Props = {
  params: Promise<{ itemTypeId?: string }>;
};

export default function TypeCreate(props: Props) {
  return (
    <div className="container mx-auto py-10">
      <PageHeader title="Type Creation">
        <Button variant="destructiveOutline" asChild>
          <Link href="/type">Cancel</Link>
        </Button>
      </PageHeader>
      <div className="relative overflow-hidden">
        <Suspense fallback={<TypeFormFallback />}>
          <SuspendedPage {...props} />
        </Suspense>
      </div>
    </div>
  );
}

async function SuspendedPage({ params }: Props) {
  const { itemTypeId } = await params;
  const type = await getType(itemTypeId?.[0]);

  return <TypeForm type={type} />;
}

function TypeFormFallback() {
  return (
    <div className="flex flex-col space-y-8">
      <div>
        <Skeleton className="h-4 mb-2 w-20" />
        <Skeleton className="h-9 w-auto" />
      </div>
      <div className="space-y-8">
        <Skeleton className="h-96 max-h-[50vh] w-auto rounded-xl" />
        <Skeleton className="ms-auto h-9 w-16" />
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
