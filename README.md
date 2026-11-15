# TalentFlow360 · Frontend Angular

Aplicación Angular 22 standalone, TypeScript estricto y SASS/SCSS para prácticas preprofesionales con matching explicable. Consume el backend Spring Boot existente. La aplicación normal **no tiene un modo demo ni sustituye respuestas de la API por datos inventados**. Los dobles de API solo están en `e2e/`.

## Probar en el navegador

[Abrir TalentFlow360](https://talentflow360-portal.outstandingjet1.chatgpt.site). La versión de prueba está publicada con acceso privado: usar la misma cuenta de ChatGPT con la que se creó este sitio. Dentro del portal, el login y el registro corresponden a las cuentas del backend TalentFlow360.

El alojamiento entrega la compilación Angular, permite abrir directamente rutas como `/empresas` y reenvía `/api` al backend de Render. Esta publicación no carga registros ni incluye cuentas de demostración. La integración autenticada con datos reales sigue pendiente de cuentas de prueba autorizadas.

## Ejecutar

Requisitos: Node 24.15 o posterior compatible con Angular 22 y npm 11. El proyecto fue validado con Node 24.19.0.

```powershell
git clone https://github.com/SamuelHuamanHuillca/FrontEnd_TalentFlow360.git
cd FrontEnd_TalentFlow360
npm ci
npm start
```

Abrir http://localhost:4200. `proxy.conf.json` envía `/api` al backend de Render. El servidor puede tardar en despertar. Se necesita una cuenta real para consultar datos. El registro público crea cuentas POSTULANTE; no incluye cuentas administrativas ni contraseñas precargadas.

## Colaboración

Repositorio principal: [FrontEnd_TalentFlow360](https://github.com/SamuelHuamanHuillca/FrontEnd_TalentFlow360). Cualquier persona puede consultar el código y proponer cambios mediante un fork y pull request. Para subir cambios directamente necesita una cuenta de GitHub invitada como colaboradora; GitHub no admite permisos de escritura anónimos por enlace.

Para backend local, cambiar únicamente el target del proxy a `http://localhost:8080` y reiniciar `npm start`. La URL de producción se configura en `public/config.json` antes del build o en el archivo `config.json` del hosting. Usar `{"apiBaseUrl":"https://bakend-talentflow360.onrender.com/api"}` cuando frontend y backend estén en dominios diferentes. Ese origen debe autorizarse en el CORS de Spring. No poner secretos en este archivo.

## Pruebas

```powershell
npm run test:unit
npx playwright install chromium
npm run test:e2e
npm run format:check
npm run build
```

Playwright inicia un servidor local y sustituye `/api/**` por una API de prueba controlada. No escribe en Render. Para usar un Chromium instalado: definir `PLAYWRIGHT_CHROMIUM_EXECUTABLE` con su ruta. Para generar capturas de diseño: definir `TF_PREVIEW_DIR` con un directorio local. Son capturas de la aplicación real con datos simulados, no evidencia de la base desplegada.

## Organización

```text
src/app/
  pages/                portada, acceso, perfil, vacantes, postulaciones,
                        entrevistas, evaluaciones, indicadores, usuarios y empresas
  components/           cabecera, layout, footer, tarjetas, carrusel,
                        buscador, formularios, iconos y estados compartidos
  models/               contratos por entidad: usuario, postulante, vacante,
                        postulación, entrevista, evaluación y respuesta de API
  data/                 catálogo de empresas, campos de perfil y transiciones
  services/             cliente REST, API de negocio, sesión y avisos
  guards/               protección de rutas por sesión y rol
  interceptors/         token JWT y tratamiento de errores HTTP
  app.ts/html/scss       componente raíz con archivos separados
  app.routes.ts         rutas públicas y privadas
src/styles/_tokens.scss variables SCSS, como en el ejemplo de clase
e2e/                    contratos de prueba y recorridos de navegador
docs/                   arquitectura, cobertura y datos históricos
scripts/                consultas de inventario de datos, de solo lectura
```

Los componentes se cargan por ruta. El JWT se conserva en memoria y se elimina al cerrar sesión o recargar. Se comprueba expiración al navegar y antes de enviar peticiones. Un 401 de recurso cierra la sesión; un 403 mantiene la sesión y explica la falta de permiso. El token solo se adjunta al backend configurado. No hay refresh token porque el backend no ofrece ese contrato.

La organización sigue el ejemplo `EjemploAngularArquitectura.zip` de clase: páginas, componentes, modelos y datos. Se amplía con servicios, guards e interceptores porque TalentFlow360 consume Spring Boot y utiliza JWT. Cada página y componente tiene su `.ts`, `.html` y `.scss`; los datos del proceso siguen llegando de la API.

## Diseño del portal

Portada con banner ilustrado, búsqueda por puesto y ubicación, carrusel automático de logos oficiales y footer. El directorio público `/empresas` permite buscar por nombre, filtrar por sector y abrir la ficha de cada empresa. Las vacantes se consultan con sesión y se cuentan a partir de la API. El espacio personal presenta resumen de perfil, oportunidades, empresas de la API y actividad del usuario. La cabecera ofrece un menú accesible al pulsar el avatar. El perfil conserva sus formularios en la nueva composición. Los botones de Google/LinkedIn tienen sus colores habituales y muestran un aviso al pulsarlos hasta integrar OAuth en Spring. Ver [empresas y fuentes de logos](docs/EMPRESAS.md) y [recursos visuales](docs/recursos-visuales.json).

## Estado de integración

La compilación y las pruebas locales están implementadas. Swagger de Render respondió 200 el 14/11/2026; vacantes y dashboard respondieron 403 sin sesión. **La prueba autenticada contra Render y el conteo de sus registros requieren una cuenta autorizada y/o acceso de lectura a la BD.**

No considerar el sistema listo para producción antes de corregir los problemas de autorización por recurso documentados en [la revisión del backend](docs/BACKEND.md). El frontend no puede sustituir esos controles de Spring Security. La edición de usuarios está identificada como pendiente por un DTO incompatible del backend. La creación y desactivación de cuentas sí tienen flujos conectados.

Ver [arquitectura](docs/ARQUITECTURA.md), [cobertura de requisitos](docs/REQUISITOS.md), [plan de datos](docs/DATOS.md) y [validación](docs/VALIDACION.md).

## Despliegue estático

`npm run build` genera `dist/frontend-talentflow360/browser`. Publicar ese directorio y configurar fallback de rutas a `index.html`. Render Static Site puede usar `npm ci && npm run build`, directorio publicado `dist/frontend-talentflow360/browser` y rewrite `/*` a `/index.html`. La publicación y el push a GitHub requieren la aprobación final del propietario.
