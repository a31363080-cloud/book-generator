import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countWords(htmlOrText: string): { words: number; chars: number; readingTime: number } {
  if (!htmlOrText) return { words: 0, chars: 0, readingTime: 0 };
  
  // Strip HTML tags
  const text = htmlOrText.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text) return { words: 0, chars: 0, readingTime: 0 };

  const words = text.split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return { words, chars, readingTime };
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
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
