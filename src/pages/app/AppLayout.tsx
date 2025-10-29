import { Outlet, useLocation } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/custom/navBar/app-sidebar";
import { useEffect } from "react";

export default function AppLayout() {
  const location = useLocation();

  const navNames = [
    { href: "/app/dashboard", name: "Dashboard" },
    { href: "/app/chat", name: "Chat" },
  ];

  const currentPage =
    navNames.find(
      (nav) =>
      location.pathname === nav.href ||
      location.pathname.startsWith(`${nav.href}/`
    )
  )?.name || "";

  useEffect(() => {
    if (location.pathname === "/app/chat") {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [location]);

  return (
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
        <div>
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
  
/*
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
*/