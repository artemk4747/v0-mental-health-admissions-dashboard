"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TimeSeriesPointExtended } from "@/types"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useState } from "react"

interface TimeSeriesChartProps {
  data: TimeSeriesPointExtended[]
  loading?: boolean
}

export function TimeSeriesChart({ data, loading }: TimeSeriesChartProps) {
  const [visibleSeries, setVisibleSeries] = useState({
    total: true,
    male: true,
    female: true,
    unknown: true,
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ingresos por Mes</CardTitle>
          <CardDescription>Evolución temporal de admisiones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  const handleLegendClick = (dataKey: string) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey as keyof typeof prev],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingresos por Mes</CardTitle>
        <CardDescription>Evolución temporal de admisiones (click en leyenda para mostrar/ocultar)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6} />
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFemale" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.6} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tickFormatter={(value) => {
                const [year, month] = value.split("-")
                return `${month}/${year.slice(2)}`
              }}
            />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend onClick={(e) => handleLegendClick(e.dataKey as string)} wrapperStyle={{ cursor: "pointer" }} />
            {visibleSeries.total && (
              <Area
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorTotal)"
                name="Total"
              />
            )}
            {visibleSeries.male && (
              <Area
                type="monotone"
                dataKey="male"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorMale)"
                name="Masculino"
              />
            )}
            {visibleSeries.female && (
              <Area
                type="monotone"
                dataKey="female"
                stroke="hsl(var(--chart-3))"
                fillOpacity={1}
                fill="url(#colorFemale)"
                name="Femenino"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
