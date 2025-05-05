import {
  ContainerItemSection,
  LinkSection,
  SimpleDataSection,
} from "@/components/detail/DetailSections";
import DetailTabContent from "@/components/detail/DetailTabConent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DetailField, DetailRowData } from "@/components/ui/custom/detail-area";
import { TypeAttributeDataType } from "@/drizzle/schema";
import Tag from "@/features/tags/components/Tag";
import Link from "next/link";
import React from "react";

export type ItemType = {
  id: string;
  name: string;
  description?: string;
  externalUrl?: string;
  createdAt: string;
  updatedAt: string;
  tags?: {
    id: string;
    name: string;
    description?: string;
    color: string;
  }[];
  itemType?: {
    id: string;
    name: string;
  };
  itemAttributes?: {
    id: string;
    typeAttributeId: string;
    textValue?: string;
    numericValue?: number;
    typeAttribute: {
      title: string;
      dataType: TypeAttributeDataType;
      displayOrder: number;
    };
  }[];
  containerItems?: {
    id: string;
    containerId: string;
    quantity: number;
    container: {
      name: string;
      barcodeId: string;
    };
  }[];
  itemImages?: {
    id: string;
    image: {
      id: string;
      fileName: string;
    };
    imageOrder: number;
  }[];
};

const fields: DetailField<ItemType>[] = [
  {
    path: "name",
    component: SimpleDataSection,
  },
  {
    path: "description",
    component: SimpleDataSection,
  },
  {
    path: "externalUrl",
    component: LinkSection,
  },
  {
    path: "tags",
    component: TagSection,
  },
  {
    path: "itemAttributes",
    component: ItemAttributeSection,
  },
  {
    path: "containerItems",
    component: ItemContainerItemSection,
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

export default function ItemDetailTab({ item }: { item: ItemType }) {
  return (
    <DetailTabContent data={item} fields={fields} images={item.itemImages} />
  );
}

function TagSection({ getValue }: DetailRowData<ItemType, ItemType["tags"]>) {
  const tags = getValue();

  if (tags == null) return <div>No tags associated with this item</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        {tags.map((tag) => (
          <Tag key={`tag-${tag.id}`} tag={tag} />
        ))}
      </CardContent>
    </Card>
  );
}

function ItemAttributeSection({
  getValue,
  data,
}: DetailRowData<ItemType, ItemType["itemAttributes"]>) {
  const itemAttributes = getValue();

  if (itemAttributes == null)
    return <div>No Type associated with this item</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Type: {data.itemType?.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="underline font-bold">
          Attributes
        </CardDescription>
        {itemAttributes.map((itemAttribute) => (
          <div key={`itemAttribute-${itemAttribute.id}`}>
            {itemAttribute.typeAttribute.title}: {itemAttribute.numericValue}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ItemContainerItemSection(
  props: DetailRowData<
    ItemType,
    {
      id: string;
      containerId: string;
      quantity: number;
      container: {
        name: string;
        barcodeId: string;
      };
    }[]
  >
) {
  const containerItems = props.getValue();

  return (
    <ContainerItemSection {...props} title="Containers">
      <React.Fragment>
        {containerItems.map((containerItem) => (
          <Card key={`container-${containerItem.id}`}>
            <CardContent>
              <div>
                Name:{" "}
                <Link
                  href={`/container/detail/${containerItem.containerId}`}
                  className="underline text-blue-500"
                >
                  {containerItem.container.name}
                </Link>{" "}
                ({containerItem.container.barcodeId})
              </div>
              <div>Amount in container: {containerItem.quantity}</div>
            </CardContent>
          </Card>
        ))}
      </React.Fragment>
    </ContainerItemSection>
  );
}
