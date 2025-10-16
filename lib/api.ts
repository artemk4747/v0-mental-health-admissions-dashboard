import axios from "axios"

export type Filters = {
  desde: string // "YYYY-MM"
  hasta: string // "YYYY-MM"
  ccaa?: string
  sexo?: "H" | "M" | ""
}

export type KpisResponse = {
  ingresos_total: number
  pct_reingreso: number
  estancia_media: number | null
}

export type SeriesDataPoint = {
  mes: string
  ingresos: number
}

export type TablaItem = {
  contacto_id: string
  ccaa: string
  servicio: string
  fecha: string
  edad_rango: string
  sexo: "H" | "M"
  uci: 0 | 1
  tipalt: string
}

export type TablaResponse = {
  items: TablaItem[]
  total: number
  page: number
  page_size: number
}

export type CcaaData = {
  ccaa: string
  ingresos: number
}

// Create axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  timeout: 15000,
})

// Helper to build clean query params
export function buildParams(filters: Filters) {
  return Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== ""))
}

// API functions
export async function fetchKpis(filters: Filters): Promise<KpisResponse> {
  const { data } = await api.get("/api/v1/kpis", {
    params: buildParams(filters),
  })
  return data
}

export async function fetchSeries(filters: Filters): Promise<SeriesDataPoint[]> {
  const { data } = await api.get("/api/v1/series", {
    params: buildParams(filters),
  })
  return data
}

export async function fetchTabla(filters: Filters, page = 1, pageSize = 20): Promise<TablaResponse> {
  const { data } = await api.get("/api/v1/tabla", {
    params: { ...buildParams(filters), page, page_size: pageSize },
  })
  return data
}

export async function fetchCcaaData(filters: Filters): Promise<CcaaData[]> {
  const { data } = await api.get("/api/v1/ingresos/por_ccaa", {
    params: buildParams(filters),
  })
  return data
}

export function getExportCsvUrl(filters: Filters): string {
  const params = new URLSearchParams(buildParams(filters) as Record<string, string>)
  return `${api.defaults.baseURL}/api/v1/tabla/export?${params.toString()}`
}
