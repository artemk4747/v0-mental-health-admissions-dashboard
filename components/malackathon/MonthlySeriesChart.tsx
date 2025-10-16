"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SeriesDataPoint } from "@/lib/api"

interface MonthlySeriesChartProps {
  data?: SeriesDataPoint[]
  isLoading: boolean
  isError: boolean
}

export function MonthlySeriesChart({ data, isLoading, isError }: MonthlySeriesChartProps) {
  if (isError) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Serie Mensual de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Error al cargar la serie</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Serie Mensual de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Serie Mensual de Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Sin datos en el rango seleccionado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Serie mensual de ingresos (ejemplo)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <span className="font-medium text-sm">{item.mes}</span>
              <span className="text-lg font-semibold text-primary">{item.ingresos.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
