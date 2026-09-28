import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize GoogleGenAI client server-side only
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// POST /api/recommendations - Personalized Book Matchmaker
app.post('/api/recommendations', async (req, res) => {
  const { mood, tropes, genres, lovedBooks, readingPace } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      source: 'algorithmic',
      message: 'Curated based on your reading profile preferences.',
      insights: [
        `Matched high lyrical resonance for ${mood || 'atmospheric'} reads.`,
        `Filtered for key thematic motifs: ${(tropes || []).join(', ') || 'character-driven narrative'}.`,
      ],
    });
  }

  try {
    const prompt = `You are the master literary curator at 'The Bindery & Co.', a storied independent boutique bookstore.
A patron is requesting personalized reading recommendations with the following profile:
- Target Mood: ${mood || 'Any'}
- Favorite Tropes / Themes: ${Array.isArray(tropes) ? tropes.join(', ') : tropes || 'Rich worldbuilding, character depth'}
- Preferred Genres: ${Array.isArray(genres) ? genres.join(', ') : genres || 'Literary Fiction, Speculative'}
- Books or Authors They Loved: ${lovedBooks || 'None specified'}
- Reading Pace/Vibe: ${readingPace || 'Immersive & Thoughtful'}

Return a JSON object with:
1. "curatorNote": A warm, 2-3 sentence personalized opening letter from the chief bookseller explaining why these themes resonate together.
2. "insights": An array of 3 brief, poetic literary insights or reading observations for this reader.
3. "suggestedThemes": An array of 3 thematic tags (e.g. "Hauntological Fiction", "Sublime Naturalism", "Slow-Burn Epistolary").
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            curatorNote: { type: Type.STRING },
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            suggestedThemes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['curatorNote', 'insights', 'suggestedThemes'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({
      success: true,
      source: 'gemini',
      ...parsed,
    });
  } catch (error: any) {
    console.warn('Gemini recommendation call fallback:', error?.message);
    return res.json({
      success: true,
      source: 'algorithmic',
      curatorNote: `We have assembled a bespoke folio tailored to your affinity for ${mood || 'captivating'} prose and ${genres?.[0] || 'thoughtful'} narratives.`,
      insights: [
        'Balanced narrative velocity with emotional depth.',
        'Selected works known for evocative sense of place.',
        'High stylistic alignment with your chosen tropes.',
      ],
      suggestedThemes: ['Atmospheric Prose', 'Interior Journeys', 'Literary Craft'],
    });
  }
});

// POST /api/search-assistant - Natural Language & Vibe Search Assistant
app.post('/api/search-assistant', async (req, res) => {
  const { query, catalogTitles } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (!ai) {
    return res.json({
      success: true,
      interpretedMood: query,
      curatorRationale: `Showing works attuned to "${query}".`,
    });
  }

  try {
    const prompt = `A bookstore visitor typed this natural language book search/mood query: "${query}".
Known titles in store: ${JSON.stringify(catalogTitles || [])}.

Return a JSON object:
- "matchedKeywords": array of 3-5 extracted keywords or genre concepts.
- "curatorRationale": 1-2 sentence literary bookseller summary of what this reader is seeking.
- "recommendedGenres": array of 1-3 matching genre strings.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchedKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            curatorRationale: { type: Type.STRING },
            recommendedGenres: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['matchedKeywords', 'curatorRationale', 'recommendedGenres'],
        },
      },
    });

    const data = JSON.parse(response.text?.trim() || '{}');
    return res.json({
      success: true,
      source: 'gemini',
      ...data,
    });
  } catch (err: any) {
    return res.json({
      success: true,
      source: 'algorithmic',
      matchedKeywords: query.toLowerCase().split(' ').filter((w: string) => w.length > 3),
      curatorRationale: `Books aligned with your search for "${query}".`,
      recommendedGenres: ['Fiction', 'Literary Fiction'],
    });
  }
});

// Mount Vite or static server
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Bookstore server listening on port ${PORT}`);
  });
}

startServer();
