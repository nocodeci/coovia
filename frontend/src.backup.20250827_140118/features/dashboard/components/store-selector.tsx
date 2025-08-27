"use client"

import { useState } from "react"
import { Store, ChevronDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/context/store-context"
import { useNavigate } from "@tanstack/react-router"

export function StoreSelector() {
  const { stores, currentStore, setCurrentStore } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "pending":
        return "En attente"
      case "inactive":
        return "Inactive"
      default:
        return status
    }
  }

  const handleStoreSelect = (store: any) => {
    setCurrentStore(store)
    setIsOpen(false)
    // Naviguer vers le dashboard spécifique de la boutique
    navigate({ to: `/stores/${store.id}/dashboard` })
  }

  if (!currentStore) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[200px] justify-between">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              <span>Sélectionner une boutique</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          {stores.map((store) => (
            <DropdownMenuItem
              key={store.id}
              onClick={() => handleStoreSelect(store)}
              className="flex items-center gap-3 p-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={store.logo || "/placeholder.svg"} alt={store.name} />
                <AvatarFallback>{store.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{store.name}</span>
                  <Badge className={`text-xs ${getStatusColor(store.status)}`}>
                    {getStatusText(store.status)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{store.description}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={currentStore.logo || "/placeholder.svg"} alt={currentStore.name} />
              <AvatarFallback className="text-xs">{currentStore.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="truncate">{currentStore.name}</span>
            <Badge className={`text-xs ${getStatusColor(currentStore.status)}`}>
              {getStatusText(currentStore.status)}
            </Badge>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => handleStoreSelect(store)}
            className="flex items-center gap-3 p-3"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={store.logo || "/placeholder.svg"} alt={store.name} />
              <AvatarFallback>{store.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{store.name}</span>
                <Badge className={`text-xs ${getStatusColor(store.status)}`}>
                  {getStatusText(store.status)}
                </Badge>
                {store.id === currentStore.id && <Check className="h-4 w-4 text-green-600" />}
              </div>
              <p className="text-xs text-muted-foreground truncate">{store.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate({ to: "/stores" })}
          className="text-blue-600 focus:text-blue-600"
        >
          <Store className="mr-2 h-4 w-4" />
          Gérer toutes les boutiques
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}