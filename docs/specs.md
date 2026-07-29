# Especificaciones Técnicas y Arquitectura (Specs) — ikasi-cmo

> **Producto:** ikasi-cmo  
> **Empresa:** Ikasi Inmobiliaria®  
> **Estado:** Documento Especificativo Inicial  

---

## 1. Arquitectura General del Sistema

`ikasi-cmo` se diseñará como una plataforma web moderna, rápida y responsiva.

```
                  ┌─────────────────────────────────────────┐
                  │          Usuario (Navegador)            │
                  └────────────────────┬────────────────────┘
                                       │ HTTPS / UI Web
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │       Frontend / Backend App            │
                  │             (ikasi-cmo)                 │
                  └──────┬─────────────┬─────────────┬──────┘
                         │             │             │
        Direct JSON/SSE  │             │ SQL         │ REST / SDK
                         ▼             ▼             ▼
  ┌────────────────────────┐  ┌──────────────────┐  ┌──────────────────┐
  │  MCP Server (IKASI)    │  │ Base de Datos    │  │ LLM APIs         │
  │  (Introspección Fichas)│  │ PostgreSQL       │  │ (OpenAI/Claude/  │
  └────────────────────────┘  └──────────────────┘  │ DeepSeek)        │
                                                    └──────────────────┘
```

- **Frontend/Backend:** Next.js (React / Node.js) o Vite + Express para renderización rápida de UI y SSR/API routes.
- **Base de Datos:** PostgreSQL en VPS corporativo (almacena opiniones de valor guardadas, histórico de copies, logs y configuraciones de plantillas).
- **Conexión MCP:** Cliente nativo MCP (StdIO / HTTP / SSE) en el backend para la consulta e introspección de propiedades en tiempo real.

---

## 2. Especificaciones por Módulo Funcional

### 2.1. Ingesta y Conexión MCP de IKASI
- **Endpoint MCP:** `https://inventorydb-mcp.industrialrealtor.app/mcp`
- **Transporte / Autenticación:** 
  - Header: `Authorization: Bearer <token>`
  - Headers requeridos: `Content-Type: application/json`, `Accept: application/json`
  - Manejo de token: Almacenado como variable de entorno segura (`MCP_INVENTORY_TOKEN`), renovable cada 30 días.
- **Herramientas Expuestas por el MCP:**
  1. `get_property_detail(property_code)`: Consulta el detalle público de una propiedad por su código (ej: `BIR-590`, `BIV-1095`, `LR-020`, `OC-1015`). Retorna información de inventario vigente.
  2. `search_space_need`: Permite buscar inventario vigente por lenguaje natural o características (ej. "bodega de 500 m2 en León").

#### Mapeo de Hallazgos y Esquema de Datos por Categoría de Activo:
Tras la inspección de muestras de producción (`BIR-`, `BIV-`, `LR-`, `OC-`), se especifican las siguientes reglas de normalización:

- **Envoltorio del Protocolo (FastMCP Wrapper):**
  Toda respuesta del MCP viene envuelta en `result.content[0].text` como un JSON serializado. `ikasi-cmo` realiza un des-empaquetado automático mediante `normalizePropertyData()`.

- **Matriz de Campos por Tipo de Propiedad y Prefijo:**
  | Prefijo | Categoría / Descripción de Activo | Métricas Clave Leídas | Notas / Comportamiento |
  | :--- | :--- | :--- | :--- |
  | **`BIR-`** | Bodega / Nave Industrial en Renta | `address`, `available_area_m2`, `dock_doors`, `clear_height_m`, `ramps`, `kva` | Industrial Renta. |
  | **`BIV-`** | Bodega / Nave Industrial en Venta | `address`, `available_area_m2`, `dock_doors`, `clear_height_m`, `price_note` | Industrial Venta. |
  | **`TIV-`** | Terreno Industrial / Comercial en Venta | `address`, `available_area_m2` / `surface_m2`, `price_note` | Terrenos Industriales/Comerciales en Venta. |
  | **`LR-`** | Local Comercial en Renta | `address`, `available_area_m2`, `parking_spaces`, `price_note` | Andenes/Rampas retornan `N/A`. |
  | **`LV-` / `LCV-`** | Local Comercial en Venta | `address`, `available_area_m2`, `parking_spaces`, `price_note` | Locales en Venta (mismo uso comercial). |
  | **`OC-`** | Oficina Corporativa en Renta / Venta | `address`, `available_area_m2`, `parking_spaces`, `price_note` | Oficinas Corporativas. |
  | **`CRR-`** | Casa Residencial en Renta | `address`, `available_area_m2`, `rooms`, `parking_spaces` | Residencial Renta. |
  | **`CRV-`** | Casa Residencial en Venta | `address`, `available_area_m2`, `rooms`, `price_note` | Residencial Venta. |
  | **`DRR-`** | Departamento Residencial en Renta | `address`, `available_area_m2`, `bedrooms`, `parking_spaces` | Departamento Renta. |
  | **`DRV-`** | Departamento Residencial en Venta | `address`, `available_area_m2`, `bedrooms`, `price_note` | Departamento Venta. |
  | **`TRV-`** | Terreno Residencial en Venta | `address`, `available_area_m2`, `price_note` | Terreno Residencial Venta. |

