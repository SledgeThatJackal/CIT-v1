"use client";

import {
  ButtonHTMLAttributes,
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import { Button } from "../button";
import { cn } from "@/lib/utils";

type TabType = {
  value?: string;
  setValue: (value: string) => void;
};

const VerticalTabContext = createContext<TabType | undefined>(undefined);

const useVerticalTabContext = () => {
  const context = useContext(VerticalTabContext);
  if (!context)
    throw new Error("This must be used with a VerticalTabs component");

  return context;
};

export function VerticalTab({
  defaultValue,
  children,
}: {
  defaultValue?: string;
  children: ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <VerticalTabContext value={{ value, setValue }}>
      <div className="flex gap-10">{children}</div>
    </VerticalTabContext>
  );
}

export function VerticalTabList({ children }: { children: ReactNode }) {
  return (
    <div role="tablist" aria-orientation="vertical" className="flex flex-col">
      {children}
    </div>
  );
}

type VerticalTabTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export function VerticalTabTrigger({
  value,
  children,
  ...props
}: VerticalTabTriggerProps) {
  const { value: current, setValue } = useVerticalTabContext();
  const isSelected = value === current;

  return (
    <Button
      {...props}
      role="tab"
      aria-selected={isSelected}
      aria-controls={`content-${value}`}
      onClick={() => setValue(value)}
      id={`verticalTab-${value}`}
      {...{ "data-state": isSelected ? "active" : "inactive" }}
      className={cn(
        "p-5 whitespace-nowrap data-[state=active]:bg-accent-alternate-active text-white bg-accent-alternate hover:bg-table-header hover:cursor-pointer rounded-none first:rounded-t-lg last:rounded-b-lg",
        props.className
      )}
    >
      {children}
    </Button>
  );
}

export function VerticalTabContent({
  value,
  children,
}: {
  value: string;
  children: ReactNode;
}) {
  const { value: current } = useVerticalTabContext();

  if (value !== current) return null;

  return (
    <div
      role="tabpanel"
      id={`content-${value}`}
      aria-labelledby={`tab-${value}`}
      className="w-full"
    >
      {children}
    </div>
  );
}
