"use client"

import React from "react"
import { NotificationCenter } from "@/components/notification-center"
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query"

// --- Simulated Backend API ---
let masterNotifications = [
  {
    id: "1",
    title: "Nouvelle commande reçue",
    message: "Une nouvelle commande a été passée par un client.",
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    priority: "high" as const,
  },
  {
    id: "2",
    title: "Mise à jour système",
    message: "Le système a été mis à jour avec de nouvelles fonctionnalités.",
    isRead: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    priority: "medium" as const,
  },
  {
    id: "3",
    title: "Rappel de maintenance",
    message: "Maintenance programmée ce soir à 22h.",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    priority: "low" as const,
  },
]

let nextId = masterNotifications.length + 1

const fetchNotifications = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...masterNotifications]
}

const markAsRead = async (id: string) => {
  masterNotifications = masterNotifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
}

const markAllAsRead = async () => {
  masterNotifications = masterNotifications.map((n) => ({ ...n, isRead: true }))
}

const deleteNotification = async (id: string) => {
  masterNotifications = masterNotifications.filter((n) => n.id !== id)
}

function NotificationWrapper() {
  const queryClient = useQueryClient()

  // Simulate real-time updates by adding a new notification every 30 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: String(nextId++),
        title: "Mise à jour en temps réel !",
        message: "Cette notification a été ajoutée automatiquement.",
        isRead: false,
        createdAt: new Date().toISOString(),
        priority: "medium" as const,
      }
      masterNotifications.unshift(newNotification)
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    }, 30000)

    return () => clearInterval(interval)
  }, [queryClient])

  return (
    <NotificationCenter
      variant="popover"
      fetchNotifications={fetchNotifications}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
      onDeleteNotification={deleteNotification}
      enableRealTimeUpdates={true}
      updateInterval={15000}
      enableBrowserNotifications={true}
    />
  )
}

const queryClient = new QueryClient()

export function NotificationProvider() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationWrapper />
    </QueryClientProvider>
  )
}
