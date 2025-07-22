"use client"

import type React from "react"
import { Bell, Menu } from "lucide-react"
import { DashboardDynamicSearchBar } from "./dashboard-dynamic-dearch-bar"

interface DashboardTopBarProps {
  onBack: () => void
  onExport?: () => void
  onAddProduct?: () => void
  onNavigate?: (section: string) => void
}

export function DashboardTopBar({ onBack, onExport, onAddProduct, onNavigate }: DashboardTopBarProps) {
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
        <DashboardDynamicSearchBar
          onBack={onBack}
          onExport={onExport}
          onAddProduct={onAddProduct}
          onNavigate={onNavigate}
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
