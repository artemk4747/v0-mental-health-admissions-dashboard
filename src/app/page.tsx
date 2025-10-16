"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KPICards } from "@/components/kpi-cards"
import { TimeSeriesChart } from "@/components/charts/time-series-chart"
import { StackedBarChart } from "@/components/charts/stacked-bar-chart"
import { TopDiagnosesChart } from "@/components/charts/top-diagnoses-chart"
import { ProvinceTable } from "@/components/charts/province-table"
import { AdmissionsTable } from "@/components/admissions-table"
import { FiltersSidebar } from "@/components/filters-sidebar"
import { DetailDrawer } from "@/components/detail-drawer"
import { AboutModal } from "@/components/about-modal"
import type { Admission, Filters, KPI, TimeSeriesPoint, DiagnosisCount, ProvinceData } from "@/types"
import { apiService } from "@/services/api"
import { Search, Info, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Dashboard() {
  const [filters, setFilters] = useState<Filters>({})
  const [appliedFilters, setAppliedFilters] = useState<Filters>({})
  const [searchQuery, setSearchQuery] = useState("")

  const [kpis, setKpis] = useState<KPI | null>(null)
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([])
  const [diagnosisByChapter, setDiagnosisByChapter] = useState<DiagnosisCount[]>([])
  const [topDiagnoses, setTopDiagnoses] = useState<DiagnosisCount[]>([])
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([])
  const [admissions, setAdmissions] = useState<Admission[]>([])

  const [loading, setLoading] = useState(true)
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null)
  const [aboutModalOpen, setAboutModalOpen] = useState(false)
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [appliedFilters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [kpisData, timeSeriesData, diagnosisData, topDiagnosesData, provinceDataResult, admissionsData] =
        await Promise.all([
          apiService.fetchKPIs(appliedFilters),
          apiService.fetchTimeSeries(appliedFilters),
          apiService.fetchDiagnosisByChapter(appliedFilters),
          apiService.fetchTopDiagnoses(appliedFilters, 10),
          apiService.fetchProvinceData(appliedFilters),
          apiService.fetchAdmissions(appliedFilters),
        ])

      setKpis(kpisData)
      setTimeSeries(timeSeriesData)
      setDiagnosisByChapter(diagnosisData)
      setTopDiagnoses(topDiagnosesData)
      setProvinceData(provinceDataResult)
      setAdmissions(admissionsData)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters, searchQuery })
    setMobileFiltersOpen(false)
  }

  const handleClearFilters = () => {
    setFilters({})
    setAppliedFilters({})
    setSearchQuery("")
  }

  const handleRowSelect = (admission: Admission) => {
    setSelectedAdmission(admission)
    setDetailDrawerOpen(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setAppliedFilters({ ...appliedFilters, searchQuery })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  {mobileFiltersOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <FiltersSidebar
                  filters={filters}
                  onFiltersChange={setFilters}
                  onApply={handleApplyFilters}
                  onClear={handleClearFilters}
                />
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold text-balance">Mental Health Admissions — Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2">
              <Input
                type="search"
                placeholder="Buscar diagnóstico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <Button variant="outline" onClick={() => setAboutModalOpen(true)}>
              <Info className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Acerca de</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 shrink-0">
            <FiltersSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-6">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="sm:hidden flex items-center gap-2">
              <Input
                type="search"
                placeholder="Buscar diagnóstico..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* KPIs */}
            {kpis && <KPICards kpis={kpis} loading={loading} />}

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              <TimeSeriesChart data={timeSeries} loading={loading} />
              <ProvinceTable data={provinceData} loading={loading} />
            </div>

            <StackedBarChart data={diagnosisByChapter} loading={loading} />

            <TopDiagnosesChart data={topDiagnoses} loading={loading} />

            {/* Table */}
            <AdmissionsTable data={admissions} onRowSelect={handleRowSelect} loading={loading} />
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container px-4 py-6">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Aviso:</strong> Los datos mostrados son anonimizados y generados para fines del Reto Malackathon
              2025.
            </p>
            <p>Dashboard desarrollado con React, TypeScript, Tailwind CSS y shadcn/ui.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AboutModal open={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
      <DetailDrawer admission={selectedAdmission} open={detailDrawerOpen} onClose={() => setDetailDrawerOpen(false)} />
    </div>
  )
}
