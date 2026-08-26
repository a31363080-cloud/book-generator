import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  PageBreak,
} from 'docx';
import { saveAs } from 'file-saver';
import { Book } from '@/types/book';

export async function exportAsDocx(book: Book, selectedChapterIds?: string[]): Promise<void> {
  const selectedChapters =
    selectedChapterIds && selectedChapterIds.length > 0
      ? book.chapters.filter((c) => selectedChapterIds.includes(c.id))
      : book.chapters;

  const isRtl = book.metadata.language === 'ar';

  const docChildren: (Paragraph | Table)[] = [];

  // Title Page
  docChildren.push(
    new Paragraph({
      text: book.metadata.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400, after: 400 },
    })
  );

  if (book.metadata.subtitle) {
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: book.metadata.subtitle,
            italics: true,
            size: 28,
            color: '64748B',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
      })
    );
  }

  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `By ${book.metadata.author || 'Anonymous'}`,
          bold: true,
          size: 26,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
    })
  );

  if (book.metadata.description) {
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: book.metadata.description,
            italics: true,
            size: 22,
            color: '475569',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 1600 },
      })
    );
  }

  // Page break after title
  docChildren.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // Table of Contents Heading
  docChildren.push(
    new Paragraph({
      text: isRtl ? 'جدول المحتويات' : 'Table of Contents',
      heading: HeadingLevel.HEADING_1,
      alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
      spacing: { before: 400, after: 400 },
    })
  );

  selectedChapters.forEach((ch, idx) => {
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${idx + 1}. ${ch.title}`,
            size: 24,
          }),
          new TextRun({
            text: `  (${ch.wordCount} words)`,
            size: 20,
            color: '94A3B8',
          }),
        ],
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { after: 180 },
      })
    );
  });

  // Page break after TOC
  docChildren.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // Chapters Content
  selectedChapters.forEach((ch, idx) => {
    // Chapter Title
    docChildren.push(
      new Paragraph({
        text: ch.title,
        heading: HeadingLevel.HEADING_1,
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { before: 600, after: 300 },
      })
    );

    // Convert HTML paragraphs and elements to Word Paragraphs
    const paragraphs = parseHtmlToDocxParagraphs(ch.content, isRtl);
    docChildren.push(...paragraphs);

    // Page break after each chapter except last
    if (idx < selectedChapters.length - 1) {
      docChildren.push(
        new Paragraph({
          children: [new PageBreak()],
        })
      );
    }
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: book.metadata.title,
                    size: 18,
                    color: '94A3B8',
                  }),
                ],
                alignment: isRtl ? AlignmentType.LEFT : AlignmentType.RIGHT,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: '94A3B8',
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: docChildren,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `${(book.metadata.title || 'manuscript')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')}.docx`;
  saveAs(blob, filename);
}

function parseHtmlToDocxParagraphs(html: string, isRtl: boolean): Paragraph[] {
  if (!html) return [];

  const paragraphs: Paragraph[] = [];
  
  // Clean basic HTML tags and split by block elements
  const blocks = html
    .replace(/<\/h[1-6]>/gi, '</block>\n')
    .replace(/<\/p>/gi, '</block>\n')
    .replace(/<\/blockquote>/gi, '</block>\n')
    .replace(/<\/li>/gi, '</block>\n')
    .replace(/<\/tr>/gi, '</block>\n')
    .split('\n');

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const text = trimmed
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    if (!text) continue;

    const isHeading2 = trimmed.includes('<h2') || trimmed.includes('<h3');
    const isBlockquote = trimmed.includes('<blockquote');

    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text,
            size: isHeading2 ? 28 : 22,
            bold: isHeading2,
            italics: isBlockquote,
            color: isBlockquote ? '475569' : '1E293B',
          }),
        ],
        alignment: isRtl ? AlignmentType.RIGHT : AlignmentType.LEFT,
        spacing: { after: 200, line: 360 }, // 1.5 line spacing
      })
    );
  }

  return paragraphs;
}