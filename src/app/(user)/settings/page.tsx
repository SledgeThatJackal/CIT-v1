import { PageHeader } from "@/components/PageHeader";
import {
  VerticalTab,
  VerticalTabContent,
  VerticalTabList,
  VerticalTabTrigger,
} from "@/components/ui/custom/vertical-tab";
import { ContainerTab } from "@/features/settings/components/ContainerTab";
import ItemTab from "@/features/settings/components/ItemTab";
import { TagTab } from "@/features/settings/components/TagTab";
import { TypeTab } from "@/features/settings/components/TypeTab";
import React from "react";

export default async function Settings() {
  return (
    <div className="container mx-auto py-10">
      <PageHeader title="Settings"></PageHeader>
      <VerticalTab>
        <VerticalTabList>
          <VerticalTabTrigger value="container">Container</VerticalTabTrigger>
          <VerticalTabTrigger value="item">Item</VerticalTabTrigger>
          <VerticalTabTrigger value="tag">Tag</VerticalTabTrigger>
          <VerticalTabTrigger value="type">Type</VerticalTabTrigger>
        </VerticalTabList>
        <VerticalTabContent value="container">
          <ContainerTab />
        </VerticalTabContent>
        <VerticalTabContent value="item">
          <ItemTab />
        </VerticalTabContent>
        <VerticalTabContent value="tag">
          <TagTab />
        </VerticalTabContent>
        <VerticalTabContent value="type">
          <TypeTab />
        </VerticalTabContent>
      </VerticalTab>
    </div>
  );
}
