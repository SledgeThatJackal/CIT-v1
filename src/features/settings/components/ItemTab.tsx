"use client";

import React from "react";
import { useItemSettings } from "../hooks/useItemSettings";
import { useSettings } from "../hooks/useSettings";
import { PageHeader } from "@/components/PageHeader";
import SettingsForm from "./SettingsForm";

export default function ItemTab() {
  const keys = ["itemDelimiter"];
  const settings = useSettings();

  const itemSettings = useItemSettings(settings, keys);
  const labels: string[] = ["Delimiter for item duplication"];

  return (
    <React.Fragment>
      <PageHeader title="Item" textSize="xl" separator />
      <SettingsForm settings={itemSettings} labels={labels} />
    </React.Fragment>
  );
}
