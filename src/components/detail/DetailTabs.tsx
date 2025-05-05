import { changeToProperCase } from "@/util/formatters";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { ReactNode } from "react";

export default function DetailTabs({
  values,
  children,
}: {
  values: readonly string[];
  children: ReactNode;
}) {
  if (values.length === 0) throw new Error("Tab values were not provided");

  return (
    <Tabs defaultValue={values[0]}>
      <TabsList>
        {values.map((value) => (
          <TabsTrigger
            key={`tab-${value}`}
            value={value}
            className="hover:cursor-pointer"
          >
            {changeToProperCase(value)}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
}
