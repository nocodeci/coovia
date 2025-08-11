"use client"

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRouteAuth } from '@/components/auth/protected-route-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp,
  Activity,
  Calendar,
  Target,
  Settings
} from 'lucide-react'

function DashboardContent() {
  const { user, logout } = useAuth()

  const stats = [
    {
      title: "Ventes totales",
      value: "€12,345",
      change: "+12.5%",
      changeType: "positive",
      icon: DollarSign,
      description: "Ce mois"
    },
    {
      title: "Commandes",
      value: "156",
      change: "+8.2%",
      changeType: "positive",
      icon: Package,
      description: "Ce mois"
    },
    {
      title: "Clients",
      value: "2,847",
      change: "+15.3%",
      changeType: "positive",
      icon: Users,
      description: "Total"
    },
    {
      title: "Taux de conversion",
      value: "3.2%",
      change: "+0.8%",
      changeType: "positive",
      icon: Target,
      description: "Ce mois"
    }
  ]

  const recentActivities = [
    { id: 1, action: "Nouvelle commande", time: "Il y a 2 min", amount: "€89.99" },
    { id: 2, action: "Paiement reçu", time: "Il y a 15 min", amount: "€156.00" },
    { id: 3, action: "Nouveau client", time: "Il y a 1h", amount: "" },
    { id: 4, action: "Produit mis à jour", time: "Il y a 2h", amount: "" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord
            </h1>
            <p className="text-gray-600">
              Bienvenue, {user?.name || user?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Aujourd'hui
            </Button>
            <Button onClick={logout} variant="outline">
              Se déconnecter
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Graphiques et activités */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique des ventes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Évolution des ventes</CardTitle>
              <CardDescription>
                Performance des ventes sur les 30 derniers jours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Graphique des ventes</p>
                  <p className="text-sm">Intégration avec Recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activités récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
              <CardDescription>
                Dernières actions sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    {activity.amount && (
                      <span className="text-sm font-medium text-gray-900">
                        {activity.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <Package className="w-6 h-6 mb-2" />
                Gérer les produits
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="w-6 h-6 mb-2" />
                Gérer les clients
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <BarChart3 className="w-6 h-6 mb-2" />
                Voir les rapports
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Settings className="w-6 h-6 mb-2" />
                Paramètres
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Composant exporté avec protection d'authentification
export function DashboardProtected() {
  return (
    <ProtectedRouteAuth>
      <DashboardContent />
    </ProtectedRouteAuth>
  )
}
