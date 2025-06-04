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
import { cn } from "@/lib/utils";
import { changeToProperCase } from "@/util/formatters";
import { XIcon } from "lucide-react";
import React, { HTMLInputTypeAttribute, ReactNode, useState } from "react";
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
  className,
  children,
  isDuplication = false,
}: {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => Promise<void>;
  className?: string;
  children: ReactNode;
  isDuplication?: boolean;
}) {
  const { isValid, isSubmitting, isDirty } = useFormState({
    control: form.control,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
      >
        {children}
        <div className="self-end">
          <Button
            disabled={isSubmitting || !isValid || (!isDirty && !isDuplication)}
            variant="secondary"
            type="submit"
            className="hover:cursor-pointer"
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
  stringBased = false,
}: {
  form: UseFormReturn<T>;
  path: Path<T>;
  label: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  hasMultipleColumns?: boolean;
  stringBased?: boolean;
}) {
  function renderInput(
    field: ControllerRenderProps<T, Path<T>>,
    currentType: string
  ) {
    switch (currentType) {
      case "number":
        return stringBased ? (
          <StringBasedNumberInput field={field} />
        ) : (
          <NumberInput field={field} />
        );
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

function StringBasedNumberInput<T extends FieldValues>({
  field,
}: {
  field: ControllerRenderProps<T, Path<T>>;
}) {
  const delimiter = "|";

  function handleChange(value: string) {
    const parts = value.split(delimiter);

    if (parts.every((part) => /^-?\d*(\.\d*)?$/.test(part)))
      field.onChange(value);
  }

  function handleBlur(value: string) {
    const parts = value.split(delimiter);

    const newValue = parts
      .map((part) => (/^-?\d*(\.\d+)?$/.test(part) ? part : undefined))
      .filter((part) => part !== undefined)
      .join(delimiter);

    field.onChange(newValue);
  }

  return (
    <Input
      {...field}
      value={field.value ?? ""}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={(e) => handleBlur(e.target.value)}
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
              <SelectTrigger className="w-full hover:cursor-pointer">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <React.Fragment>
                {options.map((option) => (
                  <SelectItem
                    key={`option-${option}`}
                    value={`${option}`}
                    className="hover:cursor-pointer hover:bg-accent-alternate"
                  >
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

type ObjectType = {
  id: string;
  name: string;
};

export function FormObjectSelectField<
  T extends FieldValues,
  S extends ObjectType
>({
  form,
  path,
  label,
  options,
  required = true,
  hasMultipleColumns = false,
  displayValue,
  ref,
}: {
  form: UseFormReturn<T>;
  path: Path<T>;
  label: string;
  options: S[] | readonly S[];
  required?: boolean;
  hasMultipleColumns?: boolean;
  displayValue?: keyof S;
  ref?: React.Ref<HTMLButtonElement> | null;
}) {
  const [key, setKey] = useState(+new Date());

  function handleClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    field: ControllerRenderProps<T, Path<T>>
  ) {
    e.stopPropagation();
    field.onChange(undefined);

    setKey(+new Date());
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
          <div className="flex flex-row gap-2 items-center">
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              key={key}
            >
              <FormControl>
                <SelectTrigger className="w-full hover:cursor-pointer">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <React.Fragment>
                  {options.map((option) => (
                    <SelectItem
                      key={`option-${option.id}`}
                      value={option.id}
                      className="hover:cursor-pointer hover:bg-accent-alternate"
                      disabled={option.id === field.value}
                    >
                      {displayValue
                        ? String(option[displayValue])
                        : option.name}
                    </SelectItem>
                  ))}
                </React.Fragment>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-transparent hover:cursor-pointer"
              onClick={(e) => handleClick(e, field)}
              ref={ref}
              type="button"
            >
              <XIcon />
            </Button>
          </div>
          {hasMultipleColumns ? <FormMessageAlt /> : <FormMessage />}
        </FormItem>
      )}
    />
  );
}
