"use client";

import { useEffect, useState } from "react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { Input } from "./ui/input";

export default function DebouncedColorPicker<T extends FieldValues>({
  onColorChange,
  field,
}: {
  onColorChange: (color: string) => void;
  field?: ControllerRenderProps<T, Path<T>>;
}) {
  const [color, setColor] = useState("#FFFFFF");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onColorChange(color);
    }, 500);

    return () => clearTimeout(timeout);
  }, [color, onColorChange]);

  return (
    <Input
      {...field}
      type="color"
      value={color}
      onChange={(e) => setColor(e.target.value)}
    />
  );
}
