import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type HasIdAndName = {
  id: string | null;
  name: string;
};

export default function ComboboxCell<TValue extends HasIdAndName>({
  value,
  displayPath,
  dataSet,
  emptyStr,
  onSelect,
  onBlur,
}: {
  value?: TValue;
  displayPath: keyof TValue;
  dataSet: TValue[];
  emptyStr: string;
  onSelect: (value: string) => void;
  onBlur: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function onOpenChange() {
    if (isOpen == true) onBlur();
    else setIsOpen(true);
  }

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox">
          {String(value?.[displayPath] ?? "None")} <ChevronsUpDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput />
          <CommandList>
            <CommandEmpty>{emptyStr}</CommandEmpty>
            <CommandGroup>
              {dataSet?.map((el) => (
                <CommandItem
                  key={`combobox-${el.id}`}
                  value={el.id}
                  onSelect={onSelect}
                >
                  {el.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      el.id === value?.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
