"use client";

import ImageDialog from "@/features/images/components/ImageDialog";
import { ImageJoinType } from "@/features/images/schema/images";
import { CellContext } from "@tanstack/react-table";
import { ChevronDown, PlusIcon } from "lucide-react";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { DialogTrigger } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";

export default function ImageCell<
  T extends { id: string },
  S extends ImageJoinType
>({
  getValue,
  row: {
    original: { id },
  },
  table,
}: CellContext<T, S[]>) {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState<S[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setImages(getValue().sort((a, b) => a.imageOrder - b.imageOrder));
  }, [getValue]);

  return (
    <div className="flex justify-center">
      {images.length > 0 ? (
        <fieldset className="flex items-center border rounded-r-lg max-w-fit">
          <HoverCard>
            <HoverCardTrigger className="h-full flex justify-center items-center max-w-fit">
              <Image
                key={images[index]!.id}
                src={`/api/uploads/images/${images[index]!.image.fileName}`}
                alt={images[index]!.image.fileName}
                width="100"
                height="100"
                className="w-10 h-10"
                onClick={() => setIndex((prev) => (prev + 1) % images.length)}
              />
            </HoverCardTrigger>
            <HoverCardContent className="flex justify-center">
              <Image
                key={images[index]!.id}
                src={`/api/uploads/images/${images[index]!.image.fileName}`}
                alt={images[index]!.image.fileName}
                width="200"
                height="200"
              />
              <Badge className="text-[0.5rem] absolute bottom-[0.5rem] whitespace-nowrap">
                {index + 1} / {images.length}
              </Badge>
            </HoverCardContent>
          </HoverCard>
          <ImageDropdownMenu>
            <DropdownMenuItem onClick={() => buttonRef.current?.click()}>
              Edit
            </DropdownMenuItem>
          </ImageDropdownMenu>
        </fieldset>
      ) : (
        <Button
          variant="dashedOutline"
          className="hover:cursor-pointer w-0.5 h-6"
          onClick={() => buttonRef.current?.click()}
        >
          <PlusIcon color="green" />
        </Button>
      )}
      <ImageDialog selectedImages={images} table={table} id={id}>
        <DialogTrigger ref={buttonRef} />
      </ImageDialog>
    </div>
  );
}

function ImageDropdownMenu({ children }: { children: ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="aria-expanded:transform-[scaleY(-1)]"
        asChild
      >
        <ChevronDown size="0.8rem" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
