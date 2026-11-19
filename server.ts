import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

type SupportedLanguage = 'fr' | 'en' | 'es' | 'it';

const LANGUAGE_GREETING_INSTRUCTION: Record<SupportedLanguage, string> = {
  fr: 'The visitor currently selected French. Start by greeting them warmly in French, introducing yourself as Lisa Coigdarens’s professional voice assistant, and briefly asking how you can assist them regarding Lisa’s profile, experience, or availability.',
  en: 'The visitor currently selected English. Start by greeting them warmly in English, introducing yourself as Lisa Coigdarens’s professional voice assistant, and briefly asking how you can assist them regarding Lisa’s profile, experience, or availability.',
  es: 'The visitor currently selected Spanish. Start by greeting them warmly in Spanish, introducing yourself as Lisa Coigdarens’s professional voice assistant, and briefly asking how you can assist them regarding Lisa’s profile, experience, or availability.',
  it: 'The visitor currently selected Italian. Start by greeting them warmly in Italian, introducing yourself as Lisa Coigdarens’s professional voice assistant, and briefly asking how you can assist them regarding Lisa’s profile, experience, or availability.',
};

const LISA_SYSTEM_INSTRUCTION = `You are the dedicated, poised, and professional voice assistant representing Lisa Coigdarens.

VOICE & PERSONA:
- Speak with a warm, articulate, refined, executive-level professional tone—never robotic or overly casual.
- You are fluent in four languages: French, English, Spanish, and Italian.
- Always respond in the language the user speaks or writes in (French, English, Spanish, or Italian). If they switch languages mid-conversation, seamlessly switch with them.
- Keep spoken responses concise, structured, and natural for voice conversation (typically 2 to 4 clear sentences unless the user asks for deep detail).
- Never invent or exaggerate facts outside Lisa's verified CV below. If asked something not on her CV, politely note that you don't have that detail on file and offer Lisa's direct contact information.

LISA COIGDARENS — VERIFIED PROFILE:
- Headline: Master Manager de Communication de Marque at Sup de Pub Paris; currently in work-study (alternance) at La Banque de France in event management ("en événementiel").
- Location: Paris, France.
- Direct Contact: Phone 06.24.17.71.27 | Email lisa.coigdarens@sfr.fr.

EXPERIENCE:
1. Assistante communication et événementiel — La Banque de France, Paris (Stage / Alternance, 16/06/2026 – 14/08/2026 & current alternance):
   - Created internal and external communication materials (newsletters, corporate supports).
   - Designed visual presentations and documents respecting strict brand guidelines.
   - Participated in organizing and coordinating internal and external events.
   - Managed vendor/supplier relations: writing briefs, analyzing quotes, monitoring production.
   - Managed projects with collaborative tools (Microsoft Teams, SharePoint), tracking priorities and deadlines.
2. Community Manager et Animatrice Radio — Université de Pau et des Pays de l'Adour (UPPA), Pau (Service Civique, 14/10/2024 – 30/06/2025):
   - Managed social media channels (stories and posts promoting radio shows).
   - Covered events and interviewed professionals to enrich radio programming.
   - Researched, simplified, and synthesized information for clear, accessible broadcasting.
   - Hosted daily and bi-monthly radio programs.
3. Chargée de communication et projet événementiel — Créa Sud Communication, Lescar (Stage, 07/05/2023 – 07/07/2023):
   - Prepared and designed events for TotalEnergies and CALAC (Salon des maires des Landes).
   - Planned and coordinated logistics for conferences, trade shows, seminars, the E-py Awards (Pyrénées Presse), and symposiums at Palais Beaumont in Pau.
   - Contributed to strategic briefs, newsletters, social media content, and direct client relations.

EDUCATION & CREDENTIALS:
1. Master 1 Stratégies des Marques et des Médias ("Stratégie Événementielle"), Sup de Pub Paris (2026 – 2028).
   - Completed a university exchange semester at Universitas Warmadewa in Bali (September – December 2025).
2. Licence Information-Communication, Université Hannah Arendt, Avignon (2021 – 2024) — Mention Assez bien.
   - Studied marketing, communication strategy, DTP (PAO), image analysis, semiotics, anthropology, and cultural economics.
   - Produced music podcasts, magazine covers, music magazines, newsletters, advertising posters, and album covers.
3. BAC Général (Specializations: English & Political Science), Albert Camus, Mourenx (2020) — Mention Assez bien.
4. Certification LVMH (Fashion & Luxury).

SKILLS, LANGUAGES & INTERESTS:
- Lisa's CV language levels: French (native), English (B2), Spanish (A2), Italian (A1). (Note: You as her voice assistant speak all four fluently.)
- Tools: Canva, Microsoft Office (Word, Excel, PowerPoint), Google Suite (Docs, Sheets, Slides), Teams, SharePoint, LinkedIn & Social Media, SketchUp (3D modeling - beginner level).
- Key Strengths: Creative, rigorous, autonomous, organized, versatile, strong team spirit.
- Interests: Fashion & Luxury (LVMH Certification), Music (Pop, Rap), Reading, Travel (Bali, Crete, Turkey), Sports (Climbing & Skiing).`;

function createGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the server environment.');
  }
  return new GoogleGenAI({
    apiKey,
    apiVersion: 'v1beta',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/live')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/live' });

  wss.on('connection', (clientWs: WebSocket) => {
    let liveSession: Awaited<ReturnType<GoogleGenAI['live']['connect']>> | null = null;
    let isClosing = false;

    const sendToClient = (payload: Record<string, unknown>) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify(payload));
      }
    };

    const cleanup = () => {
      if (isClosing) return;
      isClosing = true;
      if (liveSession) {
        try {
          liveSession.close();
        } catch {
          // ignore close errors
        }
        liveSession = null;
      }
    };

    clientWs.on('message', async (rawData) => {
      let parsed: { type?: string; data?: string; text?: string; language?: SupportedLanguage };
      try {
        parsed = JSON.parse(rawData.toString());
      } catch {
        return;
      }

      if (parsed.type === 'start') {
        if (liveSession) return;
        const lang: SupportedLanguage =
          parsed.language && parsed.language in LANGUAGE_GREETING_INSTRUCTION
            ? parsed.language
            : 'fr';

        let setupCompleted = false;
        try {
          const ai = createGenAIClient();
          const session = await ai.live.connect({
            model: 'gemini-3.8-live',
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
              },
              inputAudioTranscription: {},
              outputAudioTranscription: {},
              systemInstruction: `${LISA_SYSTEM_INSTRUCTION}\n\nSESSION LANGUAGE PREFERENCE:\n${LANGUAGE_GREETING_INSTRUCTION[lang]}`,
            },
            callbacks: {
              onmessage: (message: LiveServerMessage) => {
                const content = message.serverContent;
                if (content?.inputTranscription?.text) {
                  sendToClient({
                    type: 'inputTranscript',
                    text: content.inputTranscription.text,
                  });
                }
                if (content?.outputTranscription?.text) {
                  sendToClient({
                    type: 'outputTranscript',
                    text: content.outputTranscription.text,
                  });
                }
                for (const part of content?.modelTurn?.parts ?? []) {
                  if (part.inlineData?.data) {
                    sendToClient({
                      type: 'audio',
                      data: part.inlineData.data,
                    });
                  }
                }
                if (content?.interrupted) {
                  sendToClient({ type: 'interrupted' });
                }
                if (content?.turnComplete) {
                  sendToClient({ type: 'turnComplete' });
                }
              },
              onerror: (err) => {
                if (!setupCompleted) return;
                const errObj = err as { message?: string; error?: { message?: string } } | undefined;
                const messageText =
                  err instanceof Error
                    ? err.message
                    : errObj?.error?.message ||
                      errObj?.message ||
                      'Live voice session encountered a connection error.';
                console.error('Gemini Live error:', messageText);
                sendToClient({ type: 'error', message: messageText });
              },
              onclose: (event) => {
                if (!setupCompleted) return;
                if (event?.code && event.code !== 1000 && event.code !== 1005) {
                  console.warn('Gemini Live closed:', event.code, event.reason);
                }
                sendToClient({ type: 'closed' });
              },
            },
          });

          if (isClosing || clientWs.readyState !== WebSocket.OPEN) {
            session.close();
            return;
          }

          setupCompleted = true;
          liveSession = session;
          sendToClient({ type: 'ready' });

          const greetPrompt: Record<SupportedLanguage, string> = {
            fr: 'Bonjour, présentez-vous brièvement en français en tant qu’assistante vocale de Lisa Coigdarens.',
            en: 'Hello, please briefly introduce yourself in English as Lisa Coigdarens’s voice assistant.',
            es: 'Hola, preséntese brevemente en español como la asistente de voz de Lisa Coigdarens.',
            it: 'Buongiorno, si presenti brevemente in italiano come assistente vocale di Lisa Coigdarens.',
          };
          session.sendRealtimeInput({ text: greetPrompt[lang] });
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Unable to start the Gemini Live voice session.';
          console.error('Gemini Live connect failed:', message);
          sendToClient({ type: 'error', message });
          clientWs.close();
        }
        return;
      }

      if (parsed.type === 'audio' && parsed.data && liveSession) {
        liveSession.sendRealtimeInput({
          audio: {
            data: parsed.data,
            mimeType: 'audio/pcm;rate=16000',
          },
        });
        return;
      }

      if (parsed.type === 'text' && parsed.text && liveSession) {
        liveSession.sendRealtimeInput({
          text: parsed.text,
        });
      }
    });

    clientWs.on('close', cleanup);
    clientWs.on('error', cleanup);
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Lisa Coigdarens Voice Assistant server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
