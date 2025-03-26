import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { FormField, FormItem, FormLabel } from "../form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

export default function FormCombobox<FormType extends FieldValues>({
  form,
  listData,
  path,
  label,
}: {
  form: UseFormReturn<FormType>;
  listData: { id: string; name: string; barcodeId: string }[];
  path: Path<FormType>;
  label: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={path}
      render={({ field }) => (
        <FormItem className="">
          <FormLabel>{label}</FormLabel>
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
                          form.setValue(path, data.id);
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
        </FormItem>
      )}
    />
  );
}
