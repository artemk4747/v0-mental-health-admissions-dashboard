import type {
  Admission,
  Filters,
  KPI,
  TimeSeriesPoint,
  DiagnosisCount,
  ProvinceData,
  TimeSeriesPointExtended,
  BucketCount,
  ReadmissionRate,
} from "@/types"
import { mockAdmissions } from "./mock-data"

// Toggle between mock and real API
const USE_MOCK = true

// Mock Service
class MockService {
  private admissions: Admission[] = mockAdmissions

  async fetchAdmissions(filters?: Filters): Promise<Admission[]> {
    await this.simulateDelay()
    return this.filterAdmissions(filters)
  }

  async fetchKPIs(filters?: Filters): Promise<KPI> {
    await this.simulateDelay()
    const filteredAdmissions = this.filterAdmissions(filters)

    const totalAdmissions = filteredAdmissions.length
    const averageStay = filteredAdmissions.reduce((sum, a) => sum + a.length_of_stay, 0) / totalAdmissions || 0
    const readmissions = filteredAdmissions.filter((a) => a.readmission_30d).length
    const readmissionRate = (readmissions / totalAdmissions) * 100 || 0

    const sexDistribution = {
      Masculino: filteredAdmissions.filter((a) => a.sex === "Masculino").length,
      Femenino: filteredAdmissions.filter((a) => a.sex === "Femenino").length,
      Desconocido: filteredAdmissions.filter((a) => a.sex === "Desconocido").length,
    }

    return {
      totalAdmissions,
      averageStay: Math.round(averageStay * 10) / 10,
      readmissionRate: Math.round(readmissionRate * 10) / 10,
      sexDistribution,
    }
  }

