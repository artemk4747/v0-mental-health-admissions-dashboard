"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Admission } from "@/types"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  getFilteredRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUpDown, Download, Eye } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

interface AdmissionsTableProps {
  data: Admission[]
  onRowSelect: (admission: Admission) => void
  loading?: boolean
}

export function AdmissionsTable({ data, onRowSelect, loading }: AdmissionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Admission>[] = [
    {
      accessorKey: "admission_date",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Fecha Ingreso
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("admission_date"))
        return <div>{date.toLocaleDateString("es-ES")}</div>
      },
    },
    {
      accessorKey: "discharge_date",
      header: "Fecha Alta",
      cell: ({ row }) => {
        const date = new Date(row.getValue("discharge_date"))
        return <div>{date.toLocaleDateString("es-ES")}</div>
      },
    },
    {
      accessorKey: "province",
      header: "Provincia",
    },
    {
      accessorKey: "municipality",
      header: "Municipio",
    },
    {
      accessorKey: "sex",
      header: "Sexo",
      cell: ({ row }) => {
        const sex = row.getValue("sex") as string
        return (
          <Badge variant={sex === "Masculino" ? "default" : sex === "Femenino" ? "secondary" : "outline"}>{sex}</Badge>
        )
      },
    },
    {
      accessorKey: "age_group",
      header: "Edad",
    },
    {
      accessorKey: "primary_diagnosis_code",
      header: "Código Dx",
    },
    {
      accessorKey: "length_of_stay",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Estancia
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div>{row.getValue("length_of_stay")} días</div>
      },
    },
    {
      accessorKey: "readmission_30d",
      header: "Reingreso",
      cell: ({ row }) => {
        const readmission = row.getValue("readmission_30d")
        return <Badge variant={readmission ? "destructive" : "outline"}>{readmission ? "Sí" : "No"}</Badge>
      },
    },
    {
      accessorKey: "severity_score",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Severidad
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button variant="ghost" size="icon" onClick={() => onRowSelect(row.original)}>
            <Eye className="h-4 w-4" />
          </Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  const exportToCSV = () => {
    const headers = columns
      .filter((col) => col.id !== "actions")
      .map((col) => (typeof col.header === "string" ? col.header : (col.accessorKey as string)))

    const rows = data.map((row) =>
      columns
        .filter((col) => col.id !== "actions")
        .map((col) => {
          const key = col.accessorKey as keyof Admission
          return row[key]
        }),
    )

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "admissions.csv"
    a.click()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tabla de Ingresos</CardTitle>
          <CardDescription>Datos detallados de admisiones hospitalarias</CardDescription>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tabla de Ingresos</CardTitle>
            <CardDescription>Datos detallados de admisiones hospitalarias</CardDescription>
          </div>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Buscar por código diagnóstico, municipio..."
            value={(table.getColumn("primary_diagnosis_code")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("primary_diagnosis_code")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s)
              seleccionada(s).
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
