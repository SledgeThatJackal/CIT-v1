"use client";

import { RequiredIcon } from "@/components/table/RequiredIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import FormCombobox from "@/components/ui/custom/form-combobox";
import ImageSelector from "@/components/ui/custom/image-selector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showPromiseToast } from "@/util/Toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createContainer, updateContainer } from "../actions/containers";
import {
  createContainerSchema,
  CreateContainerType,
} from "../schema/containers";

export default function ContainerForm({
  parentContainers,
  container,
}: {
  parentContainers: {
    id: string;
    name: string;
    barcodeId: string;
  }[];
  container?: {
    id: string;
    name: string;
    description?: string;
    barcodeId: string;
    parentId?: string;
    isArea: boolean;
    containerImages?: string[];
  };
}) {
  const form = useForm<CreateContainerType>({
    resolver: zodResolver(createContainerSchema),
    defaultValues: container ?? {
      name: "",
      description: "",
      barcodeId: "",
      isArea: false,
      containerImages: [],
    },
  });

  async function onSubmit(values: CreateContainerType) {
    const action = container
      ? updateContainer.bind(null, container.id)
      : createContainer;

    const promise = () => action(values);

    showPromiseToast<{
      message: string;
    }>(
      promise,
      `Attempting to ${container ? "update" : "create"} container`,
      form.reset
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredIcon /> Name
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barcodeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <RequiredIcon /> Barcode ID
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormCombobox
          form={form}
          listData={parentContainers}
          path="parentId"
          label="Parent"
        />
        <FormField
          control={form.control}
          name="isArea"
          render={({ field }) => (
            <FormItem className="flex flex-col-2">
              <FormLabel>
                <RequiredIcon /> Area
              </FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="containerImages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <FormControl>
                <ImageSelector
                  selectedImages={field.value ?? []}
                  onSelectedImageChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
