'use client';

import React, { useRef, useEffect } from 'react';
import { CoverConfig } from '@/types/book';

interface CoverCanvasProps {
  config: CoverConfig;
  width?: number;
  height?: number;
  className?: string;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

export function CoverCanvas({
  config,
  width = 600,
  height = 900,
  className,
  onCanvasReady,
}: CoverCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background (Solid / Gradient)
    if (config.gradientType === 'solid') {
      ctx.fillStyle = config.bgColor1 || '#0f172a';
      ctx.fillRect(0, 0, width, height);
    } else if (config.gradientType === 'radial') {
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.2
      );
      grad.addColorStop(0, config.bgColor1 || '#1e293b');
      grad.addColorStop(1, config.bgColor2 || '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Linear gradient
      const angleRad = ((config.gradientAngle || 135) * Math.PI) / 180;
      const x1 = width / 2 - (Math.cos(angleRad) * width) / 2;
      const y1 = height / 2 - (Math.sin(angleRad) * height) / 2;
      const x2 = width / 2 + (Math.cos(angleRad) * width) / 2;
      const y2 = height / 2 + (Math.sin(angleRad) * height) / 2;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, config.bgColor1 || '#0f172a');
      grad.addColorStop(1, config.bgColor2 || '#3b0764');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Draw Patterns
    if (config.pattern === 'dots') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      const step = 28;
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          ctx.arc(x + 14, y + 14, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (config.pattern === 'grid') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (config.pattern === 'stars') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137) % (width - 40)) + 20;
        const sy = ((i * 241) % (height - 40)) + 20;
        const r = (i % 3) + 1;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Draw Text
    const renderCoverText = () => {
      const fontName = {
        editorial: '"Playfair Display", Georgia, serif',
        serif: 'Merriweather, Georgia, serif',
        sans: 'Inter, -apple-system, sans-serif',
        mono: '"JetBrains Mono", monospace',
        literata: 'Literata, Georgia, serif',
        arabic: '"Cairo", "Amiri", "Noto Naskh Arabic", sans-serif',
      }[config.fontFamily || 'editorial'];

      ctx.textAlign = 'center';

      // Badge / Top Label
      if (config.badgeText) {
        ctx.font = `bold 14px ${fontName}`;
        ctx.fillStyle = config.accentColor || '#38bdf8';
        ctx.letterSpacing = '3px';
        ctx.fillText(config.badgeText.toUpperCase(), width / 2, 80);
      }

      // Title
      ctx.fillStyle = config.textColor || '#ffffff';
      ctx.font = `bold 38px ${fontName}`;
      const titleLines = wrapText(ctx, config.title || 'Untitled Book', width - 80);
      const titleStartY = height * 0.38 - (titleLines.length - 1) * 25;

      titleLines.forEach((line, idx) => {
        ctx.fillText(line, width / 2, titleStartY + idx * 48);
      });

      // Accent Divider Line
      const dividerY = titleStartY + titleLines.length * 48 + 10;
      ctx.strokeStyle = config.accentColor || '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 50, dividerY);
      ctx.lineTo(width / 2 + 50, dividerY);
      ctx.stroke();

      // Subtitle
      if (config.subtitle) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = `italic 20px ${fontName}`;
        const subLines = wrapText(ctx, config.subtitle, width - 100);
        subLines.forEach((line, idx) => {
          ctx.fillText(line, width / 2, dividerY + 36 + idx * 28);
        });
      }

      // Author at bottom
      ctx.fillStyle = config.textColor || '#ffffff';
      ctx.font = `600 22px ${fontName}`;
      ctx.fillText(
        `BY ${config.author ? config.author.toUpperCase() : 'ANONYMOUS'}`,
        width / 2,
        height - 70
      );

      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
    };

    if (config.uploadedImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(0, 0, width, height);
        renderCoverText();
      };
      img.onerror = () => {
        renderCoverText();
      };
      img.src = config.uploadedImageUrl;
    } else {
      renderCoverText();
    }
  }, [config, width, height, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className={className || 'w-full h-auto rounded-lg shadow-md'}
      style={{ aspectRatio: `${width}/${height}` }}
    />
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}