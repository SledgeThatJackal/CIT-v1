"use client";

import GenericForm, {
  FormObjectSelectField,
  FormTextareaField,
  GenericFormField,
} from "@/components/form/GenericForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HelpToolTip from "@/components/ui/custom/help-tooltip";
import ImageSelector from "@/components/ui/custom/image-selector";
import { MultiSelect } from "@/components/ui/custom/multi-select";
import TrashButton from "@/components/ui/custom/trash-button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormMessageAlt,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TypeAttributeDataType } from "@/drizzle/schema";
import { useContainers } from "@/features/containers/hooks/useContainers";
import Tag from "@/features/tags/components/Tag";
import { useTags } from "@/features/tags/hooks/useTags";
import { useTypes } from "@/features/types/hooks/useTypes";
import { cn } from "@/lib/utils";
import { showPromiseToast } from "@/util/Toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import React, { useEffect, useMemo, useRef } from "react";
import {
  FieldValues,
  Path,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { createItem, updateItem } from "../actions/item";
import { createItemSchema, CreateItemType } from "../schema/item";

export default function ItemForm({
  item,
  isDuplication = false,
  onSuccess,
}: {
  item?: {
    id: string;
    name: string;
    description?: string;
    externalURL?: string;
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
    }[];
    containerItems?: {
      id: string;
      containerId: string;
      quantity: number;
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
  isDuplication?: boolean;
  onSuccess?: () => void;
}) {
  const form = useForm<CreateItemType>({
    resolver: zodResolver(createItemSchema),
    defaultValues: item
      ? {
          ...item,
          itemImages:
            item.itemImages?.map((itemImage) => itemImage.image.id) ?? [],
          tags: item.tags?.map((tag) => tag.id) ?? [],
        }
      : {
          name: "",
          description: "",
          externalUrl: "",
          tags: [],
          itemTypeId: undefined,
          itemAttributes: [],
          containerItems: [],
          itemImages: [],
        },
  });

  const itemTypeRef = useRef<HTMLButtonElement | null>(null);

  const itemAttributeFieldArray = useFieldArray({
    control: form.control,
    name: "itemAttributes",
  });

  const containerItemFieldArray = useFieldArray({
    control: form.control,
    name: "containerItems",
  });

  const types = useTypes();

  async function onSubmit(values: CreateItemType) {
    const action =
      item && !isDuplication ? updateItem.bind(null, item!.id) : createItem;

    function clearForm() {
      form.reset();
      itemTypeRef.current?.click();
      onSuccess?.();
    }

    showPromiseToast<{ message: string }>(
      () => action(values),
      `Attempting to ${item ? "update" : "create"} item`,
      clearForm
    );
  }

  return (
    <GenericForm
      form={form}
      onSubmit={onSubmit}
      className="overflow-y-auto max-h-[65vh] p-4"
      isDuplication={isDuplication}
    >
      <GenericFormField form={form} path="name" label="Name" />
      <FormTextareaField form={form} path="description" label="Description" />
      <GenericFormField
        form={form}
        path="externalUrl"
        label="URL"
        required={false}
      />
      <FormField
        control={form.control}
        name="itemImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
              <ImageSelector
                selectedImages={field.value ?? []}
                onSelectedImageChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <TagSection form={form} />
      <ContainerItemSection form={form} fieldArray={containerItemFieldArray} />
      <Card>
        <CardHeader>
          <CardTitle>Type</CardTitle>
        </CardHeader>
        <CardContent>
          <FormObjectSelectField
            form={form}
            path="itemTypeId"
            label="Item Type"
            options={types}
            required={false}
            ref={itemTypeRef}
          />
          <ItemAttributeSection
            form={form}
            fieldArray={itemAttributeFieldArray}
          />
        </CardContent>
      </Card>
    </GenericForm>
  );
}

function ItemAttributeSection({
  form,
  fieldArray: { fields, append, replace },
}: {
  form: UseFormReturn<CreateItemType>;
  fieldArray: UseFieldArrayReturn<CreateItemType, "itemAttributes", "id">;
}) {
  const typeWatch = useWatch({
    control: form.control,
    name: "itemTypeId",
  });

  const prevTypeId = useRef<string>(typeWatch);

  const referenceData = useRef<
    Record<
      string,
      {
        dataType: TypeAttributeDataType;
        path: Path<CreateItemType>;
        duplicatePath: Path<CreateItemType>;
        title: string;
      }
    >
  >({});

  const types = useTypes();

  useEffect(() => {
    const attributeData = types.find(
      (type) => type.id === typeWatch
    )?.typeAttributes;

    if (attributeData == null) return;

    referenceData.current = {};

    const items = attributeData.map((attribute, index) => {
      const dataType = attribute.dataType;

      const path = dataType === "string" ? "text" : "numeric";
      referenceData.current[attribute.id] = {
        dataType,
        path: `itemAttributes.${index}.${path}Value`,
        duplicatePath: `itemAttributes.${index}.duplicate`,
        title: attribute.title,
      };

      return {
        typeAttributeId: attribute.id,
        [`${path}Value`]: attribute[`${path}DefaultValue`],
      };
    });

    if (prevTypeId.current !== typeWatch) {
      replace(items);
      prevTypeId.current = typeWatch;
    }
  }, [append, replace, typeWatch, types]);

  return (
    <Card className="mt-4 bg-accent-alternate">
      <CardHeader>
        <CardTitle className="flex gap-2 text-center items-center">
          Attributes
          <HelpToolTip>
            <div className="p-1">Bunch of text</div>
          </HelpToolTip>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[5vh]">
        {typeWatch ? (
          <React.Fragment>
            {fields.map((field) => (
              <ItemAttributeRow
                key={field.id}
                form={form}
                config={referenceData.current[field.typeAttributeId]}
              />
            ))}
          </React.Fragment>
        ) : (
          <span>Nothing to display...</span>
        )}
      </CardContent>
    </Card>
  );
}

function ItemAttributeRow({
  form,
  config,
}: {
  form: UseFormReturn<CreateItemType>;
  config?: {
    dataType: TypeAttributeDataType;
    path: Path<CreateItemType>;
    duplicatePath: Path<CreateItemType>;
    title: string;
  };
}) {
  if (!config) return;

  return (
    <div
      className={cn(
        config.dataType !== "boolean" && "grid grid-cols-[1fr_5rem]"
      )}
    >
      <GenericFormField
        form={form}
        path={config.path}
        label={config.title}
        type={
          config.dataType === "boolean" ? "binaryCheckbox" : config.dataType
        }
      />
      {config.dataType !== "boolean" && (
        <DuplicateFormField form={form} path={config.duplicatePath} />
      )}
    </div>
  );
}

function DuplicateFormField<T extends FieldValues>({
  form,
  path,
  hasMultipleColumns,
}: {
  form: UseFormReturn<T>;
  path: Path<T>;
  hasMultipleColumns?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={path}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-center inline">Duplicate</FormLabel>
          <FormControl>
            <Input {...field} type="checkbox" />
          </FormControl>
          {hasMultipleColumns ? <FormMessageAlt /> : <FormMessage />}
        </FormItem>
      )}
    />
  );
}

