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
      content: `<h1>Chapter 1: The Tectonic Framework of Imagined Realities</h1><p>Every compelling universe begins not with a pantheon or a laser sword, but with <strong>fundamental constraints</strong>. When we create speculative fiction, our primary duty is to establish a cohesive logic that resists arbitrary deus ex machina.</p><h2>1.1 The Law of Conservation of Plausibility</h2><p>Consider the ecology of your setting. If floating citadels drift effortlessly above the methane canyons of <em>Aethelgard</em>, what powers their anti-gravitational keels? Are the miners in the lower strata suffering from atmospheric toxicity?</p><blockquote>"A fictional universe is only as expansive as the friction between its inhabitants and their environment."</blockquote><p>Here are three core axioms every speculative author must calibrate:</p><ul><li><strong>Resource Scarcity:</strong> What commodity drives commerce and war?</li><li><strong>Linguistic Inertia:</strong> How have colloquial idioms evolved over centuries of isolation?</li><li><strong>Institutional Memory:</strong> Who writes the histories, and who actively erases them?</li></ul><h2>1.2 The Cascade of Secondary Consequences</h2><p>When you introduce a single supernatural or hyper-technological variable, trace its impact through at least three societal strata: agriculture, jurisprudence, and domestic routine.</p>`
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
      content: `<h1>Chapter 2: Dialects, Cryptography & Lingual Drift</h1><p>Language is not a static container for plot exposition; it is a living organism shaped by trade routes, geopolitical conquest, and sensory limitations.</p><h2>2.1 Constructing Idiomatic Authenticity</h2><p>Avoid simplistic phonetic substitutions. Instead, root vernacular speech in the material reality of the speaker's biome. A seafaring civilization will measure distance in tide-cycles rather than static miles.</p><pre><code>// Linguistic Drift Model:
Original: "May your journey be unobstructed by storms."
Colloquial: "Calm keel to you."
Slang: "Zero-g, clear vectors."</code></pre><p>When readers encounter phrases that reflect the genuine lived pressures of your world, immersion becomes effortless.</p>`
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
      content: `<h1>Chapter 3: Socio-Economic Power Grids</h1><p>Power is rarely monolithic. In this chapter, we explore how guild syndicates, orbital merchant cartels, and hereditary dynasties leverage synthetic monopolies to enforce cultural compliance.</p><h2>3.1 The Anatomy of Monopoly</h2><p>Draft notes: Detail the three key trade routes crossing the Rift Valley. Discuss the black market synthetic catalysts.</p>`
    }
  ],
  activeChapterId: 'chap_1',
  createdAt: Date.now() - 3600000 * 48,
  updatedAt: Date.now()
};