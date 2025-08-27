"use client"

import type React from "react"
import { Bell, Menu } from "lucide-react"
import { ClientsDynamicSearchBar } from "./client-dynamic-search-bar"
import { StoreSelector } from "@/components/ui/store-selector"

interface ClientsTopBarProps {
  searchTerm: string
  selectedClients: string[]
  totalClients: number
  onSearchChange: (term: string) => void
  onFilterChange: (filters: any) => void
  onClearFilters: () => void
  onBack: () => void
  onExport?: () => void
  onAddClient?: () => void
  onBulkAction?: (action: string) => void
}

export function ClientsTopBar({
  searchTerm,
  selectedClients,
  totalClients,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onBack,
  onExport,
  onAddClient,
  onBulkAction,
}: ClientsTopBarProps) {
  return (
    <header
      className="polaris-topbar fixed top-0 left-0 right-0 flex items-center gap-4 px-4 lg:px-6 border-b bg-white/95 backdrop-blur-sm md:left-[var(--sidebar-width)] md:peer-data-[state=collapsed]:left-[var(--sidebar-width-icon)]"
      style={
        {
          height: "4rem",
          minHeight: "4rem",
          zIndex: 9995,
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <button
        className="polaris-button-secondary flex items-center justify-center md:hidden"
        style={{
          width: "2rem",
          height: "2rem",
          padding: "0",
          backgroundColor: "var(--p-color-bg-fill-transparent)",
        }}
      >
        <Menu className="h-4 w-4" style={{ color: "var(--p-color-icon)" }} />
      </button>

      <div className="flex items-center gap-2"></div>

      <div className="flex-1 flex items-center justify-center max-w-xs mx-auto">
        <ClientsDynamicSearchBar
          searchTerm={searchTerm}
          selectedClients={selectedClients}
          totalClients={totalClients}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
          onBack={onBack}
          onExport={onExport}
          onAddClient={onAddClient}
          onBulkAction={onBulkAction}
          className="w-full max-w-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          className="polaris-button-secondary flex items-center justify-center"
          style={{
            width: "2rem",
            height: "2rem",
            padding: "0",
            backgroundColor: "var(--p-color-bg-fill-transparent)",
          }}
        >
          <Bell className="h-4 w-4" style={{ color: "var(--p-color-icon)" }} />
        </button>

        <StoreSelector />
      </div>
    </header>
  )
}
