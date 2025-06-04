"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export function MultiSelect<Option>({
  options,
  getValue,
  getLabel,
  selectedValues,
  onSelectedValuesChange,
  selectPlaceholder,
  searchPlaceholder,
  noSearchResultsMessage = "No Results",
  buttonClassName,
  onBlur,
}: {
  options: Option[];
  getValue: (option: Option) => string;
  getLabel: (option: Option) => React.ReactNode;
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  noSearchResultsMessage?: string;
  buttonClassName?: string;
  onBlur?: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  function handleOpenChange(open: boolean) {
    setOpen(open);

    if (!open) onBlur?.();
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between h-auto py-1.5 px-2 min-h-9 hover:cursor-pointer",
            buttonClassName
          )}
        >
          <div className="flex gap-1 flex-wrap">
            <span>{selectPlaceholder}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{noSearchResultsMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={getValue(option)}
                  value={getValue(option)}
                  onSelect={(currentValue) => {
                    if (selectedValues.includes(currentValue)) {
                      onSelectedValuesChange(
                        selectedValues.filter((value) => value !== currentValue)
                      );
                    } else {
                      return onSelectedValuesChange([
                        ...selectedValues,
                        currentValue,
                      ]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(getValue(option))
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {getLabel(option)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
