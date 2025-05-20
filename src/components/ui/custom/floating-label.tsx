"use client";

import { useState } from "react";
import { Input } from "../input";
import { Label } from "../label";
import { cn } from "@/lib/utils";

export default function FloatingLabel({
  id,
  label,
  className,
}: {
  id: string;
  label: string;
  className?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  function handleBlur() {
    setIsFocused(false);
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
        onBlur={handleBlur}
      />
    </div>
  );
}
