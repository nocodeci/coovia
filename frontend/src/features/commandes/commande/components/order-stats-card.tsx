"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Divider } from "@/components/ui/divider"
import { 
  Clock, 
  XCircle, 
  Download,
  DollarSign,
  ShoppingCart
} from "lucide-react"
import useMediaQuery from "@/hooks/useMediaQuery"

interface OrderStats {
  cancelled: number
  downloaded: number
  totalRevenue: number
  totalOrders: number
}

interface OrderStatsCardProps {
  stats: OrderStats
}

const OrderStatsCard = ({ stats }: OrderStatsCardProps) => {
  const isBelowMdScreen = useMediaQuery("(max-width: 768px)")
  const isBelowSmScreen = useMediaQuery("(max-width: 640px)")

  const data = [
    {
      value: stats.cancelled,
      title: 'Annulées',
      icon: XCircle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      value: stats.downloaded,
      title: 'Téléchargées',
      icon: Download,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      value: stats.totalRevenue,
      title: 'Revenus totaux en CFA',
      icon: DollarSign,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      isCurrency: true
    },
    {
      value: stats.totalOrders,
      title: 'Total commandes',
      icon: ShoppingCart,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ]

  return (
    <Card className="mb-6" data-stats-card>
      <CardContent className="card-widget-separator-wrapper">
        <div className="card-body card-widget-separator">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((item, index) => (
              <div key={index} className="col-sm-6 col-lg-3">
                <div className={`flex justify-between items-start ${
                  index < data.length - 1 ? 'border-r border-gray-200 pr-6' : ''
                } pb-4 pb-sm-0`}>
                  <div>
                    <h4 className="mb-0 text-2xl font-bold">
                      {item.value.toLocaleString('fr-FR')}
                    </h4>
                    <p className="mb-0 text-sm text-muted-foreground">{item.title}</p>
                  </div>
                  <div className="avatar me-sm-6">
                    <div className={`avatar-initial bg-gray-100 rounded p-2 ${index === data.length - 1 ? '' : 'me-lg-6'}`}>
                      <item.icon className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>
                </div>
                {index < data.length - 1 && (
                  <hr className="d-none d-sm-block d-lg-none me-6" />
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OrderStatsCard 