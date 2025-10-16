export interface Admission {
  id: string
  admission_date: string
  discharge_date: string
  province: string
  municipality: string
  sex: string
  age_group: string
  primary_diagnosis_code: string
  diagnosis_chapter: string
  length_of_stay: number
  readmission_30d: boolean
  severity_score: number
}

export interface Filters {
  dateRange?: {
    from: Date
    to: Date
  }
  provinces?: string[]
  municipalities?: string[]
  sexes?: string[]
  ageGroups?: string[]
  diagnosisGroups?: string[]
  severityRange?: [number, number]
  lengthOfStayRange?: [number, number]
  searchQuery?: string
}

export interface KPI {
  totalAdmissions: number
  averageStay: number
  readmissionRate: number
  sexDistribution: {
    Masculino: number
    Femenino: number
    Desconocido: number
  }
}

export interface TimeSeriesPoint {
  date: string
  count: number
}

export interface DiagnosisCount {
  diagnosis: string
  count: number
  male: number
  female: number
  unknown: number
}

export interface ProvinceData {
  province: string
  count: number
}
