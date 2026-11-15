# Carrusel y directorio de empresas

La sección de empresas de la portada muestra los logos oficiales de Alicorp, Backus, Gloria, Cementos Pacasmayo, Compartamos Banco y Ferreyros. Cada tarjeta abre `/empresas/:slug`; el botón «Ver todas las empresas» abre `/empresas`.

## Interacción

- El carrusel avanza cada cuatro segundos, con flechas y control de reproducción/pausa.
- Se pausa al colocar el puntero, enfocar sus controles o cambiar a una pestaña oculta. La preferencia de movimiento reducido desactiva la reproducción automática inicial.
- Muestra de una a seis tarjetas según el ancho disponible. Los duplicados fuera de vista no se incluyen en la navegación de teclado.
- El directorio ofrece búsqueda por nombre/palabras, filtro por sector, orden por nombre/sector y vista de empresas con oportunidades.
- Las fichas contienen descripción, sector, presencia en Perú, enlace al sitio oficial y las vacantes publicadas que devuelve el backend para esa empresa.

## Datos y límites del contrato actual

El backend no tiene una entidad ni un endpoint de empresas: `VacanteDTO.empresa` es un texto. Por ello, los perfiles públicos están en `data/empresas.data.ts` y su contrato en `models/empresa.ts`; son información corporativa, no cuentas empresariales ni registros de la BD. No implican una alianza con TalentFlow360. Los nombres equivalentes admitidos están definidos en `aliases`; no se usa coincidencia parcial para evitar atribuir una vacante a otra organización.

`CompanyVacancies` consulta `GET /vacantes` cuando existe una sesión válida y conserva únicamente las vacantes `PUBLICADA`. Sin sesión no realiza esta petición y muestra un enlace para ingresar. Una respuesta fallida ofrece reintentar; no se transforma el fallo en un contador de cero. Al cerrar sesión se eliminan los resultados. El login conserva el retorno al directorio o a la ficha.

No se presentan estrellas, empleados, seguidores ni cifras de avisos sin una fuente del sistema. Si una empresa no tiene coincidencias en la API, se informa que no hay vacantes publicadas registradas para ella. La API actual devuelve el listado completo, sin paginación de servidor; esta limitación sigue documentada en la arquitectura.

Para administrar empresas desde el sistema se necesitará, en una siguiente ampliación, una entidad Empresa en Spring, endpoints con permisos y una relación por identificador en Vacante. Esta pantalla no añade escrituras al backend ni carga registros históricos.

## Recursos oficiales

Los seis logos están alojados localmente para evitar depender de la disponibilidad de los sitios externos durante la exposición. Se conservan los archivos originales, sus proporciones y sus colores. Backus utiliza su variante blanca oficial sobre fondo azul; Gloria, su variante oscura con el año en rojo. No se han generado ni redibujado con IA.

Las URLs de descarga y los SHA-256 están en [logos-empresas.json](logos-empresas.json). Las descripciones breves y los sectores se contrastaron el 14/11/2026 con los sitios de [Alicorp](https://www.alicorp.com.pe/pe/es), [Backus](https://www.backus.pe/), [Gloria](https://www.gloria.com.pe/), [Cementos Pacasmayo](https://www.cementospacasmayo.com.pe/), [Compartamos Banco](https://www.compartamos.com.pe/inicio) y [Ferreyros](https://www.ferreyros.com.pe/).

## Verificación

Los tests unitarios comprueban nombres equivalentes, ausencia de coincidencias parciales, rutas de retorno, consultas solo con sesión, conteos de vacantes publicadas, errores y limpieza al salir. Los recorridos de navegador verifican carga de logos, avance automático, pausa, navegación, búsqueda, filtros, vista móvil, movimiento reducido y atribución de vacantes. Las peticiones autenticadas se sustituyen por contratos de prueba: no se han realizado escrituras en Render.
