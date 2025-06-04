"use client";

import GenericForm, {
  FormColorField,
  FormTextareaField,
  GenericFormField,
} from "@/components/form/GenericForm";
import { FormLabel } from "@/components/ui/form";
import { showPromiseToast } from "@/util/Toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { createTag, updateTag } from "../actions/tag";
import { createTagSchema, CreateTagType } from "../schema/tag";
import Tag from "./Tag";

export default function TagForm({
  tag,
}: {
  tag?: CreateTagType & { id: string };
}) {
  const form = useForm<CreateTagType>({
    resolver: zodResolver(createTagSchema),
    defaultValues: tag ?? {
      name: "",
      description: "",
      color: "#00AAFF",
    },
  });

  const control = form.control;

  const watchedTag = useWatch({ control });

  async function onSubmit(values: CreateTagType) {
    const action = tag ? updateTag.bind(null, tag.id) : createTag;

    const promise = () => action(values);

    showPromiseToast(promise, "Attempting to create tag", form.reset);
  }

  return (
    <GenericForm form={form} onSubmit={onSubmit}>
      <div>
        <FormLabel className="mb-2">Preview</FormLabel>
        <Tag tag={watchedTag} />
      </div>
      <GenericFormField form={form} path="name" label="Name" />
      <FormTextareaField form={form} path="description" label="Description" />
      <FormColorField form={form} path="color" label="Color" />
    </GenericForm>
  );
}
