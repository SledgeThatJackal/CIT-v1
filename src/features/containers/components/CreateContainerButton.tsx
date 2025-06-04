"use client";

import CreateFormButton from "@/components/form/CreateFormButton";
import React from "react";
import ContainerForm from "./ContainerForm";

export default function CreateContainerButton() {
  return (
    <div>
      <CreateFormButton
        title="Creating Container"
        buttonLabel="New Container"
        className="min-w-[50vh]"
      >
        <ContainerForm />
      </CreateFormButton>
    </div>
  );
}
