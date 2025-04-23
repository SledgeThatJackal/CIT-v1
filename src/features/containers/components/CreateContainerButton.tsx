"use client";

import CreateFormButton from "@/components/form/CreateFormButton";
import React from "react";
import { ContainerType } from "../schema/containers";
import ContainerForm from "./ContainerForm";

export default function CreateContainerButton({
  parentContainers,
}: {
  parentContainers: ContainerType[];
}) {
  return (
    <React.Fragment>
      <CreateFormButton title="Creating Container" buttonLabel="New Container">
        <ContainerForm parentContainers={parentContainers} />
      </CreateFormButton>
    </React.Fragment>
  );
}
