# AGENTS.md — ikasi-cmo

> **Proyecto:** ikasi-cmo  
> **Empresa:** Ikasi Inmobiliaria®  
> **Propósito:** Plataforma web interna para la automatización de marketing, generación de assets, opiniones de valor multimetodología y fichas multilingües de propiedades industriales.

---

## 1. Contexto del Proyecto y Estado Actual

- **Empresa Madre:** Ikasi Inmobiliaria®
- **Aplicación:** Plataforma Web (`ikasi-cmo`)
- **Archivos de Documentación Obligatorios (Leer antes de trabajar):**
  - [docs/memoria_proyecto.md](file:///C:/Users/rcard/Documents/ikasi-cmo/docs/memoria_proyecto.md): Filosofía y visión general del producto.
  - [docs/producto.md](file:///C:/Users/rcard/Documents/ikasi-cmo/docs/producto.md): PRD (Documento de Requerimientos de Producto).
  - [docs/specs.md](file:///C:/Users/rcard/Documents/ikasi-cmo/docs/specs.md): Especificaciones técnicas de arquitectura, modelo de datos y flujo por módulo.

---

## 2. Contrato Técnico del MCP de IKASI

`ikasi-cmo` interactúa directamente con el MCP de inventario de **Ikasi Inmobiliaria®**.

- **Endpoint oficial:** `https://inventorydb-mcp.industrialrealtor.app/mcp`
- **Autenticación requerida:**
  - Header: `Authorization: Bearer <token>`
  - Headers: `Content-Type: application/json`, `Accept: application/json`
  - *Vigencia:* El token se renueva cada 30 días. Debe gestionarse exclusivamente vía variable de entorno (`IKASI_MCP_BEARER_TOKEN`).
- **Herramientas Disponibles en el MCP:**
  1. `get_property_detail`: Obtiene detalle público de una propiedad por su `property_code` (ej: `BIR-590`).
  2. `search_space_need`: Busca inventario vigente mediante consulta de lenguaje natural (ej. *"bodega de 500 m2 en León"*).

### Alcance y Límites del MCP (Lo que NO puede hacer):
- Solo lectura de inventario vigente.
- No modifica inventario, no escribe en Supabase, no sincroniza Google Drive, no accede a documentos/links internos ni credenciales.

---

## 3. Módulos de ikasi-cmo y Decisiones de Diseño

1. **Ingreso por Código de Propiedad:**
   - La aplicación no sincroniza todo el catálogo localmente. Cada módulo recibe el `property_code` (ej: `BIR-587`), consulta al MCP y transforma los datos en entregables individuales.
2. **Creative Area (Motor de Marketing):**
   - **Generación:** individual por propiedad.
   - **Copies:** 4 formatos (Largo, Corto, Portales, Redes + CTA).
   - **Imágenes:** Formatos 1:1, 4:5, 9:16 y 1.91:1 generados mediante motor gráfico interno HTML/Canvas/SVG (sin dependencias externas).
   - **Flyers:** Exportación a PDF en 4 idiomas (Español, Inglés, Mandarín, Japonés).
3. **Opinión de Valor Inteligente:**
   - Asistente conversacional (Chat UI) para ingresar o buscar comparables con `search_space_need` y seleccionar entre 3 metodologías: *Comparables de Mercado*, *Capitalización de Rentas*, *Enfoque de Costos*. Permite guardar en PostgreSQL.
4. **Gestión de Fotografías:**
   - Procesamiento automático al subir: encuadre, corrección de iluminación y superposición de la marca de agua de **Ikasi Inmobiliaria®**.
5. **Procesadores Asiáticos (Mandarín y Japonés):**
   - Produce dos entregables: Ficha Gráfica (Flyer PDF) + Ficha Técnica Ejecutiva PDF, además de copies para WeChat/Line.
6. **Fase 3: Servidor MCP de ikasi-cmo para ikasi-assistant (Integración Agéntica Remota):**
   - `ikasi-cmo` expondrá un servidor MCP propio con múltiples herramientas (`generate_marketing_copy`, `generate_asian_flyer`, `watermark_photos`, `calculate_valuation`).
   - Esto permitirá que agentes externos (como `ikasi-assistant` en Telegram o bots corporativos) invoquen de forma remota y agéntica todas las capacidades de `ikasi-cmo`.

---

## 4. Reglas para Futuros Agentes de IA

1. **Nombre del Proyecto:** Usar siempre `ikasi-cmo`.
2. **Seguridad:** NUNCA harcodear ni subir en commits tokens del MCP o credenciales de PostgreSQL. Usar variables de entorno (`.env`).
3. **Mantenimiento de Documentación:** Si la arquitectura o decisiones de UI/UX cambian durante el desarrollo, actualiza inmediatamente [docs/producto.md](file:///C:/Users/rcard/Documents/ikasi-cmo/docs/producto.md) y [docs/specs.md](file:///C:/Users/rcard/Documents/ikasi-cmo/docs/specs.md).
