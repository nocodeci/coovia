import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
  IconApps,
  IconListCheck,
} from "@tabler/icons-react"
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react"
import { ClerkLogo } from "@/assets/clerk-logo"
import type { SidebarData } from "../types"

// Fonction pour générer les URLs dynamiques avec storeId
export const getSidebarData = (storeId?: string): SidebarData => {
  const baseUrl = storeId ? `/${storeId}` : ""
  
  return {
    user: {
      name: "satnaing",
      email: "satnaingdev@gmail.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Shadcn Admin",
        logo: Command,
        plan: "Vite + ShadcnUI",
      },
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
    ],
    navGroups: [
      {
        title: "Général",
        items: [
          {
            title: "Dashboard",
            url: `${baseUrl}/dashboard` as any,
            icon: IconLayoutDashboard,
          },
          {
            title: "Produits",
            url: `${baseUrl}/produits` as any,
            icon: IconPackages,
          },
          {
            title: "Applications",
            url: `${baseUrl}/apps` as any,
            icon: IconApps,
          },
          {
            title: "Clients",
            url: `${baseUrl}/clients` as any,
            icon: IconUsers,
          },
          {
            title: "Tâches",
            url: `${baseUrl}/tasks` as any,
            icon: IconListCheck,
          },
        ],
      },
      {
        title: "Configuration",
        items: [
          {
            title: "Paramètres",
            icon: IconSettings,
            items: [
              {
                title: "Profil",
                url: `${baseUrl}/settings` as any,
                icon: IconUserCog,
              },
              {
                title: "Compte",
                url: `${baseUrl}/settings/account` as any,
                icon: IconTool,
              },
              {
                title: "Apparence",
                url: `${baseUrl}/settings/appearance` as any,
                icon: IconPalette,
              },
              {
                title: "Notifications",
                url: `${baseUrl}/settings/notifications` as any,
                icon: IconNotification,
              },
              {
                title: "Affichage",
                url: `${baseUrl}/settings/display` as any,
                icon: IconBrowserCheck,
              },
            ],
          },
        ],
      },
    ],
  }
}

// Données par défaut pour la compatibilité
export const sidebarData: SidebarData = getSidebarData()
