"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Filters } from "@/components/malackathon/Filters"
import { KpiCards } from "@/components/malackathon/KpiCards"
import { MonthlySeriesChart } from "@/components/malackathon/MonthlySeriesChart"
import { DataTable } from "@/components/malackathon/DataTable"
import { fetchKpis, fetchSeries, fetchTabla } from "@/lib/api"
import type { Filters as FiltersType } from "@/lib/api"

export default function MalackathonPage() {
  const [filters, setFilters] = useState<FiltersType>({
    desde: "2024-01",
    hasta: "2025-09",
  })
  const [page, setPage] = useState(1)

  const {
    data: kpisData,
    isLoading: kpisLoading,
    isError: kpisError,
  } = useQuery({
    queryKey: ["kpis", filters],
    queryFn: () => fetchKpis(filters),
  })

  const {
    data: seriesData,
    isLoading: seriesLoading,
    isError: seriesError,
  } = useQuery({
    queryKey: ["series", filters],
    queryFn: () => fetchSeries(filters),
  })

  const {
    data: tablaData,
    isLoading: tablaLoading,
    isError: tablaError,
  } = useQuery({
    queryKey: ["tabla", filters, page],
    queryFn: () => fetchTabla(filters, page, 20),
  })

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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Malackathon · RAE-CMBD Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Filters onApply={handleApplyFilters} onReset={handleResetFilters} />

        <KpiCards data={kpisData} isLoading={kpisLoading} isError={kpisError} />

        <MonthlySeriesChart data={seriesData} isLoading={seriesLoading} isError={seriesError} />

        <DataTable
          data={tablaData}
          isLoading={tablaLoading}
          isError={tablaError}
          filters={filters}
          page={page}
          onPageChange={setPage}
        />
      </main>
    </div>
  )
}
