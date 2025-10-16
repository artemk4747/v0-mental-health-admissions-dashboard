export interface TimeSeriesPointExtended {
  date: string
  total: number
  male?: number
  female?: number
  unknown?: number
}

export interface DiagnosisGroupBar {
  group: string
  male: number
  female: number
  unknown: number
  total: number
}

export interface TopDiagnosisItem {
  code: string
  label: string
  count: number
  pct: number
}

export interface BucketCount {
  bucket: string
  count: number
  mean?: number
  median?: number
}

export interface ProvinceAggregate {
  province: string
  count: number
  trend?: Array<{ date: string; value: number }>
}

export interface ReadmissionRate {
  rate: number
  deltaPct: number
  total: number
  readmissions: number
}
