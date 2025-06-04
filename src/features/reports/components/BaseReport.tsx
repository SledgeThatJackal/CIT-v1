"use client";

import FieldsetSelect from "@/components/ui/custom/fieldset-select";
import { SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { generateBaseReport } from "../db/reports";
import { ReportPage } from "./Report";
import BaseReportPrint from "./designs/base-report";

export default function BaseReport({
  containers,
}: {
  containers: {
    name: string;
    id: string;
    barcodeId: string;
  }[];
}) {
  const [container, setContainer] = useState<
    | {
        name: string;
        containerItems: {
          item: {
            name: string;
          };
        }[];
      }
    | undefined
  >();

  async function fetchData(value: string) {
    setContainer(await generateBaseReport(value));
  }

  return (
    <>
      <ReportPage
        documentTitle="Base Report"
        CustomComponent={BaseReportPrint}
        data={container}
      />
      <FieldsetSelect onSubmit={fetchData}>
        {containers.map((container) => (
          <SelectItem key={`container-${container.id}`} value={container.id}>
            {container.name} ({container.barcodeId})
          </SelectItem>
        ))}
      </FieldsetSelect>
    </>
  );
}
