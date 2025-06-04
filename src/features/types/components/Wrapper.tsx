"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TypeAttributeDataType } from "@/drizzle/schema";
import dynamic from "next/dynamic";

// Lazy-load the form on client-side only
const TypeForm = dynamic(() => import("./TypeForm"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col space-y-8">
      <div>
        <Skeleton className="h-4 mb-2 w-20" />
        <Skeleton className="h-9 w-auto" />
      </div>
      <div className="space-y-8">
        <Skeleton className="h-96 max-h-[50vh] w-auto rounded-xl" />
        <Skeleton className="ms-auto h-9 w-16" />
      </div>
    </div>
  ),
});

export default function ClientWrapper({
  type,
}: {
  type?: {
    id: string;
    name: string;
    typeAttributes?: {
      id: string;
      itemTypeId?: string;
      displayOrder: number;
      dataType: TypeAttributeDataType;
      textDefaultValue?: string;
      numericDefaultValue?: number;
      title: string;
    }[];
  };
}) {
  return <TypeForm type={type} />;
}
