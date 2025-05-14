"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { showPromiseToast } from "@/util/Toasts";
import { Ban, CircleHelp, File, FileUp, Upload } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";

import "../style/container.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BulkUploadButton() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        onClick={() => setOpen(true)} // inputRef.current?.click()
        variant="outline"
        title="Upload Zip File"
        className="hover:cursor-pointer"
      >
        <Upload />
      </Button>
      <ZipDialog open={open} setOpen={setOpen} />
    </div>
  );
}

// FUNCTIONALLY THIS WORKS...
// However, if you try to drop a file onto of the text, it won't work. :(

function ZipDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [data, setData] = useState<FormData>();
  const inputRef = useRef<HTMLInputElement>(null);
  const allowClickRef = useRef<boolean>(false);

  function handleClick(e: React.MouseEvent<HTMLInputElement>) {
    if (!allowClickRef.current) e.preventDefault();

    allowClickRef.current = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleChange(e: any) {
    if (e.target.files == null) return;

    const formData = new FormData();

    formData.append("zipFile", e.target.files[0]);

    setData(formData);
  }

  function handleFileUpload() {
    const promise = (): Promise<{ message: string }> =>
      fetch("/api/zip", {
        method: "POST",
        body: data,
      }).then((res) => res.json());

    showPromiseToast(
      promise,
      "Attempting to create containers from zip file",
      () => setOpen(false)
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            Upload Zip File
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleHelp className="text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent className="bg-accent-alternate text-white">
                  <FileStructureText />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </DialogTitle>
        </DialogHeader>
        <div
          className="h-[15rem] border border-dashed rounded-lg relative text-sm"
          onDragEnter={(e) => e.currentTarget.classList.add("drag-over")}
          onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
        >
          <div className="absolute z-10 space-y-1 text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex justify-center items-center">
              <FileUp />
            </div>
            <p className="text-center">Drag files here</p>
            <p>
              Or{" "}
              <span
                className="p-0 bg-transparent cursor-pointer underline text-blue-700"
                onClick={() => {
                  allowClickRef.current = true;
                  inputRef.current?.click();
                }}
              >
                choose your file
              </span>
            </p>
          </div>
          <input
            type="file"
            ref={inputRef}
            accept=".zip"
            className="opacity-0 w-full h-full absolute top-0 left-0"
            onChange={handleChange}
            onClick={handleClick}
            title=""
          />
        </div>
        <div className="flex gap-2">
          {data?.get("zipFile") ? (
            <>
              <File /> <p>{(data.get("zipFile") as File).name}</p>
            </>
          ) : (
            <>
              <Ban />
              <p>No file selected</p>
            </>
          )}
        </div>
        <Button
          onClick={handleFileUpload} // inputRef.current?.click()
          variant="outline"
          title="Upload Zip File"
          className="hover:cursor-pointer"
        >
          Upload
        </Button>
      </DialogContent>
      <DialogDescription />
    </Dialog>
  );
}

function FileStructureText() {
  return (
    <div className="text-lg">
      <p className="underline font-bold">Expected Directory Structure</p>
      <pre>
        {`
    MyZipFile 
    |-- barcodeId1 
    | |-- image1.jpg
    | |-- image2.png 
    |-- barcodeId2  
    |-- barcodeId3  
    | |-- image3.gif
      `}
      </pre>
    </div>
  );
}
