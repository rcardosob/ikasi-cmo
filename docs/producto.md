# Documento del Producto (PRD) — ikasi-cmo

> **Empresa:** Ikasi Inmobiliaria®  
> **Producto:** ikasi-cmo  
> **Tipo de Aplicación:** Plataforma Web Interna  
> **Estado:** Borrador Inicial  

---

## 1. Visión y Propósito del Producto

**ikasi-cmo** es la plataforma web interna de automatización de marketing y soporte comercial desarrollada para **Ikasi Inmobiliaria®**. 

Su propósito central es estructurar, optimizar y agilizar las tareas de marketing inmobiliario industrial (bodegas, naves industriales y terrenos). Actúa como una herramienta operativa que consume la información técnica de las propiedades mediante la integración con el MCP de IKASI para garantizar una **única fuente de verdad**, eliminando trabajo duplicado y manteniendo siempre el control estratégico en manos del equipo humano.

---

## 2. Objetivos del Producto

1. **Eficiencia Operativa:** Reducir drásticamente el tiempo empleado por el equipo interno en la creación de assets publicitarios, fichas técnicas multilingües y valoraciones comerciales.
2. **Reutilización de Información:** Aprovechar los datos de propiedades ya existentes en el ecosistema IKASI sin inventar ni alucinar información.
3. **Estandarización de Marca:** Garantizar la consistencia visual y narrativa de **Ikasi Inmobiliaria®** mediante plantillas predefinidas para redes sociales, flyers y fichas técnicas.
4. **Escalabilidad Comercial:** Facilitar la atención a clientes internacionales mediante la generación de materiales en español, inglés, chino-mandarín y japonés.

---

## 3. Módulos Funcionales (Visión de Producto)

### 3.1. Backoffice & Ingesta de Datos (MCP IKASI)
- Conexión vía MCP de IKASI para la extracción e introspección de información de propiedades industriales.
- **Auto-descubrimiento:** El MCP de IKASI define e informa dinámicamente al sistema qué información y herramientas están disponibles (esquema de datos, parámetros y métodos de uso), evitando estructuras rígidas y adaptándose a las capacidades que exponga el servidor MCP.
- Datos comunes consumidos: Código de propiedad, Tipo, Ubicación, Superficies, Altura, Andenes, Rampas, KVA, Precio, Estado, Servicios, etc.

### 3.2. Creative Area (Generación de Assets de Marketing)
Generación de materiales a partir del **Código de Propiedad**:
- **Generación de Copy:** Copies estructurados por canal (largo, corto, portales inmobiliarios, redes sociales) con Calls to Action (CTA) optimizados.
- **Material para Redes Sociales:** Generación de imágenes (PNG) en formatos estándar (1:1, 4:5, 9:16, 1.91:1) sobre plantillas de la marca.
- **Afiches y Flyers:** Creación automática de flyers en 4 idiomas (Español, Inglés, Chino-Mandarín, Japonés) respetando plantillas corporativas.

### 3.3. Opinión de Valor Inteligente
- Búsqueda y estructuración de comparables de mercado.
- Asistente guiado para la determinación de valores comerciales mediante 3 metodologías:
  1. Comparables de Mercado
  2. Capitalización de Rentas
  3. Enfoque de Costos
- Opción de vincular y guardar la opinión de valor generada en la propiedad correspondiente.

### 3.4. Gestión de Fotografías
- Módulo de carga y procesamiento de imágenes por código de propiedad.
- Mejoras automáticas: reencuadre, corrección de iluminación y aplicación de marca de agua de **Ikasi Inmobiliaria®**.
- Almacenamiento y repositorio de descarga para uso transversal en otros módulos.

### 3.5. Procesadores Multilingües Especificos (Mandarín y Japonés)
- Transformación y traducción estructurada de Fichas Técnicas (desde español/inglés) hacia plantillas especializadas para clientes de habla china y japonesa.

### 3.6. Servidor MCP Propio de ikasi-cmo (Fase 3: Integración Agéntica con ikasi-assistant)
- **Concepto:** Exposición de las capacidades del sistema a través de un servidor MCP propio (`ikasi-cmo-mcp`).
- **Propósito:** Permitir que el asistente corporativo en Telegram (`ikasi-assistant`) u otros agentes IA externos puedan invocar dinámicamente cualquier entregable (copies, flyers en mandarín/japonés, procesar fotos o consultar valoraciones) mediante herramientas MCP sin depender de la UI web.

---

## 4. Próximos Pasos (Documentación Técnica y Specs)

1. **Aprobación de este PRD:** Confirmar el alcance y módulos.
2. **Creación del Documento de Especificaciones Técnicas (Specs):**
   - Arquitectura del sistema (Frontend, Backend, Base de Datos PostgreSQL).
   - Integración con el MCP de IKASI.
   - Definición del modelo de datos en PostgreSQL.
   - Especificaciones de APIs e integraciones externas (Canva, OpenAI, Claude, DeepSeek, etc.).
   - Flujos detallados de UX/UI por sección.
