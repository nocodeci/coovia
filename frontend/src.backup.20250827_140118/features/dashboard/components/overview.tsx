"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import apiService from "@/lib/api"
import { useStore } from "@/context/store-context"

export const description = "Graphique interactif des revenus des ventes à succès"

const chartConfig = {
  ventes: {
    label: "Ventes",
  },
  revenus: {
    label: "Revenus (CFA)",
    color: "hsl(142, 76%, 36%)",
  },
} satisfies ChartConfig

export function Overview() {
  const { currentStore } = useStore()
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartData, setChartData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Charger les données du graphique depuis le backend
  React.useEffect(() => {
    const loadChartData = async () => {
      if (!currentStore?.id) return

      try {
        setLoading(true)
        const response = await apiService.getRevenueChart(currentStore.id, timeRange)
        
        if (response.success && response.data) {
          setChartData(response.data as any[])
        } else {
          setError('Erreur lors du chargement des données du graphique')
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement du graphique:', err)
        setError(err.message || 'Erreur de connexion')
      } finally {
        setLoading(false)
      }
    }

    loadChartData()
  }, [currentStore?.id, timeRange])

  // Calculer les totaux pour la période sélectionnée
  const totals = React.useMemo(() => {
    if (!chartData.length) return { revenus: 0, ventes: 0 }

    const totalRevenus = chartData.reduce((sum, item) => sum + (item.revenus || 0), 0)
    const nombreVentes = chartData.filter(item => item.revenus > 0).length

    return {
      revenus: totalRevenus,
      ventes: nombreVentes,
    }
  }, [chartData])

  const totalRevenus = totals.revenus
  const nombreVentes = totals.ventes

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[250px]">
        <p className="text-muted-foreground">Chargement du graphique...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[250px]">
        <p className="text-red-500">Erreur: {error}</p>
      </div>
    )
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Analyse des Revenus - Interactive</CardTitle>
          <CardDescription>
            {totalRevenus.toLocaleString()} CFA générés • {nombreVentes} ventes réussies
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Sélectionner une période"
          >
            <SelectValue placeholder="3 derniers mois" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              3 derniers mois
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              30 derniers jours
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 derniers jours
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillRevenus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenus)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-revenus)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  formatter={(value) => [`${value} CFA`, " Revenus"]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="revenus"
              type="natural"
              fill="url(#fillRevenus)"
              stroke="var(--color-revenus)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
