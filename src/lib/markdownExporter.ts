import { Book } from '@/types/book';
import { saveAs } from 'file-saver';

export function htmlToMarkdown(html: string): string {
  if (!html) return '';

  let md = html
    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, (_match, p1) => {
      const lines = p1.trim().replace(/<[^>]*>/g, '').split('\n');
      return lines.map((l: string) => '> ' + l.trim()).join('\n') + '\n\n';
    })
    .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
    .replace(/<code>(.*?)<\/code>/gi, '`$1`')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<u>(.*?)<\/u>/gi, '$1')
    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<ul[\s\S]*?>/gi, '')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[\s\S]*?>/gi, '')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return md.replace(/\n{3,}/g, '\n\n').trim();
}

export function generateMarkdownManuscript(book: Book, selectedChapterIds?: string[]): string {
  const selectedChapters = selectedChapterIds && selectedChapterIds.length > 0
    ? book.chapters.filter(c => selectedChapterIds.includes(c.id))
    : book.chapters;

  let doc = `---
title: "${book.metadata.title}"
${book.metadata.subtitle ? `subtitle: "${book.metadata.subtitle}"\n` : ''}author: "${book.metadata.author}"
${book.metadata.publisher ? `publisher: "${book.metadata.publisher}"\n` : ''}language: "${book.metadata.language}"
${book.metadata.isbn ? `isbn: "${book.metadata.isbn}"\n` : ''}date: "${book.metadata.publicationDate || new Date().toISOString().split('T')[0]}"
---

# ${book.metadata.title}
${book.metadata.subtitle ? `### *${book.metadata.subtitle}*\n` : ''}
**By ${book.metadata.author}**

${book.metadata.description ? `> ${book.metadata.description}\n\n` : ''}
---

## Table of Contents
`;

  selectedChapters.forEach((ch, idx) => {
    doc += `${idx + 1}. [${ch.title}](#${ch.slug || 'chapter-' + (idx + 1)})\n`;
  });

  doc += `\n---\n\n`;

  selectedChapters.forEach((ch) => {
    doc += `\n\n<!-- chapter: ${ch.title} -->\n\n`;
    doc += htmlToMarkdown(ch.content);
    doc += `\n\n---\n`;
  });

  return doc;
}

export function exportAsMarkdown(book: Book, selectedChapterIds?: string[]): void {
  const md = generateMarkdownManuscript(book, selectedChapterIds);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const filename = (book.metadata.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'ebook') + '.md';
  saveAs(blob, filename);
}

export function exportAsPlainText(book: Book, selectedChapterIds?: string[]): void {
  const md = generateMarkdownManuscript(book, selectedChapterIds);
  const plainText = md
    .replace(/^---[\s\S]*?---\n/g, '')
    .replace(/#+ /g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`(.*?)`/g, '$1');

  const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
  const filename = (book.metadata.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'ebook') + '.txt';
  saveAs(blob, filename);
}