import { camelCaseToProperCase } from "@/util/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DetailRowData } from "../ui/custom/detail-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Badge } from "../ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ImageJoinType } from "@/features/images/schema/images";
import { CheckIcon, XIcon } from "lucide-react";
import { ReactNode } from "react";

export function SimpleDataSection<TabData extends DetailRowData>({
  getValue,
  row: { id },
}: DetailRowData<TabData, string>) {
  const value = getValue();

  return (
    <Card>
      <CardHeader className="grid-rows-none">
        <CardTitle>
          {camelCaseToProperCase(String(id))}:{" "}
          {value.length > 0 ? <span>{value}</span> : <span>N/A</span>}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export function ImageCarousel({ images }: { images?: ImageJoinType[] }) {
  if (!images || images.length === 0)
    return (
      <div className="flex justify-center items-center">
        No Images to display
      </div>
    );

  return (
    <div className="flex justify-center">
      <Carousel className="w-[70%] flex items-center">
        <CarouselContent>
          {images.map((imageJoin, index) => (
            <CarouselItem key={`image-${imageJoin.id}`}>
              <div className="relative">
                <Image
                  src={`/api/uploads/images/${imageJoin.image.fileName}`}
                  alt={imageJoin.image.fileName}
                  height={500}
                  width={500}
                  priority
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Badge className="absolute left-1/2 bottom-1 transform -translate-x-1/2 whitespace-nowrap select-none">
                  {index + 1} / {images.length}
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

export function BooleanSection<TabData extends DetailRowData>({
  getValue,
  row: { id },
}: DetailRowData<TabData, boolean>) {
  return (
    <Card>
      <CardContent className="flex flex-row gap-1">
        {camelCaseToProperCase(String(id))}:{" "}
        {getValue() ? (
          <CheckIcon className="text-green-700" />
        ) : (
          <XIcon className="text-red-700" />
        )}
      </CardContent>
    </Card>
  );
}

export function LinkSection<TabData extends DetailRowData>({
  getValue,
  row: { id },
}: DetailRowData<TabData, string>) {
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
      <CardHeader className="grid-rows-none">
        <CardTitle className="flex flex-row gap-1">
          {camelCaseToProperCase(String(id))}: {getHyperLink()}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

type ContainerItemType = {
  id: string;
  quantity: number;
};

export function ContainerItemSection<T, S extends ContainerItemType>({
  getValue,
  title,
  children,
}: DetailRowData<T, S[]> & {
  title: string;
  children: ReactNode;
}) {
  const containerItems = getValue();

  if (containerItems == null)
    return <div>No Type associated with this item</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex ">
          <span>{title}</span>
          <span className="ms-auto">
            Total Quantity:{" "}
            {containerItems.reduce((acc, value) => acc + value.quantity, 0)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}
