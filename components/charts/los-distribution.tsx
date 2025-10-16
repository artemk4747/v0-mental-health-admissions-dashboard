"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { BucketCount } from "@/types"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts"

interface LOSDistributionProps {
  data: BucketCount[]
  loading?: boolean
}

export function LOSDistribution({ data, loading }: LOSDistributionProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Estancia</CardTitle>
          <CardDescription>Días de hospitalización por tramos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  const mean = data[0]?.mean || 0
  const median = data[0]?.median || 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Estancia</CardTitle>
        <CardDescription>
          Media: {mean} días | Mediana: {median} días
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="bucket" className="text-xs" angle={-45} textAnchor="end" height={80} />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value} ingresos`, "Cantidad"]}
            />
            <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            <ReferenceLine y={mean} stroke="hsl(var(--chart-1))" strokeDasharray="3 3" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
