import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DiagnosisCount } from "@/types"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface StackedBarChartProps {
  data: DiagnosisCount[]
  loading?: boolean
}

export function StackedBarChart({ data, loading }: StackedBarChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Diagnósticos por Capítulo y Sexo</CardTitle>
          <CardDescription>Distribución de casos por categoría diagnóstica</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnósticos por Capítulo y Sexo</CardTitle>
        <CardDescription>Distribución de casos por categoría diagnóstica</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" />
            <YAxis dataKey="diagnosis" type="category" width={100} className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="male" stackId="a" fill="hsl(var(--chart-1))" name="Masculino" />
            <Bar dataKey="female" stackId="a" fill="hsl(var(--chart-2))" name="Femenino" />
            <Bar dataKey="unknown" stackId="a" fill="hsl(var(--chart-3))" name="Desconocido" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
