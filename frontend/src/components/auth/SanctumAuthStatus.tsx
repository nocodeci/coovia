"use client"

import React from 'react'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  LogOut, 
  Settings, 
  Key, 
  Shield,
  RefreshCw
} from 'lucide-react'

export function SanctumAuthStatus() {
  const { 
    user, 
    isAuthenticated, 
    logout, 
    logoutAll, 
    refreshToken, 
    isLoading 
  } = useSanctumAuth()

  if (!isAuthenticated || !user) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'super_admin':
        return 'bg-purple-100 text-purple-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'store_owner':
        return 'bg-green-100 text-green-800'
      case 'customer':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'Admin'
      case 'super_admin':
        return 'Super Admin'
      case 'manager':
        return 'Manager'
      case 'store_owner':
        return 'Propriétaire'
      case 'customer':
        return 'Client'
      default:
        return role
    }
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Badge Sanctum */}
      <Badge variant="outline" className="hidden sm:flex items-center space-x-1 border-blue-200 text-blue-700 bg-blue-50">
        <Key className="h-3 w-3" />
        <span>Sanctum</span>
      </Badge>

      {/* Menu utilisateur */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-neutral-100">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-neutral-900">{user.name}</p>
              <p className="text-xs leading-none text-neutral-500">
                {user.email}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getRoleColor(user.role)} variant="secondary">
                  {getRoleLabel(user.role)}
                </Badge>
                <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                  <Key className="mr-1 h-3 w-3" />
                  Sanctum
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="text-neutral-700 hover:bg-neutral-100">
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="text-neutral-700 hover:bg-neutral-100">
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem className="text-neutral-700 hover:bg-neutral-100">
            <Shield className="mr-2 h-4 w-4" />
            <span>Sécurité</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={refreshToken}
            disabled={isLoading}
            className="text-neutral-700 hover:bg-neutral-100"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Rafraîchir le token</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={logoutAll}
            disabled={isLoading}
            className="text-neutral-700 hover:bg-neutral-100"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion globale</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={logout}
            disabled={isLoading}
            className="text-red-600 focus:text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
