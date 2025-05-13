"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef } from "react";

export default function BulkUploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleSubmit(e: any) {
    if (e.target.files == null) return;

    const data = new FormData();

    data.append("file", e.target.files[0]);
  }

  return (
    <div>
      <Button
        onClick={() => inputRef.current?.click()}
        variant="outline"
        title="Upload Zip File"
        className="hover:cursor-pointer"
      >
        <Upload />
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        className="hidden"
        onChange={handleSubmit}
      />
    </div>
  );
}
