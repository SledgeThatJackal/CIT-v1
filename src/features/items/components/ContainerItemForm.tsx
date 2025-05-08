"use client";

import GenericForm, { GenericFormField } from "@/components/form/GenericForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FormCombobox from "@/components/ui/custom/form-combobox";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { useContainers } from "@/features/containers/hooks/useContainers";
import { showPromiseToast } from "@/util/Toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2Icon } from "lucide-react";
import React from "react";
import {
  FieldArrayWithId,
  useFieldArray,
  UseFieldArrayRemove,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

type Name = "item" | "container";

type Info = {
  label: string;
  path: keyof z.infer<typeof containerItem>;
  title: string;
};

type ConfigType = Record<Name, Info>;

const config: ConfigType = {
  item: {
    label: "Container",
    path: "containerId",
    title: "Editing Containers",
  },
  container: {
    label: "Item",
    path: "itemId",
    title: "Editing Items",
  },
};

const containerItem = z
  .object({
    quantity: z.number(),
    itemId: z.string().uuid().optional(),
    containerId: z.string().uuid().optional(),
  })
  .refine((data) => data.itemId || data.containerId, {
    message: "Required",
    path: [],
  });

const containerItemSchema = z.object({
  containerItems: z.array(containerItem),
});

type ContainerItemType = z.infer<typeof containerItemSchema>;

export default function ContainerItemForm({
  containerItems,
  type = "item",
  id,
  saveContainerItems,
}: {
  containerItems: {
    id: string;
    quantity: number;
    itemId?: string;
    containerId?: string;
  }[];
  type?: Name;
  id: string;
  saveContainerItems: (
    id: string,
    data: {
      quantity: number;
      itemId?: string;
      containerId?: string;
    }[]
  ) => Promise<{ message: string }>;
}) {
  const containers = useContainers();

  const form = useForm<ContainerItemType>({
    resolver: zodResolver(containerItemSchema),
    defaultValues: containerItems
      ? { containerItems }
      : {
          containerItems: [
            {
              quantity: 1,
              itemId: undefined,
              containerId: undefined,
            },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray<ContainerItemType>({
    control: form.control,
    name: "containerItems",
  });

  async function onSubmit({ containerItems }: ContainerItemType) {
    const action = saveContainerItems.bind(null, id);

    showPromiseToast(() => action(containerItems), "Attempting to save");
  }

  function addContainer() {
    append({ quantity: 1, itemId: undefined, containerId: undefined });
  }

  const info = config[type];

  return (
    <GenericForm form={form} onSubmit={onSubmit}>
      <React.Fragment>
        <div className="flex">
          <h1 className="text-lg font-bold self-center">{info.title}</h1>
          <Button
            className="ms-auto hover:cursor-pointer"
            type="button"
            onClick={addContainer}
            variant="outline"
          >
            New Container
          </Button>
        </div>
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <ContainerItemRow
              key={field.id}
              form={form}
              field={field}
              containers={containers}
              index={index}
              info={info}
              remove={remove}
            />
          ))
        ) : (
          <div className="text-center">No associated containers</div>
        )}
      </React.Fragment>
    </GenericForm>
  );
}

function ContainerItemRow({
  form,
  containers,
  index,
  info,
  remove,
}: {
  form: UseFormReturn<ContainerItemType>;
  field: FieldArrayWithId<ContainerItemType, "containerItems", "id">;
  containers: {
    id: string;
    name: string;
    barcodeId: string;
  }[];
  index: number;
  info: Info;
  remove: UseFieldArrayRemove;
}) {
  function handleClick() {
    remove(index);
  }

  return (
    <Card>
      <CardContent className="grid grid-cols-[1fr_1fr_3rem] gap-2">
        <FormCombobox
          form={form}
          listData={containers}
          path={`containerItems.${index}.${info.path}`}
          label={info.label}
          required={true}
        />
        <GenericFormField
          form={form}
          path={`containerItems.${index}.quantity`}
          label="Quantity"
          type="number"
        />
        <FormItem>
          <FormLabel>Remove</FormLabel>
          <FormControl>
            <Button
              variant="destructiveOutline"
              size="sm"
              className="hover:cursor-pointer"
              onClick={handleClick}
            >
              <Trash2Icon />
              <span className="sr-only">Delete</span>
            </Button>
          </FormControl>
        </FormItem>
      </CardContent>
    </Card>
  );
}