- **Prioridad de Resoluciòn de Campos (Fallbacks Multilingües):**
  - **Ubicación (`location`):** `property.address` -> `property.industrial_park` -> `property.location` -> `property.ubicacion`.
  - **Superficie (`surface_area`):** `units[0].available_area_m2` -> `units[0].surface_area` -> `units[0].superficie_m2` -> `units[0].area_m2`.
  - **Andenes (`loading_docks`):** `units[0].dock_doors` -> `units[0].andenes`.
  - **KVA / Energía (`kva`):** `units[0].kva` -> `units[0].power_kva` -> `kva`. (Si no aplica, muestra `N/A`).

### 2.2. Creative Area (Motor de Marketing)
- **Flujo de Usuario:**
  1. Ingreso de un Código de Propiedad individual (ej. `BIR-587`).
  2. Obtención automática de datos del MCP.
  3. **Generación de Copy:** Llamada a LLM con prompts estructurados para producir 4 variantes (Largo, Corto, Portales Inmobiliarios, Redes Sociales + CTA). Permite edición de texto en vivo y copiado rápido.
  4. **Motor Gráfico Interno:** Generación autónoma de imágenes usando HTML Canvas / SVG renderizado a PNG en servidor/cliente en 4 formatos:
     - 1:1 (Post cuadrado)
     - 4:5 (Post vertical)
     - 9:16 (Stories / Reels)
     - 1.91:1 (Banner / Horizontal)
  5. **Flyers/Afiches:** Renderizado de plantillas corporativas de **Ikasi Inmobiliaria®** exportables a PDF en 4 idiomas (Español, Inglés, Chino-Mandarín, Japonés).

### 2.3. Opinión de Valor Inteligente
- **Interfaz:** Asistente conversacional e interactivo (Chat UI).
- **Flujo:**
  1. El usuario proporciona datos o busca comparables en la conversación.
  2. El asistente analiza la información y le presenta al usuario la opción de elegir entre 3 metodologías:
     - *Comparables de Mercado*
     - *Capitalización de Rentas*
     - *Enfoque de Costos*
  3. La IA calcula la valuación, genera la memoria de cálculo y redacta el informe.
  4. Muestra opción para asociar y guardar la opinión de valor en PostgreSQL vinculada al código de propiedad.

### 2.4. Gestión de Fotografías
- **Flujo:** Carga por lote mediante drag-and-drop asociadas a un código de propiedad.
- **Procesamiento Automático:**
  - Corrección automática de contraste/iluminación.
  - Reencuadre y ajuste de aspecto.
  - Superposición de la marca de agua oficial de **Ikasi Inmobiliaria®**.
- **Entrega:** Galería con descarga directa (individual o archivo ZIP).

### 2.5. Procesador Mandarín y Japonés
- **Flujo:** Ingreso de código de propiedad + selección de idioma destino (Chino-Mandarín / Japonés).
- **Entregables Concretos:**
  1. **Ficha Gráfica (Flyer):** Afiche visual adaptado cultural y tipográficamente en PDF.
  2. **Ficha Técnica Ejecutiva:** Documento técnico completo traducido en PDF.
  3. **Copies Multilingües:** Textos optimizados para canales asiáticos (WeChat / Line).

### 2.6. Servidor MCP Propio de ikasi-cmo (Fase 3 - Integración Agéntica)
- **Endpoint Exposición MCP:** `https://cmo.industrialrealtor.app/mcp` (o subruta `/api/mcp` dentro del backend de ikasi-cmo).
- **Consumidores:** `ikasi-assistant` (bot de Telegram) u otros agentes autorizados vía Bearer token interno.
- **Herramientas (Tools) Expuestas por ikasi-cmo:**
  - `generate_marketing_copy(property_code, type)`
  - `generate_asian_flyer(property_code, language)`
  - `watermark_property_photos(property_code, photo_urls)`
  - `calculate_valuation(property_code, method, comps)`

---

## 3. Matriz de Integraciones

| Servicio / Herramienta | Función en ikasi-cmo |
| :--- | :--- |
| **MCP IKASI** | Fuente de verdad de fichas técnicas e inventario industrial |
| **PostgreSQL** | Persistencia de opiniones de valor, logs y datos del sistema |
| **LLMs (OpenAI / Claude / DeepSeek)** | Generación de copy, traducción especializada y motor del chat de valuación |
| **Canvas / Sharp / PDFKit** | Procesamiento de fotografías, marca de agua y renderizado de PDF/PNG |
