'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Mic, MicOff, Upload, Image as ImageIcon, CheckCircle2, Loader2, Sparkles, X } from 'lucide-react';
import { NormalizedProperty } from '@/lib/mcp/client';

interface PropertyInputHeaderProps {
  onPropertyLoaded: (property: NormalizedProperty) => void;
  onHighlightsChanged: (highlights: string) => void;
  onImagesUploaded: (imagesBase64: string[]) => void;
}

export default function PropertyInputHeader({
  onPropertyLoaded,
  onHighlightsChanged,
  onImagesUploaded,
}: PropertyInputHeaderProps) {
  const [code, setCode] = useState('BIR-590');
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<NormalizedProperty | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [highlights, setHighlights] = useState('');

  // Estados para Dictado por Voz (Web Speech API)
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<unknown>(null);

  // Estados para Uploader de Imágenes
  const [images, setImages] = useState<{ id: string; base64: string; name: string }[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    // Inicializar Web Speech API para Dictado por Voz
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
          .SpeechRecognition ||
        (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
          .webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
      } else {
        const recognition = new (SpeechRecognition as new () => {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: (e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void;
          onerror: (e: { error: string }) => void;
          onend: () => void;
          start: () => void;
          stop: () => void;
        })();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'es-MX';

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < Object.keys(event.results).length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setHighlights(transcript);
          onHighlightsChanged(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [onHighlightsChanged]);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) return;
    const rec = recognitionRef.current as { start: () => void; stop: () => void };

    if (isListening) {
      rec.stop();
      setIsListening(false);
    } else {
      try {
        rec.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleSearchProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/mcp/property?code=${encodeURIComponent(code.trim())}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        setError(json.error || 'Propiedad no encontrada en el MCP.');
        setProperty(null);
      } else {
        setProperty(json.data);
        onPropertyLoaded(json.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 6) {
      alert('Límite de máximo 6 imágenes por propiedad.');
      return;
    }

    setUploadingImage(true);
    const newImages: { id: string; base64: string; name: string }[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imgObj = {
            id: Math.random().toString(36).substring(2, 9),
            base64: event.target.result as string,
            name: file.name,
          };
          newImages.push(imgObj);

          if (newImages.length === files.length) {
            const updated = [...images, ...newImages];
            setImages(updated);
            onImagesUploaded(updated.map((i) => i.base64));
            setUploadingImage(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    onImagesUploaded(updated.map((i) => i.base64));
  };

  return (
    <div className="w-full bg-ikasi-deep/90 border border-ikasi-cool/60 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-ikasi-cool/40 pb-4">
        <div>
          <h2 className="text-xl font-bold text-ikasi-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-ikasi-accent" /> Ingesta de Datos para Material de Marketing
          </h2>
          <p className="text-xs text-ikasi-secondary">
            Consumiendo ficha técnica del MCP de Ikasi Inmobiliaria® + Aspectos Destacados
          </p>
        </div>

        {property && (
          <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {property.property_code} Cargada
          </span>
        )}
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulario de Código */}
        <form onSubmit={handleSearchProperty} className="lg:col-span-4 flex flex-col justify-between space-y-3">
          <label className="text-xs font-semibold text-ikasi-secondary uppercase tracking-wider">
            Código de Propiedad
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ej. BIR-590"
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-ikasi-darkest border border-ikasi-cool text-ikasi-primary font-mono text-sm focus:outline-none focus:border-ikasi-accent uppercase"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ikasi-secondary" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-ikasi-accent text-ikasi-darkest font-semibold hover:bg-[#e0ab9b] transition-all text-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Consultar'}
            </button>
          </div>
          {error && <p className="text-xs text-rose-400 font-mono">{error}</p>}
        </form>

        {/* Aspectos a Destar con Dictado por Voz */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-ikasi-secondary uppercase tracking-wider">
              Aspectos a Destacar (Texto / Voz 🎙️)
            </label>
            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`text-xs px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${
                  isListening
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-ikasi-medium/80 border-ikasi-cool text-ikasi-accent hover:border-ikasi-accent'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isListening ? 'Detener Grabación' : 'Dictar por Voz'}
              </button>
            )}
          </div>
          <textarea
            rows={2}
            value={highlights}
            onChange={(e) => {
              setHighlights(e.target.value);
              onHighlightsChanged(e.target.value);
            }}
            placeholder="ej. Entrega inmediata, subestación de 500 KVA, excelente patio de maniobras..."
            className="w-full px-3 py-2 rounded-xl bg-ikasi-darkest border border-ikasi-cool text-ikasi-primary text-xs focus:outline-none focus:border-ikasi-accent resize-none"
          />
        </div>

        {/* Uploader de Imágenes de Apoyo */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-2">
          <label className="text-xs font-semibold text-ikasi-secondary uppercase tracking-wider flex items-center justify-between">
            <span>Fotos ({images.length}/6)</span>
          </label>
          <div className="flex items-center gap-2">
            <label className="flex-1 cursor-pointer p-2.5 rounded-xl bg-ikasi-darkest border border-dashed border-ikasi-cool hover:border-ikasi-accent transition-colors flex items-center justify-center gap-2 text-xs text-ikasi-secondary hover:text-ikasi-accent">
              <Upload className="w-4 h-4" />
              <span>{uploadingImage ? 'Cargando...' : 'Subir Imágenes'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={images.length >= 6}
              />
            </label>
          </div>

          {/* Previews rápidas */}
          {images.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {images.map((img) => (
                <div key={img.id} className="relative group shrink-0 w-8 h-8 rounded bg-ikasi-medium border border-ikasi-cool overflow-hidden">
                  <img src={img.base64} alt={img.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(img.id)}
                    className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ficha Resumen de la Propiedad */}
      {property && (
        <div className="p-4 rounded-xl bg-ikasi-darkest/90 border border-ikasi-cool/40 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-ikasi-secondary block text-[10px]">TÍTULO / TIPO:</span>
            <p className="font-semibold text-ikasi-primary truncate">{property.title}</p>
          </div>
          <div>
            <span className="text-ikasi-secondary block text-[10px]">UBICACIÓN:</span>
            <p className="font-semibold text-ikasi-primary truncate">{property.location}</p>
          </div>
          <div>
            <span className="text-ikasi-secondary block text-[10px]">SUPERFICIE:</span>
            <p className="font-semibold text-ikasi-accent">
              {property.surface_area ? `${property.surface_area} m²` : 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-ikasi-secondary block text-[10px]">ANDENES / KVA:</span>
            <p className="font-semibold text-ikasi-primary">
              {property.loading_docks ?? 'N/A'} andenes | {property.kva ? `${property.kva} KVA` : 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
