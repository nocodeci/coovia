"use client"

import React from 'react'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  Key,
  ChevronDown 
} from 'lucide-react'

export function SanctumAuthNavbar() {
  const { user, isAuthenticated, logout, isLoading } = useSanctumAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate({ to: '/' })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleProfile = () => {
    navigate({ to: '/profile' })
  }

  const handleSettings = () => {
    navigate({ to: '/settings' })
  }

  const handleDashboard = () => {
    navigate({ to: '/dashboard' })
  }

  const handleSignIn = () => {
    navigate({ to: '/sign-in' })
  }

  const handleSignUp = () => {
    navigate({ to: '/sign-up' })
  }

  // Si l'utilisateur est connecté
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-4">
        {/* Bouton tableau de bord */}
        <Button
          variant="ghost"
          onClick={handleDashboard}
          className="hidden md:flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          Tableau de bord
        </Button>

        {/* Menu utilisateur */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Key className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">
                    Sanctum
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètres</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              disabled={isLoading}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Si l'utilisateur n'est pas connecté
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        onClick={handleSignIn}
        className="hidden md:flex items-center gap-2"
      >
        <Key className="h-4 w-4" />
        Se connecter
      </Button>
      <Button
        onClick={handleSignUp}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
      >
        Créer un compte
      </Button>
    </div>
  )
}
