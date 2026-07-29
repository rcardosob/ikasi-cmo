# Documento de Sistema de Diseño y Paleta de Colores — ikasi-cmo

> **Empresa:** Ikasi Inmobiliaria®  
> **Producto:** ikasi-cmo  
> **Estado:** Documento de Diseño Oficial  

---

## 1. Paleta de Colores Corporativa (Dark Theme Elegante)

Esta paleta combina tonos malvas y púrpuras profundos con contrastes en cobre satinado y blancos suaves para una apariencia lujosa, moderna y altamente legible.

### 1.1. Paleta Base (Originales de la Marca)
Tonos profundos para superficies, barras de navegación, tarjetas y fondos principales:

| Token CSS | Hex | Uso y Descripción |
| :--- | :--- | :--- |
| `--bg-base-darkest` | `#050205` | **Fondo Base Muy Oscuro:** Tono más profundo (casi negro) para fondo de la aplicación. |
| `--bg-base-deep` | `#140919` | **Base Oscura Profunda:** Púrpura-negro profundo para paneles y sidebars. |
| `--bg-base-medium` | `#23162E` | **Base Media Oscura:** Púrpura oscuro para tarjetas y contendores elevados. |
| `--bg-base-cool` | `#2E2B4D` | **Base Profunda Azulada:** Matiz frío para hovers, bordes o elementos activos. |
| `--bg-base-malva` | `#4E325C` | **Base Clara (Malva):** El tono base más claro para acentos secundarios o bordes destacados. |

### 1.2. Colores de Contraste para Texto y Destacados
Diseñados para garantizar contraste y confort visual sobre fondos oscuros:

| Token CSS | Hex | Uso y Descripción |
| :--- | :--- | :--- |
| `--text-primary` | `#F8F8FA` | **Texto Principal (Blanco Suave):** Para títulos y cuerpo de texto principal. |
| `--text-secondary` | `#B0AFB8` | **Texto Secundario (Gris Piedra):** Subtítulos, descripciones, metadatos y letra pequeña. |
| `--accent-gold-rose` | `#CF9C8C` | **Cobre Satinado / Oro Rosa:** Tono estrella para CTAs, estados activos, links y elementos destacados. |

---

## 2. Recomendaciones de Diseño & UI (Sugerencias Antigravity)

1. **Estado Interactivo (Hover / Active):**
   - Sugerimos usar `#CF9C8C` con una opacidad del 15% (`rgba(207, 156, 140, 0.15)`) para efectos *glow* detrás de botones principales y bordes en estado activo.
2. **Bordes Elegantes:**
   - En lugar de bordes grises planos, usar `#2E2B4D` o `#4E325C` con transparencia (`1px solid rgba(78, 50, 92, 0.4)`) para dar profundidad sin recargar visualmente.
3. **Indicadores de Estado (Feedback UI):**
   - Mantendremos la armonía sumando un verde esmeralda desaturado (`#4EBA8D`) para avisos de éxito (ej. *"Copy copiado"*) y un rojo coral suavizado (`#E06C6C`) para errores sin romper la sofisticación de la paleta.

---

## 3. Estructura de Assets y Marca

- **Carpeta de Assets:** `public/brand/`
- **Uso:** Espacio reservado para los logotipos oficiales de **Ikasi Inmobiliaria®** (PNG, SVG, SVG blanco/transparente) y favicon.
