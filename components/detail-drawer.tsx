"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Admission } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, User, Activity, Clock, AlertCircle } from "lucide-react"

interface DetailDrawerProps {
  admission: Admission | null
  open: boolean
  onClose: () => void
}

export function DetailDrawer({ admission, open, onClose }: DetailDrawerProps) {
  if (!admission) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalle del Episodio</SheetTitle>
          <SheetDescription>ID: {admission.id}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Dates */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Fechas</span>
            </div>
            <div className="pl-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ingreso:</span>
                <span className="font-medium">{new Date(admission.admission_date).toLocaleDateString("es-ES")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Alta:</span>
                <span className="font-medium">{new Date(admission.discharge_date).toLocaleDateString("es-ES")}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Ubicación</span>
            </div>
            <div className="pl-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provincia:</span>
                <span className="font-medium">{admission.province}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Municipio:</span>
                <span className="font-medium">{admission.municipality}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Patient Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Información del Paciente</span>
            </div>
            <div className="pl-6 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sexo:</span>
                <Badge variant={admission.sex === "Masculino" ? "default" : "secondary"}>{admission.sex}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grupo de edad:</span>
                <span className="font-medium">{admission.age_group}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Diagnosis */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Diagnóstico</span>
            </div>
            <div className="pl-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Código:</span>
                <span className="font-medium font-mono">{admission.primary_diagnosis_code}</span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Capítulo:</span>
                <p className="text-xs leading-relaxed">{admission.diagnosis_chapter}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Clinical Data */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Datos Clínicos</span>
            </div>
            <div className="pl-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estancia:</span>
                <span className="font-medium">{admission.length_of_stay} días</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Severidad:</span>
                <Badge variant="outline">{admission.severity_score}/10</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Reingreso 30d:</span>
                <Badge variant={admission.readmission_30d ? "destructive" : "outline"}>
                  {admission.readmission_30d ? "Sí" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {admission.readmission_30d && (
            <>
              <Separator />
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-destructive">Reingreso detectado</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Este paciente reingresó dentro de los 30 días posteriores al alta.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6">
          <Button onClick={onClose} className="w-full">
            Cerrar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
