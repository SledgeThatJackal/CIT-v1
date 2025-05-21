"use client";

import { useEffect, useState } from "react";
import { Input } from "../input";
import { Label } from "../label";
import { cn } from "@/lib/utils";

export default function FloatingLabel({
  id,
  label,
  className,
  defaultValue,
  onChange,
  onKeyDown,
}: {
  id: string;
  label: string;
  className?: string;
  defaultValue?: string;
  onChange?: (key: string, value: string) => void;
  onKeyDown?: () => void;
}) {
  const [isFocused, setIsFocused] = useState(false);

  function handleBlur(value: string) {
    if (!value || value.length === 0) setIsFocused(false);
  }

  useEffect(() => {
    if (defaultValue && defaultValue.length > 0) setIsFocused(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleKeyDown(key: string) {
    if (key === "Enter") onKeyDown?.();
  }

  return (
    <div className="relative flex-1">
      <Label
        htmlFor={id}
        className={cn(
          "absolute pointer-events-none text-accent-alternate rounded-md",
          isFocused ? "top-0.5 left-2 text-[0.6em]" : "top-3.5 left-3.5"
        )}
        style={{ transition: "all 0.2s ease-in-out" }}
      >
        {label}
      </Label>
      <Input
        className={cn("rounded-none h-11", className)}
        id={id}
        onFocus={() => setIsFocused(true)}
        onChange={(e) => onChange?.(id, e.target.value)}
        onBlur={(e) => handleBlur(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e.key)}
        defaultValue={defaultValue}
      />
    </div>
  );
}
