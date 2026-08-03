'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import { NormalizedProperty } from '@/lib/mcp/client';

interface ImageGeneratorProps {
  property: NormalizedProperty | null;
  uploadedImages: string[];
}

type AspectRatioType = '1:1' | '4:5' | '9:16' | '1.91:1';

interface FormatConfig {
  id: AspectRatioType;
  label: string;
  desc: string;
  width: number;
  height: number;
  previewClass: string;
}

export default function ImageGenerator({ property, uploadedImages }: ImageGeneratorProps) {
  const [selectedFormat, setSelectedFormat] = useState<AspectRatioType>('4:5');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const formats: FormatConfig[] = [
    { id: '1:1', label: '1:1 Cuadrado', desc: 'Feed Universal / Posts', width: 1080, height: 1080, previewClass: 'aspect-square max-w-[280px]' },
    { id: '4:5', label: '4:5 Vertical', desc: 'Feed IG / FB (Recomendado)', width: 1080, height: 1350, previewClass: 'aspect-[4/5] max-w-[280px]' },
    { id: '9:16', label: '9:16 Story / Reel', desc: 'Stories, TikTok, WhatsApp', width: 1080, height: 1920, previewClass: 'aspect-[9/16] max-w-[220px]' },
    { id: '1.91:1', label: '1.91:1 Banner', desc: 'LinkedIn / Web / FB Link', width: 1200, height: 630, previewClass: 'aspect-[1.91/1] max-w-[340px]' },
  ];

  const currentConfig = formats.find((f) => f.id === selectedFormat)!;

  useEffect(() => {
    if (!canvasRef.current || !property) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar dimensiones reales
    canvas.width = currentConfig.width;
    canvas.height = currentConfig.height;

    const W = canvas.width;
    const H = canvas.height;

    // 1. Fondo Gradiente Oscuro Corporativo (Paleta #050205 a #140919)
    const gradient = ctx.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#050205');
    gradient.addColorStop(0.5, '#140919');
    gradient.addColorStop(1, '#23162e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    // 2. Renderizar foto de apoyo si existe
    if (uploadedImages.length > 0) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Renderizar imagen recortada en la mitad superior con overlay
        const imgH = H * 0.55;
        ctx.drawImage(img, 0, 0, W, imgH);

        // Degradado oscuro sobre la foto para integrar el texto
        const overlay = ctx.createLinearGradient(0, 0, 0, imgH);
        overlay.addColorStop(0, 'rgba(5, 2, 5, 0.2)');
        overlay.addColorStop(1, '#140919');
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, W, imgH);

        drawGraphicTextContent(ctx, W, H, property);
      };
      img.src = uploadedImages[0];
    } else {
      drawGraphicTextContent(ctx, W, H, property);
    }
  }, [property, selectedFormat, uploadedImages, currentConfig]);

  const drawGraphicTextContent = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    p: NormalizedProperty
  ) => {
    // Si no hay foto, agregar sutiles patrones de diseño
    if (uploadedImages.length === 0) {
      ctx.strokeStyle = 'rgba(78, 50, 92, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < W; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, H);
        ctx.stroke();
      }
    }

    // Marca / Badge Superior
    ctx.fillStyle = '#CF9C8C';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('IKASI INMOBILIARIA®', 60, 80);

    ctx.fillStyle = '#B0AFB8';
    ctx.font = '18px sans-serif';
    ctx.fillText('INDUSTRIAL REALTOR TECH', 60, 110);

    // Caja de Código de Propiedad
    const boxY = uploadedImages.length > 0 ? H * 0.48 : 160;
    ctx.fillStyle = '#2E2B4D';
    ctx.beginPath();
    ctx.roundRect(60, boxY, 180, 48, 12);
    ctx.fill();

    ctx.fillStyle = '#CF9C8C';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(p.property_code, 80, boxY + 32);

    // Título Principal
    ctx.fillStyle = '#F8F8FA';
    ctx.font = 'bold 44px sans-serif';
    const titleY = boxY + 110;
    ctx.fillText(p.title.toUpperCase(), 60, titleY, W - 120);

    // Ubicación
    ctx.fillStyle = '#B0AFB8';
    ctx.font = '26px sans-serif';
    ctx.fillText(`📍 ${p.location}`, 60, titleY + 45, W - 120);

    // Tarjeta de Especificaciones (Grid)
    const cardY = titleY + 90;
    ctx.fillStyle = 'rgba(35, 22, 46, 0.9)';
    ctx.strokeStyle = '#4E325C';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(60, cardY, W - 120, H - cardY - 100, 20);
    ctx.fill();
    ctx.stroke();

    // Métricas en la tarjeta
    ctx.fillStyle = '#CF9C8C';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('ESPECIFICACIONES TÉCNICAS:', 90, cardY + 50);

    ctx.fillStyle = '#F8F8FA';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(
      `📐 Superficie: ${p.surface_area ? p.surface_area + ' m²' : 'N/A'}`,
      90,
      cardY + 110
    );

    ctx.font = '26px sans-serif';
    ctx.fillText(
      `🚛 Andenes de Carga: ${p.loading_docks !== null ? p.loading_docks : 'N/A'}`,
      90,
      cardY + 160
    );

    ctx.fillText(
      `⚡ Capacidad Eléctrica: ${p.kva ? p.kva + ' KVA' : 'N/A'}`,
      90,
      cardY + 210
    );

    // Footer de Cierre
    ctx.fillStyle = '#CF9C8C';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('www.industrialrealtor.app', 60, H - 45);
  };

  const handleDownload = () => {
    if (!canvasRef.current || !property) return;
    const link = document.createElement('a');
    link.download = `${property.property_code}_format_${selectedFormat.replace(':', 'x')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="w-full bg-ikasi-deep/90 border border-ikasi-cool/60 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-ikasi-cool/40 pb-4">
        <div>
          <h3 className="text-lg font-bold text-ikasi-primary flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-ikasi-accent" /> Motor Gráfico Interno (4 Formatos Sociales)
          </h3>
          <p className="text-xs text-ikasi-secondary">
            Renderización autónoma en alta resolución sobre la paleta de Ikasi Inmobiliaria®
          </p>
        </div>

        {property && (
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-ikasi-accent text-ikasi-darkest font-semibold hover:bg-[#e0ab9b] transition-all text-xs flex items-center gap-2 shadow-lg shadow-[#cf9c8c]/10"
          >
            <Download className="w-4 h-4" /> Descargar PNG ({selectedFormat})
          </button>
        )}
      </div>

      {/* Selector de Formatos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {formats.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFormat(f.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedFormat === f.id
                ? 'bg-ikasi-medium border-ikasi-accent text-ikasi-accent shadow-md'
                : 'bg-ikasi-darkest/60 border-ikasi-cool/40 text-ikasi-secondary hover:border-ikasi-malva'
            }`}
          >
            <div className="font-bold text-xs">{f.label}</div>
            <div className="text-[10px] text-ikasi-secondary mt-0.5">{f.desc}</div>
          </button>
        ))}
      </div>

      {/* Canvas Viewport */}
      {!property ? (
        <div className="p-12 text-center border border-dashed border-ikasi-cool/40 rounded-xl text-ikasi-secondary text-sm">
          Ingresa un código de propiedad arriba para visualizar las piezas gráficas en tiempo real.
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 bg-ikasi-darkest rounded-xl border border-ikasi-cool/40 space-y-4">
          <div className={`relative overflow-hidden rounded-xl border border-ikasi-malva/50 shadow-2xl ${currentConfig.previewClass}`}>
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>
          <p className="text-xs text-ikasi-secondary font-mono">
            Resolución Renderizada: {currentConfig.width} x {currentConfig.height} px
          </p>
        </div>
      )}
    </div>
  );
}
