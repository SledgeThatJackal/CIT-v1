import { PageHeader } from "@/components/PageHeader";
import BaseReport from "@/features/reports/components/BaseReport";
import { getContainers } from "../item/[[...type]]/page";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Reports",
  description: "Page for generating reports",
};

export default function Reports() {
  return (
    <div className="container mx-auto py-10">
      <PageHeader title="Reports" />
      <Suspense>
        <SuspendedPage />
      </Suspense>
    </div>
  );
}

async function SuspendedPage() {
  const containers = await getContainers();

  return <BaseReport containers={containers} />;
}
