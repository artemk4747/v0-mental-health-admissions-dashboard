"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import type { TablaResponse, Filters } from "@/lib/api"
import { getExportCsvUrl } from "@/lib/api"

interface DataTableProps {
  data?: TablaResponse
  isLoading: boolean
  isError: boolean
  filters: Filters
  page: number
  onPageChange: (page: number) => void
}

export function DataTable({ data, isLoading, isError, filters, page, onPageChange }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleExport = () => {
    const url = getExportCsvUrl(filters)
    window.open(url, "_blank")
  }

  const filteredItems = data?.items.filter((item) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      item.contacto_id.toLowerCase().includes(search) ||
      item.ccaa.toLowerCase().includes(search) ||
      item.servicio.toLowerCase().includes(search) ||
      item.sexo.toLowerCase().includes(search)
    )
  })

  const totalPages = data ? Math.ceil(data.total / data.page_size) : 0

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tabla de Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Error al cargar la tabla</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Tabla de Datos</CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button onClick={handleExport} variant="outline" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Exportar CSV</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : !filteredItems || filteredItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Sin filas en el rango seleccionado</p>
        ) : (
          <>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>CCAA</TableHead>
                    <TableHead>Diagnóstico/Servicio</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Sexo</TableHead>
                    <TableHead>UCI</TableHead>
                    <TableHead>Tipo Alta</TableHead>
                    <TableHead>Contacto (ID)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item, idx) => (
                    <TableRow key={`${item.contacto_id}-${idx}`}>
                      <TableCell>{item.fecha}</TableCell>
                      <TableCell>{item.ccaa}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.servicio}</TableCell>
                      <TableCell>{item.edad_rango}</TableCell>
                      <TableCell>{item.sexo}</TableCell>
                      <TableCell>{item.uci ? "Sí" : "No"}</TableCell>
                      <TableCell>{item.tipalt}</TableCell>
                      <TableCell className="font-mono text-xs">{item.contacto_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Página {page} de {totalPages} ({data?.total} registros totales)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
