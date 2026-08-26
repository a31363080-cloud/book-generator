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

  let xhtml = html
    .replace(/<br\s*>/gi, '<br />')
    .replace(/<hr\s*>/gi, '<hr />')
    .replace(/<img([^>]*?)>/gi, (_match, p1) => {
      if (p1.endsWith('/')) return '<img' + p1 + '>';
      return '<img' + p1 + ' />';
    })
    .replace(/&nbsp;/g, '&#160;')
    .replace(/<p><\/p>/gi, '<p>&#160;</p>');

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
  const isRtl = book.metadata.direction === 'rtl' || book.metadata.language === 'ar';
  const pageDirection = isRtl ? 'rtl' : 'ltr';

  const selectedChapters =
    selectedChapterIds && selectedChapterIds.length > 0
      ? book.chapters.filter((c) => selectedChapterIds.includes(c.id))
      : book.chapters;

  // 1. mimetype (uncompressed)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  zip.folder('META-INF')?.file('container.xml', containerXml);

  const oebps = zip.folder('OEBPS');
  if (!oebps) throw new Error('Could not create OEBPS folder');

  // 3. OEBPS/style.css
  const styleCss = `
@charset "utf-8";
body {
  font-family: ${
    isRtl
      ? '"Amiri", "Cairo", "Noto Naskh Arabic", "Traditional Arabic", serif'
      : 'Georgia, "Times New Roman", serif'
  };
  line-height: 1.7;
  margin: 5%;
  color: #1a1a1a;
  background-color: #ffffff;
  direction: ${pageDirection};
  text-align: ${isRtl ? 'right' : 'justify'};
}
h1, h2, h3, h4 {
  font-family: ${
    isRtl
      ? '"Cairo", "Amiri", sans-serif'
      : '"Helvetica Neue", Helvetica, Arial, sans-serif'
  };
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
  text-indent: 1.2em;
}
p:first-of-type {
  text-indent: 0;
}
blockquote {
  margin: 1.2em 2em;
  padding: 0 1em;
  border-${isRtl ? 'right' : 'left'}: 3px solid #0284c7;
  font-style: italic;
  color: #475569;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
}
th, td {
  border: 1px solid #cbd5e1;
  padding: 0.5em 0.8em;
  text-align: ${isRtl ? 'right' : 'left'};
}
th {
  background-color: #f1f5f9;
  font-weight: bold;
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
`;
  oebps.file('style.css', styleCss);

  // 4. Handle Cover Image
  let hasCoverImage = false;
  if (coverDataUrl && coverDataUrl.startsWith('data:image/')) {
    try {
      const base64Data = coverDataUrl.split(',')[1];
      oebps.folder('images')?.file('cover.png', base64Data, { base64: true });
      hasCoverImage = true;

      const coverXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${book.metadata.language}" dir="${pageDirection}">
<head>
  <title>Cover</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body class="cover-page">
  <img src="images/cover.png" alt="Cover" class="cover-image" />
</body>
</html>`;
      oebps.file('cover.xhtml', coverXhtml);
    } catch (e) {
      console.warn('Cover processing failed:', e);
    }
  }

  // 5. Title Page
  const titleXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${book.metadata.language}" dir="${pageDirection}">
<head>
  <title>${escapeXml(book.metadata.title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <div class="title-page">
    <h1>${escapeXml(book.metadata.title)}</h1>
    ${book.metadata.subtitle ? `<p class="subtitle">${escapeXml(book.metadata.subtitle)}</p>` : ''}
    <p class="author">${isRtl ? 'تأليف' : 'By'} ${escapeXml(book.metadata.author)}</p>
    ${book.metadata.publisher ? `<p class="publisher">${escapeXml(book.metadata.publisher)}</p>` : ''}
    ${book.metadata.description ? `<blockquote style="margin-top: 3em; text-align: ${isRtl ? 'right' : 'left'};">${escapeXml(book.metadata.description)}</blockquote>` : ''}
  </div>
</body>
</html>`;
  oebps.file('title.xhtml', titleXhtml);

  // 6. Chapters XHTML files
  selectedChapters.forEach((ch, idx) => {
    const filename = `chapter_${idx + 1}.xhtml`;
    const chapterHtml = cleanHtmlToXhtml(ch.content);
    const contentXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${book.metadata.language}" dir="${pageDirection}">
<head>
  <title>${escapeXml(ch.title)}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <div class="chapter-container">
    ${chapterHtml}
  </div>
</body>
</html>`;
    oebps.file(filename, contentXhtml);
  });

  // 7. Navigation Document (nav.xhtml)
  let navItems = selectedChapters
    .map(
      (ch, idx) =>
        `      <li><a href="chapter_${idx + 1}.xhtml">${escapeXml(ch.title)}</a></li>`
    )
    .join('\n');

  const navXhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${book.metadata.language}" dir="${pageDirection}">
<head>
  <title>${isRtl ? 'جدول المحتويات' : 'Table of Contents'}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>${isRtl ? 'جدول المحتويات' : 'Table of Contents'}</h1>
    <ol>
      <li><a href="title.xhtml">${isRtl ? 'صفحة العنوان' : 'Title Page'}</a></li>
${navItems}
    </ol>
  </nav>
</body>
</html>`;
  oebps.file('nav.xhtml', navXhtml);

  // 8. NCX Table of Contents (toc.ncx)
  let ncxPoints = `
    <navPoint id="navPoint-1" playOrder="1">
      <navLabel><text>${isRtl ? 'صفحة العنوان' : 'Title Page'}</text></navLabel>
      <content src="title.xhtml"/>
    </navPoint>`;

  selectedChapters.forEach((ch, idx) => {
    ncxPoints += `
    <navPoint id="navPoint-${idx + 2}" playOrder="${idx + 2}">
      <navLabel><text>${escapeXml(ch.title)}</text></navLabel>
      <content src="chapter_${idx + 1}.xhtml"/>
    </navPoint>`;
  });

  const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${escapeXml(bookId)}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${escapeXml(book.metadata.title)}</text>
  </docTitle>
  <docAuthor>
    <text>${escapeXml(book.metadata.author)}</text>
  </docAuthor>
  <navMap>
${ncxPoints}
  </navMap>
</ncx>`;
  oebps.file('toc.ncx', tocNcx);

  // 9. content.opf
  let manifestItems = `
    <item id="style" href="style.css" media-type="text/css"/>
    <item id="toc_ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="title_page" href="title.xhtml" media-type="application/xhtml+xml"/>`;

  if (hasCoverImage) {
    manifestItems += `
    <item id="cover_img" href="images/cover.png" media-type="image/png" properties="cover-image"/>
    <item id="cover_page" href="cover.xhtml" media-type="application/xhtml+xml"/>`;
  }

  selectedChapters.forEach((_, idx) => {
    manifestItems += `
    <item id="chapter_${idx + 1}" href="chapter_${idx + 1}.xhtml" media-type="application/xhtml+xml"/>`;
  });

  let spineItems = '';
  if (hasCoverImage) {
    spineItems += `
    <itemref idref="cover_page"/>`;
  }
  spineItems += `
    <itemref idref="title_page"/>`;
  selectedChapters.forEach((_, idx) => {
    spineItems += `
    <itemref idref="chapter_${idx + 1}"/>`;
  });

  const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookID" version="3.0" xml:lang="${book.metadata.language}" dir="${pageDirection}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:identifier id="BookID">${escapeXml(bookId)}</dc:identifier>
    <dc:title>${escapeXml(book.metadata.title)}</dc:title>
    <dc:creator>${escapeXml(book.metadata.author)}</dc:creator>
    <dc:language>${escapeXml(book.metadata.language)}</dc:language>
    ${book.metadata.publisher ? `<dc:publisher>${escapeXml(book.metadata.publisher)}</dc:publisher>` : ''}
    ${book.metadata.description ? `<dc:description>${escapeXml(book.metadata.description)}</dc:description>` : ''}
    <meta property="dcterms:modified">${nowIso}</meta>
    ${hasCoverImage ? '<meta name="cover" content="cover_img"/>' : ''}
  </metadata>
  <manifest>
${manifestItems}
  </manifest>
  <spine toc="toc_ncx" page-progression-direction="${pageDirection}">
${spineItems}
  </spine>
</package>`;
  oebps.file('content.opf', contentOpf);

  return await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
}

export async function exportAsEpub(
  book: Book,
  coverDataUrl?: string,
  selectedChapterIds?: string[]
): Promise<void> {
  const blob = await generateEpub(book, coverDataUrl, selectedChapterIds);
  const filename = `${(book.metadata.title || 'ebook')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')}.epub`;
  saveAs(blob, filename);
}