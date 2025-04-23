import { Badge } from "@/components/ui/badge";

import "../style/tag.css";

export default function Tag({
  tag,
}: {
  tag: {
    name?: string | undefined;
    color?: string | undefined;
    description?: string | null | undefined;
  };
}) {
  const textColor = getTextColor(tag.color ?? "00AAFF");

  return (
    <Badge
      variant="tag"
      style={
        {
          "--bg": tag.color,
          "--bg-hover": `color-mix(in srgb, ${tag.color}, ${textColor})`,
          color: textColor,
        } as React.CSSProperties
      }
      title={tag.description ?? ""}
    >
      {tag.name || "Example"}
    </Badge>
  );
}

function getTextColor(color: string) {
  const { r, g, b } = hexToRGB(color);

  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return L > 0.179 ? "black" : "white";
}

function hexToRGB(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;

  return { r, g, b };
}
