"use client"

import React from 'react'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Store, 
  ShoppingCart,
  Crown
} from 'lucide-react'

export function UserNav() {
  const { user, logout, isAdmin, isVendor, isCustomer } = useSanctumAuth()

  if (!user) {
    return (
      <Button variant="outline" asChild>
        <a href="/sign-in">Se connecter</a>
      </Button>
    )
  }

  const getRoleIcon = () => {
    if (isAdmin()) return <Crown className="h-4 w-4" />
    if (isVendor()) return <Store className="h-4 w-4" />
    if (isCustomer()) return <ShoppingCart className="h-4 w-4" />
    return <User className="h-4 w-4" />
  }

  const getRoleLabel = () => {
    if (isAdmin()) return 'Administrateur'
    if (isVendor()) return 'Vendeur'
    if (isCustomer()) return 'Client'
    return 'Utilisateur'
  }

  const getInitials = () => {
    if (!user.name) return user.email?.charAt(0).toUpperCase() || 'U'
    return user.name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image || ''} alt={user.name || user.email || ''} />
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'Utilisateur'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              {getRoleIcon()}
              <span className="text-xs text-muted-foreground">{getRoleLabel()}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <a href="/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Mon profil
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a href="/settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </a>
        </DropdownMenuItem>

        {isAdmin() && (
          <DropdownMenuItem asChild>
            <a href="/admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Administration
            </a>
          </DropdownMenuItem>
        )}

        {isVendor() && (
          <DropdownMenuItem asChild>
            <a href="/vendor" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Espace vendeur
            </a>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={logout}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
