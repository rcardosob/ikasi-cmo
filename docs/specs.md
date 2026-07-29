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
  - Manejo de token: Almacenado como variable de entorno segura (`IKASI_MCP_BEARER_TOKEN`), renovable cada 30 días.
- **Herramientas Expuestas por el MCP:**
  1. `get_property_detail(property_code)`: Consulta el detalle público de una propiedad por su código (ej: `BIR-590`). Retorna información de inventario vigente (área, precio, ubicación, servicios, especificaciones técnicas).
  2. `search_space_need`: Permite buscar inventario vigente por lenguaje natural o características (ej. "bodega de 500 m2 en León").
- **Flujo en ikasi-cmo:** 
  - `ikasi-cmo` invoca `get_property_detail` pasando el `property_code` ingresado por el usuario.
  - Recibe el JSON con la ficha técnica pública oficial para alimentar a los generadores de copy, imágenes, flyers multilingües y valuaciones.

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
