"use client";

import GenericForm, {
  FormSelectField,
  GenericFormField,
} from "@/components/form/GenericForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TrashButton from "@/components/ui/custom/trash-button";
import {
  TypeAttributeDataType,
  typeAttributeDataTypes,
} from "@/drizzle/schema";
import { showPromiseToast } from "@/util/Toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import {
  FieldArrayWithId,
  Path,
  useFieldArray,
  UseFieldArrayRemove,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
  useWatch,
} from "react-hook-form";
import { createType, updateType } from "../actions/type";
import { formTypeSchema, FormTypeType } from "../schema/type";

export default function TypeForm({
  type,
}: {
  type?: {
    id: string;
    name: string;
    typeAttributes?: {
      id: string;
      itemTypeId?: string;
      displayOrder: number;
      dataType: TypeAttributeDataType;
      textDefaultValue?: string;
      numericDefaultValue?: number;
      title: string;
    }[];
  };
}) {
  const form = useForm<FormTypeType>({
    resolver: zodResolver(formTypeSchema),
    defaultValues: type ?? {
      name: "",
      typeAttributes: [],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "typeAttributes",
  });

  async function onSubmit(values: FormTypeType) {
    const action = type ? updateType.bind(null, type.id) : createType;

    const promise = () => action(values);

    showPromiseToast(
      promise,
      `Attempting to ${type ? "update" : "create"} type`,
      form.reset
    );
  }

  return (
    <GenericForm form={form} onSubmit={onSubmit}>
      <GenericFormField form={form} path="name" label="Name" />
      <TypeAttributeSection form={form} fieldArray={fieldArray} />
    </GenericForm>
  );
}

function TypeAttributeSection({
  form,
  fieldArray: { fields, append, remove },
}: {
  form: UseFormReturn<FormTypeType>;
  fieldArray: UseFieldArrayReturn<FormTypeType, "typeAttributes", "id">;
}) {
  function addTypeAttribute() {
    append({
      title: "",
      displayOrder: fields.length + 1,
      dataType: "string",
      textDefaultValue: "",
      numericDefaultValue: 0,
    });
  }

  return (
    <Card className="overflow-y-auto max-h-[50vh] pt-0">
      <CardHeader
        className="sticky top-0 z-10 bg-card pt-6 border-b"
        hasDescription={false}
      >
        <CardTitle className="flex items-center justify-between">
          <span>Type Attributes</span>
          <Button
            className="ms-auto bg-green-500"
            size="sm"
            onClick={addTypeAttribute}
          >
            <PlusIcon />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 flex-col">
        {fields.map((field, index) => (
          <TypeAttributeCard
            key={field.id}
            index={index}
            field={field}
            remove={remove}
            form={form}
          />
        ))}
      </CardContent>
    </Card>
  );
}

const dataTypeFieldMap = {
  string: {
    path: "textDefaultValue",
    label: "Default Value",
    type: "text",
  },
  number: {
    path: "numericDefaultValue",
    label: "Default Value",
    type: "number",
  },
  boolean: {
    path: "numericDefaultValue",
    label: "Default Value",
    type: "checkbox",
  },
  list: {
    path: "",
    label: "",
    type: "",
  },
};

function TypeAttributeCard({
  index,
  field,
  remove,
  form,
}: {
  index: number;
  field: FieldArrayWithId<FormTypeType, "typeAttributes", "id">;
  remove: UseFieldArrayRemove;
  form: UseFormReturn<FormTypeType>;
}) {
  const dataTypeWatch = useWatch({
    control: form.control,
    name: `typeAttributes.${index}.dataType`,
  });

  const config = dataTypeFieldMap[dataTypeWatch];

  return (
    <Card className="bg-table-header">
      <CardHeader>
        <CardTitle className="flex">
          {field.title || `Type Attribute ${index + 1}`}
          <TrashButton className="ms-auto" onClick={() => remove(index)} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <GenericFormField
          form={form}
          path={`typeAttributes.${index}.title`}
          label="Title"
          hasMultipleColumns
        />
        <GenericFormField
          form={form}
          path={`typeAttributes.${index}.displayOrder`}
          label="Display Order"
          type="number"
          hasMultipleColumns
        />
        <FormSelectField
          form={form}
          path={`typeAttributes.${index}.dataType`}
          label="Data Type"
          // Until lists are implemented, I am doing this so you cannot pick it.
          options={typeAttributeDataTypes.filter(
            (dataType) => dataType !== "list"
          )}
          hasMultipleColumns
        />
        {config && (
          <GenericFormField
            key={`${config.path}-${config.type}`}
            form={form}
            path={
              `typeAttributes.${index}.${config.path}` as Path<FormTypeType>
            }
            label={config.label}
            type={config.type === "checkbox" ? "binaryCheckbox" : config.type}
            hasMultipleColumns
          />
        )}
      </CardContent>
    </Card>
  );
}
