"use client"

import { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Filters } from "@/components/malackathon/Filters"
import { KpiCards } from "@/components/malackathon/KpiCards"
import { MonthlySeriesChart } from "@/components/malackathon/MonthlySeriesChart"
import { DataTable } from "@/components/malackathon/DataTable"
import type { Filters as FiltersType } from "@/lib/api"
import { mockKpis, mockSeries, mockTabla } from "@/lib/mock-data"

export default function MalackathonPage() {
  const [filters, setFilters] = useState<FiltersType>({
    desde: "2024-01",
    hasta: "2025-09",
  })
  const [page, setPage] = useState(1)

  const kpisData = mockKpis
  const seriesData = mockSeries
  const tablaData = mockTabla

  const handleApplyFilters = (newFilters: FiltersType) => {
    setFilters(newFilters)
    setPage(1)
  }

  const handleResetFilters = () => {
    setFilters({
      desde: "2024-01",
      hasta: "2025-09",
    })
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        <section id="inicio" className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Malackathon · RAE-CMBD Dashboard</h1>
          <p className="text-muted-foreground">
            Dashboard de análisis de datos del Registro de Actividad de Atención Especializada
          </p>
        </section>

        <Filters onApply={handleApplyFilters} onReset={handleResetFilters} />

        <section id="kpis">
          <KpiCards data={kpisData} isLoading={false} isError={false} />
        </section>

        <section id="graficos">
          <MonthlySeriesChart data={seriesData} isLoading={false} isError={false} />
        </section>

        <section id="tabla">
          <DataTable
            data={tablaData}
            isLoading={false}
            isError={false}
            filters={filters}
            page={page}
            onPageChange={setPage}
          />
        </section>
      </main>
    </div>
  )
}
