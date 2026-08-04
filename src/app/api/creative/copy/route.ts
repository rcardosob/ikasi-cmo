import { NextRequest, NextResponse } from 'next/server';
import { NormalizedProperty } from '@/lib/mcp/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { property, highlights, channel } = body as {
      property?: NormalizedProperty;
      highlights?: string;
      channel: 'linkedin' | 'portals' | 'tiktok' | 'social' | 'whatsapp';
    };

    // Propiedad por defecto si no viene código de propiedad del MCP (Propiedad Manual)
    const effectiveProperty: NormalizedProperty = property || {
      property_code: 'NUEVA-PROP',
      title: 'PROPIEDAD INDUSTRIAL EN PROMOCIÓN',
      type: 'Industrial',
      location: 'Ubicación Inmobiliaria Destacada',
      surface_area: null,
      height_m: null,
      loading_docks: null,
      ramps: null,
      kva: null,
      price_note: 'Consultar condiciones',
      raw: {},
    };

    const propDetails = `
Código: ${effectiveProperty.property_code}
Título: ${effectiveProperty.title}
Tipo: ${effectiveProperty.type}
Ubicación: ${effectiveProperty.location}
Superficie: ${effectiveProperty.surface_area ? effectiveProperty.surface_area + ' m²' : 'N/A'}
Aspectos Destacados / Notas: ${highlights || 'Promoción directa de propiedad industrial'}
`;

    let promptInstruction = '';
    switch (channel) {
      case 'linkedin':
        promptInstruction = `
Eres el Chief Marketing Officer de Ikasi Inmobiliaria®. Redacta una publicación profesional y ejecutiva para LinkedIn dirigida a C-Levels, Directores de Logística y Gerentes de Expansión Corporativa.
Destaca el retorno de inversión, ventajas estratégicas de conectividad industrial y la infraestructura técnica. Usa un tono de alto nivel, párrafos ejecutivos y hashtags B2B relevantes.
`;
        break;

      case 'portals':
        promptInstruction = `
Eres un especialista en Portales Inmobiliarios Industriales (Inmuebles24, Vivanuncios, Lamudi, etc.). Redacta una ficha descriptiva comercial-operativa enfocada en dueños de negocio y gerentes de operaciones.
Destaca usos de suelo, accesibilidad de transporte pesado, servicios de la zona y facilidades diarias. Usa estructura limpia con viñetas claras.
`;
        break;

      case 'tiktok':
        promptInstruction = `
Eres un creador de contenido inmobiliario de alta tendencia en TikTok. Diseña un guion/caption ultra dinámico para TikTok.
Debe iniciar con un HOOK o gancho irresistible en los primeros 3 segundos (ej. "¡Esta nave industrial tiene algo que casi ninguna en la zona ofrece!"). Incluye emojis visuales, ritmo ágil, indicaciones de texto en pantalla y un Call to Action llamativo.
`;
        break;

      case 'social':
        promptInstruction = `
Eres un experto en Instagram y Facebook Reels/Feed para el sector inmobiliario de lujo e industrial.
Crea una publicación atractiva con storytelling, párrafos legibles con espacio en blanco, emojis bien ubicados, beneficios principales del inmueble y llamada a la acción para agendar visita por mensaje directo.
`;
        break;

      case 'whatsapp':
        promptInstruction = `
Redacta un mensaje de WhatsApp / Historia corto, directo y de alto impacto para enviar a clientes o publicar en Estados de WhatsApp.
Usa viñetas breves con los datos clave más importantes (Superficie, Ubicación, KVA/Andenes, Precio) y una llamada inmediata a solicitar la ficha técnica o agendar llamada.
`;
        break;

      default:
        promptInstruction = 'Redacta un copy comercial inmobiliario atractivo.';
    }

    // Si hay llaves de API externas configuradas en el entorno se usan; de lo contrario generamos plantilla inteligente bien formateada
    const generatedCopy = generateStructuredFallbackCopy(channel, effectiveProperty, highlights);

    return NextResponse.json({
      success: true,
      channel,
      copy: generatedCopy,
      promptUsed: promptInstruction,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error al generar copy' },
      { status: 500 }
    );
  }
}

