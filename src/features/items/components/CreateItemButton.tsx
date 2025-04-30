import CreateFormButton from "@/components/form/CreateFormButton";
import React from "react";
import ItemForm from "./ItemForm";

export default function CreateItemButton() {
  return (
    <React.Fragment>
      <CreateFormButton
        title="Creating Item"
        buttonLabel="New Item"
        className="min-w-[50vh]"
      >
        <ItemForm />
      </CreateFormButton>
    </React.Fragment>
  );
}
