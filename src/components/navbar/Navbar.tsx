import { SignedIn } from "@/services/clerk/components/SignAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { NavbarClient } from "./NavbarClient";
import { appVersion } from "@/lib/utils";

export function Navbar({
  children,
  content,
  footer,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <NavbarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <div className="flex items-center">
              <span className="text-nowrap h-fit">CIT</span>
            </div>
            <div className="flex items-center ml-auto">
              <p className="text-muted-foreground/50 text-xs select-none">
                v{appVersion}
              </p>
            </div>
          </SidebarHeader>
          <SidebarContent>{content}</SidebarContent>
          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>{footer}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </NavbarClient>
    </SidebarProvider>
  );
}
