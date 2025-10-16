"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { Filters } from "@/types"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

interface FiltersSidebarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onApply: () => void
  onClear: () => void
}

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

const sexOptions = ["Masculino", "Femenino", "Desconocido"]
const ageGroupOptions = ["0-17", "18-25", "26-40", "41-65", "66+"]
const diagnosisOptions = [
  "F00-F09",
  "F10-F19",
  "F20-F29",
  "F30-F39",
  "F40-F48",
  "F50-F59",
  "F60-F69",
  "F70-F79",
  "F80-F89",
  "F90-F98",
]

export function FiltersSidebar({ filters, onFiltersChange, onApply, onClear }: FiltersSidebarProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    filters.dateRange ? { from: filters.dateRange.from, to: filters.dateRange.to } : undefined,
  )

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      onFiltersChange({ ...filters, dateRange: { from: range.from, to: range.to } })
    }
  }

  const handleProvinceChange = (value: string) => {
    const provinces = value === "all" ? [] : [value]
    onFiltersChange({ ...filters, provinces })
  }

  const handleSexToggle = (sex: string) => {
    const sexes = filters.sexes || []
    const newSexes = sexes.includes(sex) ? sexes.filter((s) => s !== sex) : [...sexes, sex]
    onFiltersChange({ ...filters, sexes: newSexes })
  }

  const handleAgeGroupToggle = (ageGroup: string) => {
    const ageGroups = filters.ageGroups || []
    const newAgeGroups = ageGroups.includes(ageGroup)
      ? ageGroups.filter((a) => a !== ageGroup)
      : [...ageGroups, ageGroup]
    onFiltersChange({ ...filters, ageGroups: newAgeGroups })
  }

  const handleDiagnosisToggle = (diagnosis: string) => {
    const diagnosisGroups = filters.diagnosisGroups || []
    const newDiagnosisGroups = diagnosisGroups.includes(diagnosis)
      ? diagnosisGroups.filter((d) => d !== diagnosis)
      : [...diagnosisGroups, diagnosis]
    onFiltersChange({ ...filters, diagnosisGroups: newDiagnosisGroups })
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Range */}
        <div className="space-y-2">
          <Label>Rango de Fechas</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy")
                  )
                ) : (
                  <span>Seleccionar fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Province */}
        <div className="space-y-2">
          <Label>Provincia</Label>
          <Select value={filters.provinces?.[0] || "all"} onValueChange={handleProvinceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las provincias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las provincias</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sex */}
        <div className="space-y-2">
          <Label>Sexo</Label>
          <div className="space-y-2">
            {sexOptions.map((sex) => (
              <div key={sex} className="flex items-center space-x-2">
                <Checkbox
                  id={`sex-${sex}`}
                  checked={filters.sexes?.includes(sex)}
                  onCheckedChange={() => handleSexToggle(sex)}
                />
                <label
                  htmlFor={`sex-${sex}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {sex}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Age Group */}
        <div className="space-y-2">
          <Label>Grupo de Edad</Label>
          <div className="space-y-2">
            {ageGroupOptions.map((ageGroup) => (
              <div key={ageGroup} className="flex items-center space-x-2">
                <Checkbox
                  id={`age-${ageGroup}`}
                  checked={filters.ageGroups?.includes(ageGroup)}
                  onCheckedChange={() => handleAgeGroupToggle(ageGroup)}
                />
                <label
                  htmlFor={`age-${ageGroup}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {ageGroup}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnosis */}
        <div className="space-y-2">
          <Label>Capítulo Diagnóstico</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {diagnosisOptions.map((diagnosis) => (
              <div key={diagnosis} className="flex items-center space-x-2">
                <Checkbox
                  id={`diagnosis-${diagnosis}`}
                  checked={filters.diagnosisGroups?.includes(diagnosis)}
                  onCheckedChange={() => handleDiagnosisToggle(diagnosis)}
                />
                <label
                  htmlFor={`diagnosis-${diagnosis}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {diagnosis}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Score */}
        <div className="space-y-2">
          <Label>Severidad (1-10)</Label>
          <Slider
            min={1}
            max={10}
            step={1}
            value={filters.severityRange || [1, 10]}
            onValueChange={(value) => onFiltersChange({ ...filters, severityRange: value as [number, number] })}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{filters.severityRange?.[0] || 1}</span>
            <span>{filters.severityRange?.[1] || 10}</span>
          </div>
        </div>

        {/* Length of Stay */}
        <div className="space-y-2">
          <Label>Estancia (días)</Label>
          <Slider
            min={1}
            max={30}
            step={1}
            value={filters.lengthOfStayRange || [1, 30]}
            onValueChange={(value) => onFiltersChange({ ...filters, lengthOfStayRange: value as [number, number] })}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{filters.lengthOfStayRange?.[0] || 1}</span>
            <span>{filters.lengthOfStayRange?.[1] || 30}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={onApply} className="flex-1">
            Aplicar
          </Button>
          <Button onClick={onClear} variant="outline" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