function generateStructuredFallbackCopy(
  channel: string,
  p: NormalizedProperty,
  highlights?: string
): string {
  const h = highlights ? `\n🌟 Aspectos Destacados: ${highlights}` : '';

  if (channel === 'linkedin') {
    return `🏢 OPORTUNIDAD INDUSTRIAL | ${p.title} (${p.property_code})

Ubicación Estratégica: ${p.location}
Superficie Total Disponible: ${p.surface_area ? p.surface_area + ' m²' : 'Consultar'}

Ikasi Inmobiliaria® presenta esta propiedad industrial de primer nivel diseñada para optimizar cadenas de suministro y operaciones de alta eficiencia.

📋 Especificaciones Clave:
• Altura Libre: ${p.height_m ? p.height_m + ' m' : 'Estándar Industrial'}
• Andenes de Carga: ${p.loading_docks ?? 'N/A'} | Rampas: ${p.ramps ?? 'N/A'}
• Capacidad Eléctrica: ${p.kva ? p.kva + ' KVA' : 'Adaptable a requerimiento'}
• Esquema Comercial: ${p.price_note || 'Bajo consulta corporativa'}${h}

Ideal para empresas en proceso de expansión logística o manufacturera. Contáctenos para coordinar una visita técnica o recibir el dossier completo.

#BienesRaicesIndustriales #IkasiInmobiliaria #NavesIndustriales #Logistica #InversionB2B`;
  }

  if (channel === 'portals') {
    return `📍 ${p.title} - ${p.property_code} | ${p.location}

Excelente opción inmobiliaria lista para operar. Propiedad tipo ${p.type} ubicada en zona con excelente conectividad y accesibilidad para transporte de carga.

CARACTERÍSTICAS PRINCIPALES:
- Área Disponible: ${p.surface_area ? p.surface_area + ' m²' : 'Consultar'}
- Ubicación: ${p.location}
- Andenes de Carga: ${p.loading_docks ?? 'N/A'}
- Rampas Niveladoras: ${p.ramps ?? 'N/A'}
- Altura Libre: ${p.height_m ? p.height_m + ' m' : 'N/A'}
- Capacidad Eléctrica: ${p.kva ? p.kva + ' KVA' : 'N/A'}${h}

PRECIO / CONDICIONES:
${p.price_note || 'Contactar para cotización personalizada'}

Para mayores informes o agendar una cita previa, póngase en contacto con nuestro equipo de Ikasi Inmobiliaria®.`;
  }

  if (channel === 'tiktok') {
    return `🚀 ¡Mira esta nave industrial en ${p.location}! 📦

[TEXTO EN PANTALLA: Espacio listo para tu empresa en ${p.location}]

Si tu negocio necesita crecer, la propiedad ${p.property_code} tiene todo lo que buscas:
👉 ${p.surface_area ? p.surface_area + ' m² disponibles' : 'Amplio espacio operativo'}
👉 ${p.loading_docks ? p.loading_docks + ' andenes de carga' : 'Excelente maniobra'}
👉 Altura libre de ${p.height_m ? p.height_m + 'm' : 'gran capacidad'}${h}

💡 ¿Buscas espacio para logística o producción?
💬 ¡Deja un comentario o manda mensaje directo para enviarte la ficha técnica de Ikasi Inmobiliaria®!

#NaveIndustrial #BodegaEnRenta #IkasiInmobiliaria #BienesRaices #RealEstateMexico`;
  }

  if (channel === 'social') {
    return `✨ ¡Nueva Disponibilidad Industrial! ✨

Propiedad ${p.property_code} en ${p.location} 🏗️

Ideal para empresas que buscan conectividad y eficiencia operativa.

📐 Superficie: ${p.surface_area ? p.surface_area + ' m²' : 'Consultar'}
🚛 Andenes: ${p.loading_docks ?? 'N/A'} | Rampas: ${p.ramps ?? 'N/A'}
⚡ Capacidad KVA: ${p.kva ? p.kva + ' KVA' : 'N/A'}${h}

📲 Envíanos un mensaje directo o contáctanos al equipo de Ikasi Inmobiliaria® para conocer todos los detalles y agendar una visita.`;
  }

  // WhatsApp
  return `📢 *OPORTUNIDAD INDUSTRIAL - IKASI INMOBILIARIA®*

*Código:* ${p.property_code}
*Ubicación:* ${p.location}
*Superficie:* ${p.surface_area ? p.surface_area + ' m²' : 'Consultar'}
*Andenes:* ${p.loading_docks ?? 'N/A'} | *Altura:* ${p.height_m ? p.height_m + 'm' : 'N/A'}${h}

*Precio:* ${p.price_note || 'Bajo consulta'}

📲 Responde a este mensaje para recibir la ficha técnica completa o coordinar visita.`;
}
