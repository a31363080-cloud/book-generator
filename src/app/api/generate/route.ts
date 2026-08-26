import { NextRequest, NextResponse } from 'next/server';
import { AIRequest, AIResponse, ALL_MODELS, PROMPTS, stripHtml } from '@/lib/ai-engine';

// ─── Provider implementations ───────────────────────────────────────────────

async function runGoogle(prompt: string, modelId: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Google Gemini API Key is missing. Please set GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY in your .env.local file.');
  }

  const { GoogleGenAI } = await import('@google/genai');
  const genai = new GoogleGenAI({ apiKey });
  
  // Model aliases for Google GenAI SDK
  const candidates = [
    modelId,
    modelId.replace('gemini-1.5-flash', 'gemini-3.6-flash'),
    modelId.replace('gemini-2.0-flash', 'gemini-3.6-flash'),
    modelId.replace('gemini-2.5-flash', 'gemini-3.6-flash'),
    'gemini-3.6-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ];

  const uniqueCandidates = Array.from(new Set(candidates));
  let lastError: Error | null = null;

  for (const candidate of uniqueCandidates) {
    try {
      const response = await genai.models.generateContent({
        model: candidate,
        contents: prompt,
      });

      const text = response.text?.trim();
      if (text) {
        return text;
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // If error is 404/not available, continue to next candidate
      const msg = lastError.message.toLowerCase();
      if (msg.includes('not found') || msg.includes('no longer available') || msg.includes('not supported')) {
        continue;
      }
      // For other errors (like quota or invalid key), break immediately
      throw lastError;
    }
  }

  throw lastError || new Error('Google Gemini returned an empty response.');
}

async function runOpenAI(prompt: string, modelId: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API Key is missing. Please set OPENAI_API_KEY in your .env.local file.');
  }

  const OpenAI = (await import('openai')).default;
  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: modelId,
    messages: [
      { role: 'system', content: 'You are an enterprise-grade literary assistant and book writing editor.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2500,
  });

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('OpenAI returned an empty response.');
  }
  return text;
}

async function runAnthropic(prompt: string, modelId: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API Key is missing. Please set ANTHROPIC_API_KEY in your .env.local file.');
  }

  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey });
  
  // Normalize Anthropic model ID
  const targetModel = modelId === 'claude-3.5-sonnet' || modelId === 'claude-3-5-sonnet'
    ? 'claude-3-5-sonnet-20241022'
    : modelId;

  const message = await client.messages.create({
    model: targetModel,
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
  });

  const block = message.content[0];
  if (!block || block.type !== 'text') {
    throw new Error('Anthropic Claude returned an empty response.');
  }
  return block.text.trim();
}

async function runDeepSeek(prompt: string, modelId: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('DeepSeek API Key is missing. Please set DEEPSEEK_API_KEY in your .env.local file.');
  }

  // DeepSeek is fully compatible with OpenAI SDK
  const OpenAI = (await import('openai')).default;
  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com',
  });

  const completion = await client.chat.completions.create({
    model: modelId,
    messages: [
      { role: 'system', content: 'You are an enterprise-grade literary assistant and story editor.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 2500,
  });

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('DeepSeek returned an empty response.');
  }
  return text;
}

// ─── Main POST handler ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AIRequest;

    if (!body.action || !body.modelId) {
      return NextResponse.json(
        { error: 'Missing required parameters: action or modelId.' },
        { status: 400 }
      );
    }

    const model = ALL_MODELS[body.modelId];
    if (!model) {
      return NextResponse.json(
        { error: `Unrecognized model ID: "${body.modelId}". Please select a supported model.` },
        { status: 400 }
      );
    }

    const isBookLevelAction = body.action === 'generate_book_outline' || body.action === 'generate_chapter_content';
    const rawText = body.text || '';
    const plainText = stripHtml(rawText);

    if (!isBookLevelAction && plainText.length < 5) {
      return NextResponse.json(
        { error: 'Text content is too short. Please select or write some text in the editor first.' },
        { status: 400 }
      );
    }

    const promptFn = PROMPTS[body.action];
    if (!promptFn) {
      return NextResponse.json(
        { error: `Unrecognized AI action: "${body.action}".` },
        { status: 400 }
      );
    }

    const prompt = promptFn(plainText, {
      title: body.title || body.bookTitle,
      subtitle: body.subtitle,
      bookTitle: body.bookTitle || body.title,
      description: body.description,
      author: body.author,
      category: body.category || body.genre,
      genre: body.genre || body.category,
      chapterTitle: body.chapterTitle,
      chapterIndex: body.chapterIndex,
      totalChapters: body.totalChapters,
      allChapterTitles: body.allChapterTitles,
      numChapters: body.numChapters,
      language: body.language,
    });

    let result: string;
    switch (model.provider) {
      case 'google':
        result = await runGoogle(prompt, model.id);
        break;
      case 'openai':
        result = await runOpenAI(prompt, model.id);
        break;
      case 'anthropic':
        result = await runAnthropic(prompt, model.id);
        break;
      case 'deepseek':
        result = await runDeepSeek(prompt, model.id);
        break;
      default:
        return NextResponse.json({ error: `Provider "${model.provider}" is not supported.` }, { status: 400 });
    }

    const response: AIResponse = {
      result,
      action: body.action,
      modelId: body.modelId,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during generation.';
    console.error('[POST /api/generate Error]:', message);

    let userFriendlyError = message;
    if (message.includes('API key') || message.includes('API Key') || message.includes('missing')) {
      userFriendlyError = message;
    } else if (message.includes('429') || message.toLowerCase().includes('quota') || message.toLowerCase().includes('rate limit')) {
      userFriendlyError = 'API rate limit or quota exceeded for this provider. Please try again later or switch to another model.';
    } else if (message.includes('401') || message.toLowerCase().includes('unauthorized') || message.toLowerCase().includes('authentication')) {
      userFriendlyError = 'Invalid API key provided for this provider. Please check your credentials in .env.local.';
    }

    return NextResponse.json({ error: userFriendlyError }, { status: 500 });
  }
}
