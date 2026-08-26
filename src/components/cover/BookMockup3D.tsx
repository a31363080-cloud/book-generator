'use client';

import React from 'react';
import { CoverConfig } from '@/types/book';
import { CoverCanvas } from './CoverCanvas';

interface BookMockup3DProps {
  config: CoverConfig;
  className?: string;
}

export function BookMockup3D({ config, className }: BookMockup3DProps) {
  return (
    <div className={`relative flex items-center justify-center py-6 select-none ${className || ''}`}>
      {/* 3D Container with Perspective */}
      <div
        className="relative group transition-transform duration-500 hover:rotate-y-[-10deg] hover:rotate-x-[5deg]"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Book Container with 3D tilt */}
        <div
          className="relative rounded-r-lg overflow-hidden shadow-2xl transition-all duration-500"
          style={{
            width: '240px',
            height: '360px',
            transform: 'rotateY(-18deg) rotateX(6deg) scale(0.95)',
            boxShadow:
              '20px 25px 40px -10px rgba(0, 0, 0, 0.45), 5px 5px 15px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Front Cover Canvas */}
          <CoverCanvas config={config} width={400} height={600} className="w-full h-full object-cover" />

          {/* Spine Highlight / Crease */}
          <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/40 via-white/20 to-transparent pointer-events-none" />

          {/* Gloss Lighting Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-80" />
        </div>

        {/* Realistic Page Edges (Right and Bottom Thickness) */}
        <div
          className="absolute right-0 top-3 w-4 h-[350px] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-r-sm pointer-events-none"
          style={{
            transform: 'translateX(10px) translateZ(-10px) rotateY(70deg)',
            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.15)',
          }}
        />

        {/* Soft Drop Shadow under book */}
        <div
          className="absolute -bottom-6 left-6 right-6 h-8 bg-black/40 blur-xl rounded-full pointer-events-none"
          style={{ transform: 'rotateX(80deg)' }}
        />
      </div>
    </div>
  );
}