import CreateFormButton from "@/components/form/CreateFormButton";
import React from "react";
import TagForm from "./TagForm";

export default function CreateTagButton() {
  return (
    <CreateFormButton title="Creating Tag" buttonLabel="New Tag">
      <TagForm />
    </CreateFormButton>
  );
}
