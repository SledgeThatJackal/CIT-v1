"use client";

import TemplateCell from "@/components/renderers/TemplateCell";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Tag from "@/features/tags/components/Tag";
import { SimpleTagType } from "@/features/tags/schema/tag";
import { CellContext } from "@tanstack/react-table";
import { ItemType } from "../../schema/item";
import { MultiSelect } from "@/components/ui/custom/multi-select";
import { useTags } from "@/features/tags/hooks/useTags";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { updateItemTags } from "../../actions/item";
import { showPromiseToast } from "@/util/Toasts";

export default function TagCell({
  getValue,
  row,
}: CellContext<ItemType, SimpleTagType[]>) {
  const tags = getValue();

  return (
    <TemplateCell>
      <ReadView tags={tags} itemId={row.original.id} />
      <WriteView defaultTags={tags} itemId={row.original.id} />
    </TemplateCell>
  );
}

function ReadView({
  itemId,
  tags,
  toggleWriting,
}: {
  itemId: string;
  tags: SimpleTagType[];
  toggleWriting?: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={cn(tags.length === 0 && "w-full")}>
          <div
            onDoubleClick={toggleWriting}
            className={cn(tags.length > 0 ? "flex space-x-1" : "w-full h-5")}
          >
            {tags
              .sort((a, b) => b.name.localeCompare(a.name))
              .map((tag) => (
                <Tag key={`tagCell-${itemId}-${tag.id}`} tag={tag} />
              ))}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Double click to edit</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function WriteView({
  itemId,
  defaultTags,
  toggleReading,
}: {
  itemId: string;
  defaultTags: SimpleTagType[];
  toggleReading?: () => void;
}) {
  const tagOptions = useTags();
  const [tags, setTags] = useState(defaultTags.map((tag) => tag.id));

  function handleBlur() {
    const action = updateItemTags.bind(null, itemId);

    showPromiseToast(
      () => action(tags),
      "Attempting to update tags",
      toggleReading
    );
  }

  return (
    <MultiSelect
      selectPlaceholder="Add Tags"
      searchPlaceholder="Search Tags"
      options={tagOptions}
      getLabel={(tag) => tag.name}
      getValue={(tag) => tag.id}
      selectedValues={tags}
      onSelectedValuesChange={setTags}
      onBlur={handleBlur}
    />
  );
}
