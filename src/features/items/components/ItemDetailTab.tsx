import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import DetailArea, {
  DetailField,
  DetailRowData,
} from "@/components/ui/custom/detail-area";
import { TypeAttributeDataType } from "@/drizzle/schema";
import Tag from "@/features/tags/components/Tag";
import { camelCaseToProperCase } from "@/util/formatters";
import Image from "next/image";
import Link from "next/link";

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
    component: ContainerItemSection,
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
    <Card>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <DetailArea data={item} fields={fields} />
        </div>
        <ImageCarousel item={item} />
      </CardContent>
    </Card>
  );
}

function ImageCarousel({ item: { itemImages } }: { item: ItemType }) {
  if (!itemImages || itemImages.length === 0)
    return <div>No Images to display</div>;

  return (
    <div className="flex justify-center">
      <Carousel className="w-[70%] flex items-center">
        <CarouselContent>
          {itemImages.map((itemImage, index) => (
            <CarouselItem key={`image-${itemImage.id}`}>
              <div className="relative">
                <Image
                  src={`/api/uploads/images/${itemImage.image.fileName}`}
                  alt={itemImage.image.fileName}
                  height={500}
                  width={500}
                  priority
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Badge className="absolute left-1/2 bottom-1 transform -translate-x-1/2 whitespace-nowrap select-none">
                  {index + 1} / {itemImages.length}
                </Badge>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="cursor-pointer" />
        <CarouselNext className="cursor-pointer" />
      </Carousel>
    </div>
  );
}

function SimpleDataSection({
  getValue,
  row: { id },
}: DetailRowData<ItemType, string>) {
  const value = getValue();

  return (
    <Card>
      <CardContent>
        {camelCaseToProperCase(id)}:{" "}
        {value.length > 0 ? <span>{value}</span> : <span>N/A</span>}
      </CardContent>
    </Card>
  );
}

function LinkSection({
  getValue,
  row: { id },
}: DetailRowData<ItemType, string>) {
  function getHyperLink() {
    try {
      const link = new URL(getValue());

      return <Link href={link}>Link</Link>;
    } catch {
      return <div>N/A</div>;
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-row gap-1">
        {camelCaseToProperCase(id)}: {getHyperLink()}
      </CardContent>
    </Card>
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

function ContainerItemSection({
  getValue,
}: DetailRowData<ItemType, ItemType["containerItems"]>) {
  const containerItems = getValue();

  if (containerItems == null)
    return <div>No Type associated with this item</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex ">
          <span>Containers</span>
          <span className="ms-auto">
            Total Quantity:{" "}
            {containerItems.reduce((acc, value) => acc + value.quantity, 0)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
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
      </CardContent>
    </Card>
  );
}
