# Cobertura funcional y académica

La columna de interfaz indica implementación Angular contra el contrato actual. No implica que el backend ya cumpla toda regla de seguridad ni que se haya ejecutado la prueba real autenticada en Render.

| RF del Avance 2 | Interfaz / ruta | Estado y dependencia |
|---|---|---|
| 01, 03, 04, 05 · Cuentas | Equipo y accesos | Registro, consulta, filtro por rol y desactivación conectados |
| 02 · Actualizar cuenta | Equipo y accesos | Pendiente por DTO de backend incompatible, explicado en UI |
| 06–12 · Perfil, formación, experiencia, habilidades, completitud | Mi perfil | Formularios y consultas conectados. La completitud viene del servidor |
| 13–17 · Vacantes y requisitos | Oportunidades y creación | Borrador, publicación, cierre, consulta y filtros conectados |
| 18–25 · Postulación, estados, matching e historial | Postulaciones / detalle | Propias/asignadas/por vacante, cambios y desglose conectados |
| 26–28 · Agenda y conflictos | Agenda de entrevistas | Consulta, creación y cambios de estado. Errores de conflicto visibles |
| 29–30 · Evaluaciones | Evaluaciones | Criterios dinámicos y consulta por postulación/evaluador |
| 31–32 · Retroalimentación | Evaluaciones y detalle de postulación | Creación con visibilidad y consulta visible para postulante |
| 33 · Dashboard | Indicadores | Campos disponibles del endpoint. No hay filtro temporal de servidor |
| 34 · Login | Ingresar | JWT, expiración y navegación por rol |
| 35 · Asignación explícita | Sin operación ficticia | Endpoint y persistencia de asignación pendientes en backend |
| 36 · Persistir intento rechazado | Error visible al agendar | Falta registro durable del evento en servidor |
| 37 · Tiempos por etapa | Identificado en Indicadores | Falta agregado de historial en servidor |

## Temas Angular

| Tema | Evidencia |
|---|---|
| Fundamentos / generación de componentes | Componentes standalone con `@Component` y archivos separados; nuevas páginas con `npx ng generate component pages/nueva --style=scss` y elementos reutilizables en `components/` |
| SASS | Variables en `src/styles/_tokens.scss`, estilos globales en `src/styles.scss`, estilos por componente `.scss` y schematic configurado |
| Rutas | `app.routes.ts`, lazy `loadComponent`, authGuard y roleGuard |
| Comunicación | DataForm y ArrayEditor reciben `input()` y emiten `output()` hacia sus padres |
| Formularios | ReactiveFormsModule, FormGroup, FormControl y validadores por campo y rango |
| Errores | Mensajes HTTP 400/401/403/404/409, estados de consulta y avisos accesibles |
| REST | HttpClient tipado, ApiResponse, composición RxJS y métodos del contrato Java |
| Auth / autorización | AuthStore en memoria, JWT interceptor, guards por rol, menú por permisos y verificación de ámbito de postulación |
| Pruebas | Vitest con HttpTestingController; Playwright con contratos aislados |

La autenticación tiene una capacidad funcional (RF-34) y cualidades de seguridad (RNF-03/04/05). Angular no equivale únicamente a requisitos no funcionales: es la interfaz que implementa los RF del caso. El cifrado BCrypt corresponde al servidor, nunca a una contraseña guardada por el frontend.

RNF-06/07 (tiempos), RNF-08 (99% de disponibilidad), RNF-14 (80% de cobertura Java) y RNF-16 (despliegue) requieren mediciones y configuración reales. No se consideran logrados por haber compilado Angular. Los logs locales de navegador tampoco demuestran trazabilidad persistente.
