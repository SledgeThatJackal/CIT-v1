import { SidebarMenuButton } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/services/clerk/clerk";
import { SignInButton } from "@clerk/nextjs";
import { LogInIcon } from "lucide-react";
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
      <SignInButton>
        <SidebarMenuButton>
          <LogInIcon />
          <span>Log In</span>
        </SidebarMenuButton>
      </SignInButton>
    );

  return <NavbarUserButtonClient {...user} />;
}
