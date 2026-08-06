import { NextRequest, NextResponse } from 'next/server';
import { NormalizedProperty } from '@/lib/mcp/client';
import { buildCopyPrompt, ChannelType, CHANNEL_LABELS } from '@/lib/copy/prompts';
import { callDeepSeek, callOpenAILuna } from '@/lib/llm/client';
import { sendPushoverAlert } from '@/lib/notifications/pushover';

const CHANNELS: ChannelType[] = ['linkedin', 'portals', 'tiktok', 'social', 'whatsapp'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { property, highlights, channel } = body as {
      property?: NormalizedProperty;
      highlights?: string;
      channel: ChannelType;
    };

    if (!channel || !CHANNELS.includes(channel)) {
      return NextResponse.json(
        { success: false, error: `Canal inválido. Debe ser uno de: ${CHANNELS.join(', ')}` },
        { status: 400 }
      );
    }

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

    const { system, user } = buildCopyPrompt(channel, effectiveProperty, highlights);
    const propertyCode = effectiveProperty.property_code;
    let deepSeekErrorMsg = '';
    let openAIFallbackErrorMsg = '';

    // Nivel 1: DeepSeek
    try {
      const result = await callDeepSeek(system, user);
      return NextResponse.json({
        success: true,
        channel,
        copy: result.text,
        provider: result.provider,
        promptUsed: system,
      });
    } catch (deepSeekError) {
      deepSeekErrorMsg = deepSeekError instanceof Error ? deepSeekError.message : String(deepSeekError);
      console.warn('[copy] DeepSeek falló, intentando fallback OpenAI:', deepSeekErrorMsg);
    }

    // Nivel 2: Fallback OpenAI gpt-5.6-luna
    try {
      const result = await callOpenAILuna(system, user);
      await sendPushoverAlert({
        title: `⚠️ Copy ${propertyCode} generado con FALLBACK`,
        message: `Canal ${CHANNEL_LABELS[channel]}. DeepSeek falló; se usó el fallback OpenAI (${result.provider}). El copy se generó correctamente. Error DeepSeek: ${deepSeekErrorMsg}`,
        priority: 1,
      });
      return NextResponse.json({
        success: true,
        channel,
        copy: result.text,
        provider: result.provider,
        fallback: true,
        alertSent: true,
        promptUsed: system,
      });
    } catch (openAIFallbackError) {
      openAIFallbackErrorMsg =
        openAIFallbackError instanceof Error ? openAIFallbackError.message : String(openAIFallbackError);
      console.warn('[copy] Fallback OpenAI también falló:', openAIFallbackErrorMsg);
    }

    // Nivel 3: Ambos LLM fallaron -> alerta Pushover #2 + plantilla local
    const fallbackCopy = generateStructuredFallbackCopy(channel, effectiveProperty, highlights);

    const warning = `Ambos proveedores de IA fallaron (DeepSeek y OpenAI). Se generó un copy con plantilla local.`;

    await sendPushoverAlert({
      title: `🔴 DOBLE FALLA: copy ${propertyCode}`,
      message: `Canal ${CHANNEL_LABELS[channel]}. DeepSeek y el fallback OpenAI (gpt-5.6-luna) fallaron. Se entregó plantilla local para no dejar vacía la UI. DeepSeek: ${deepSeekErrorMsg} | OpenAI: ${openAIFallbackErrorMsg}`,
      priority: 2,
    });

    return NextResponse.json({
      success: true,
      channel,
      copy: fallbackCopy,
      provider: 'fallback-template',
      fallback: true,
      alertSent: true,
      warning,
      promptUsed: system,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Error al generar copy' },
      { status: 500 }
    );
  }
}

function generateStructuredFallbackCopy(
  channel: ChannelType,
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
