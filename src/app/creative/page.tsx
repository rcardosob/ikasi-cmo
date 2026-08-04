'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Image as ImageIcon, FileText, Layers, Building2 } from 'lucide-react';
import PropertyInputHeader from '@/components/creative/PropertyInputHeader';
import CopyGenerator from '@/components/creative/CopyGenerator';
import ImageGenerator from '@/components/creative/ImageGenerator';
import FlyerGenerator from '@/components/creative/FlyerGenerator';
import CarouselGenerator from '@/components/creative/CarouselGenerator';
import { NormalizedProperty } from '@/lib/mcp/client';

import ThemeToggle from '@/components/ThemeToggle';

type ModeType = 'copy' | 'images' | 'flyer' | 'carousel';

export default function CreativeAreaPage() {
  const [property, setProperty] = useState<NormalizedProperty | null>(null);
  const [highlights, setHighlights] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [activeMode, setActiveMode] = useState<ModeType>('copy');

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

        {/* 2. Selector de Los 4 Modos de Generación (Botones Principales) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;

            return (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'bg-ikasi-medium border-ikasi-accent shadow-xl shadow-[#cf9c8c]/10 text-ikasi-accent'
                    : 'bg-ikasi-deep/70 border-ikasi-cool/50 text-ikasi-secondary hover:border-ikasi-malva hover:text-ikasi-primary'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${isActive ? 'bg-ikasi-cool border-ikasi-accent text-ikasi-accent' : 'bg-ikasi-darkest border-ikasi-cool text-ikasi-secondary'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-ikasi-cool/50 text-ikasi-secondary">
                    {m.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-ikasi-primary">{m.label}</h4>
                  <p className="text-xs text-ikasi-secondary mt-1">{m.desc}</p>
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
