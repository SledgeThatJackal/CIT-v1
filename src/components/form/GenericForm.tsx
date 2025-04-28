"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormMessageAlt,
} from "@/components/ui/form";
import { changeToProperCase } from "@/util/formatters";
import React, { HTMLInputTypeAttribute, ReactNode } from "react";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
  useFormState,
  useWatch,
} from "react-hook-form";
import DebouncedColorPicker from "../DebouncedColorPicker";
import { RequiredIcon } from "../table/RequiredIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export default function GenericForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
}: {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => Promise<void>;
  children: ReactNode;
}) {
  const { isValid, isSubmitting, isDirty } = useFormState({
    control: form.control,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        {children}
        <div className="self-end">
          <Button
            disabled={isSubmitting || !isValid || !isDirty}
            variant="secondary"
            type="submit"
          >
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
  required = true,
  hasMultipleColumns = false,
}: {
  form: UseFormReturn<T>;
  path: Path<T>;
  label: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  hasMultipleColumns?: boolean;
}) {
  function renderInput(
    field: ControllerRenderProps<T, Path<T>>,
    currentType: string
  ) {
    switch (currentType) {
      case "number":
        return <NumberInput field={field} />;
      case "binaryCheckbox":
        return <BinaryCheckbox form={form} path={path} field={field} />;
      default:
        return <Input {...field} type={currentType} />;
    }
  }

  return (
    <FormField
      control={form.control}
      name={path}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {required && <RequiredIcon />} {label}
          </FormLabel>
          <FormControl>{renderInput(field, type)}</FormControl>
          {hasMultipleColumns ? <FormMessageAlt /> : <FormMessage />}
        </FormItem>
      )}
    />
  );
}

function NumberInput<T extends FieldValues>({
  field,
}: {
  field: ControllerRenderProps<T, Path<T>>;
}) {
  return (
    <Input
      {...field}
      value={field.value ?? 0}
      onChange={(e) => field.onChange(Number(e.target.value))}
      type="number"
    />
  );
}

function BinaryCheckbox<T extends FieldValues>({
  form,
  path,
  field,
}: {
  form: UseFormReturn<T>;
  path: Path<T>;
  field: ControllerRenderProps<T, Path<T>>;
}) {
  const watchedValue = useWatch({ control: form.control, name: path });

  return (
    <Input
      {...field}
      type="checkbox"
      checked={watchedValue === 1}
      aria-checked={watchedValue === 1}
      onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
      className="w-fit"
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

export function FormSelectField<
  T extends FieldValues,
  S extends string | number
>({
  form,
  path,
  label,
  options,
  required = true,
  hasMultipleColumns = false,
}: {
  form: UseFormReturn<T>;
  path: Path<T>;
  label: string;
  options: S[] | readonly S[];
  required?: boolean;
  hasMultipleColumns?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={path}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {required && <RequiredIcon />} {label}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <React.Fragment>
                {options.map((option) => (
                  <SelectItem key={`option-${option}`} value={`${option}`}>
                    {typeof option === "string"
                      ? changeToProperCase(option)
                      : `${option}`}
                  </SelectItem>
                ))}
              </React.Fragment>
            </SelectContent>
          </Select>
          {hasMultipleColumns ? <FormMessageAlt /> : <FormMessage />}
        </FormItem>
      )}
    />
  );
}
