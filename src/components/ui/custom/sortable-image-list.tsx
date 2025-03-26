import { SortableItem, SortableList } from "@/components/SortableList";
import { Trash2Icon } from "lucide-react";
import { Button } from "../button";

export function SortableImageList({
  images,
  handleOrderChange,
  handleClick,
}: {
  images: { id: string; fileName: string }[];
  handleOrderChange: (newOrder: string[]) => void;
  handleClick: (imageId: string) => void;
}) {
  return (
    <SortableList items={images} onOrderChange={handleOrderChange}>
      {(items) =>
        items.map((item) => (
          <SortableItem
            key={item.id}
            id={item.id}
            className="flex items-center"
          >
            <div className="contents">{item.fileName}</div>
            <Button
              variant="destructiveOutline"
              size="sm"
              onClick={() => handleClick(item.id)}
              className="ms-auto hover:cursor-pointer"
            >
              <Trash2Icon />
              <span className="sr-only">Delete</span>
            </Button>
          </SortableItem>
        ))
      }
    </SortableList>
  );
}
