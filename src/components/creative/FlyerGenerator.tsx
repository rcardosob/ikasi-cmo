'use client';

import { useState } from 'react';
import { Download, FileText, Globe, Printer } from 'lucide-react';
import { NormalizedProperty } from '@/lib/mcp/client';

interface FlyerGeneratorProps {
  property: NormalizedProperty | null;
  uploadedImages: string[];
}

type LanguageType = 'es' | 'en' | 'zh' | 'ja';

export default function FlyerGenerator({ property, uploadedImages }: FlyerGeneratorProps) {
  const [lang, setLang] = useState<LanguageType>('es');

  const languages: { id: LanguageType; label: string; flag: string }[] = [
    { id: 'es', label: 'Español', flag: '🇪🇸' },
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'zh', label: 'Chino-Mandarín (中文)', flag: '🇨🇳' },
    { id: 'ja', label: 'Japonés (日本語)', flag: '🇯🇵' },
  ];

  const handlePrintFlyer = () => {
    window.print();
  };

  return (
    <div className="w-full bg-ikasi-deep/90 border border-ikasi-cool/60 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ikasi-cool/40 pb-4">
        <div>
          <h3 className="text-lg font-bold text-ikasi-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-ikasi-accent" /> Generador de Afiches y Flyers Corporativos (PDF / Impresión)
          </h3>
          <p className="text-xs text-ikasi-secondary">
            Plantilla membretada en 4 idiomas (Español, Inglés, Mandarín y Japonés)
          </p>
        </div>

        {property && (
          <button
            onClick={handlePrintFlyer}
            className="px-4 py-2 rounded-xl bg-ikasi-accent text-ikasi-darkest font-semibold hover:bg-[#e0ab9b] transition-all text-xs flex items-center gap-2 shadow-lg shadow-[#cf9c8c]/10"
          >
            <Printer className="w-4 h-4" /> Exportar / Imprimir PDF ({lang.toUpperCase()})
          </button>
        )}
      </div>

      {/* Selector de Idiomas */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-ikasi-cool/30">
        {languages.map((l) => (
          <button
            key={l.id}
            onClick={() => setLang(l.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border shrink-0 ${
              lang === l.id
                ? 'bg-ikasi-medium border-ikasi-accent text-ikasi-accent shadow-md'
                : 'bg-ikasi-darkest/60 border-ikasi-cool/40 text-ikasi-secondary hover:border-ikasi-malva'
            }`}
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>

      {/* Vista Previa Membretada del Flyer */}
      {!property ? (
        <div className="p-12 text-center border border-dashed border-ikasi-cool/40 rounded-xl text-ikasi-secondary text-sm">
          Ingresa un código de propiedad arriba para generar la ficha/flyer en el idioma seleccionado.
        </div>
      ) : (
        <div className="p-8 bg-white text-slate-900 rounded-xl shadow-2xl font-sans max-w-3xl mx-auto space-y-6 print:m-0 print:shadow-none">
          {/* Header Membretado */}
          <div className="flex items-center justify-between border-b-2 border-purple-900 pb-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-purple-950">IKASI INMOBILIARIA®</h1>
              <p className="text-xs text-purple-700 font-semibold tracking-widest uppercase">Industrial Realtor Tech</p>
            </div>
            <div className="text-right font-mono">
              <span className="inline-block px-3 py-1 bg-purple-900 text-amber-200 text-xs font-bold rounded-lg">
                {property.property_code}
              </span>
            </div>
          </div>

          {/* Banner de Título */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 uppercase">
              {lang === 'es' && property.title}
              {lang === 'en' && `INDUSTRIAL PROPERTY - ${property.property_code}`}
              {lang === 'zh' && `工业厂房技术规格书 - ${property.property_code}`}
              {lang === 'ja' && `産業用物件テクニカルシート - ${property.property_code}`}
            </h2>
            <p className="text-sm text-slate-600 font-medium">📍 {property.location}</p>
          </div>

          {/* Grid Foto + Specs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {uploadedImages.length > 0 && (
              <div className="md:col-span-5 h-48 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                <img src={uploadedImages[0]} alt="Propiedad" className="w-full h-full object-cover" />
              </div>
            )}

            <div className={uploadedImages.length > 0 ? 'md:col-span-7' : 'md:col-span-12'}>
              <table className="w-full text-xs text-left border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-bold text-slate-500">
                      {lang === 'es' && 'Superficie Total:'}
                      {lang === 'en' && 'Available Area:'}
                      {lang === 'zh' && '可用面积:'}
                      {lang === 'ja' && '利用可能面積:'}
                    </td>
                    <td className="py-2 font-bold text-purple-900">
                      {property.surface_area ? `${property.surface_area} m²` : 'N/A'}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-bold text-slate-500">
                      {lang === 'es' && 'Andenes de Carga:'}
                      {lang === 'en' && 'Dock Doors:'}
                      {lang === 'zh' && '装卸码头门:'}
                      {lang === 'ja' && '接车ドック:'}
                    </td>
                    <td className="py-2 font-bold text-slate-800">
                      {property.loading_docks !== null ? property.loading_docks : 'N/A'}
                    </td>
                  </tr>

                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-bold text-slate-500">
                      {lang === 'es' && 'Capacidad KVA:'}
                      {lang === 'en' && 'Power Capacity:'}
                      {lang === 'zh' && '电力容量:'}
                      {lang === 'ja' && '受电容量:'}
                    </td>
                    <td className="py-2 font-bold text-slate-800">
                      {property.kva ? `${property.kva} KVA` : 'N/A'}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 font-bold text-slate-500">
                      {lang === 'es' && 'Esquema Comercial:'}
                      {lang === 'en' && 'Commercial Terms:'}
                      {lang === 'zh' && '商务条款:'}
                      {lang === 'ja' && '商业条件:'}
                    </td>
                    <td className="py-2 font-bold text-slate-800">
                      {property.price_note || 'Bajo consulta'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Membretado */}
          <div className="border-t-2 border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>Contacto: info@industrialrealtor.app</span>
            <span>Ikasi Inmobiliaria® • Industrial Real Estate</span>
          </div>
        </div>
      )}
    </div>
  );
}
