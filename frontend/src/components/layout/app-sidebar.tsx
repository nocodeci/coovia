import type React from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { NavGroup } from "@/components/layout/nav-group"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import { getSidebarData } from "./data/sidebar-data"
import { useStore } from "@/context/store-context"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentStore } = useStore()
  
  // Utiliser les données dynamiques du sidebar avec le storeId de la boutique actuelle
  const sidebarData = getSidebarData(currentStore?.id)

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
