import { Outlet, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { LowerBar } from "@/components/custom/LowerBar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/custom/navBar/app-sidebar";

export default function AppLayout() {
  const isMobile = useIsMobile();
  const location = useLocation();

  const navNames = [
    { href: "/app/dashboard", name: "Dashboard" },
    { href: "/app/pazienti", name: "Pazienti" },
  ];

  const currentPage =
    navNames.find(
      (nav) =>
        location.pathname === nav.href ||
        location.pathname.startsWith(`${nav.href}/`)
    )?.name || "";

  return isMobile ? (
    <>
      <div className="p-6">
        <div className="space-y-2">
          {currentPage && (
            <h1 className="text-3xl font-semibold tracking-tight">
              {currentPage}
            </h1>
          )}
          <Separator />
        </div>
        <Outlet />
      </div>
      <LowerBar></LowerBar>
    </>
  ) : (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex">
              <div>
                <Separator orientation="vertical" />
              </div>
              <div className="pl-4">
                {currentPage && (
                  <h1 className="text-xl font-semibold tracking-tight">
                    {currentPage}
                  </h1>
                )}
              </div>
            </div>
          </div>
        </header>
        <div className="px-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
