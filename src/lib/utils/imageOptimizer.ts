import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export interface OptimizedImageResult {
  filename: string;
  originalSize: number;
  optimizedSize: number;
  width: number;
  height: number;
  base64: string;
}

/**
 * Optimiza y normaliza imágenes de propiedad recibidas por la app
 * Redimensiona a un máximo razonable (1920px) y convierte a WebP con calidad 82%
 */
export async function optimizeImageBuffer(
  buffer: Buffer,
  originalFilename: string
): Promise<OptimizedImageResult> {
  const originalSize = buffer.length;

  const image = sharp(buffer);
  const metadata = await image.metadata();

  const optimizedBuffer = await image
    .resize({
      width: 1920,
      height: 1920,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();

  const optimizedMeta = await sharp(optimizedBuffer).metadata();
  const base64 = `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
  const filename = `${path.parse(originalFilename).name}_opt.webp`;

  return {
    filename,
    originalSize,
    optimizedSize: optimizedBuffer.length,
    width: optimizedMeta.width || metadata.width || 0,
    height: optimizedMeta.height || metadata.height || 0,
    base64,
  };
}
