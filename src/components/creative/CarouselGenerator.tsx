'use client';

import { useState } from 'react';
import { Layers, ChevronLeft, ChevronRight, Download, Sparkles } from 'lucide-react';
import { NormalizedProperty } from '@/lib/mcp/client';

interface CarouselGeneratorProps {
  property: NormalizedProperty | null;
  uploadedImages: string[];
}

export default function CarouselGenerator({ property, uploadedImages }: CarouselGeneratorProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = property
    ? [
        {
          title: `OPORTUNIDAD INDUSTRIAL EN ${property.location.toUpperCase()}`,
          subtitle: `Propiedad ${property.property_code}`,
          bg: '#050205',
          tag: 'SLIDE 1: PORTADA IMPACTANTE',
          desc: 'Presentación visual principal con título comercial y marca corporativa.',
        },
        {
          title: 'ESPECIFICACIONES TÉCNICAS CLAVE',
          subtitle: `Superficie: ${property.surface_area ? property.surface_area + ' m²' : 'Consultar'} | Andenes: ${property.loading_docks ?? 'N/A'}`,
          bg: '#140919',
          tag: 'SLIDE 2: MÉTRICAS Y CAPACIDADES',
          desc: 'Resalte gráfico de métricas para tomadores de decisión.',
        },
        {
          title: 'INFRAESTRUCTURA & CONECTIVIDAD',
          subtitle: `Capacidad Eléctrica: ${property.kva ? property.kva + ' KVA' : 'Adaptable a requerimiento'}`,
          bg: '#23162e',
          tag: 'SLIDE 3: INFRAESTRUCTURA',
          desc: 'Detalles operativos esenciales.',
        },
        {
          title: 'AGENDA UNA VISITA TÉCNICA',
          subtitle: 'Ikasi Inmobiliaria® • Industrial Realtor Tech',
          bg: '#2e2b4d',
          tag: 'SLIDE 4: CALL TO ACTION (CTA)',
          desc: 'Cierre comercial con llamada a la acción e información de contacto.',
        },
      ]
    : [];

  return (
    <div className="w-full bg-ikasi-deep/90 border border-ikasi-cool/60 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ikasi-cool/40 pb-4">
        <div>
          <h3 className="text-lg font-bold text-ikasi-primary flex items-center gap-2">
            <Layers className="w-5 h-5 text-ikasi-accent" /> Diseñador de Carruseles Multicapa (LinkedIn / Instagram)
          </h3>
          <p className="text-xs text-ikasi-secondary">
            Diapositivas secuenciales deslizables para publicaciones de alto compromiso
          </p>
        </div>

        {property && (
          <button
            onClick={() => alert('Exportando carrusel completo de 4 diapositivas...')}
            className="px-4 py-2 rounded-xl bg-ikasi-accent text-ikasi-darkest font-semibold hover:bg-[#e0ab9b] transition-all text-xs flex items-center gap-2 shadow-lg shadow-[#cf9c8c]/10"
          >
            <Download className="w-4 h-4" /> Descargar Carrusel Completo (4 Slides)
          </button>
        )}
      </div>

      {!property ? (
        <div className="p-12 text-center border border-dashed border-ikasi-cool/40 rounded-xl text-ikasi-secondary text-sm">
          Ingresa un código de propiedad arriba para diseñar las diapositivas del carrusel.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between bg-ikasi-darkest p-3 rounded-xl border border-ikasi-cool/30">
            <span className="text-xs font-semibold text-ikasi-accent">
              Diapositiva {activeSlide + 1} de {slides.length}: {slides[activeSlide].tag}
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={activeSlide === 0}
                onClick={() => setActiveSlide((prev) => prev - 1)}
                className="p-1.5 rounded-lg bg-ikasi-medium text-ikasi-primary disabled:opacity-30 border border-ikasi-cool hover:border-ikasi-accent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={activeSlide === slides.length - 1}
                onClick={() => setActiveSlide((prev) => prev + 1)}
                className="p-1.5 rounded-lg bg-ikasi-medium text-ikasi-primary disabled:opacity-30 border border-ikasi-cool hover:border-ikasi-accent"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slide Stage Preview */}
          <div className="flex flex-col items-center justify-center p-6 bg-black/40 rounded-xl border border-ikasi-cool/40">
            <div
              style={{ backgroundColor: slides[activeSlide].bg }}
              className="w-full max-w-[340px] aspect-square rounded-2xl p-6 border-2 border-ikasi-malva/60 shadow-2xl flex flex-col justify-between relative overflow-hidden"
            >
              {uploadedImages.length > 0 && activeSlide === 0 && (
                <div className="absolute inset-0 opacity-20">
                  <img src={uploadedImages[0]} alt="Fondo" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] font-bold text-ikasi-accent tracking-widest z-10">
                <span>IKASI INMOBILIARIA®</span>
                <span>{property.property_code}</span>
              </div>

              <div className="space-y-2 my-auto z-10">
                <h4 className="text-lg font-extrabold text-ikasi-primary leading-tight">
                  {slides[activeSlide].title}
                </h4>
                <p className="text-xs text-ikasi-secondary font-medium leading-relaxed">
                  {slides[activeSlide].subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between text-[9px] text-ikasi-secondary border-t border-ikasi-cool/40 pt-2 z-10">
                <span>Desliza para ver más 👉</span>
                <span className="font-bold text-ikasi-accent">{activeSlide + 1}/4</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
