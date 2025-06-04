import { PageHeader } from "@/components/PageHeader";
import BaseReport from "@/features/reports/components/BaseReport";
import { getContainers } from "../item/[[...type]]/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description: "Page for generating reports",
};

export default async function Reports() {
  const containers = await getContainers();

  return (
    <div className="container mx-auto py-10">
      <PageHeader title="Reports" />
      <BaseReport containers={containers} />
    </div>
  );
}
