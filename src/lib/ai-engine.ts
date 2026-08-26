// ─── Universal Multi-Provider AI Registry ────────────────────────────────────
// Supports Google Gemini, OpenAI, Anthropic Claude, and DeepSeek

export type Provider = 'google' | 'openai' | 'anthropic' | 'deepseek';

export interface ModelConfig {
  id: string;          // API model identifier
  label: string;       // Display name
  provider: Provider;
  badge?: string;      // Tag badge (e.g., 'Reasoning', 'Fast', 'Flagship')
}

export interface ProviderGroup {
  provider: Provider;
  label: string;
  icon: string;
  models: ModelConfig[];
}

export const PROVIDER_GROUPS: ProviderGroup[] = [
  {
    provider: 'google',
    label: 'Google Gemini',
    icon: '✦',
    models: [
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', provider: 'google', badge: 'Fast' },
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', provider: 'google', badge: 'Next-Gen' },
      { id: 'gemini-1.5-pro',   label: 'Gemini 1.5 Pro',   provider: 'google', badge: 'Pro' },
    ],
  },
  {
    provider: 'openai',
    label: 'OpenAI',
    icon: '◆',
    models: [
      { id: 'gpt-4o',      label: 'GPT-4o',      provider: 'openai', badge: 'Flagship' },
      { id: 'gpt-4o-mini', label: 'GPT-4o-mini', provider: 'openai', badge: 'Fast' },
    ],
  },
  {
    provider: 'anthropic',
    label: 'Anthropic',
    icon: '◉',
    models: [
      { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', provider: 'anthropic', badge: 'Flagship' },
    ],
  },
  {
    provider: 'deepseek',
    label: 'DeepSeek',
    icon: '⬡',
    models: [
      { id: 'deepseek-chat',     label: 'DeepSeek-V3', provider: 'deepseek', badge: 'General' },
      { id: 'deepseek-reasoner', label: 'DeepSeek-R1', provider: 'deepseek', badge: 'Reasoning' },
    ],
  },
];

// Flat lookup map
export const ALL_MODELS: Record<string, ModelConfig> = Object.fromEntries(
  PROVIDER_GROUPS.flatMap((g) => g.models.map((m) => [m.id, m]))
);

export const DEFAULT_MODEL_ID = 'gemini-1.5-flash';

// ─── AI Action Types ─────────────────────────────────────────────────────────

export type AIAction =
  | 'continue_writing'
  | 'expand_chapter'
  | 'fix_grammar'
  | 'summarize'
  | 'generate_outline'
  | 'generate_book_outline'
  | 'generate_chapter_content'
  | 'translate_ar'
  | 'translate_en'
  | 'translate_es'
  | 'make_formal'
  | 'make_casual';

export interface AIRequest {
  action: AIAction;
  text?: string;
  modelId: string;
  // User variables strictly passed into prompts
  title?: string;
  subtitle?: string;
  bookTitle?: string;
  description?: string;
  author?: string;
  category?: string;
  genre?: string;
  chapterTitle?: string;
  chapterIndex?: number;
  totalChapters?: number;
  allChapterTitles?: string[];
  numChapters?: number;
  language?: string;
}

export interface AIResponse {
  result: string;
  action: AIAction;
  modelId: string;
}

export interface PromptCtx {
  title?: string;
  subtitle?: string;
  bookTitle?: string;
  description?: string;
  author?: string;
  category?: string;
  genre?: string;
  chapterTitle?: string;
  chapterIndex?: number;
  totalChapters?: number;
  allChapterTitles?: string[];
  numChapters?: number;
  language?: string;
}

// ─── Mandatory System Context Builder ────────────────────────────────────────

export function buildStrictContextBlock(ctx: PromptCtx): string {
  const title = ctx.title || ctx.bookTitle || 'Untitled Book';
  const subtitle = ctx.subtitle || '';
  const description = ctx.description || 'No specific premise provided';
  const author = ctx.author || 'Anonymous';
  const category = ctx.category || ctx.genre || 'General';
  const chapter = ctx.chapterTitle || 'Current Chapter';
  const language = ctx.language || 'English';

  return `[MANDATORY SYSTEM INSTRUCTIONS - STRICT FIELD ADHERENCE]
You must STRICTLY adhere to and incorporate the following user-provided book variables without altering or hallucinating different details:
- Book Title ($title): "${title}"${subtitle ? `\n- Subtitle ($subtitle): "${subtitle}"` : ''}
- Description / Plot Premise ($description): "${description}"
- Author ($author): "${author}"
- Category / Genre ($category): "${category}"
- Active Chapter: "${chapter}"
- Target Language: "${language}"

CRITICAL RULES:
1. STRICT ADHERENCE: Strictly anchor all generated content to $title, $description, $author, and $category.
2. NO HALLUCINATIONS: Do NOT invent different titles, change the author name, alter the core premise, or deviate from the established genre.
3. VOICE & CONTINUITY: Ensure prose style, narrative tone, characters, and themes strictly follow the provided description ($description) and genre ($category).
4. OUTPUT ONLY: Output strictly the resulting prose or requested text — do not include introductory commentary, labels, or disclaimers.
--------------------------------------------------`;
}

// ─── Specialized Prompts ─────────────────────────────────────────────────────

type PromptFn = (text: string, ctx: PromptCtx) => string;

export const PROMPTS: Record<AIAction, PromptFn> = {
  // Step 1: Generate proposed chapter titles based on user input
  generate_book_outline: (_text, ctx) => {
    const title = ctx.title || ctx.bookTitle || 'Untitled Book';
    const subtitle = ctx.subtitle ? `\n- Subtitle ($subtitle): "${ctx.subtitle}"` : '';
    const author = ctx.author || 'Anonymous Author';
    const description = ctx.description || 'General storyline';
    const category = ctx.category || ctx.genre || 'General';
    const language = ctx.language || 'en';
    const numChapters = ctx.numChapters || 5;

    const isArabic = language === 'ar' || language === 'arabic';
    const isSpanish = language === 'es' || language === 'spanish';

    const langName = isArabic ? 'Modern Standard Arabic (العربية الفصحى)' : isSpanish ? 'Spanish (Español)' : 'English';
    const exampleOutput = isArabic
      ? `["الفصل 1: البداية المجهولة", "الفصل 2: أسرار الماضي", "الفصل 3: طريق الحقيقة", "الفصل 4: نقطة التحول", "الفصل 5: الخاتمة والعهد الجديد"]`
      : isSpanish
      ? `["Capítulo 1: El Comienzo Inesperado", "Capítulo 2: Secretos del Pasado", "Capítulo 3: El Sendero Oculto", "Capítulo 4: El Punto de Inflexión", "Capítulo 5: El Nuevo Horizonte"]`
      : `["Chapter 1: The First Dawn", "Chapter 2: Echoes of the Past", "Chapter 3: The Path Forward", "Chapter 4: The Turning Point", "Chapter 5: A New Beginning"]`;

    return `[MANDATORY SYSTEM INSTRUCTIONS - OUTLINE GENERATION]
You must generate a comprehensive list of proposed chapter titles for a book based STRICTLY on these user variables:
- Book Title ($title): "${title}"${subtitle}
- Author ($author): "${author}"
- Book Description / Plot Premise ($description): "${description}"
- Category / Genre ($category): "${category}"
- Target Language ($language): ${langName}
- Number of Chapters: ${numChapters}

STRICT OUTPUT FORMAT RULES:
1. Output ONLY a valid JSON array of strings containing exactly ${numChapters} chapter titles.
2. The chapter titles must strictly follow the story arc, pacing, and subject matter defined in $description and $category.
3. Every title must be written in ${langName}.
4. DO NOT write markdown formatting around the JSON, and DO NOT output conversational greetings, notes, or extra text.

Example format:
${exampleOutput}`;
  },

  // Step 2: Generate full structural prose for an individual chapter
  generate_chapter_content: (_text, ctx) => {
    const title = ctx.title || ctx.bookTitle || 'Untitled Book';
    const subtitle = ctx.subtitle ? ` (${ctx.subtitle})` : '';
    const author = ctx.author || 'Anonymous Author';
    const description = ctx.description || 'General storyline';
    const category = ctx.category || ctx.genre || 'General';
    const chapterTitle = ctx.chapterTitle || 'Chapter 1';
    const chapterIndex = ctx.chapterIndex || 1;
    const totalChapters = ctx.totalChapters || 1;
    const allChapters = ctx.allChapterTitles && ctx.allChapterTitles.length > 0
      ? `\n- Full Book Table of Contents: ${ctx.allChapterTitles.map((t, i) => `${i + 1}. ${t}`).join(' | ')}`
      : '';
    const language = ctx.language || 'en';

    const isArabic = language === 'ar' || language === 'arabic';
    const isSpanish = language === 'es' || language === 'spanish';
    const langName = isArabic ? 'fluent, literary Modern Standard Arabic (العربية الفصحى)' : isSpanish ? 'rich, literary Spanish (Español)' : 'fluent, evocative literary English';

    return `[MANDATORY SYSTEM INSTRUCTIONS - FULL CHAPTER PROSE GENERATION]
You are writing an official chapter for a published book. Strictly adhere to these book details:
- Book Title ($title): "${title}"${subtitle}
- Author ($author): "${author}"
- Description / Plot Premise ($description): "${description}"
- Category / Genre ($category): "${category}"
- Current Chapter: "${chapterTitle}" (Chapter ${chapterIndex} of ${totalChapters})${allChapters}
- Target Language: ${langName}

STRICT PROSE GENERATION RULES:
1. FULL STRUCTURAL PARAGRAPHS ONLY: Write complete, rich, and immersive prose paragraphs (at least 600-1000 words).
2. NO BULLET POINTS / NO SUMMARIES: Absolutely DO NOT write bullet points, numbered summary lists, synopsis overviews, or notes. Write continuous book narrative with natural dialogue, rich atmosphere, and narrative momentum.
3. STRUCTURE: Begin with an <h1>${chapterTitle}</h1> heading, followed by multiple engaging sections with <h2> subheadings and narrative <p> paragraphs.
4. CONSISTENCY: Ensure characters, plot points, and setting strictly follow the overarching premise ($description) and genre ($category).
5. OUTPUT FORMAT: Output valid HTML (using <h1>, <h2>, <p>, <blockquote> tags). DO NOT include markdown code blocks, conversational introductions, or commentary.`;
  },

  continue_writing: (text, ctx) => {
    const contextHeader = buildStrictContextBlock(ctx);
    const title = ctx.title || ctx.bookTitle || 'the manuscript';
    const chapter = ctx.chapterTitle || 'the current chapter';
    const category = ctx.category || ctx.genre || 'the genre';
    const desc = ctx.description || '';

    return `${contextHeader}
TASK: Continue Writing Next Scene / Paragraphs
You are the author of "${title}" in the ${category} genre${desc ? ` (Premise: ${desc})` : ''}.
Continue writing the next 2-4 narrative paragraphs following the excerpt from "${chapter}".
Maintain the author's exact tone, character consistency, pacing, and vocabulary.

EXCERPT TO CONTINUE FROM:
${text}`;
  },

  expand_chapter: (text, ctx) => {
    const contextHeader = buildStrictContextBlock(ctx);
    const title = ctx.title || ctx.bookTitle || 'the book';
    const category = ctx.category || ctx.genre || 'the genre';

    return `${contextHeader}
TASK: Expand and Enrich Chapter Passage
You are the developmental editor for "${title}" in the ${category} category.
Expand the following scene or passage with deeper sensory details, richer descriptions, authentic dialogue, and stronger emotional resonance while remaining 100% faithful to the book premise and genre.

ORIGINAL PASSAGE:
${text}`;
  },

  fix_grammar: (text, ctx) => {
    const contextHeader = buildStrictContextBlock(ctx);
    const title = ctx.title || ctx.bookTitle || 'the manuscript';

    return `${contextHeader}
TASK: Grammar, Syntax & Style Proofreading
You are the senior copy editor for "${title}".
Proofread and correct all grammar, spelling, punctuation, phrasing, and stylistic flow in the text below. Preserve the author's authentic voice, tone, and character diction.

TEXT TO EDIT:
${text}`;
  },

  summarize: (text, ctx) => {
    const contextHeader = buildStrictContextBlock(ctx);
    const title = ctx.title || ctx.bookTitle || 'the book';
    const desc = ctx.description || '';

    return `${contextHeader}
TASK: Chapter / Passage Summary
Provide a clear, cohesive 3-5 sentence summary of the following excerpt from "${title}"${desc ? ` (Context: ${desc})` : ''}.
Accurately capture the key developments, character decisions, and themes.

TEXT TO SUMMARIZE:
${text}`;
  },

  generate_outline: (text, ctx) => {
    const contextHeader = buildStrictContextBlock(ctx);
    const title = ctx.title || ctx.bookTitle || 'the book';
    const chapter = ctx.chapterTitle || 'this chapter';
    const category = ctx.category || ctx.genre || 'General';
    const desc = ctx.description || '';

    return `${contextHeader}
TASK: Generate Structured Chapter Outline
Design a structured, multi-section chapter outline for "${chapter}" in "${title}" (Genre: ${category}${desc ? `, Premise: ${desc}` : ''}).
Based on the text below, generate 5-7 section beats with titles, bulleted developments, and smooth narrative transitions.

CHAPTER DRAFT:
${text}`;
  },

  translate_ar: (text, ctx) => {
    const contextHeader = buildStrictContextBlock(ctx);
    const title = ctx.title || ctx.bookTitle || 'الكتاب';

    return `${contextHeader}
TASK: Professional Literary Translation to Arabic (ترجمة أدبية إلى العربية الفصحى)
Translate the following text from "${title}" into eloquent, natural Modern Standard Arabic (فصحى) suitable for publication.
Preserve the literary nuance, style, and tone with natural RTL flow.

TEXT TO TRANSLATE:
${text}`;
  },

  translate_en: (text, ctx) => {
    const contextHeader = buildStrictContextBlock(ctx);
    const title = ctx.title || ctx.bookTitle || 'the book';

    return `${contextHeader}
TASK: Professional Literary Translation to English
Translate the following text from "${title}" into polished, fluent, and expressive literary English.
Preserve the author's voice, nuance, and meaning.

TEXT TO TRANSLATE:
${text}`;
  },

  translate_es: (text, ctx) => {
    const contextHeader = buildStrictContextBlock(ctx);
    const title = ctx.title || ctx.bookTitle || 'el libro';

    return `${contextHeader}
TASK: Professional Literary Translation to Spanish (Español)
Translate the following text from "${title}" into natural, rich, and eloquent literary Spanish.
Maintain the exact voice, rhythm, and tone.

TEXT TO TRANSLATE:
${text}`;
  },

  make_formal: (text, ctx) => {
    const contextHeader = buildStrictContextBlock(ctx);
    const title = ctx.title || ctx.bookTitle || 'the work';

    return `${contextHeader}
TASK: Academic & Formal Polish
Rewrite the text below from "${title}" in an authoritative, sophisticated, and polished formal register while preserving all factual content and intent.

TEXT TO REWRITE:
${text}`;
  },

  make_casual: (text, ctx) => {
    const contextHeader = buildStrictContextBlock(ctx);
    const title = ctx.title || ctx.bookTitle || 'the story';

    return `${contextHeader}
TASK: Conversational & Engaging Polish
Rewrite the text below from "${title}" in a warm, engaging, conversational, and accessible voice while preserving all core ideas.

TEXT TO REWRITE:
${text}`;
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strips HTML tags to plain text for AI ingestion */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Converts plain-text / markdown response to clean HTML for TipTap */
export function textToHtml(text: string): string {
  if (text.includes('<p>') || text.includes('<h1>') || text.includes('<h2>')) {
    return text;
  }

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const out: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const closeList = () => {
    if (listType) { out.push(`</${listType}>`); listType = null; }
  };

  for (const line of lines) {
    if (/^#\s+/.test(line)) {
      closeList();
      out.push(`<h2>${line.replace(/^#\s+/, '')}</h2>`);
    } else if (/^#{2,3}\s+/.test(line)) {
      closeList();
      out.push(`<h3>${line.replace(/^#{2,3}\s+/, '')}</h3>`);
    } else if (/^\d+\.\s+/.test(line)) {
      if (listType !== 'ol') { closeList(); out.push('<ol>'); listType = 'ol'; }
      out.push(`<li>${line.replace(/^\d+\.\s+/, '')}</li>`);
    } else if (/^[-*•]\s+/.test(line)) {
      if (listType !== 'ul') { closeList(); out.push('<ul>'); listType = 'ul'; }
      out.push(`<li>${line.replace(/^[-*•]\s+/, '')}</li>`);
    } else {
      closeList();
      out.push(`<p>${line}</p>`);
    }
  }
  closeList();
  return out.join('');
}

/** Parses JSON array of chapter titles returned by AI, with fallback cleaning */
export function parseChapterTitlesJson(rawText: string, expectedCount = 5, fallbackPrefix = 'Chapter'): string[] {
  let cleaned = rawText.trim();
  // Remove markdown code blocks if any
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '').trim();

  // Try parsing direct JSON
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item) => String(item).trim()).filter(Boolean);
    }
  } catch {
    // If direct parse fails, try extracting array via regex
    const match = cleaned.match(/\[\s*([\s\S]*?)\s*\]/);
    if (match) {
      try {
        const parsed = JSON.parse(`[${match[1]}]`);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        // Fall through
      }
    }
  }

  // Fallback: line-by-line parsing if AI returned bulleted / numbered list
  const lines = cleaned
    .split('\n')
    .map((l) => l.replace(/^[\d+.\-*•\s"]+|[",\s]+$/g, '').trim())
    .filter(Boolean);

  if (lines.length > 0) {
    return lines;
  }

  // Last resort default list
  return Array.from({ length: expectedCount }, (_, i) => `${fallbackPrefix} ${i + 1}`);
}

// ─── Client API Caller ───────────────────────────────────────────────────────

export async function runAIAction(req: AIRequest): Promise<AIResponse> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Network response failed' }));
    throw new Error(body.error || `Server error (${res.status})`);
  }

  return res.json() as Promise<AIResponse>;
}
