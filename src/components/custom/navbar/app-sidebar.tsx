import * as React from "react"
import {
  LayoutDashboard,
  MapPinHouse,
  NotebookText,
} from "lucide-react"

import { NavMain } from "@/components/custom/navbar/nav-main"
import { NavUser } from "@/components/custom/navbar/nav-user"
import { CompanyInformation } from "@/components/custom/navbar/CompanyInformation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      id: 1,
      title: "Dashboard",
      url: "/app/dashboard",
      icon: LayoutDashboard
    },
    {
      id: 2,
      title: "Places",
      url: "/app/places",
      icon: MapPinHouse
    },
    {
      id: 3,
      title: "Reservations",
      url: "/app/reservations",
      icon: NotebookText
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyInformation />
      </SidebarHeader>
      <hr />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
