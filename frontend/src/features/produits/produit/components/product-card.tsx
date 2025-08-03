"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ShoppingCart, CreditCard, Gift, Users } from "lucide-react"

type DataType = {
  title: string
  value: string
  icon: React.ReactNode
  desc: string
  change?: number
  color: string
}

// Données des statistiques
const data: DataType[] = [
  {
    title: 'Ventes en magasin',
    value: '5,345 FCFA',
    icon: <ShoppingCart className="w-6 h-6" />,
    desc: '5k commandes',
    change: 5.7,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Ventes en ligne',
    value: '74,347 FCFA',
    icon: <CreditCard className="w-6 h-6" />,
    desc: '21k commandes',
    change: 12.4,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Remises',
    value: '14,235 FCFA',
    icon: <Gift className="w-6 h-6" />,
    desc: '6k commandes',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Affiliés',
    value: '8,345 FCFA',
    icon: <Users className="w-6 h-6" />,
    desc: '150 commandes',
    change: -3.5,
    color: 'bg-orange-100 text-orange-600'
  }
]

export function ProductCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, index) => (
            <div
              key={index}
              className={`relative ${index < data.length - 1 ? 'border-r border-gray-200 pr-6' : ''}`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-medium text-gray-600">{item.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${item.color}`}>
                    {item.icon}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{item.desc}</span>
                  {item.change && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        item.change > 0 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {item.change > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(item.change)}%
                      </div>
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Séparateur pour les écrans moyens et grands */}
              {index < data.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 