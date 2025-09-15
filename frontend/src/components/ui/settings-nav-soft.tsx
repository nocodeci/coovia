import * as React from "react"
import { cn } from "@/lib/utils"

interface SettingsNavSoftProps {
  children: React.ReactNode
  className?: string
}

export function SettingsNavSoft({ children, className }: SettingsNavSoftProps) {
  return (
    <div 
      className={cn(
        "relative bg-background hidden w-full min-w-40 px-1 py-2 md:block",
        "rounded-xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300",
        "bg-gradient-to-br from-background to-muted/20",
        "backdrop-blur-sm",
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:pointer-events-none",
        className
      )}
      style={{
        position: "relative",
        "--radix-scroll-area-corner-width": "0px",
        "--radix-scroll-area-corner-height": "0px"
      } as React.CSSProperties}
    >
      <style jsx>{`
        [data-radix-scroll-area-viewport] {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        [data-radix-scroll-area-viewport]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div 
        data-radix-scroll-area-viewport
        data-slot="scroll-area-viewport"
        className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
        style={{ overflow: "hidden scroll" }}
      >
        <div style={{ minWidth: "100%", display: "table" }}>
          {children}
        </div>
      </div>
      <div 
        data-orientation="vertical"
        data-slot="scroll-area-scrollbar"
        className="flex touch-none p-px transition-colors select-none h-full w-2.5 border-l border-l-transparent"
        style={{
          position: "absolute",
          top: "0px",
          right: "0px",
          bottom: "var(--radix-scroll-area-corner-height)",
          "--radix-scroll-area-thumb-height": "138px"
        } as React.CSSProperties}
      />
    </div>
  )
}