# ProdBooster · Agente de Cobranza Judicial

Front real (solo frontend) del prototipo del agente de cobranza judicial para
estudios jurídicos. Recrea el borrador HTML como una app React modular con
navegación real, estado y flujos agénticos simulados sobre mock data.

## Stack

- **React 19 + TypeScript**
- **Vite** (dev server + build)
- **React Router** (navegación entre pantallas)
- **Zustand** (estado global: chat, colas de firma/revisión, toasts)

Todo es frontend: no hay backend. Los datos viven en `src/data/` y las acciones
(encargar embargo, firmar, validar OCR, generar informe, cargar lote) se simulan
en el cliente con timeouts, toasts y actualización de estado.

## Correr el proyecto

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción
```

## Pantallas y funciones

| Ruta | Pantalla | Funciones |
|------|----------|-----------|
| `/` | **Home** | **Agente global** con briefing del día y plan de trabajo priorizado (FB-02), **recordatorios internos** que vencen hoy (FB-06), tarjetas "Vence pronto", métricas en lote que abren flujos agénticos. Las causas suspendidas/eliminadas quedan fuera de urgentes y métricas |
| `/bienvenida` | **Bienvenida** | Input del procurador, chips de acción, drag & drop de ZIP que deriva a Demandas |
| `/demandas` | **Demandas** (FB-01) | La demanda vive antes que la causa (redactada/lista/subida/suspendida). Ingesta de ZIP con **feedback en vivo** fila a fila (FB-08), buscador, filtro por estado, "Marcar como lista" con aviso de **crédito recurrente** |
| `/causas` | **Causas** | Lista con filtro por etapa + **filtro de gestión** (Activas/Suspendidas/Todas) y búsqueda por crédito/RUT/nombre/patente |
| `/causas/:id` | **Causa interior** | Tabs Procurador / Expediente / Documentos / **Hitos de cobro** (FB-07). Chat agéntico; **menú Gestión** para suspender/reactivar/eliminar con motivo (FB-05); **notas internas** en Datos y creación de recordatorios por chat (FB-06); los escritos redactables abren el **editor tipo Word** (FB-04) |
| `/estado-diario` | **Estado diario PJUD** (FB-03) | Vista secundaria de respaldo: tabla rol/movimiento/tribunal con filtro por día y lupa → causa. Enlazada desde el Inicio, no compite con el feed del agente |
| `/revisiones` | **Revisión manual** | Decisiones humanas, mandamientos y OCR. "Preparar borrador" y "rectifíquese" abren el editor de escritos (FB-04) |
| `/informes` | **Informes** | Semáforo de cartera, causas detenidas, generación de informe para la financiera |
| `/config` | **Configuración** | Pautas por financiera (intentos, política CAV, umbral) y base de receptores con toggles |
| `/backlog` | **Backlog** | Backlog de producto de 3 semanas + feedback Loreto (07/07), con enlaces navegables |

## Estructura

```
src/
  components/   Icon, Rail, Toasts, Modal, RichText, BatchFlowModal, EscritoEditor
  data/         mock.ts (causas, demandas, recordatorios, PJUD diario…) · flows.ts · escritos.ts (plantillas del editor)
  pages/        Home, Welcome, Demandas, EstadoDiario, Causas, Causa, Revisiones, Informes, Config, Backlog
  store/        useAppStore.ts (Zustand: causas, demandas, recordatorios, notas, borradores…)
  types.ts      Modelo de dominio
  index.css     Design system (tokens Indigo/Violeta, Poppins)
```

## Fuera de alcance (igual que en el corte del MVP)

La subida efectiva a la OJV no está implementada: los escritos quedan firmados y
listos, y el submit se marca manualmente. Tampoco hay integraciones reales
(PJUD, Registro Civil, OCR); todo se simula en el cliente.
