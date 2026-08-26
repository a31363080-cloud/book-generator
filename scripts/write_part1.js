const fs = require('fs');
const path = require('path');

function write(relPath, content) {
  const fullPath = path.join(process.cwd(), relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('Wrote ' + relPath);
}

// 1. types/book.ts
write('src/types/book.ts', `
export type ChapterStatus = 'draft' | 'review' | 'complete';

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML string
  status: ChapterStatus;
  wordCount: number;
  characterCount: number;
  order: number;
  notes?: string;
  lastModified: number;
}

export type CoverTemplate = 'minimal' | 'bold' | 'editorial' | 'scifi' | 'vintage' | 'tech' | 'custom';
export type CoverPattern = 'none' | 'dots' | 'grid' | 'waves' | 'stars' | 'geometric';

export interface CoverConfig {
  title: string;
  subtitle: string;
  author: string;
  template: CoverTemplate;
  bgColor1: string;
  bgColor2: string;
  gradientType: 'linear' | 'radial' | 'solid';
  gradientAngle: number;
  textColor: string;
  accentColor: string;
  fontFamily: 'serif' | 'sans' | 'mono' | 'editorial' | 'literata';
  pattern: CoverPattern;
  uploadedImageUrl?: string;
  imageFit: 'cover' | 'contain' | 'center';
  badgeText?: string;
}

export interface BookMetadata {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  publisher?: string;
  language: string;
  isbn?: string;
  publicationDate?: string;
  description: string;
  genre: string;
  tags: string[];
  targetWordCount: number;
  coverConfig: CoverConfig;
}

export interface Book {
  metadata: BookMetadata;
  chapters: Chapter[];
  activeChapterId: string;
  createdAt: number;
  updatedAt: number;
}

export type EditorTheme = 'light' | 'sepia' | 'dark' | 'night';
export type EditorFont = 'serif' | 'sans' | 'mono' | 'editorial' | 'literata';

export type ExportFormat = 'epub' | 'pdf' | 'markdown' | 'html' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  includeCover: boolean;
  includeToc: boolean;
  selectedChapterIds: string[];
  customTitle?: string;
  customAuthor?: string;
}
`);

// 2. lib/utils.ts
write('src/lib/utils.ts', `
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countWords(htmlOrText: string): { words: number; chars: number; readingTime: number } {
  if (!htmlOrText) return { words: 0, chars: 0, readingTime: 0 };
  
  // Strip HTML tags
  const text = htmlOrText.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\\s+/g, ' ').trim();
  if (!text) return { words: 0, chars: 0, readingTime: 0 };

  const words = text.split(/\\s+/).filter(Boolean).length;
  const chars = text.length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return { words, chars, readingTime };
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\\s\\W-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'chapter';
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp));
}

export function generateId(): string {
  return 'id_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
}
`);

console.log('Part 1 written successfully');