import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { ContainerTable, ItemTable, ItemTypeTable } from "@/drizzle/schema";
import { count, eq } from "drizzle-orm";
import Link from "next/link";
import { ReactNode } from "react";

export default async function Home() {
  const [containerInfo] = await getContainerInfo();
  const itemInfo = await getItemInfo();

  return (
    <div className="container-6 mt-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 w-3/4 justify-self-center">
        <InfoCard title="Containers">
          <p>{`${containerInfo?.totalContainers ?? 0}`} Containers</p>
        </InfoCard>
        <InfoCard title="Items">
          <p className="underline">
            {`${itemInfo.totalItems?.totalItems ?? 0}`} Item
            {itemInfo.totalItems?.totalItems !== 1 && "s"}
          </p>
          {itemInfo.groupedTypes &&
            itemInfo.groupedTypes.map((groupedType) => (
              <p key={groupedType.type}>
                {groupedType.count}
                {"- "}
                {groupedType.type ? (
                  <Link
                    href={`/item/${groupedType.type}`}
                    className="underline text-blue-600"
                  >
                    {groupedType.type}
                  </Link>
                ) : (
                  <>None</>
                )}
              </p>
            ))}
        </InfoCard>
      </div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader className="border-b-1 pb-3">
        <CardTitle className="font-bold text-2xl text-center">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

async function getContainerInfo() {
  "use cache";

  return await db
    .select({
      totalContainers: count(),
    })
    .from(ContainerTable);
}

async function getItemInfo() {
  "use cache";

  const result = await db.transaction(async (trx) => {
    const [totalItems] = await trx
      .select({ totalItems: count() })
      .from(ItemTable);

    const groupedTypes = await trx
      .select({
        type: ItemTypeTable.name,
        count: count(),
      })
      .from(ItemTable)
      .leftJoin(ItemTypeTable, eq(ItemTable.itemTypeId, ItemTypeTable.id))
      .groupBy(ItemTable.itemTypeId, ItemTypeTable.id);

    return { totalItems, groupedTypes };
  });

  return result;
}
