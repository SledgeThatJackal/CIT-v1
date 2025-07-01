import { SidebarMenuButton } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/services/clerk/clerk";
import { SignOutButton } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import { Suspense } from "react";
import { NavbarUserButtonClient } from "./NavbarUserButtonClient";

export default function NavbarUserButton() {
  return (
    <Suspense>
      <SuspendedComponent />
    </Suspense>
  );
}

async function SuspendedComponent() {
  const user = await getCurrentUser({ allData: true }).then((res) =>
    res.user ? res.user : null
  );

  if (user == null)
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon />
          <span>Log out</span>
        </SidebarMenuButton>
      </SignOutButton>
    );

  return <NavbarUserButtonClient {...user} />;
}
