"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Percent, Clock } from "lucide-react"
import type { KpisResponse } from "@/lib/api"

interface KpiCardsProps {
  data?: KpisResponse
  isLoading: boolean
  isError: boolean
}

export function KpiCards({ data, isLoading, isError }: KpiCardsProps) {
  if (isError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">Error al cargar KPIs</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted animate-pulse rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const kpis = [
    {
      title: "Ingresos Totales",
      value: data?.ingresos_total?.toLocaleString("es-ES") || "0",
      icon: Activity,
    },
    {
      title: "% Reingreso",
      value: data?.pct_reingreso ? `${(data.pct_reingreso * 100).toFixed(1)}%` : "0.0%",
      icon: Percent,
    },
    {
      title: "Estancia Media",
      value:
        data?.estancia_media !== null && data?.estancia_media !== undefined
          ? `${data.estancia_media.toFixed(1)} días`
          : "—",
      icon: Clock,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
