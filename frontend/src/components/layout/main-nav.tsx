"use client"

import React from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSanctumAuth } from '@/hooks/useSanctumAuth'
import { 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  CreditCard, 
  Sparkles,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'

export function MainNav() {
  const { user, isAuthenticated, isLoading, logout } = useSanctumAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleLogin = () => {
    // Rediriger vers la page de connexion
    window.location.href = '/sign-in'
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  Coovia
                </h1>
                <div className="text-xs text-gray-500 font-medium">Plateforme E-commerce</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Tableau de bord
            </Link>
            <Link 
              to="/boutiques" 
              className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Boutiques
            </Link>
            <Link 
              to="/produits" 
              className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Produits
            </Link>
            <Link 
              to="/media" 
              className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Média
            </Link>
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 rounded-full w-8 h-8"></div>
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-sm font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/notifications" className="flex items-center">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/billing" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Facturation
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/upgrade" className="flex items-center">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Passer à Pro
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={handleLogin}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Se connecter
                </Button>
                <Button 
                  onClick={handleLogin}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Commencer
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tableau de bord
              </Link>
              <Link 
                to="/boutiques" 
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Boutiques
              </Link>
              <Link 
                to="/produits" 
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Produits
              </Link>
              <Link 
                to="/media" 
                className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Média
              </Link>
              
              {!isAuthenticated && (
                <div className="px-4 py-2 space-y-2">
                  <Button 
                    variant="ghost" 
                    onClick={handleLogin}
                    className="w-full text-gray-700 hover:text-gray-900"
                  >
                    Se connecter
                  </Button>
                  <Button 
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Commencer
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
