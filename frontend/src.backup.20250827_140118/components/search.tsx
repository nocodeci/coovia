"use client"

import type React from "react"

import { IconSearch } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { useSearch } from "@/context/search-context"
import { Button } from "./ui/button"

interface Props {
  className?: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
}

export function Search({
  className = "",
  placeholder = "Trouvez n'importe quoi : Appuyez sur espace sur votre clavier",
}: Props) {
  const { setOpen } = useSearch()

  return (
    <Button
      variant="outline"
      className={cn(
        "group relative h-10 w-full max-w-lg justify-start rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm text-gray-500 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-white hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        "sm:pr-14 md:w-96 lg:w-[28rem]",
        className,
      )}
      onClick={() => setOpen(true)}
    >
      <IconSearch
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-gray-600"
      />
      <span className="ml-10 truncate text-sm font-normal text-gray-600 group-hover:text-gray-800">{placeholder}</span>
      <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden items-center gap-0.5 rounded-md border border-gray-200 bg-gray-50/80 px-2 py-1 font-mono text-xs font-medium text-gray-500 shadow-sm transition-all group-hover:border-gray-300 group-hover:bg-gray-100/80 sm:flex">
        <span className="text-xs">⌘</span>
        <span>K</span>
      </kbd>
    </Button>
  )
}
