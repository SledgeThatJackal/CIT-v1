"use client";

import { RequiredIcon } from "@/components/table/RequiredIcon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { createContainer } from "../actions/containers";
import {
  createContainerSchema,
  CreateContainerType,
} from "../schema/containers";

export default function ContainerForm({
  container,
}: {
  container?: {
    id: string;
    name: string;
    description?: string;
    barcodeId: string;
    parentId?: string;
    isArea: boolean;
  };
}) {
  const form = useForm<CreateContainerType>({
    resolver: zodResolver(createContainerSchema),
    defaultValues: container ?? {
      name: "",
      description: "",
      barcodeId: "",
      isArea: false,
    },
  });

  async function onSubmit(values: CreateContainerType) {
    const promise = () => createContainer(values);

    showPromiseToast<{
      message: string;
    }>(promise, "Attempting to create container", form.reset);
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
        <FormField
          control={form.control}
          name="parent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent</FormLabel>
              <FormControl>{/* <Input {...field} /> */}</FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isArea"
          render={({ field }) => (
            <FormItem>
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
        <div className="self-end">
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            onClick={() => console.log(form.getValues())}
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
