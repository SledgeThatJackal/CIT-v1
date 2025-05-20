"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { camelCaseToProperCase } from "@/util/formatters";
import { showPromiseToast } from "@/util/Toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { updateSettings } from "../actions/settings";
import { settingsSchema, SettingsType } from "../schema/settings";

export default function SettingsForm({
  settings,
  labels,
}: {
  settings: SettingsType[];
  labels: string[];
}) {
  if (settings.length !== labels.length)
    throw new Error("Settings should be the same size as labels");

  return (
    <React.Fragment>
      {settings.map((setting, index) => (
        <Row
          key={`settings-${setting.id}`}
          setting={setting}
          label={labels[index]!}
        />
      ))}
    </React.Fragment>
  );
}

function Row({ setting, label }: { setting: SettingsType; label: string }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      {isEditing ? (
        <CustomForm setting={setting} setIsEditing={setIsEditing} />
      ) : (
        <div className="flex items-center">
          <p className="text-center ">
            {label}: {setting.value}
          </p>
          <Button
            onClick={() => setIsEditing(true)}
            className="ms-auto hover:cursor-pointer"
            variant="outline"
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}

function CustomForm({
  setting,
  setIsEditing,
}: {
  setting: SettingsType;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<SettingsType>({
    resolver: zodResolver(settingsSchema),
    defaultValues: setting,
  });

  const { isValid, isSubmitting, isDirty } = useFormState({
    control: form.control,
  });

  async function onSubmit(value: SettingsType) {
    showPromiseToast(
      () => updateSettings(value),
      "Attempting to update setting",
      () => setIsEditing(false)
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-[1fr_1fr]"
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{camelCaseToProperCase(setting.key, " ")}</FormLabel>
              <FormControl>
                <Input {...field} type="text" maxLength={1} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="ms-auto self-end space-x-2">
          <Button
            type="submit"
            className="hover:cursor-pointer"
            variant="outline"
            disabled={isSubmitting || !isValid || !isDirty}
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={() => setIsEditing(false)}
            className="hover:cursor-pointer"
            variant="destructiveOutline"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
