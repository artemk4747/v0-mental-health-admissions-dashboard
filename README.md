# Mental Health Admissions Dashboard

Dashboard interactivo para análisis de ingresos hospitalarios por salud mental, desarrollado para el Reto Malackathon 2025.

## 🚀 Inicio Rápido

\`\`\`bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📋 Características

- **KPIs en tiempo real**: Total de ingresos, estancia media, tasa de reingresos, distribución por sexo
- **Visualizaciones interactivas**: Gráficos de series temporales, barras apiladas, top diagnósticos
- **Filtros avanzados**: Rango de fechas, provincia, sexo, edad, diagnóstico, severidad, estancia
- **Tabla detallada**: Ordenación, paginación, búsqueda, selección, exportación CSV
- **Responsive**: Adaptado para desktop, tablet y móvil
- **Accesible**: Cumple con estándares WCAG AA

## 🛠️ Stack Tecnológico

- **React 18** + **TypeScript** + **Next.js 15**
- **Tailwind CSS** + **shadcn/ui**
- **Recharts** para visualizaciones
- **TanStack Table** para tablas avanzadas

## 🏗️ Arquitectura

- **Frontend SPA**: Aplicación de una sola página con React
- **Capa de servicios**: Mock service (desarrollo) + Real service (producción)
- **Componentes desacoplados**: Arquitectura modular y reutilizable
- **Tipado TypeScript**: Interfaces completas para todos los DTOs

## 🔄 Conexión con Backend

Para conectar con Oracle APEX/ORDS:

1. Abre `src/services/api.ts`
2. Cambia `USE_MOCK = false`
3. Configura `baseUrl` con tu endpoint ORDS

Los endpoints esperados son:
- `/api/admissions` - Lista de ingresos
- `/api/kpis` - KPIs agregados
- `/api/timeseries` - Serie temporal
- `/api/diagnosis-by-chapter` - Diagnósticos por capítulo
- `/api/top-diagnoses` - Top diagnósticos
- `/api/province-data` - Datos por provincia

## 📦 Despliegue

\`\`\`bash
# Build de producción
npm run build

# Iniciar servidor de producción
npm start
\`\`\`

## 📄 Licencia

Proyecto desarrollado para Malackathon 2025.
