"use client"

import { Check, Store, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface User {
  name: string
  email: string
  initials: string
}

const stores = [
  {
    id: "1",
    name: "My Store",
    initials: "MS",
    isActive: true,
  },
]

const currentUser: User = {
  name: "YOHAN ERIC KOUAKOU KOFFI",
  email: "yohankoffik225@gmail.com",
  initials: "YK",
}

export function StoreSelector() {
  const activeStore = stores.find((store) => store.isActive) || stores[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 h-9 px-3 bg-transparent">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-green-500 text-white text-xs font-medium">
              {activeStore.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Ma Boutique</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        {/* Active Store */}
        <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-default">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-green-500 text-white text-sm font-medium">
              {activeStore.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-medium text-sm">{activeStore.name}</div>
          </div>
          <Check className="h-4 w-4 text-green-600" />
        </DropdownMenuItem>

        {/* All Stores */}
        <DropdownMenuItem className="flex items-center gap-3 p-3">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Store className="h-4 w-4 text-gray-600" />
          </div>
          <span className="text-sm">All stores</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Current User */}
        <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-default">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-green-500 text-white text-sm font-medium">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{currentUser.name}</div>
            <div className="text-xs text-gray-500 truncate">{currentUser.email}</div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Log Out */}
        <DropdownMenuItem className="flex items-center gap-3 p-3 text-red-600 focus:text-red-600">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="text-sm">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
