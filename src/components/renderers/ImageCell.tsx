"use client";

import { ImageJoinType } from "@/features/images/schema/images";
import { CellContext } from "@tanstack/react-table";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

type ImageCellData = ImageJoinType;

export default function ImageCell<T, S extends ImageCellData>(
  context: CellContext<T, S[]>
) {
  const [index, setIndex] = useState(0);
  const images = useRef(
    context.getValue().sort((a, b) => a.imageOrder - b.imageOrder)
  );

  if (!images.current || images.current.length < 1) return;

  return (
    <div className="flex justify-center">
      <HoverCard>
        <HoverCardTrigger>
          <Image
            key={images.current[index]?.id}
            src={`/api/uploads/images/${images.current[index]?.image.fileName}`}
            alt="Image"
            width="100"
            height="100"
            className="w-8 h-8"
            onClick={() =>
              setIndex((prev) => (prev + 1) % images.current.length)
            }
          />
        </HoverCardTrigger>
        <HoverCardContent className="flex justify-center">
          <Image
            key={images.current[index]?.id}
            src={`/api/uploads/images/${images.current[index]?.image.fileName}`}
            alt="Image"
            width="200"
            height="200"
            onClick={() =>
              setIndex((prev) => (prev + 1) % images.current.length)
            }
          />
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
