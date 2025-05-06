"use client";

import GenericForm, { GenericFormField } from "@/components/form/GenericForm";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type Name = "item" | "container";

type Info = {
  label: string;
  path: keyof z.infer<typeof containerItem>;
};

type ConfigType = Record<Name, Info>;

const config: ConfigType = {
  item: {
    label: "Container",
    path: "containerId",
  },
  container: {
    label: "Item",
    path: "itemId",
  },
};

export default function ContainerItemForm({
  containerItems,
  type = "item",
}: {
  containerItems: {
    id: string;
    quantity: number;
    itemId?: string;
    containerId?: string;
  }[];
  type?: Name;
}) {
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

  const { fields } = useFieldArray<ContainerItemType>({
    control: form.control,
    name: "containerItems",
  });

  function onSubmit(values: ContainerItemType) {
    return new Promise<void>((_) => {});
  }

  const info = config[type];

  return (
    <GenericForm form={form} onSubmit={onSubmit}>
      <React.Fragment>
        {fields.map((field, index) => (
          <React.Fragment key={field.id}>
            <GenericFormField
              form={form}
              path={`containerItems.${index}.${info.path}`}
              label={info.label}
            />
            <GenericFormField
              form={form}
              path={`containerItems.${index}.quantity`}
              label="Quantity"
            />
          </React.Fragment>
        ))}
      </React.Fragment>
    </GenericForm>
  );
}

const containerItem = z.object({
  quantity: z.number(),
  itemId: z.string().uuid().optional(),
  containerId: z.string().uuid().optional(),
});

const containerItemSchema = z.object({
  containerItems: z.array(containerItem),
});

type ContainerItemType = z.infer<typeof containerItemSchema>;

function fetchContainers() {}
