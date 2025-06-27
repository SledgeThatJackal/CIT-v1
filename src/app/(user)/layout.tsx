import { Navbar } from "@/components/navbar/Navbar";
import NavbarGroup from "@/components/navbar/NavbarGroup";
import { db } from "@/drizzle/db";
import {
  ContainerTable,
  ItemTable,
  ItemTypeTable,
  TagTable,
} from "@/drizzle/schema";
import { getContainerGlobalTag } from "@/features/containers/db/cache/containers";
import { getItemGlobalTag } from "@/features/items/db/cache/item";
import { getTagGlobalTag } from "@/features/tags/db/cache/tag";
import { getTypeGlobalTag } from "@/features/types/db/cache/type";
import NavbarUserButton from "@/features/users/components/NavbarUserButton";
import {
  ClipboardListIcon,
  ContainerIcon,
  FileTextIcon,
  SearchIcon,
  ShoppingBagIcon,
  TagIcon,
  TypeIcon,
} from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { Suspense } from "react";

type Props = Readonly<{ children: React.ReactNode; sidebar: React.ReactNode }>;

export default function UserLayout(props: Props) {
  return (
    <Suspense>
      <SuspendedComponent {...props} />
    </Suspense>
  );
}

async function SuspendedComponent({ children, sidebar }: Props) {
  const containerTotal = await getContainerTotal();
  const itemTotal = await getItemTotal();
  const tagTotal = await getTagTotal();
  const typeTotal = await getTypeTotal();

  return (
    <>
      <Navbar
        content={
          <>
            {sidebar}
            <NavbarGroup
              className="mt-auto"
              items={[
                { href: "/", icon: <ClipboardListIcon />, label: "Home" },
                {
                  href: "/container",
                  icon: <ContainerIcon />,
                  label: "Containers",
                  total: containerTotal,
                },
                {
                  href: "/item",
                  icon: <ShoppingBagIcon />,
                  label: "Items",
                  total: itemTotal,
                },
                {
                  href: "/tag",
                  icon: <TagIcon />,
                  label: "Tags",
                  total: tagTotal,
                },
                {
                  href: "/type",
                  icon: <TypeIcon />,
                  label: "Types",
                  total: typeTotal,
                },
                { href: "/find", icon: <SearchIcon />, label: "Find" },
                { href: "/reports", icon: <FileTextIcon />, label: "Reports" },
              ]}
            />
          </>
        }
        footer={<NavbarUserButton />}
      >
        {children}
      </Navbar>
      {children}
    </>
  );
}

async function getContainerTotal() {
  "use cache";

  cacheTag(getContainerGlobalTag());

  return await db.$count(ContainerTable);
}

async function getItemTotal() {
  "use cache";

  cacheTag(getItemGlobalTag());

  return await db.$count(ItemTable);
}

async function getTagTotal() {
  "use cache";

  cacheTag(getTagGlobalTag());

  return await db.$count(TagTable);
}

async function getTypeTotal() {
  "use cache";

  cacheTag(getTypeGlobalTag());

  return await db.$count(ItemTypeTable);
}
