"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import React, { useState } from "react";
import ContainerForm from "./ContainerForm";
import { ContainerType } from "../schema/containers";

export default function CreateContainerButton({
  parentContainers,
}: {
  parentContainers: ContainerType[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="bg-green-600 rounded mt-2 hover:bg-green-700">
          <PlusIcon />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Creating Container</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            <ContainerForm parentContainers={parentContainers} />
          </div>
        </DialogContent>
        <DialogDescription />
      </Dialog>
    </React.Fragment>
  );
}
