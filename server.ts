// ByteBrothers Studio Backend Server
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for received contact inquiries
const inquiriesQueue: any[] = [];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    studio: 'ByteBrothers',
    version: '4.0.2',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/inquiry', (req, res) => {
  const inquiryData = req.body;
  inquiryData.receivedAt = new Date().toISOString();
  inquiryData.status = 'Queued for ByteBrothers Review';
  inquiriesQueue.push(inquiryData);

  res.json({
    success: true,
    message: 'Inquiry received successfully and queued for review.',
    id: `inq_${Date.now()}`,
    data: inquiryData
  });
});

app.get('/api/inquiries', (req, res) => {
  res.json({
    count: inquiriesQueue.length,
    inquiries: inquiriesQueue
  });
});

// AI Architectural Estimator via Gemini API
app.post('/api/ai/estimate', async (req, res) => {
  try {
    const { projectType, budget, details } = req.body;

    const isWebflow = projectType?.toLowerCase().includes('webflow');
    const defaultStack = isWebflow
      ? ['Webflow Enterprise', 'Client-First v2 (Finsweet)', 'Custom JS / GSAP', 'Webflow CMS API', 'Relume Library']
      : ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Express'];

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: true,
        isFallback: true,
        estimate: {
          recommendedStack: defaultStack,
          estimatedTimeline: '2-4 Weeks',
          architecturalStrategy: isWebflow
            ? `Enterprise Webflow architecture utilizing Client-First v2 class structures, 100% pixel-perfect Figma translation, dynamic Webflow CMS schemas, and custom GSAP micro-interactions.`
            : `Bespoke ${projectType || 'Web Application'} architecture focused on sub-second render performance, zero bloat, and PWA offline caching.`,
          keyMilestones: isWebflow
            ? [
                'Week 1: Figma design audit & Client-First styleguide setup',
                'Week 2: Webflow DOM construction & responsive breakpoint tuning',
                'Week 3: Webflow CMS relational schemas & custom JS module binding',
                'Week 4: 100/100 Lighthouse audit & CMS video handoff training'
              ]
            : [
                'Week 1: High-fidelity Figma blueprint & wireframing',
                'Week 2-3: Core React UI & state persistence engine',
                'Week 4: API integration & V8 performance tuning',
                'Week 5: Production launch & offline SW verification'
              ]
        }
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are the lead AI Architectural Advisor for "ByteBrothers", an elite boutique digital engineering studio specializing in AI-native products, custom WebGL, and full-stack systems.

Client Request Overview:
- Project Type: ${projectType || 'Custom Business Web Application'}
- Target Budget Range: ${budget || '$5,000 - $15,000'}
- Details / Vision: ${details || 'High performance web app with responsive UI'}

Special Studio Mastery: ByteBrothers are world-class engineers utilizing Webflow Enterprise with Client-First v2 (Finsweet), custom JS/GSAP extensions, React 19, and 100/100 Lighthouse performance.

Provide a JSON output matching this structure strictly (no markdown fence, raw JSON only):
{
  "recommendedStack": ["string", "string"],
  "estimatedTimeline": "string",
  "architecturalStrategy": "string",
  "keyMilestones": ["string", "string", "string", "string"],
  "founderNote": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text || '';
    let parsedJson;
    try {
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedJson = JSON.parse(cleanJson);
    } catch {
      parsedJson = {
        recommendedStack: ['React', 'TypeScript', 'Tailwind CSS', 'Express', 'Vite'],
        estimatedTimeline: '4 Weeks',
        architecturalStrategy: text,
        keyMilestones: [
          'Phase 1: Architecture & UI Systems',
          'Phase 2: Core Engineering',
          'Phase 3: QA & Performance Benchmarking',
          'Phase 4: Production Deployment'
        ],
        founderNote: 'The ByteBrothers team will conduct a 1-on-1 discovery session to validate this proposal.'
      };
    }

    res.json({
      success: true,
      estimate: parsedJson
    });
  } catch (error: any) {
    console.error('Gemini API Estimate Error:', error);
    res.status(200).json({
      success: true,
      isFallback: true,
      estimate: {
        recommendedStack: ['React 19', 'TypeScript', 'Tailwind CSS v4', 'Express', 'PWA Offline Cache'],
        estimatedTimeline: '3-6 Weeks',
        architecturalStrategy: 'Single-file component modularity, V8 execution optimization, and offline IndexedDB persistence.',
        keyMilestones: [
          'Sprint 1: UI System & Motion Engine',
          'Sprint 2: Service Worker & Cache Strategy',
          'Sprint 3: Real-time Notification Engine',
          'Sprint 4: Edge Deployment'
        ],
        founderNote: 'The ByteBrothers team will review your submission personally.'
      }
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ByteBrothers] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
