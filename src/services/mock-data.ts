import type { Admission } from "@/types"

const provinces = [
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Zaragoza",
  "Málaga",
  "Murcia",
  "Palma",
  "Las Palmas",
  "Bilbao",
]

const municipalities: Record<string, string[]> = {
  Madrid: ["Madrid", "Móstoles", "Alcalá de Henares", "Fuenlabrada"],
  Barcelona: ["Barcelona", "Hospitalet", "Badalona", "Terrassa"],
  Valencia: ["Valencia", "Gandía", "Torrent", "Paterna"],
  Sevilla: ["Sevilla", "Dos Hermanas", "Alcalá de Guadaíra"],
  Zaragoza: ["Zaragoza", "Calatayud", "Utebo"],
  Málaga: ["Málaga", "Marbella", "Vélez-Málaga"],
  Murcia: ["Murcia", "Cartagena", "Lorca"],
  Palma: ["Palma", "Calvià", "Manacor"],
  "Las Palmas": ["Las Palmas", "Telde", "Arucas"],
  Bilbao: ["Bilbao", "Barakaldo", "Getxo"],
}

const diagnosisChapters = [
  "F00-F09: Trastornos mentales orgánicos",
  "F10-F19: Trastornos por uso de sustancias",
  "F20-F29: Esquizofrenia y trastornos psicóticos",
  "F30-F39: Trastornos del estado de ánimo",
  "F40-F48: Trastornos de ansiedad",
  "F50-F59: Trastornos de la conducta alimentaria",
  "F60-F69: Trastornos de la personalidad",
  "F70-F79: Retraso mental",
  "F80-F89: Trastornos del desarrollo",
  "F90-F98: Trastornos de inicio en la infancia",
]

const diagnosisCodes: Record<string, string[]> = {
  "F00-F09: Trastornos mentales orgánicos": ["F00", "F01", "F02", "F03", "F05"],
  "F10-F19: Trastornos por uso de sustancias": ["F10.2", "F11.2", "F12.2", "F13.2", "F14.2", "F15.2"],
  "F20-F29: Esquizofrenia y trastornos psicóticos": ["F20.0", "F20.1", "F20.2", "F25.0", "F25.1"],
  "F30-F39: Trastornos del estado de ánimo": ["F31.0", "F31.3", "F32.0", "F32.1", "F32.2", "F33.0", "F33.2"],
  "F40-F48: Trastornos de ansiedad": ["F40.0", "F41.0", "F41.1", "F42.0", "F43.1"],
  "F50-F59: Trastornos de la conducta alimentaria": ["F50.0", "F50.1", "F50.2"],
  "F60-F69: Trastornos de la personalidad": ["F60.0", "F60.3", "F60.31"],
  "F70-F79: Retraso mental": ["F70", "F71", "F72"],
  "F80-F89: Trastornos del desarrollo": ["F84.0", "F84.5"],
  "F90-F98: Trastornos de inicio en la infancia": ["F90.0", "F91.0", "F98.0"],
}

const sexes: Array<"Masculino" | "Femenino" | "Desconocido"> = ["Masculino", "Femenino", "Desconocido"]
const ageGroups: Array<"0-17" | "18-25" | "26-40" | "41-65" | "66+"> = ["0-17", "18-25", "26-40", "41-65", "66+"]

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function generateMockAdmissions(count = 500): Admission[] {
  const admissions: Admission[] = []
  const startDate = new Date("2023-01-01")
  const endDate = new Date("2024-12-31")

  for (let i = 0; i < count; i++) {
    const province = randomElement(provinces)
    const municipality = randomElement(municipalities[province])
    const sex = randomElement(sexes)
    const ageGroup = randomElement(ageGroups)
    const diagnosisChapter = randomElement(diagnosisChapters)
    const diagnosisCodes_list = diagnosisCodes[diagnosisChapter]
    const primaryDiagnosisCode = randomElement(diagnosisCodes_list)
    const admissionDate = randomDate(startDate, endDate)
    const lengthOfStay = Math.floor(Math.random() * 30) + 1
    const dischargeDate = new Date(admissionDate)
    dischargeDate.setDate(dischargeDate.getDate() + lengthOfStay)

    admissions.push({
      id: `ADM-${i + 1}`,
      admission_date: admissionDate.toISOString().split("T")[0],
      discharge_date: dischargeDate.toISOString().split("T")[0],
      province,
      municipality,
      sex,
      age_group: ageGroup,
      primary_diagnosis_code: primaryDiagnosisCode,
      diagnosis_group: primaryDiagnosisCode,
      diagnosis_chapter: diagnosisChapter,
      length_of_stay: lengthOfStay,
      readmission_30d: Math.random() > 0.85,
      severity_score: Math.floor(Math.random() * 10) + 1,
    })
  }

  return admissions.sort((a, b) => new Date(b.admission_date).getTime() - new Date(a.admission_date).getTime())
}

export const mockAdmissions = generateMockAdmissions(500)
