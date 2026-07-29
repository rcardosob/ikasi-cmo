# Memoria del Proyecto — ikasi-cmo (Versión Editable)

> **Estado:** Documento de trabajo (editable)
> **Propósito:** Esta memoria representa la visión actual del proyecto y puede modificarse libremente conforme evolucione el producto.

---

# Objetivo del Sistema

Automatizar, estructurar y optimizar la generación de assets de marketing, valuación financiera y generación de copy para propiedades industriales (bodegas, naves industriales y terrenos), bajo un modelo operativo controlado por humanos.

La visión del proyecto es construir una plataforma web integral que concentre los procesos internos relacionados con marketing inmobiliario y comercialización de propiedades.

---

# Filosofía del Producto

* El sistema debe ahorrar tiempo al equipo.
* El sistema debe reutilizar información existente.
* El sistema debe evitar duplicidad de trabajo.
* El sistema debe mantener una única fuente de verdad para cada propiedad.
* Las decisiones estratégicas permanecen bajo control humano.
* El sistema no debe inventar información inexistente.

---

# Backoffice

## Ingesta Híbrida de Fichas Técnicas

### Objetivo

obtener información de las propiedades vía el MCP de IKASI, la información que proporciona el sistema está organizada y puede ser reutilizable por nosotros.

### Información disponible

* Código de propiedad
* Tipo
* Ubicación
* Superficies
* Altura
* Andenes
* Rampas
* KVA
* Precio
* Estado
* Servicios

---

# Portal Web

## Sección: Creative Area

### Objetivo

Generar materiales comerciales utilizando únicamente el código de propiedad.

---

### Funcionalidad 1

Generación de copy.

Ejemplo:

> Dame el copy para la propiedad BIR-XXX.

Outputs esperados:

* Copy largo
* Copy corto
* Copy para portales
* Copy para redes sociales
* CTA

---

### Funcionalidad 2

Generación de material para redes sociales.

Ejemplo:

> Dame el material para redes sociales de la propiedad BIR-XXX.

Outputs esperados:

* PNG
* formatos 1:1
* 4:5
* 9:16
* 1.91:1

Usando plantillas previamente diseñadas.

---

### Funcionalidad 3

Generación de afiches.

Ejemplo:

> Dame un flyer de la propiedad BIR-XXX.

El sistema utilizará plantillas corporativas previamente diseñadas.

En esta funcionalidad, el usuario puede elegir entre 4 idiomas para la generación de la información: español, inglés, chino-mandarín, y japonés.

---

# Sección: Opinión de Valor Inteligente

## Objetivo

Ayudar al usuario a obtener una opinión de valor comercial utilizando comparables de mercado.

---

### Flujo esperado

1. Buscar comparables.
2. Estructurar la información encontrada.
3. Preguntar si se desea generar una opinión de valor.
4. Permitir elegir metodología.

Opciones:

* Comparables de Mercado
* Capitalización de Rentas
* Enfoque de Costos

5. Mostrar el resultado.
6. Preguntar si debe guardarse en una propiedad existente.

---

# Sección: Fotografías

## Objetivo

Administrar todas las fotografías de una propiedad.

---

### Flujo esperado

1. El usuario proporciona el código de propiedad.
2. Carga fotografías.
3. El sistema mejora encuadre.
4. Mejora iluminación.
5. Coloca marca de agua.
6. Guarda las fotografías.
7. Permite descargarlas.

Estas fotografías serán utilizadas posteriormente por otros módulos.

---

# Sección: Procesador Mandarín

## Objetivo

Preparar Fichas Técnicas para clientes de habla china.

---

### Idea general:

1. transformar una Ficha Técnica (inglés o español) al idioma mandarín, de acuerdo a una plantilla específica.

---

# Sección: Procesador Japonés

## Objetivo

Preparar Fichas Técnicas para clientes de habla japonesa.

---

### Idea general:

1. transformar una Ficha Técnica (inglés o español) al idioma japonés, de acuerdo a una plantilla específica.

---

## Arquitectura

Pendiente definir.

---

## Base de Datos

postgres, en VPS de la empresa.

---

## Modelo de Datos

Pendiente definir.

---

## Automatizaciones

Pendiente definir.

---

## Integraciones

Pendiente definir.

* Canva
* Google Drive
* OpenAI
* Claude
* DeepSeek
* Otros

---

# Observaciones

Este documento representa únicamente la visión funcional del producto.

No define arquitectura técnica, tecnologías específicas ni decisiones de implementación.

Todos esos aspectos se documentarán posteriormente en documentos independientes.
