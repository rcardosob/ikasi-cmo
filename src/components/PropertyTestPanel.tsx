'use client';

import { useState } from 'react';
import { Search, Building, Zap, MapPin, Ruler, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface PropertyDetail {
  property_code?: string;
  title?: string;
  type?: string;
  location?: string;
  surface_area?: number;
  covered_area?: number;
  height_m?: number;
  loading_docks?: number;
  ramps?: number;
  kva?: number;
  price?: number;
  currency?: string;
  status?: string;
  services?: string[];
  description?: string;
  [key: string]: unknown;
}

export default function PropertyTestPanel() {
  const [code, setCode] = useState('BIR-590');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PropertyDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/mcp/property?code=${encodeURIComponent(code.trim())}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'No se pudo obtener la propiedad del MCP.');
      } else {
        setResult(json.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 rounded-2xl bg-ikasi-deep/90 border border-ikasi-cool/60 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-ikasi-cool/40 pb-4">
        <div>
          <h2 className="text-xl font-bold text-ikasi-primary flex items-center gap-2">
            <Building className="w-5 h-5 text-ikasi-accent" /> Validador de Conexión MCP IKASI
          </h2>
          <p className="text-xs text-ikasi-secondary">
            Prueba de consulta en tiempo real vía <span className="font-mono text-ikasi-accent">get_property_detail</span>
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Conector Activo
        </span>
      </div>

      {/* Formulario de Consulta */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ingrese el Código de Propiedad (ej. BIR-590)"
            className="w-full px-4 py-3 pl-11 rounded-xl bg-ikasi-darkest border border-ikasi-cool text-ikasi-primary placeholder:text-ikasi-secondary/50 focus:outline-none focus:border-ikasi-accent transition-colors font-mono text-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ikasi-secondary" />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-ikasi-accent text-ikasi-darkest font-semibold hover:bg-[#e0ab9b] disabled:opacity-50 transition-all flex items-center gap-2 text-sm shadow-lg shadow-[#cf9c8c]/10"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Consultar MCP
        </button>
      </form>

      {/* Estado de Error */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error al consultar el MCP:</p>
            <p className="text-xs text-rose-300/80 mt-1 font-mono">{error}</p>
          </div>
        </div>
      )}

      {/* Resultado de la Propiedad */}
      {result && (
        <div className="p-5 rounded-xl bg-ikasi-darkest/80 border border-ikasi-cool/50 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-ikasi-cool/30 pb-3">
            <span className="text-xs uppercase tracking-wider text-ikasi-accent font-mono font-bold">
              {result.property_code || code}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-ikasi-cool/40 text-ikasi-secondary">
              {result.type || 'Propiedad Industrial'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-ikasi-medium/60 border border-ikasi-cool/30">
              <span className="text-ikasi-secondary flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-ikasi-accent" /> Ubicación
              </span>
              <p className="font-semibold text-ikasi-primary truncate">{result.location || 'No especificada'}</p>
            </div>

            <div className="p-3 rounded-lg bg-ikasi-medium/60 border border-ikasi-cool/30">
              <span className="text-ikasi-secondary flex items-center gap-1 mb-1">
                <Ruler className="w-3.5 h-3.5 text-ikasi-accent" /> Superficie
              </span>
              <p className="font-semibold text-ikasi-primary">
                {result.surface_area !== null && result.surface_area !== undefined ? `${result.surface_area} m²` : 'N/A'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-ikasi-medium/60 border border-ikasi-cool/30">
              <span className="text-ikasi-secondary flex items-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-ikasi-accent" /> KVA
              </span>
              <p className="font-semibold text-ikasi-primary">
                {result.kva !== null && result.kva !== undefined ? `${result.kva} KVA` : 'N/A'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-ikasi-medium/60 border border-ikasi-cool/30">
              <span className="text-ikasi-secondary flex items-center gap-1 mb-1">
                <Building className="w-3.5 h-3.5 text-ikasi-accent" /> Andenes
              </span>
              <p className="font-semibold text-ikasi-primary">
                {result.loading_docks !== null && result.loading_docks !== undefined ? result.loading_docks : 'N/A'}
              </p>
            </div>
          </div>

          {/* Raw JSON Expander */}
          <details className="text-[11px] font-mono text-ikasi-secondary pt-2 border-t border-ikasi-cool/20 text-left">
            <summary className="cursor-pointer hover:text-ikasi-accent transition-colors font-mono text-left">
              Ver JSON crudo retornado por el MCP de IKASI
            </summary>
            <pre className="mt-2 p-3 rounded-lg bg-black/80 overflow-x-auto text-emerald-400/90 leading-relaxed max-h-80 overflow-y-auto text-left font-mono whitespace-pre">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
