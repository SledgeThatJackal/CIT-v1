import { RequiredIcon } from "@/components/table/RequiredIcon";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { FormField, FormItem, FormLabel, FormMessage } from "../form";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export default function FormCombobox<FormType extends FieldValues>({
  form,
  listData,
  path,
  required = false,
  label,
}: {
  form: UseFormReturn<FormType>;
  listData: { id: string; name: string; barcodeId: string }[];
  path: Path<FormType>;
  required?: boolean;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={path}
      render={({ field }) => (
        <FormItem className="">
          <FormLabel>
            {required && <RequiredIcon />} {label}
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="hover:cursor-pointer"
              >
                {field.value
                  ? listData.find((data) => data.id === field.value)?.name
                  : `Select ${label}`}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty>No {label} found.</CommandEmpty>
                  <CommandGroup>
                    {listData?.map((data) => (
                      <CommandItem
                        key={`combobox-${data.id}`}
                        value={data.name}
                        onSelect={() => {
                          form.setValue(path, data.id, {
                            shouldValidate: true,
                          });
                        }}
                      >
                        {data.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            data.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
