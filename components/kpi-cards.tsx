import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { KPI } from "@/types"
import { Activity, Clock, RefreshCw, Users } from "lucide-react"

interface KPICardsProps {
  kpis: KPI
  loading?: boolean
}

export function KPICards({ kpis, loading }: KPICardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.totalAdmissions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Registros filtrados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estancia Media</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.averageStay} días</div>
          <p className="text-xs text-muted-foreground">Promedio de hospitalización</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reingresos 30d</CardTitle>
          <RefreshCw className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.readmissionRate}%</div>
          <p className="text-xs text-muted-foreground">Tasa de reingreso</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distribución Sexo</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">M:</span>
              <span className="font-medium">{kpis.sexDistribution.Masculino}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">F:</span>
              <span className="font-medium">{kpis.sexDistribution.Femenino}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
