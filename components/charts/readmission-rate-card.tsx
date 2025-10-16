"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReadmissionRate } from "@/types"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

interface ReadmissionRateCardProps {
  data: ReadmissionRate | null
  loading?: boolean
}

export function ReadmissionRateCard({ data, loading }: ReadmissionRateCardProps) {
  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasa de Reingreso</CardTitle>
          <CardDescription>Reingresos a 30 días</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  const chartData = [
    { name: "Reingresos", value: data.rate, fill: "hsl(var(--chart-4))" },
    { name: "Sin reingreso", value: 100 - data.rate, fill: "hsl(var(--muted))" },
  ]

  const isImprovement = data.deltaPct < 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasa de Reingreso</CardTitle>
        <CardDescription>Reingresos a 30 días</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-4xl font-bold">{data.rate}%</div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              {isImprovement ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-600" />
              )}
              <span className={isImprovement ? "text-green-600" : "text-red-600"}>
                {Math.abs(data.deltaPct)}% vs periodo anterior
              </span>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {data.readmissions} de {data.total} pacientes
            </div>
          </div>
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
