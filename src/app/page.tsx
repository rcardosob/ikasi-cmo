'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TargetCursor from '@/components/TargetCursor';
import PropertyTestPanel from '@/components/PropertyTestPanel';
import { Sparkles, Image as ImageIcon, Calculator, Languages, ArrowRight, ShieldCheck, Cpu, User } from 'lucide-react';

export default function LandingPage() {
  // Forzar siempre Modo Oscuro en la Landing Page Principal
  useEffect(() => {
    document.body.classList.remove('light-mode');
  }, []);

  const modules = [
    {
      title: 'Creative Area',
      description: 'Generación de copies optimizados y piezas para redes (1:1, 4:5, 9:16, 1.91:1) y afiches.',
      icon: Sparkles,
      href: '/creative',
      tag: 'Marketing Motor',
    },
    {
      title: 'Gestión de Fotografías',
      description: 'Procesamiento automático de fotos: encuadre, iluminación y marca de agua corporativa.',
      icon: ImageIcon,
      href: '/fotos',
      tag: 'Auto-Process',
    },
    {
      title: 'Opinión de Valor',
      description: 'Asistente IA para valuación financiera comercial mediante 3 metodologías.',
      icon: Calculator,
      href: '/opinion-valor',
      tag: 'Finance AI',
    },
    {
      title: 'Procesadores Asiáticos',
      description: 'Fichas ejecutivas y afiches traducidos en Mandarín y Japonés para WeChat / Line.',
      icon: Languages,
      href: '/asiatico',
      tag: 'Multi-Language',
    },
  ];

  return (
    <div className="relative min-h-screen bg-ikasi-darkest text-ikasi-primary flex flex-col justify-between selection:bg-ikasi-accent selection:text-ikasi-darkest">
      {/* Target Cursor Activo Exclusivamente en Landing Page */}
      <TargetCursor
        spinDuration={2.5}
        hideDefaultCursor={true}
        hoverDuration={0.2}
        parallaxOn={true}
        cursorColor="#F8F8FA"
        cursorColorOnTarget="#CF9C8C"
      />

      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#4e325c]/20 via-[#2e2b4d]/10 to-transparent blur-3xl pointer-events-none -z-0" />

      {/* Top Navbar Permamentemente Oscuro con Acentos Cobre Satinado */}
      <header className="w-full border-b border-[#242030] bg-black/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/brand/LOGO 2022 v.004 (blanco).png"
                alt="Ikasi Inmobiliaria Logo"
                width={140}
                height={40}
                className="h-9 w-auto object-contain cursor-pointer"
                priority
              />
            </Link>
            <span className="text-[11px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#1a1724] border border-[#3a2c47] text-[#cf9c8c] font-semibold">
              CMO Platform
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Módulo de Autenticación Corporativa (Ikasi Accounts) en desarrollo.')}
              className="px-4 py-2 rounded-xl bg-[#cf9c8c] text-[#050205] hover:bg-[#e0ab9b] font-semibold transition-all text-xs flex items-center gap-2 shadow-md shadow-[#cf9c8c]/10"
            >
              <User className="w-4 h-4" /> Login
            </button>
          </div>
        </div>
      </header>

       {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-20 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#140919] border border-[#4e325c]/50 text-[#cf9c8c] text-xs font-semibold mb-8 shadow-lg">
          <Sparkles className="w-4 h-4" /> Plataforma Inteligente de Marketing Inmobiliario
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#f8f8fa] max-w-4xl leading-tight">
          Usa la tecnología para crear <span className="text-[#cf9c8c]">nuevas oportunidades</span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-[#b0afb8] max-w-2xl font-normal leading-relaxed">
          Responde más rápido, comunica mejor y convierte cada oportunidad antes que la competencia.
        </p>

        {/* 1. Panel de Prueba MCP / Validador de Conexión (Arriba del Menú de Módulos) */}
        <div className="mt-12 w-full max-w-3xl">
          <PropertyTestPanel />
        </div>

        {/* 2. Tarjetas del Menú de Módulos (Reposo Negro #050205 / Hover Cobre Satinado #CF9C8C) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full text-left">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <Link
                key={idx}
                href={m.href}
                className="group relative p-6 rounded-2xl bg-[#050205] text-[#f8f8fa] border border-[#cf9c8c]/40 hover:bg-[#cf9c8c] hover:text-[#050205] hover:border-[#e0ab9b] transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-[#cf9c8c]/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-[#121018] text-[#cf9c8c] border border-[#242030] group-hover:bg-[#050205] group-hover:text-[#cf9c8c] group-hover:border-[#050205] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#121018] text-[#cf9c8c] border border-[#242030] group-hover:bg-[#050205]/20 group-hover:text-[#050205] group-hover:border-[#050205]/10 transition-colors">
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#f8f8fa] group-hover:text-[#050205] transition-colors">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-xs font-normal text-[#b0afb8] group-hover:text-[#1f1826] group-hover:font-medium leading-relaxed transition-colors">
                    {m.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#242030] group-hover:border-[#050205]/20 flex items-center justify-between text-xs font-bold text-[#cf9c8c] group-hover:text-[#050205] transition-colors">
                  <span>Acceder al Módulo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer Alineado a la Derecha con Branding de Ikasi Inmobiliaria® e Industrial Realtor® */}
      <footer className="w-full border-t border-[#2e2b4d]/40 bg-[#050205] py-8 text-xs text-[#b0afb8]">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-end">
          <p className="font-medium text-right">
            © 2026 Ikasi Inmobiliaria® • Industrial Realtor®. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
