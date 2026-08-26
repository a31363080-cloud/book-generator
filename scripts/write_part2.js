const fs = require('fs');
const path = require('path');

function write(relPath, content) {
  const fullPath = path.join(process.cwd(), relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('Wrote ' + relPath);
}

// 3. lib/sampleData.ts
write('src/lib/sampleData.ts', `
import { Book } from '@/types/book';

export const SAMPLE_BOOK: Book = {
  metadata: {
    id: 'book_sample_01',
    title: "The Chronicler's Codex",
    subtitle: "Architectures of Speculative Worldbuilding & Narrative Realism",
    author: "Elena Vance",
    publisher: "Mythos & Circuit Press",
    language: "en",
    isbn: "978-1-987654-32-1",
    publicationDate: "2026-08-23",
    description: "A comprehensive masterclass on crafting deep, interconnected speculative universes. From tectonic geopolitics to linguistic drift and socio-magical economics.",
    genre: "Non-Fiction / Writing & Worldbuilding",
    tags: ["Worldbuilding", "Sci-Fi", "Fantasy", "Creative Writing", "Game Design"],
    targetWordCount: 25000,
    coverConfig: {
      title: "The Chronicler's Codex",
      subtitle: "Architectures of Speculative Worldbuilding",
      author: "Elena Vance",
      template: "scifi",
      bgColor1: "#0f172a",
      bgColor2: "#3b0764",
      gradientType: "linear",
      gradientAngle: 135,
      textColor: "#f8fafc",
      accentColor: "#38bdf8",
      fontFamily: "editorial",
      pattern: "stars",
      imageFit: "cover",
      badgeText: "SPECIAL EDITION"
    }
  },
  chapters: [
    {
      id: 'chap_1',
      title: 'Chapter 1: The Tectonic Framework of Imagined Realities',
      slug: 'chapter-1-the-tectonic-framework',
      status: 'complete',
      wordCount: 412,
      characterCount: 2840,
      order: 0,
      notes: 'Focuses on establishing the initial constraints of worldbuilding before narrative design.',
      lastModified: Date.now() - 3600000 * 24,
      content: \`
        <h1>Chapter 1: The Tectonic Framework of Imagined Realities</h1>
        <p>Every compelling universe begins not with a pantheon or a laser sword, but with <strong>fundamental constraints</strong>. When we create speculative fiction, our primary duty is to establish a cohesive logic that resists arbitrary deus ex machina.</p>
        
        <h2>1.1 The Law of Conservation of Plausibility</h2>
        <p>Consider the ecology of your setting. If floating citadels drift effortlessly above the methane canyons of <em>Aethelgard</em>, what powers their anti-gravitational keels? Are the miners in the lower strata suffering from atmospheric toxicity?</p>
        
        <blockquote>
          "A fictional universe is only as expansive as the friction between its inhabitants and their environment."
        </blockquote>

        <p>Here are three core axioms every speculative author must calibrate:</p>
        <ul>
          <li><strong>Resource Scarcity:</strong> What commodity drives commerce and war?</li>
          <li><strong>Linguistic Inertia:</strong> How have colloquial idioms evolved over centuries of isolation?</li>
          <li><strong>Institutional Memory:</strong> Who writes the histories, and who actively erases them?</li>
        </ul>

        <h2>1.2 The Cascade of Secondary Consequences</h2>
        <p>When you introduce a single supernatural or hyper-technological variable, trace its impact through at least three societal strata: agriculture, jurisprudence, and domestic routine.</p>
      \`
    },
    {
      id: 'chap_2',
      title: 'Chapter 2: Dialects, Cryptography & Lingual Drift',
      slug: 'chapter-2-dialects-cryptography',
      status: 'review',
      wordCount: 328,
      characterCount: 2150,
      order: 1,
      notes: 'Needs additional notes on phonetic evolution across regional clusters.',
      lastModified: Date.now() - 3600000 * 5,
      content: \`
        <h1>Chapter 2: Dialects, Cryptography & Lingual Drift</h1>
        <p>Language is not a static container for plot exposition; it is a living organism shaped by trade routes, geopolitical conquest, and sensory limitations.</p>
        
        <h2>2.1 Constructing Idiomatic Authenticity</h2>
        <p>Avoid simplistic phonetic substitutions. Instead, root vernacular speech in the material reality of the speaker's biome. A seafaring civilization will measure distance in tide-cycles rather than static miles.</p>

        <pre><code>// Linguistic Drift Model:
Original: "May your journey be unobstructed by storms."
Colloquial (Archipelago): "Calm keel to you."
Slang (Sub-orbital station): "Zero-g, clear vectors."</code></pre>

        <p>When readers encounter phrases that reflect the genuine lived pressures of your world, immersion becomes effortless.</p>
      \`
    },
    {
      id: 'chap_3',
      title: 'Chapter 3: Socio-Economic Power Grids',
      slug: 'chapter-3-socio-economic-power-grids',
      status: 'draft',
      wordCount: 210,
      characterCount: 1390,
      order: 2,
      notes: 'Drafting in progress. Outline needs expansion for the Guild structures.',
      lastModified: Date.now() - 1800000,
      content: \`
        <h1>Chapter 3: Socio-Economic Power Grids</h1>
        <p>Power is rarely monolithic. In this chapter, we explore how guild syndicates, orbital merchant cartels, and hereditary dynasties leverage synthetic monopolies to enforce cultural compliance.</p>
        
        <h2>3.1 The Anatomy of Monopoly</h2>
        <p>Draft notes: Detail the three key trade routes crossing the Rift Valley. Discuss the black market synthetic catalysts.</p>
      \`
    }
  ],
  activeChapterId: 'chap_1',
  createdAt: Date.now() - 3600000 * 48,
  updatedAt: Date.now()
};
`);

// 4. lib/storage.ts
write('src/lib/storage.ts', `
import { Book, BookMetadata } from '@/types/book';
import { SAMPLE_BOOK } from './sampleData';

const STORAGE_KEY_PREFIX = 'ebook_studio_';
const BOOKS_INDEX_KEY = 'ebook_studio_books_index';
const CURRENT_BOOK_ID_KEY = 'ebook_studio_current_book_id';

export function getStoredCurrentBookId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CURRENT_BOOK_ID_KEY);
}

export function setStoredCurrentBookId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_BOOK_ID_KEY, id);
}

export function listBooks(): BookMetadata[] {
  if (typeof window === 'undefined') return [SAMPLE_BOOK.metadata];
  try {
    const raw = localStorage.getItem(BOOKS_INDEX_KEY);
    if (!raw) {
      // Seed with sample book
      saveBook(SAMPLE_BOOK);
      return [SAMPLE_BOOK.metadata];
    }
    const index: BookMetadata[] = JSON.parse(raw);
    return index.length > 0 ? index : [SAMPLE_BOOK.metadata];
  } catch (err) {
    console.error('Error listing books:', err);
    return [SAMPLE_BOOK.metadata];
  }
}

export function getBook(id: string): Book | null {
  if (typeof window === 'undefined') return SAMPLE_BOOK;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + id);
    if (!raw) {
      if (id === SAMPLE_BOOK.metadata.id) {
        saveBook(SAMPLE_BOOK);
        return SAMPLE_BOOK;
      }
      return null;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading book ' + id, err);
    return null;
  }
}

export function saveBook(book: Book): void {
  if (typeof window === 'undefined') return;
  try {
    const updatedBook = {
      ...book,
      updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEY_PREFIX + book.metadata.id, JSON.stringify(updatedBook));

    // Update index
    const indexRaw = localStorage.getItem(BOOKS_INDEX_KEY);
    let index: BookMetadata[] = indexRaw ? JSON.parse(indexRaw) : [];
    const existingIdx = index.findIndex(b => b.id === book.metadata.id);
    if (existingIdx >= 0) {
      index[existingIdx] = updatedBook.metadata;
    } else {
      index.push(updatedBook.metadata);
    }
    localStorage.setItem(BOOKS_INDEX_KEY, JSON.stringify(index));
  } catch (err) {
    console.error('Error saving book:', err);
  }
}

export function deleteBook(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_PREFIX + id);
    const indexRaw = localStorage.getItem(BOOKS_INDEX_KEY);
    if (indexRaw) {
      const index: BookMetadata[] = JSON.parse(indexRaw);
      const filtered = index.filter(b => b.id !== id);
      localStorage.setItem(BOOKS_INDEX_KEY, JSON.stringify(filtered));
    }
  } catch (err) {
    console.error('Error deleting book:', err);
  }
}

export function exportBackupData(): string {
  if (typeof window === 'undefined') return '';
  const books = listBooks().map(meta => getBook(meta.id)).filter(Boolean);
  return JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    books
  }, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data && Array.isArray(data.books)) {
      data.books.forEach((b: Book) => {
        if (b && b.metadata && b.chapters) {
          saveBook(b);
        }
      });
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to parse backup JSON:', err);
    return false;
  }
}
`);

// 5. lib/markdownExporter.ts
write('src/lib/markdownExporter.ts', `
import { Book } from '@/types/book';
import { saveAs } from 'file-saver';

export function htmlToMarkdown(html: string): string {
  if (!html) return '';

  let md = html
    .replace(/<h1>(.*?)<\\/h1>/gi, '# $1\\n\\n')
    .replace(/<h2>(.*?)<\\/h2>/gi, '## $1\\n\\n')
    .replace(/<h3>(.*?)<\\/h3>/gi, '### $1\\n\\n')
    .replace(/<h4>(.*?)<\\/h4>/gi, '#### $1\\n\\n')
    .replace(/<blockquote>([\\s\\S]*?)<\\/blockquote>/gi, (_match, p1) => {
      const lines = p1.trim().replace(/<[^>]*>/g, '').split('\\n');
      return lines.map((l: string) => '> ' + l.trim()).join('\\n') + '\\n\\n';
    })
    .replace(/<pre><code>([\\s\\S]*?)<\\/code><\\/pre>/gi, '```\\n$1\\n```\\n\\n')
    .replace(/<code>(.*?)<\\/code>/gi, '\`$1\`')
    .replace(/<strong>(.*?)<\\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\\/i>/gi, '*$1*')
    .replace(/<u>(.*?)<\\/u>/gi, '$1')
    .replace(/<li>(.*?)<\\/li>/gi, '- $1\\n')
    .replace(/<ul[\\s\\S]*?>/gi, '')
    .replace(/<\\/ul>/gi, '\\n')
    .replace(/<ol[\\s\\S]*?>/gi, '')
    .replace(/<\\/ol>/gi, '\\n')
    .replace(/<p>(.*?)<\\/p>/gi, '$1\\n\\n')
    .replace(/<br\\s*\\/?>/gi, '\\n')
    .replace(/<hr\\s*\\/?>/gi, '\\n---\\n\\n')
    .replace(/<[^>]+>/g, '') // remove remaining tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Collapse excess newlines
  return md.replace(/\\n{3,}/g, '\\n\\n').trim();
}

export function generateMarkdownManuscript(book: Book, selectedChapterIds?: string[]): string {
  const selectedChapters = selectedChapterIds && selectedChapterIds.length > 0
    ? book.chapters.filter(c => selectedChapterIds.includes(c.id))
    : book.chapters;

  let doc = \`---
title: "\${book.metadata.title}"
\${book.metadata.subtitle ? \`subtitle: "\${book.metadata.subtitle}"\\n\` : ''}author: "\${book.metadata.author}"
\${book.metadata.publisher ? \`publisher: "\${book.metadata.publisher}"\\n\` : ''}language: "\${book.metadata.language}"
\${book.metadata.isbn ? \`isbn: "\${book.metadata.isbn}"\\n\` : ''}date: "\${book.metadata.publicationDate || new Date().toISOString().split('T')[0]}"
---

# \${book.metadata.title}
\${book.metadata.subtitle ? \`### *\${book.metadata.subtitle}*\\n\` : ''}
**By \${book.metadata.author}**

\${book.metadata.description ? \`> \${book.metadata.description}\\n\\n\` : ''}
---

## Table of Contents
\`;

  selectedChapters.forEach((ch, idx) => {
    doc += \`\${idx + 1}. [\${ch.title}](#\${ch.slug || 'chapter-' + (idx + 1)})\\n\`;
  });

  doc += \`\\n---\\n\\n\`;

  selectedChapters.forEach((ch) => {
    doc += \`\\n\\n<!-- chapter: \${ch.title} -->\\n\\n\`;
    doc += htmlToMarkdown(ch.content);
    doc += \`\\n\\n---\\n\`;
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
  // Strip Markdown symbols for raw text
  const plainText = md
    .replace(/^---[\\s\\S]*?---\\n/g, '') // remove frontmatter
    .replace(/#+ /g, '')
    .replace(/\\*\\*(.*?)\\*\\*/g, '$1')
    .replace(/\\*(.*?)\\*/g, '$1')
    .replace(/\`\`\`[\\s\\S]*?\`\`\`/g, '')
    .replace(/\`(.*?)\`/g, '$1');

  const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
  const filename = (book.metadata.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'ebook') + '.txt';
  saveAs(blob, filename);
}
`);

// 6. lib/epubGenerator.ts
write('src/lib/epubGenerator.ts', `
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Book } from '@/types/book';

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanHtmlToXhtml(html: string): string {
  if (!html) return '<p></p>';
  
  // Ensure common self-closing tags are XHTML compliant
  let xhtml = html
    .replace(/<br\\s*>/gi, '<br />')
    .replace(/<hr\\s*>/gi, '<hr />')
    .replace(/<img([^>]*?)>/gi, (_match, p1) => {
      if (p1.endsWith('/')) return '<img' + p1 + '>';
      return '<img' + p1 + ' />';
    })
    .replace(/&nbsp;/g, '&#160;')
    .replace(/<p><\\/p>/gi, '<p>&#160;</p>');

  return xhtml;
}

export async function generateEpub(
  book: Book,
  coverDataUrl?: string,
  selectedChapterIds?: string[]
): Promise<Blob> {
  const zip = new JSZip();
  const bookId = book.metadata.isbn || 'urn:uuid:' + book.metadata.id;
  const nowIso = new Date().toISOString();
  
  const selectedChapters = selectedChapterIds && selectedChapterIds.length > 0
    ? book.chapters.filter(c => selectedChapterIds.includes(c.id))
    : book.chapters;

  // 1. mimetype (MUST be first and uncompressed)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  const containerXml = \`<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>\`;
  zip.folder('META-INF')?.file('container.xml', containerXml);

  const oebps = zip.folder('OEBPS');
  if (!oebps) throw new Error('Could not create OEBPS folder');

  // 3. OEBPS/style.css
  const styleCss = \`
@charset "utf-8";
body {
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.6;
  margin: 5%;
  color: #1a1a1a;
  background-color: #ffffff;
}
h1, h2, h3, h4 {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #0f172a;
  line-height: 1.25;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: bold;
}
h1 {
  font-size: 2em;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.3em;
  margin-top: 0.5em;
}
h2 { font-size: 1.5em; }
h3 { font-size: 1.2em; }
p {
  margin: 0 0 1em 0;
  text-align: justify;
  text-indent: 1.2em;
}
p:first-of-type {
  text-indent: 0;
}
blockquote {
  margin: 1.2em 2em;
  padding-left: 1em;
  border-left: 3px solid #0284c7;
  font-style: italic;
  color: #475569;
}
pre, code {
  font-family: "Courier New", Courier, monospace;
  font-size: 0.9em;
  background-color: #f1f5f9;
  border-radius: 4px;
}
pre {
  padding: 1em;
  overflow-x: auto;
  margin: 1em 0;
}
ul, ol {
  margin: 1em 0 1em 2em;
}
li {
  margin-bottom: 0.5em;
}
.cover-page {
  text-align: center;
  padding: 0;
  margin: 0;
}
.cover-image {
  max-width: 100%;
  max-height: 100%;
  height: auto;
}
.title-page {
  text-align: center;
  margin-top: 20%;
}
.title-page h1 {
  font-size: 2.5em;
  border: none;
  margin-bottom: 0.2em;
}
.title-page .subtitle {
  font-size: 1.2em;
  font-style: italic;
  color: #64748b;
  margin-bottom: 2em;
}
.title-page .author {
  font-size: 1.3em;
  font-weight: bold;
}
\`;
  oebps.file('style.css', styleCss);

  // 4. Handle Cover Image
  let hasCoverImage = false;
  if (coverDataUrl && coverDataUrl.startsWith('data:image/')) {
    try {
      const base64Data = coverDataUrl.split(',')[1];
      oebps.folder('images')?.file('cover.png', base64Data, { base64: true });
      hasCoverImage = true;

      const coverXhtml = \`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="\${book.metadata.language}">
<head>
  <title>Cover</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body class="cover-page">
  <img src="images/cover.png" alt="Cover" class="cover-image" />
</body>
</html>\`;
      oebps.file('cover.xhtml', coverXhtml);
    } catch (e) {
      console.warn('Cover processing failed:', e);
    }
  }

  // 5. Title Page
  const titleXhtml = \`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="\${book.metadata.language}">
<head>
  <title>\${escapeXml(book.metadata.title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <div class="title-page">
    <h1>\${escapeXml(book.metadata.title)}</h1>
    \${book.metadata.subtitle ? \`<p class="subtitle">\${escapeXml(book.metadata.subtitle)}</p>\` : ''}
    <p class="author">By \${escapeXml(book.metadata.author)}</p>
    \${book.metadata.publisher ? \`<p class="publisher">\${escapeXml(book.metadata.publisher)}</p>\` : ''}
    \${book.metadata.description ? \`<blockquote style="margin-top: 3em; text-align: left;">\${escapeXml(book.metadata.description)}</blockquote>\` : ''}
  </div>
</body>
</html>\`;
  oebps.file('title.xhtml', titleXhtml);

  // 6. Chapters XHTML files
  selectedChapters.forEach((ch, idx) => {
    const filename = \`chapter_\${idx + 1}.xhtml\`;
    const chapterHtml = cleanHtmlToXhtml(ch.content);
    const contentXhtml = \`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="\${book.metadata.language}">
<head>
  <title>\${escapeXml(ch.title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <div class="chapter-container">
    \${chapterHtml}
  </div>
</body>
</html>\`;
    oebps.file(filename, contentXhtml);
  });

  // 7. Navigation Document (nav.xhtml - EPUB 3 requirement)
  let navItems = selectedChapters.map((ch, idx) => 
    \`      <li><a href="chapter_\${idx + 1}.xhtml">\${escapeXml(ch.title)}</a></li>\`
  ).join('\\n');

  const navXhtml = \`<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="\${book.metadata.language}">
<head>
  <title>Table of Contents</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Table of Contents</h1>
    <ol>
      <li><a href="title.xhtml">Title Page</a></li>
\${navItems}
    </ol>
  </nav>
</body>
</html>\`;
  oebps.file('nav.xhtml', navXhtml);

  // 8. NCX Table of Contents (toc.ncx - EPUB 2 backward compatibility)
  let ncxPoints = \`
    <navPoint id="navPoint-1" playOrder="1">
      <navLabel><text>Title Page</text></navLabel>
      <content src="title.xhtml"/>
    </navPoint>\`;

  selectedChapters.forEach((ch, idx) => {
    ncxPoints += \`
    <navPoint id="navPoint-\${idx + 2}" playOrder="\${idx + 2}">
      <navLabel><text>\${escapeXml(ch.title)}</text></navLabel>
      <content src="chapter_\${idx + 1}.xhtml"/>
    </navPoint>\`;
  });

  const tocNcx = \`<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="\${escapeXml(bookId)}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>\${escapeXml(book.metadata.title)}</text>
  </docTitle>
  <docAuthor>
    <text>\${escapeXml(book.metadata.author)}</text>
  </docAuthor>
  <navMap>
\${ncxPoints}
  </navMap>
</ncx>\`;
  oebps.file('toc.ncx', tocNcx);

  // 9. content.opf
  let manifestItems = \`
    <item id="style" href="style.css" media-type="text/css"/>
    <item id="toc_ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="title_page" href="title.xhtml" media-type="application/xhtml+xml"/>\`;

  if (hasCoverImage) {
    manifestItems += \`
    <item id="cover_img" href="images/cover.png" media-type="image/png" properties="cover-image"/>
    <item id="cover_page" href="cover.xhtml" media-type="application/xhtml+xml"/>\`;
  }

  selectedChapters.forEach((_, idx) => {
    manifestItems += \`
    <item id="chapter_\${idx + 1}" href="chapter_\${idx + 1}.xhtml" media-type="application/xhtml+xml"/>\`;
  });

  let spineItems = '';
  if (hasCoverImage) {
    spineItems += \`
    <itemref idref="cover_page"/>\`;
  }
  spineItems += \`
    <itemref idref="title_page"/>\`;
  selectedChapters.forEach((_, idx) => {
    spineItems += \`
    <itemref idref="chapter_\${idx + 1}"/>\`;
  });

  const contentOpf = \`<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="3.0" xml:lang="\${book.metadata.language}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:identifier id="BookID">\${escapeXml(bookId)}</dc:identifier>
    <dc:title>\${escapeXml(book.metadata.title)}</dc:title>
    <dc:creator>\${escapeXml(book.metadata.author)}</dc:creator>
    <dc:language>\${escapeXml(book.metadata.language)}</dc:language>
    \${book.metadata.publisher ? \`<dc:publisher>\${escapeXml(book.metadata.publisher)}</dc:publisher>\` : ''}
    \${book.metadata.description ? \`<dc:description>\${escapeXml(book.metadata.description)}</dc:description>\` : ''}
    <meta property="dcterms:modified">\${nowIso}</meta>
    \${hasCoverImage ? '<meta name="cover" content="cover_img"/>' : ''}
  </metadata>
  <manifest>
\${manifestItems}
  </manifest>
  <spine toc="toc_ncx">
\${spineItems}
  </spine>
</package>\`;
  oebps.file('content.opf', contentOpf);

  return await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
}

export async function exportAsEpub(
  book: Book,
  coverDataUrl?: string,
  selectedChapterIds?: string[]
): Promise<void> {
  const blob = await generateEpub(book, coverDataUrl, selectedChapterIds);
  const filename = (book.metadata.title.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'ebook') + '.epub';
  saveAs(blob, filename);
}
`);

console.log('Part 2 written successfully');