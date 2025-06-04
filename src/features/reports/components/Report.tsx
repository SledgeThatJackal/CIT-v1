/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ComponentType, useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";

export const ReportPage = <T,>({
  documentTitle,
  CustomComponent,
  data,
}: {
  documentTitle: string;
  CustomComponent: ComponentType<any>;
  data?: T;
}) => {
  const componentRef = useRef<any>(null);

  const reactToPrintContent = () => {
    return componentRef.current;
  };

  const handlePrint = useReactToPrint({
    documentTitle,
  });

  useEffect(() => {
    if (data) handlePrint(reactToPrintContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="hidden">
      <CustomComponent className="hidden" ref={componentRef} data={data} />
    </div>
  );
};
