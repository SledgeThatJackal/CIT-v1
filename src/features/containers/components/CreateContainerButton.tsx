"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ContainerForm from "./ContainerForm";

export default function CreateContainerButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="bg-green-600 rounded mt-2 hover:bg-green-700">
          <PlusIcon />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create</DialogTitle>
          </DialogHeader>
          <div>
            <ContainerForm />
          </div>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
