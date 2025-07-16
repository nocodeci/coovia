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
import { mockTransactions } from "@/data/mock-transactions"

export const description = "Graphique interactif des revenus des ventes à succès"

// Générer des données de revenus basées uniquement sur les ventes à succès
const generatePaymentData = () => {
  const data = []
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 3)

  // Créer un map pour calculer les revenus par date
  const revenueByDate = new Map()

  // Traiter uniquement les transactions avec le statut "Succès"
  mockTransactions
    .filter((transaction) => transaction.status === "Succès")
    .forEach((transaction) => {
      const transactionDate = new Date(transaction.joinDate)
      const dateStr = transactionDate.toISOString().split("T")[0]

      if (!revenueByDate.has(dateStr)) {
        revenueByDate.set(dateStr, {
          revenus: 0,
        })
      }

      const dayData = revenueByDate.get(dateStr)
      dayData.revenus += transaction.value
    })

  // Générer les données pour chaque jour des 3 derniers mois
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0]
    const dayData = revenueByDate.get(dateStr)

    if (dayData) {
      // Utiliser les vrais revenus
      data.push({
        date: dateStr,
        revenus: dayData.revenus,
      })
    } else {
      // Pas de revenus ce jour-là
      data.push({
        date: dateStr,
        revenus: 0,
      })
    }
  }

  return data
}

const chartData = generatePaymentData()

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
  const [timeRange, setTimeRange] = React.useState("30d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  // Calculer les totaux pour la période sélectionnée basés sur les revenus des ventes à succès
  const totals = React.useMemo(() => {
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    // Filtrer uniquement les transactions à succès selon la période sélectionnée
    const filteredTransactions = mockTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.joinDate)
      return transactionDate >= startDate && transaction.status === "Succès"
    })

    // Calculer le total des revenus
    const totalRevenus = filteredTransactions.reduce((sum, transaction) => sum + transaction.value, 0)
    const nombreVentes = filteredTransactions.length

    return {
      revenus: totalRevenus,
      ventes: nombreVentes,
    }
  }, [timeRange])

  const totalRevenus = totals.revenus
  const nombreVentes = totals.ventes

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
          <AreaChart data={filteredData}>
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
