"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import type { Filters as FiltersType } from "@/lib/api"

interface FiltersProps {
  onApply: (filters: FiltersType) => void
  onReset: () => void
}

export function Filters({ onApply, onReset }: FiltersProps) {
  const [mounted, setMounted] = useState(false)
  const [desde, setDesde] = useState("2024-01")
  const [hasta, setHasta] = useState("2025-09")
  const [ccaa, setCcaa] = useState("")
  const [sexo, setSexo] = useState<"Todos" | "H" | "M">("Todos")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleApply = () => {
    onApply({
      desde,
      hasta,
      ccaa: ccaa || undefined,
      sexo: sexo === "Todos" ? undefined : sexo,
    })
  }

  const handleReset = () => {
    setDesde("2024-01")
    setHasta("2025-09")
    setCcaa("")
    setSexo("Todos")
    onReset()
  }

  if (!mounted) return null

  return (
    <Card className="p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="desde">Desde</Label>
          <Input id="desde" type="month" value={desde} onChange={(e) => setDesde(e.target.value)} className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hasta">Hasta</Label>
          <Input id="hasta" type="month" value={hasta} onChange={(e) => setHasta(e.target.value)} className="w-full" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ccaa">CCAA</Label>
          <Input
            id="ccaa"
            type="text"
            placeholder="Código o nombre"
            value={ccaa}
            onChange={(e) => setCcaa(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sexo">Sexo</Label>
          <Select value={sexo} onValueChange={(v) => setSexo(v as "Todos" | "H" | "M")}>
            <SelectTrigger id="sexo">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="H">Hombre</SelectItem>
              <SelectItem value="M">Mujer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApply} className="flex-1">
            Aplicar
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </div>
    </Card>
  )
}
