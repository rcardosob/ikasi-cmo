'use client';

import Image from 'next/image';
import Link from 'next/link';
import TargetCursor from '@/components/TargetCursor';
import PropertyTestPanel from '@/components/PropertyTestPanel';
import { Sparkles, Image as ImageIcon, Calculator, Languages, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export default function LandingPage() {
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

      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Image
            src="/brand/LOGO 2022 v.004 (blanco).png"
            alt="Ikasi Inmobiliaria Logo"
            width={140}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="text-xs uppercase tracking-widest px-2.5 py-1 rounded-full bg-ikasi-cool/60 border border-ikasi-malva/40 text-ikasi-accent font-semibold">
            CMO Platform
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-xs text-ikasi-secondary bg-ikasi-deep/80 px-3 py-1.5 rounded-lg border border-ikasi-cool/40">
            <Cpu className="w-3.5 h-3.5 text-ikasi-accent" /> MCP Connected
          </span>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 z-10 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ikasi-medium/80 border border-ikasi-malva/50 text-ikasi-accent text-sm tracking-wide">
            <ShieldCheck className="w-4 h-4" /> Plataforma de Automatización de Marketing Inmobiliario
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Potencia el alcance de tus <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ikasi-primary via-ikasi-accent to-[#e6b9ad]">
              Propiedades Industriales
            </span>
          </h1>

          <p className="text-ikasi-secondary text-lg md:text-xl font-normal leading-relaxed">
            Consumiendo la única fuente de verdad a través del MCP de <span className="text-ikasi-primary font-semibold">Ikasi Inmobiliaria®</span>. Genera assets, copys, afiches multilingües y valuaciones en segundos.
          </p>

          {/* Panel de Validación MCP Fase 1 */}
          <PropertyTestPanel />
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <Link
                key={idx}
                href={mod.href}
                className="cursor-target group relative p-6 rounded-2xl bg-ikasi-deep/70 border border-ikasi-cool/50 hover:border-ikasi-accent/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#cf9c8c]/5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-ikasi-medium/80 border border-ikasi-malva/40 text-ikasi-accent group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-ikasi-cool/50 text-ikasi-secondary">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold group-hover:text-ikasi-accent transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-sm text-ikasi-secondary leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between text-xs font-semibold text-ikasi-accent pt-4 border-t border-ikasi-cool/30">
                  <span>Acceder al Módulo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-8 border-t border-ikasi-cool/30 flex flex-col sm:flex-row items-center justify-between text-xs text-ikasi-secondary z-10 gap-4">
        <p>© 2026 Ikasi Inmobiliaria®. Todos los derechos reservados.</p>
        <div className="flex items-center gap-6">
          <span>ikasi-cmo v1.0.0</span>
          <span>•</span>
          <span className="text-ikasi-accent">Industrial Realtor Tech</span>
        </div>
      </footer>
    </div>
  );
}