function ContainerItemSection({
  form,
  fieldArray: { fields, append, remove },
}: {
  form: UseFormReturn<CreateItemType>;
  fieldArray: UseFieldArrayReturn<CreateItemType, "containerItems", "id">;
}) {
  const containers = useContainers();

  function addRow() {
    append({
      containerId: "",
      quantity: 1,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center">
          <span>Containers</span>
          <PlusIcon
            className="bg-green-600 rounded-sm ms-auto hover:cursor-pointer hover:bg-green-800"
            onClick={addRow}
          />
        </CardTitle>
        <CardContent className="flex flex-col gap-2 overflow-y-auto max-h-[17vh] p-4 mt-2">
          {fields.map((field, index) => (
            <ContainerItemRow
              key={field.id}
              form={form}
              remove={() => remove(index)}
              index={index}
              containers={containers}
            />
          ))}
        </CardContent>
      </CardHeader>
    </Card>
  );
}

function ContainerItemRow({
  form,
  remove,
  index,
  containers,
}: {
  form: UseFormReturn<CreateItemType>;
  remove: () => void;
  index: number;
  containers: {
    name: string;
    id: string;
    barcodeId: string;
  }[];
}) {
  return (
    <div className="border rounded-sm p-4">
      <div className="flex flex-row p-2 items-center mb-2">
        <h1 className="font-bold">Container {index + 1}</h1>
        <TrashButton className="ms-auto" onClick={remove} />
      </div>
      <div className="space-y-4">
        <FormObjectSelectField
          form={form}
          path={`containerItems.${index}.containerId`}
          label="Container"
          options={containers}
        />
        <GenericFormField
          form={form}
          path={`containerItems.${index}.quantity`}
          label="Quantity"
          type="number"
        />
      </div>
    </div>
  );
}

function TagSection({ form }: { form: UseFormReturn<CreateItemType> }) {
  const tags = useTags();

  const tagsWatch = useWatch({
    control: form.control,
    name: "tags",
  });

  const displayTags = useMemo(() => {
    if (!tagsWatch) return [];

    return tagsWatch
      .map((tagId) => {
        const tag = tags.find((currentTag) => currentTag.id === tagId);

        return {
          id: tag?.id ?? "",
          name: tag?.name ?? "",
          description: tag?.description ?? "",
          color: tag?.color ?? "",
        };
      })
      .sort((a, b) => b.name.localeCompare(a.name));
  }, [tags, tagsWatch]);

  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tag(s)</FormLabel>
          <FormControl>
            <div>
              <MultiSelect
                options={tags}
                selectPlaceholder="Select Tags"
                searchPlaceholder="Search Tags..."
                getLabel={(t) => t.name}
                getValue={(t) => t.id}
                selectedValues={field.value || []}
                onSelectedValuesChange={field.onChange}
                buttonClassName="w-full"
              />
            </div>
          </FormControl>
          <FormDescription className="flex">
            <span className="mr-1">Selected Tags:</span>
            <span className="flex flex-row gap-2">
              {displayTags.length > 0 ? (
                <React.Fragment>
                  {displayTags.map((tag) => (
                    <Tag key={tag.id} tag={tag} />
                  ))}
                </React.Fragment>
              ) : (
                <span>No tags selected</span>
              )}
            </span>
          </FormDescription>
        </FormItem>
      )}
    />
  );
}
