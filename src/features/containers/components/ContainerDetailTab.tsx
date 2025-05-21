import { DetailContainerType } from "@/app/(user)/container/detail/[barcodeId]/page";
import {
  BooleanSection,
  ContainerItemSection,
  SimpleDataSection,
} from "@/components/detail/DetailSections";
import DetailTabContent from "@/components/detail/DetailTabConent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailField, DetailRowData } from "@/components/ui/custom/detail-area";
import Link from "next/link";
import React from "react";

const fields: DetailField<DetailContainerType>[] = [
  {
    path: "name",
    component: SimpleDataSection,
  },
  {
    path: "description",
    component: SimpleDataSection,
  },
  {
    path: "barcodeId",
    component: SimpleDataSection,
  },
  {
    path: "isArea",
    component: BooleanSection,
  },
  {
    path: "parent",
    component: ParentSection,
  },
  {
    path: "containerItems",
    component: ContainerContainerItemSection,
  },
  {
    path: "createdAt",
    component: SimpleDataSection,
  },
  {
    path: "updatedAt",
    component: SimpleDataSection,
  },
];

export default function ContainerDetailTab({
  container,
}: {
  container: DetailContainerType;
}) {
  return (
    <DetailTabContent
      data={container}
      fields={fields}
      images={container.containerImages}
    />
  );
}

function ParentSection({
  getValue,
}: DetailRowData<DetailContainerType, DetailContainerType["parent"]>) {
  const parent = getValue();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parent</CardTitle>
      </CardHeader>
      <CardContent>
        <Card>
          <CardContent>
            {parent ? (
              <span>
                {parent.name} ({parent.barcodeId})
              </span>
            ) : (
              <span>N/A</span>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

function ContainerContainerItemSection(
  props: DetailRowData<
    DetailContainerType,
    {
      id: string;
      itemId: string;
      quantity: number;
      item: {
        name: string;
      };
    }[]
  >
) {
  const containerItems = props.getValue();

  return (
    <ContainerItemSection {...props} title="Items">
      <React.Fragment>
        {containerItems.map((containerItem) => (
          <Card key={`container-${containerItem.id}`}>
            <CardContent>
              <div>
                Name:{" "}
                <Link
                  href={`/item/detail/${containerItem.itemId}`}
                  className="underline text-blue-500"
                >
                  {containerItem.item.name}
                </Link>
              </div>
              <div>Amount in container: {containerItem.quantity}</div>
            </CardContent>
          </Card>
        ))}
      </React.Fragment>
    </ContainerItemSection>
  );
}
