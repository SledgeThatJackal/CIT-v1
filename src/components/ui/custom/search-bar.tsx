"use client";

import { cn } from "@/lib/utils";
import { Button } from "../button";
import FloatingLabel from "./floating-label";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  id: string;
  label: string;
  className?: string;
};

export default function SearchBar({
  props,
  searchParams,
}: {
  props: SearchBarProps[];
  searchParams: { [key: string]: string };
}) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [filters, setFilters] = useState<Record<string, string>>(searchParams);
  const updateFilters = (key: string, value: string) => {
    if (value === undefined || value.length === 0) {
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[key];

        return newFilters;
      });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  function handleSearch() {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
      params.set(key, value);
    }

    router.replace(`?${params.toString()}`);
  }

  return (
    <fieldset className="flex flex-row mb-2">
      {props.map((prop, index) => (
        <FloatingLabel
          key={`search-${prop.id}`}
          {...prop}
          className={cn(prop.className, index === 0 && "rounded-l-lg")}
          onChange={updateFilters}
          onKeyDown={() => {
            handleSearch();
            buttonRef.current?.focus();
          }}
          defaultValue={searchParams[prop.id]}
        />
      ))}
      <Button
        className="rounded-none rounded-r-lg hover:cursor-pointer h-11"
        variant="secondary"
        onClick={handleSearch}
        ref={buttonRef}
      >
        Search
      </Button>
    </fieldset>
  );
}