  async fetchTimeSeries(filters?: Filters): Promise<TimeSeriesPoint[]> {
    await this.simulateDelay()
    const filteredAdmissions = this.filterAdmissions(filters)

    const monthCounts = new Map<string, number>()
    filteredAdmissions.forEach((admission) => {
      const month = admission.admission_date.substring(0, 7)
      monthCounts.set(month, (monthCounts.get(month) || 0) + 1)
    })

    return Array.from(monthCounts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  async fetchTimeSeriesExtended(filters?: Filters): Promise<TimeSeriesPointExtended[]> {
    await this.simulateDelay()
    const filteredAdmissions = this.filterAdmissions(filters)

    const monthData = new Map<string, { male: number; female: number; unknown: number }>()

    filteredAdmissions.forEach((admission) => {
      const month = admission.admission_date.substring(0, 7)
      if (!monthData.has(month)) {
        monthData.set(month, { male: 0, female: 0, unknown: 0 })
      }
      const data = monthData.get(month)!
      if (admission.sex === "Masculino") data.male++
      else if (admission.sex === "Femenino") data.female++
      else data.unknown++
    })

    return Array.from(monthData.entries())
      .map(([date, counts]) => ({
        date,
        total: counts.male + counts.female + counts.unknown,
        male: counts.male,
        female: counts.female,
        unknown: counts.unknown,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  async fetchDiagnosisByChapter(filters?: Filters): Promise<DiagnosisCount[]> {
    await this.simulateDelay()
    const filteredAdmissions = this.filterAdmissions(filters)

    const chapterCounts = new Map<string, { male: number; female: number; unknown: number }>()

    filteredAdmissions.forEach((admission) => {
      const chapter = admission.diagnosis_chapter
      if (!chapterCounts.has(chapter)) {
        chapterCounts.set(chapter, { male: 0, female: 0, unknown: 0 })
      }
      const counts = chapterCounts.get(chapter)!
      if (admission.sex === "Masculino") counts.male++
      else if (admission.sex === "Femenino") counts.female++
      else counts.unknown++
    })

    return Array.from(chapterCounts.entries())
      .map(([diagnosis, counts]) => ({
        diagnosis: diagnosis.split(":")[0],
        count: counts.male + counts.female + counts.unknown,
        male: counts.male,
        female: counts.female,
        unknown: counts.unknown,
      }))
      .sort((a, b) => b.count - a.count)
  }

  async fetchTopDiagnoses(filters?: Filters, limit = 10): Promise<DiagnosisCount[]> {
    await this.simulateDelay()
    const filteredAdmissions = this.filterAdmissions(filters)

    const diagnosisCounts = new Map<string, { male: number; female: number; unknown: number }>()

    filteredAdmissions.forEach((admission) => {
      const code = admission.primary_diagnosis_code
      if (!diagnosisCounts.has(code)) {
        diagnosisCounts.set(code, { male: 0, female: 0, unknown: 0 })
      }
      const counts = diagnosisCounts.get(code)!
      if (admission.sex === "Masculino") counts.male++
      else if (admission.sex === "Femenino") counts.female++
      else counts.unknown++
    })

    return Array.from(diagnosisCounts.entries())
      .map(([diagnosis, counts]) => ({
        diagnosis,
        count: counts.male + counts.female + counts.unknown,
        male: counts.male,
        female: counts.female,
        unknown: counts.unknown,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  async fetchProvinceData(filters?: Filters): Promise<ProvinceData[]> {
    await this.simulateDelay()
    const filteredAdmissions = this.filterAdmissions(filters)

    const provinceCounts = new Map<string, number>()
    filteredAdmissions.forEach((admission) => {
      provinceCounts.set(admission.province, (provinceCounts.get(admission.province) || 0) + 1)
    })

    return Array.from(provinceCounts.entries())
      .map(([province, count]) => ({ province, count }))
      .sort((a, b) => b.count - a.count)
  }

  async fetchLengthOfStayBuckets(filters?: Filters): Promise<BucketCount[]> {
    await this.simulateDelay()
    const filteredAdmissions = this.filterAdmissions(filters)

    const buckets = [
      { label: "0-1 días", min: 0, max: 1 },
      { label: "2-3 días", min: 2, max: 3 },
      { label: "4-7 días", min: 4, max: 7 },
      { label: "8-14 días", min: 8, max: 14 },
      { label: "15-30 días", min: 15, max: 30 },
      { label: "31+ días", min: 31, max: Number.POSITIVE_INFINITY },
    ]

    const stays = filteredAdmissions.map((a) => a.length_of_stay)
    const mean = stays.reduce((sum, val) => sum + val, 0) / stays.length || 0
    const sortedStays = [...stays].sort((a, b) => a - b)
    const median = sortedStays[Math.floor(sortedStays.length / 2)] || 0

    return buckets.map(({ label, min, max }) => ({
      bucket: label,
      count: filteredAdmissions.filter((a) => a.length_of_stay >= min && a.length_of_stay <= max).length,
      mean: Math.round(mean * 10) / 10,
      median,
    }))
  }

  async fetchReadmissionRateExtended(filters?: Filters): Promise<ReadmissionRate> {
    await this.simulateDelay()
    const filteredAdmissions = this.filterAdmissions(filters)

    const total = filteredAdmissions.length
    const readmissions = filteredAdmissions.filter((a) => a.readmission_30d).length
    const rate = total > 0 ? (readmissions / total) * 100 : 0

    // Calculate previous period for comparison (mock: -2% improvement)
    const deltaPct = -2.3

    return {
      rate: Math.round(rate * 10) / 10,
      deltaPct: Math.round(deltaPct * 10) / 10,
      total,
      readmissions,
    }
  }

  private filterAdmissions(filters?: Filters): Admission[] {
    if (!filters) return this.admissions

    return this.admissions.filter((admission) => {
      if (filters.dateRange) {
        const admissionDate = new Date(admission.admission_date)
        if (admissionDate < filters.dateRange.from || admissionDate > filters.dateRange.to) {
          return false
        }
      }

      if (filters.provinces && filters.provinces.length > 0) {
        if (!filters.provinces.includes(admission.province)) return false
      }

      if (filters.municipalities && filters.municipalities.length > 0) {
        if (!filters.municipalities.includes(admission.municipality)) return false
      }

      if (filters.sexes && filters.sexes.length > 0) {
        if (!filters.sexes.includes(admission.sex)) return false
      }

      if (filters.ageGroups && filters.ageGroups.length > 0) {
        if (!filters.ageGroups.includes(admission.age_group)) return false
      }

      if (filters.diagnosisGroups && filters.diagnosisGroups.length > 0) {
        const matchesChapter = filters.diagnosisGroups.some((group) => admission.diagnosis_chapter.includes(group))
        if (!matchesChapter) return false
      }

      if (filters.severityRange) {
        const [min, max] = filters.severityRange
        if (admission.severity_score < min || admission.severity_score > max) return false
      }

      if (filters.lengthOfStayRange) {
        const [min, max] = filters.lengthOfStayRange
        if (admission.length_of_stay < min || admission.length_of_stay > max) return false
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        return (
          admission.primary_diagnosis_code.toLowerCase().includes(query) ||
          admission.diagnosis_chapter.toLowerCase().includes(query) ||
          admission.municipality.toLowerCase().includes(query)
        )
      }

      return true
    })
  }

  private simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 300))
  }
}

// Real Service (placeholder for ORDS/APEX endpoints)
class RealService {
  private baseUrl = "/api"

  async fetchAdmissions(filters?: Filters): Promise<Admission[]> {
    const params = this.buildQueryParams(filters)
    const response = await fetch(`${this.baseUrl}/admissions?${params}`)
    return response.json()
  }

  async fetchKPIs(filters?: Filters): Promise<KPI> {
    const params = this.buildQueryParams(filters)
    const response = await fetch(`${this.baseUrl}/kpis?${params}`)
    return response.json()
  }

  async fetchTimeSeries(filters?: Filters): Promise<TimeSeriesPoint[]> {
    const params = this.buildQueryParams(filters)
    const response = await fetch(`${this.baseUrl}/timeseries?${params}`)
    return response.json()
  }

  async fetchTimeSeriesExtended(filters?: Filters): Promise<TimeSeriesPointExtended[]> {
    const params = this.buildQueryParams(filters)
    const response = await fetch(`${this.baseUrl}/timeseries-extended?${params}`)
    return response.json()
  }

  async fetchDiagnosisByChapter(filters?: Filters): Promise<DiagnosisCount[]> {
    const params = this.buildQueryParams(filters)
    const response = await fetch(`${this.baseUrl}/diagnosis-by-chapter?${params}`)
    return response.json()
  }

  async fetchTopDiagnoses(filters?: Filters, limit = 10): Promise<DiagnosisCount[]> {
    const params = this.buildQueryParams(filters)
    const response = await fetch(`${this.baseUrl}/top-diagnoses?${params}&limit=${limit}`)
    return response.json()
  }

  async fetchProvinceData(filters?: Filters): Promise<ProvinceData[]> {
    const params = this.buildQueryParams(filters)
    const response = await fetch(`${this.baseUrl}/province-data?${params}`)
    return response.json()
  }

  async fetchLengthOfStayBuckets(filters?: Filters): Promise<BucketCount[]> {
    const params = this.buildQueryParams(filters)
    const response = await fetch(`${this.baseUrl}/length-of-stay-buckets?${params}`)
    return response.json()
  }

  async fetchReadmissionRateExtended(filters?: Filters): Promise<ReadmissionRate> {
    const params = this.buildQueryParams(filters)
    const response = await fetch(`${this.baseUrl}/readmission-rate-extended?${params}`)
    return response.json()
  }

  private buildQueryParams(filters?: Filters): string {
    if (!filters) return ""

    const params = new URLSearchParams()

    if (filters.dateRange) {
      params.append("from", filters.dateRange.from.toISOString())
      params.append("to", filters.dateRange.to.toISOString())
    }

    if (filters.provinces) {
      filters.provinces.forEach((p) => params.append("province", p))
    }

    if (filters.municipalities) {
      filters.municipalities.forEach((m) => params.append("municipality", m))
    }

    if (filters.sexes) {
      filters.sexes.forEach((s) => params.append("sex", s))
    }

    if (filters.ageGroups) {
      filters.ageGroups.forEach((a) => params.append("ageGroup", a))
    }

    if (filters.diagnosisGroups) {
      filters.diagnosisGroups.forEach((d) => params.append("diagnosis", d))
    }

    if (filters.severityRange) {
      params.append("severityMin", filters.severityRange[0].toString())
      params.append("severityMax", filters.severityRange[1].toString())
    }

    if (filters.lengthOfStayRange) {
      params.append("stayMin", filters.lengthOfStayRange[0].toString())
      params.append("stayMax", filters.lengthOfStayRange[1].toString())
    }

    if (filters.searchQuery) {
      params.append("q", filters.searchQuery)
    }

    return params.toString()
  }
}

// Export the active service
const service = USE_MOCK ? new MockService() : new RealService()

export const apiService = service
