import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AboutModalProps {
  open: boolean
  onClose: () => void
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Acerca del Dashboard</DialogTitle>
          <DialogDescription>Información técnica y funcional del proyecto</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tech" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tech">Tecnologías</TabsTrigger>
            <TabsTrigger value="arch">Arquitectura</TabsTrigger>
            <TabsTrigger value="features">Funcionalidades</TabsTrigger>
          </TabsList>

          <TabsContent value="tech" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Stack Tecnológico</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Frontend Framework</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>React 18</Badge>
                      <Badge>TypeScript</Badge>
                      <Badge>Next.js 15</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">UI & Styling</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Tailwind CSS</Badge>
                      <Badge variant="secondary">shadcn/ui</Badge>
                      <Badge variant="secondary">Radix UI</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Data Visualization</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Recharts</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Data Management</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">TanStack Table</Badge>
                      <Badge variant="outline">React Hooks</Badge>
                      <Badge variant="outline">date-fns</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="arch" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Arquitectura del Sistema</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">Frontend SPA (Single Page Application)</p>
                    <p className="text-muted-foreground">
                      Aplicación React con TypeScript que se ejecuta completamente en el navegador, proporcionando una
                      experiencia de usuario fluida y responsive.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Capa de Servicios</p>
                    <p className="text-muted-foreground">
                      Abstracción de datos con dos implementaciones: MockService (datos estáticos para desarrollo) y
                      RealService (preparado para consumir endpoints REST de Oracle APEX/ORDS).
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Componentes Presentacionales</p>
                    <p className="text-muted-foreground">
                      Arquitectura basada en componentes desacoplados y reutilizables, con separación clara entre lógica
                      de negocio y presentación.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Tipado TypeScript</p>
                    <p className="text-muted-foreground">
                      Sistema de tipos completo que garantiza la integridad de datos en toda la aplicación, con
                      interfaces para DTOs, filtros, KPIs y entidades de dominio.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Estado con React Hooks</p>
                    <p className="text-muted-foreground">
                      Gestión de estado local con useState y useEffect, sin dependencias externas de gestión de estado
                      global, manteniendo la aplicación ligera y eficiente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Funcionalidades Principales</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">📊 Gráficos Interactivos</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Serie temporal de ingresos por mes (área chart)</li>
                      <li>Diagnósticos por capítulo y sexo (barras apiladas)</li>
                      <li>Top 10 diagnósticos primarios (barras horizontales)</li>
                      <li>Distribución geográfica por provincia (tabla heat)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">🔍 Filtros Facetados</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Rango de fechas con date picker</li>
                      <li>Provincia y municipio con búsqueda</li>
                      <li>Sexo y grupo de edad (multi-selección)</li>
                      <li>Capítulo diagnóstico (multi-selección)</li>
                      <li>Severidad y estancia (sliders de rango)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">📋 Tabla Detallada</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Ordenación por columnas</li>
                      <li>Paginación cliente</li>
                      <li>Búsqueda en columnas</li>
                      <li>Selección de filas</li>
                      <li>Exportación a CSV</li>
                      <li>Vista detallada en drawer lateral</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">📱 Diseño Responsive</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Adaptado para desktop, tablet y móvil</li>
                      <li>Sidebar de filtros como drawer en móvil</li>
                      <li>Gráficos apilados en pantallas pequeñas</li>
                      <li>Navegación optimizada para touch</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">♿ Accesibilidad</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Etiquetas ARIA en todos los controles</li>
                      <li>Navegación por teclado completa</li>
                      <li>Contraste de colores WCAG AA</li>
                      <li>Estados de carga y vacío informativos</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-1">🔄 Preparado para Backend</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Capa de servicios lista para ORDS/APEX</li>
                      <li>Construcción automática de query params</li>
                      <li>Manejo de estados de carga y error</li>
                      <li>Fácil conmutación entre mock y real (USE_MOCK flag)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
