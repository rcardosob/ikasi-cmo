'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles, Loader2, Building2, Linkedin, Video, Instagram, MessageSquare, AlertTriangle } from 'lucide-react';
import { NormalizedProperty } from '@/lib/mcp/client';
import { ChannelType } from '@/lib/copy/prompts';

interface CopyGeneratorProps {
  property: NormalizedProperty | null;
  highlights: string;
}

export default function CopyGenerator({ property, highlights }: CopyGeneratorProps) {
  const [activeTab, setActiveTab] = useState<ChannelType>('linkedin');
  const [copies, setCopies] = useState<Record<ChannelType, string>>({
    linkedin: '',
    portals: '',
    tiktok: '',
    social: '',
    whatsapp: '',
  });
  const [loadingChannel, setLoadingChannel] = useState<Record<ChannelType, boolean>>({
    linkedin: false,
    portals: false,
    tiktok: false,
    social: false,
    whatsapp: false,
  });
  const [copied, setCopied] = useState<Record<ChannelType, boolean>>({
    linkedin: false,
    portals: false,
    tiktok: false,
    social: false,
    whatsapp: false,
  });
  const [warning, setWarning] = useState<string | null>(null);

  const channels: { id: ChannelType; label: string; icon: React.ElementType; badge: string }[] = [
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, badge: 'C-Level & B2B' },
    { id: 'portals', label: 'Portales Inmobiliarios', icon: Building2, badge: 'Dueños & Gerentes' },
    { id: 'tiktok', label: 'TikTok', icon: Video, badge: 'Hooks & Tendencias' },
    { id: 'social', label: 'Instagram & FB', icon: Instagram, badge: 'Storytelling & Feed' },
    { id: 'whatsapp', label: 'WhatsApp & Stories', icon: MessageSquare, badge: 'Mensaje Directo' },
  ];

  const handleGenerateCopy = async (channel: ChannelType) => {
    setLoadingChannel((prev) => ({ ...prev, [channel]: true }));
    setWarning(null);

    try {
      const res = await fetch('/api/creative/copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          property: property || undefined,
          highlights,
          channel,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCopies((prev) => ({ ...prev, [channel]: json.copy }));
        if (json.warning) setWarning(json.warning);
      } else {
        alert(json.error || 'Error al generar copy');
      }
    } catch {
      alert('Error de conexión al generar copy.');
    } finally {
      setLoadingChannel((prev) => ({ ...prev, [channel]: false }));
    }
  };

  const handleGenerateAll = async () => {
    for (const c of channels) {
      await handleGenerateCopy(c.id);
    }
  };

  const copyToClipboard = (channel: ChannelType) => {
    const text = copies[channel];
    if (!text) return;

    navigator.clipboard.writeText(text);
    setCopied((prev) => ({ ...prev, [channel]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [channel]: false }));
    }, 2000);
  };

  return (
    <div className="w-full bg-ikasi-deep/90 border border-ikasi-cool/60 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ikasi-cool/40 pb-4">
        <div>
          <h3 className="text-lg font-bold text-ikasi-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-ikasi-accent" /> Generador Multicanal de Copies con IA
          </h3>
          <p className="text-xs text-ikasi-secondary">
            Redacción optimizada según audiencia (LinkedIn B2B, Portales, TikTok Hooks, IG/FB y WhatsApp)
          </p>
        </div>

        <button
          onClick={handleGenerateAll}
          className="px-4 py-2 rounded-xl bg-ikasi-accent text-ikasi-darkest font-semibold hover:bg-[#f3e5ab] transition-all text-xs flex items-center gap-2 shadow-lg shadow-[#d4af37]/10"
        >
          <Sparkles className="w-4 h-4" /> Generar Todos los Canales
        </button>
      </div>

      {/* Tabs por Canal */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-ikasi-cool/30">
        {channels.map((c) => {
          const Icon = c.icon;
          const isActive = activeTab === c.id;
          const hasContent = Boolean(copies[c.id]);

          return (
            <button
              key={c.id}
              onClick={() => setActiveTab(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                isActive
                  ? 'bg-ikasi-medium text-ikasi-accent border-ikasi-accent shadow-md'
                  : 'bg-ikasi-darkest/60 text-ikasi-secondary border-ikasi-cool/40 hover:border-ikasi-malva hover:text-ikasi-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{c.label}</span>
              {hasContent && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Panel del Canal Activo */}
      <div className="space-y-4">
        {warning && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Generación degradada</p>
              <p className="text-amber-200/90 mt-0.5">{warning}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-ikasi-accent font-mono font-bold">
              Canal: {channels.find((c) => c.id === activeTab)?.label}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-ikasi-cool/40 text-ikasi-secondary">
              {channels.find((c) => c.id === activeTab)?.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGenerateCopy(activeTab)}
              disabled={loadingChannel[activeTab]}
              className="px-3.5 py-1.5 rounded-lg bg-ikasi-medium border border-ikasi-accent/40 text-ikasi-accent hover:border-ikasi-accent text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
            >
              {loadingChannel[activeTab] ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {copies[activeTab] ? 'Regenerar Copy' : 'Generar Copy'}
            </button>

            {copies[activeTab] && (
              <button
                onClick={() => copyToClipboard(activeTab)}
                className="px-3.5 py-1.5 rounded-lg bg-ikasi-accent text-ikasi-darkest font-semibold hover:bg-[#f3e5ab] text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                {copied[activeTab] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied[activeTab] ? '¡Copiado!' : 'Copiar Texto'}
              </button>
            )}
          </div>
        </div>

        {/* Textarea de Edición en Vivo */}
        <textarea
          rows={12}
          value={copies[activeTab]}
          onChange={(e) => setCopies((prev) => ({ ...prev, [activeTab]: e.target.value }))}
          placeholder={`Haz clic en "Generar Copy" para crear la redacción personalizada para ${channels.find((c) => c.id === activeTab)?.label}...`}
          className="w-full p-4 rounded-xl bg-ikasi-darkest border border-ikasi-cool text-ikasi-primary font-mono text-xs leading-relaxed focus:outline-none focus:border-ikasi-accent resize-y"
        />
      </div>
    </div>
  );
}
