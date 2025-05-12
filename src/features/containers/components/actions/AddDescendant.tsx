"use client";

import { Row } from "@tanstack/react-table";
import React, { useEffect, useRef, useState } from "react";
import { fetchOrphanContainers } from "../../lib/container";
import { ContainerType } from "../../schema/containers";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { updateDescendants } from "../../actions/containers";
import { showPromiseToast } from "@/util/Toasts";

export default function AddDescendant({ row }: { row: Row<ContainerType> }) {
  const [orphans, setOrphans] = useState<
    { id: string; barcodeId: string; name: string }[]
  >([]);

  const selectedContainers = useRef(new Set<string>());

  useEffect(() => {
    fetchOrphanContainers(row.original.id, row.original.isArea).then(
      ({ orphanContainers }) => {
        setOrphans(orphanContainers);
      }
    );
  }, [row.original]);

  function handleClick(id: string) {
    const containers = selectedContainers.current;

    if (containers.has(id)) {
      containers.delete(id);
    } else {
      containers.add(id);
    }
  }

  function handleSave() {
    const containers = selectedContainers.current;

    if (containers.size === 0) return;

    const action = updateDescendants.bind(null, row.original.id);

    showPromiseToast(
      () => action(Array.from(containers)),
      `Attempting to add descendants`
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {orphans.map((orphan) => (
          <Label
            htmlFor={`orphan-${orphan.id}`}
            key={orphan.id}
            className="text-xs hover:cursor-pointer flex flex-row p-2 gap-2 rounded-lg bg-table-header"
          >
            <Checkbox
              id={`orphan-${orphan.id}`}
              className="hover:cursor-pointer"
              onClick={() => handleClick(orphan.id)}
            />
            {orphan.name} ({orphan.barcodeId})
          </Label>
        ))}
      </div>
      <Button
        variant="outline"
        type="submit"
        onClick={handleSave}
        className="hover:cursor-pointer ms-auto "
      >
        Save
      </Button>
    </div>
  );
}
