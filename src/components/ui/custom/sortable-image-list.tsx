import { SortableItem, SortableList } from "@/components/SortableList";
import TrashButton from "./trash-button";

type DeleteProps = {
  handleClick: (imageId: string) => void;
};

export function SortableImageList({
  images,
  deleteProps,
  handleOrderChange,
}: {
  images: { id: string; fileName: string }[];
  handleOrderChange: (newOrder: string[]) => void;
  deleteProps?: DeleteProps;
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
            {deleteProps && (
              <TrashButton onClick={() => deleteProps.handleClick(item.id)} />
            )}
          </SortableItem>
        ))
      }
    </SortableList>
  );
}
