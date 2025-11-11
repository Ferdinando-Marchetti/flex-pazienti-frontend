"use client"

import * as React from "react"
import {
  BicepsFlexed,
  CalendarClock,
  Command,
  LayoutDashboard,
  LifeBuoy,
  MessageCircle,
  Send,
} from "lucide-react"

import { NavMain } from "@/components/custom/navBar/nav-main"
import { NavUser } from "@/components/custom/navBar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./theme-toggler"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Chat",
      url: "chat",
      icon: MessageCircle
    },
    {
      title: "Appuntamenti",
      url: "appuntamenti",
      icon: CalendarClock
    },
    {
      title: "Allenamento",
      url: "allenamento",
      icon: BicepsFlexed
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-xl" >
                <img src='/logo.png' style={{borderRadius: '20em'}}></img>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">FlexiFisio</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <ModeToggle></ModeToggle>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
