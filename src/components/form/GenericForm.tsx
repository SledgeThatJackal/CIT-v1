"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { RequiredIcon } from "../table/RequiredIcon";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { HTMLInputTypeAttribute, ReactNode } from "react";
import DebouncedColorPicker from "../DebouncedColorPicker";

export default function GenericForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
}: {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => Promise<void>;
  children: ReactNode;
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {children}
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function GenericFormField<T extends FieldValues>({
  form,
  path,
  label,
  type = "text",
}: {
  form: UseFormReturn<T>;
  path: Path<T>;
  label: string;
  type?: HTMLInputTypeAttribute;
}) {
  return (
    <FormField
      control={form.control}
      name={path}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            <RequiredIcon /> {label}
          </FormLabel>
          <FormControl>
            <Input {...field} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function FormTextareaField<T extends FieldValues>({
  form,
  path,
  label,
}: {
  form: UseFormReturn<T>;
  path: Path<T>;
  label: string;
}) {
  return (
    <FormField
      control={form.control}
      name={path}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea className="min-h-20 resize-none" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function FormColorField<T extends FieldValues>({
  form,
  path,
  label,
}: {
  form: UseFormReturn<T>;
  path: Path<T>;
  label: string;
}) {
  return (
    <FormField
      control={form.control}
      name={path}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <DebouncedColorPicker
              onColorChange={field.onChange}
              field={field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
