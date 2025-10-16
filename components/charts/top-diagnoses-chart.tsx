import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DiagnosisCount } from "@/types"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface TopDiagnosesChartProps {
  data: DiagnosisCount[]
  loading?: boolean
}

export function TopDiagnosesChart({ data, loading }: TopDiagnosesChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Diagnósticos Primarios</CardTitle>
          <CardDescription>Códigos diagnósticos más frecuentes</CardDescription>
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
        <CardTitle>Top 10 Diagnósticos Primarios</CardTitle>
        <CardDescription>Códigos diagnósticos más frecuentes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" />
            <YAxis dataKey="diagnosis" type="category" width={60} className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
