import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ProvinceData } from "@/types"

interface ProvinceTableProps {
  data: ProvinceData[]
  loading?: boolean
}

export function ProvinceTable({ data, loading }: ProvinceTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Provincia</CardTitle>
          <CardDescription>Casos por ubicación geográfica</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Provincia</CardTitle>
        <CardDescription>Casos por ubicación geográfica</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provincia</TableHead>
              <TableHead className="text-right">Casos</TableHead>
              <TableHead>Distribución</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const percentage = (item.count / maxCount) * 100
              return (
                <TableRow key={item.province}>
                  <TableCell className="font-medium">{item.province}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-chart-1 transition-all" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">{Math.round(percentage)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
