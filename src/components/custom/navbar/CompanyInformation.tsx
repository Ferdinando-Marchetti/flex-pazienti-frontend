import {
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { GalleryVerticalEnd } from "lucide-react"
// Rendere unico, non selezioni multiple
export function CompanyInformation() {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    >
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <GalleryVerticalEnd className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">Dynamic Digital</span>
        <span className="truncate text-xs">Free</span>
      </div>
    </SidebarMenuButton>
  )
}
