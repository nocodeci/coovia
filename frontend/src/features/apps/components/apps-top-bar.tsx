"use client"

import { Bell, Menu } from "lucide-react"
import { AppsDynamicSearchBar } from "./apps-dynamic-search-bar"

interface AppsTopBarProps {
  searchTerm: string
  appType: string
  sort: string
  totalApps: number
  connectedApps: number
  onSearchChange: (term: string) => void
  onFilterChange: (filters: any) => void
  onSortChange: (sort: string) => void
  onClearFilters: () => void
  onBack: () => void
  onConnectAll?: () => void
  onRefresh?: () => void
  onBulkAction?: (action: string) => void
}

export function AppsTopBar({
  searchTerm,
  appType,
  sort,
  totalApps,
  connectedApps,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onClearFilters,
  onBack,
  onConnectAll,
  onRefresh,
  onBulkAction,
}: AppsTopBarProps) {
  return (
    <header
      className="polaris-topbar sticky top-0 flex items-center gap-4 px-4 lg:px-6 border-b bg-white/95 backdrop-blur-sm z-[9997]"
      style={{ height: "4rem", minHeight: "4rem" }}
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

      <div className="flex-1 flex items-center justify-center max-w-md mx-auto">
        <AppsDynamicSearchBar
          searchTerm={searchTerm}
          appType={appType}
          sort={sort}
          totalApps={totalApps}
          connectedApps={connectedApps}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
          onClearFilters={onClearFilters}
          onBack={onBack}
          onConnectAll={onConnectAll}
          onRefresh={onRefresh}
          onBulkAction={onBulkAction}
          className="w-full max-w-lg"
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

        <div className="flex items-center gap-2">
          <div
            className="polaris-avatar"
            style={{
              width: "2rem",
              height: "2rem",
              backgroundColor: "#7126FF",
              fontSize: "var(--p-font-size-275)",
            }}
          >
            <span style={{ color: "white" }}>MS</span>
          </div>
          <span
            style={{
              fontSize: "var(--p-font-size-300)",
              fontWeight: "var(--p-font-weight-medium)",
              color: "var(--p-color-text)",
            }}
            className="hidden md:block"
          >
            My Store
          </span>
        </div>
      </div>
    </header>
  )
}
