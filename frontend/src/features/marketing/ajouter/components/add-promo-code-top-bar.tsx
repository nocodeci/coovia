"use client"

import type React from "react"
import { Bell, Menu } from "lucide-react"
import { AddPromoCodeDynamicSearchBar } from "./add-promo-code-dynamic-search-bar"
import { StoreSelector } from "@/components/ui/store-selector"

interface AddPromoCodeTopBarProps {
  promoCode?: string
  discountType?: string
  discountValue?: string
  selectedProducts?: string[]
  applyToAll?: boolean
  isFormValid?: boolean
  hasUnsavedChanges?: boolean
  onSave?: () => void
  onDiscard?: () => void
  onBack?: () => void
  onSuggestionApply?: (type: string, value: string) => void
}

export function AddPromoCodeTopBar({
  promoCode = "",
  discountType = "percentage",
  discountValue = "",
  selectedProducts = [],
  applyToAll = false,
  isFormValid = false,
  hasUnsavedChanges = false,
  onSave,
  onDiscard,
  onBack,
  onSuggestionApply,
}: AddPromoCodeTopBarProps = {}) {
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

      <div className="flex-1 flex items-center justify-center gap-3 max-w-lg mx-auto">
        

        <AddPromoCodeDynamicSearchBar
          promoCode={promoCode}
          discountType={discountType}
          discountValue={discountValue}
          selectedProducts={selectedProducts}
          applyToAll={applyToAll}
          isFormValid={isFormValid}
          hasUnsavedChanges={hasUnsavedChanges}
          onSave={onSave}
          onDiscard={onDiscard}
          onBack={onBack}
          onSuggestionApply={onSuggestionApply}
          className="flex-1 max-w-sm"
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
