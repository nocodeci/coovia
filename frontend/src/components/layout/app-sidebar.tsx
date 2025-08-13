import type React from "react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { NavGroup } from "@/components/layout/nav-group"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import { SidebarLoading } from "@/components/layout/sidebar-loading"
import { getSidebarData } from "./data/sidebar-data"
import { useStore } from "@/context/store-context"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentStore, isLoading } = useStore()
  
  // Utiliser les données dynamiques du sidebar avec le storeId de la boutique actuelle
  // Même si currentStore est null pendant le chargement, on peut toujours afficher le sidebar
  const sidebarData = getSidebarData(currentStore?.id)

  return (
    <Sidebar collapsible={false} variant="floating" {...props}>
      <SidebarHeader>
        {isLoading ? (
          <SidebarLoading />
        ) : (
          <TeamSwitcher teams={sidebarData.teams} />
        )}
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
