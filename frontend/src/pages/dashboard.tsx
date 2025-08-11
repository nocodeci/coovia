"use client"

import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { MainNav } from '@/components/layout/main-nav'
import { useAuth } from '@/context/auth-context'
import { 
  ShoppingBag, 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings, 
  Bell, 
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  DollarSign,
  Package,
  Star,
  Calendar,
  ArrowRight,
  Activity,
  Target,
  Zap
} from 'lucide-react'

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState({
    totalStores: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    monthlyGrowth: 12.5,
    activeOrders: 0
  })

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'order',
      message: 'Nouvelle commande reçue - Boutique Mode',
      time: 'Il y a 2 heures',
      amount: '€89.99'
    },
    {
      id: 2,
      type: 'product',
      message: 'Produit ajouté - T-shirt Premium',
      time: 'Il y a 4 heures',
      store: 'Boutique Mode'
    },
    {
      id: 3,
      type: 'customer',
      message: 'Nouveau client inscrit',
      time: 'Il y a 6 heures',
      customer: 'Marie Dupont'
    }
  ])

  const [quickActions] = useState([
    {
      title: 'Créer une boutique',
      description: 'Lancez votre nouvelle boutique en ligne',
      icon: Plus,
      action: '/stores/create',
      color: 'bg-blue-500'
    },
    {
      title: 'Ajouter un produit',
      description: 'Mettez en ligne vos produits',
      icon: Package,
      action: '/products/create',
      color: 'bg-green-500'
    },
    {
      title: 'Voir les analytics',
      description: 'Analysez vos performances',
      icon: BarChart3,
      action: '/analytics',
      color: 'bg-purple-500'
    },
    {
      title: 'Gérer les commandes',
      description: 'Traitez vos commandes en cours',
      icon: ShoppingBag,
      action: '/orders',
      color: 'bg-orange-500'
    }
  ])

  useEffect(() => {
    // Simuler le chargement des statistiques
    // Dans une vraie application, ces données viendraient de l'API
    setTimeout(() => {
      setStats({
        totalStores: 3,
        totalProducts: 47,
        totalCustomers: 1247,
        totalRevenue: 15420.50,
        monthlyGrowth: 12.5,
        activeOrders: 8
      })
    }, 1000)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-green-500" />
      case 'product':
        return <Package className="w-4 h-4 text-blue-500" />
      case 'customer':
        return <Users className="w-4 h-4 text-purple-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <MainNav />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Tableau de bord
                </h1>
                <p className="text-gray-600 mt-2">
                  Bienvenue, {user?.name || user?.email || 'Utilisateur'} ! Voici un aperçu de votre activité.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Boutiques</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalStores}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Produits</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Clients</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenus</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Growth and Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Croissance mensuelle
                </CardTitle>
                <CardDescription>
                  Comparaison avec le mois précédent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-green-600">+{stats.monthlyGrowth}%</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    En hausse
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Vos ventes ont augmenté de {stats.monthlyGrowth}% ce mois-ci
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2 text-orange-500" />
                  Commandes actives
                </CardTitle>
                <CardDescription>
                  Commandes en attente de traitement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-orange-600">{stats.activeOrders}</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    En cours
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {stats.activeOrders} commandes nécessitent votre attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Card key={index} className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity and User Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>
                    Dernières actions sur vos boutiques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        {activity.amount && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {activity.amount}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      Voir toute l'activité
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Profile Card */}
            <div>
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user?.picture} alt={user?.name} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">{user?.name || 'Utilisateur'}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                  <Badge variant="secondary" className="mt-2 bg-blue-100 text-blue-800">
                    <Star className="w-3 h-3 mr-1" />
                    Plan Premium
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Membre depuis</p>
                    <p className="font-medium text-gray-900">
                      {user?.updated_at ? new Date(user.updated_at).toLocaleDateString('fr-FR') : 'Récemment'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Modifier le profil
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Gérer l'abonnement
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progression</span>
                      <span className="font-medium text-gray-900">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Objectif mensuel atteint
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
