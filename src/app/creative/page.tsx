'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Image as ImageIcon, FileText, Layers } from 'lucide-react';
import PropertyInputHeader from '@/components/creative/PropertyInputHeader';
import CopyGenerator from '@/components/creative/CopyGenerator';
import ImageGenerator from '@/components/creative/ImageGenerator';
import FlyerGenerator from '@/components/creative/FlyerGenerator';
import CarouselGenerator from '@/components/creative/CarouselGenerator';
import ThemeToggle from '@/components/ThemeToggle';
import { NormalizedProperty } from '@/lib/mcp/client';

type ModeType = 'copy' | 'images' | 'flyer' | 'carousel';

export default function CreativeAreaPage() {
  const [property, setProperty] = useState<NormalizedProperty | null>(null);
  const [highlights, setHighlights] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeMode, setActiveMode] = useState<ModeType>('copy');
  const [isLightMode, setIsLightMode] = useState(false);

  // Escuchar si la aplicación está en Modo Claro u Oscuro
  useEffect(() => {
    const checkTheme = () => {
      setIsLightMode(document.body.classList.contains('light-mode'));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const modes: { id: ModeType; label: string; desc: string; icon: React.ElementType; badge: string }[] = [
    {
      id: 'copy',
      label: 'a) Crea Copy',
      desc: '5 Canales (LinkedIn, Portales, TikTok, IG/FB, WhatsApp)',
      icon: Sparkles,
      badge: 'IA Multicanal',
    },
    {
      id: 'images',
      label: 'b) Crea Imágenes',
      desc: '4 Formatos (1:1, 4:5, 9:16, 1.91:1)',
      icon: ImageIcon,
      badge: 'Canvas 4K',
    },
    {
      id: 'flyer',
      label: 'c) Crea Flyers',
      desc: 'PDF Membretado en 4 Idiomas (ES, EN, ZH, JA)',
      icon: FileText,
      badge: 'PDF Multi-idioma',
    },
    {
      id: 'carousel',
      label: 'd) Crea Carruseles',
      desc: 'Diapositivas multicapa para LinkedIn e Instagram',
      icon: Layers,
      badge: 'Multi-Slide',
    },
  ];

  return (
    <div className="min-h-screen bg-ikasi-darkest text-ikasi-primary selection:bg-ikasi-accent selection:text-ikasi-darkest pb-16">
      {/* Header Superior Permanentemente Oscuro (Fondo Negro #000000 + Blancos + Cobre Satinado #CF9C8C) */}
      <header className="w-full border-b border-[#242030] bg-black/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Extremo Izquierdo: Logotipo Blanco (Link al Home /) + Badge Cobre */}
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/brand/LOGO 2022 v.004 (blanco).png"
                alt="Ikasi Logo"
                width={120}
                height={35}
                className="h-8 w-auto object-contain cursor-pointer"
                priority
              />
            </Link>
            <span className="text-[11px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#1a1724] border border-[#3a2c47] text-[#cf9c8c] font-semibold">
              Creative Area
            </span>
          </div>

          {/* Extremo Derecho: Selector de Tema (Dark/Light) + Volver al Inicio en Blancos / Cobre */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="p-2 px-3.5 rounded-xl bg-[#1a1724] border border-[#3a2c47] text-[#f8f8fa] hover:border-[#cf9c8c] hover:text-[#cf9c8c] transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-[#cf9c8c]" /> Volver al Inicio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* 1. Header de Ingesta (MCP + Aspectos Destacados Texto/Voz + Uploader de Fotos) */}
        <PropertyInputHeader
          onPropertyLoaded={setProperty}
          onHighlightsChanged={setHighlights}
          onImagesUploaded={setUploadedImages}
        />

        {/* 2. Selector de Los 4 Modos de Generación (ESTILOS GARANTIZADOS POR REACT STATE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;

            // Determinar estilo exacto usando JavaScript directo
            let buttonStyle = '';
            let iconStyle = '';
            let badgeStyle = '';

            if (isLightMode) {
              // MODO CLARO
              if (isActive) {
                // Modo Claro + Seleccionado -> Fondo Negro Absoluto + Borde Cobre
                buttonStyle = 'bg-[#050205] text-[#f8f8fa] border-[#cf9c8c] -translate-y-1 shadow-2xl';
                iconStyle = 'bg-[#cf9c8c] text-[#050205] border-[#cf9c8c]';
                badgeStyle = 'bg-[#cf9c8c] text-[#050205] border-[#cf9c8c]';
              } else {
                // Modo Claro + Inactivo -> Fondo Blanco + Texto Oscuro
                buttonStyle = 'bg-white text-[#12101a] border-slate-200 hover:bg-[#050205] hover:text-[#f8f8fa] hover:border-[#cf9c8c] hover:-translate-y-1';
                iconStyle = 'bg-slate-100 text-slate-700 border-slate-200';
                badgeStyle = 'bg-slate-100 text-slate-600 border-slate-200';
              }
            } else {
              // MODO OSCURO
              if (isActive) {
                // Modo Oscuro + Seleccionado -> Fondo Cobre Satinado + Texto Oscuro
                buttonStyle = 'bg-[#cf9c8c] text-[#050205] border-[#e0ab9b] -translate-y-1 shadow-2xl shadow-[#cf9c8c]/20';
                iconStyle = 'bg-[#050205] text-[#cf9c8c] border-[#050205]';
                badgeStyle = 'bg-[#050205]/20 text-[#050205] border-[#050205]/10';
              } else {
                // Modo Oscuro + Inactivo -> Fondo Negro Absoluto + Borde Cobre
                buttonStyle = 'bg-[#050205] text-[#f8f8fa] border-[#cf9c8c]/40 hover:bg-[#cf9c8c] hover:text-[#050205] hover:border-[#e0ab9b] hover:-translate-y-1';
                iconStyle = 'bg-[#121018] text-[#cf9c8c] border-[#242030]';
                badgeStyle = 'bg-[#121018] text-[#cf9c8c] border-[#242030]';
              }
            }

            return (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between space-y-3 shadow-xl ${buttonStyle}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border transition-colors ${iconStyle}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-colors ${badgeStyle}`}>
                    {m.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm transition-colors">{m.label}</h4>
                  <p className="text-xs mt-1 transition-colors opacity-90">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3. Panel Activo de Generación */}
        <div className="w-full">
          {activeMode === 'copy' && <CopyGenerator property={property} highlights={highlights} />}
          {activeMode === 'images' && <ImageGenerator property={property} uploadedImages={uploadedImages} />}
          {activeMode === 'flyer' && <FlyerGenerator property={property} uploadedImages={uploadedImages} />}
          {activeMode === 'carousel' && <CarouselGenerator property={property} uploadedImages={uploadedImages} />}
        </div>
      </main>
    </div>
  );
}
