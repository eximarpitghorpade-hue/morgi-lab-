import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { db } from '../../db/database.ts';
import { requireAuth, type AuthenticatedRequest } from '../auth.ts';

const router = Router();

// Server-side Gemini client
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize Gemini AI client:', err);
  }
}

// Student AI Assistant Route: Morni Mitr
router.post('/morni-mitr', requireAuth, async (req: AuthenticatedRequest, res) => {
  const student = req.user!;
  const { prompt, mode = 'explain', lessonTitle, topic } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'A question or prompt is required.' });
  }

  const data = db.getData();
  const config = data.aiConfig;

  if (!config.enabled) {
    return res.status(403).json({
      error: 'MORNI MITR is currently paused by the academic administration for scheduled curriculum maintenance.',
    });
  }

  // Check student daily usage limits
  const today = new Date().toISOString().split('T')[0];
  const studentDailyUsage = data.aiUsageLogs.filter(
    log => log.studentId === student.id && log.createdAt.startsWith(today)
  ).length;

  if (studentDailyUsage >= config.dailyStudentLimit) {
    return res.status(429).json({
      error: `You have reached your daily mentor guidance limit of ${config.dailyStudentLimit} prompts. Try applying what you've learned today or review your lesson notes!`,
    });
  }

  // Academic Guardrails Prompt
  const contextualInstruction = `
${config.systemPrompt}

Current Mode: ${mode.toUpperCase()}
Student Name: ${student.name}
${lessonTitle ? `Active Lesson Context: "${lessonTitle}"` : ''}
${topic ? `Topic Area: "${topic}"` : ''}

CRITICAL PEDAGOGICAL SAFETY RULES:
1. Under NO circumstances should you write complete graded code, essay answers, or project deliverables for the student.
2. If the student asks you to "do my homework" or "give me the final submission text", politely explain that true creativity comes from building it themselves, and instead break the problem down into a 3-step thinking framework.
3. Be inspiring, concise, encouraging, and clear. Format answers with clean markdown headings and bullet points.
4. If giving a hint, provide a guided question that leads the student to the answer.
`;

  try {
    let replyText = '';

    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${contextualInstruction}\n\nStudent asks: ${prompt}` }] },
        ],
      });
      replyText = response.text || 'I am thinking about your question. Let us examine the core concept together.';
    } else {
      // Pedagogical Fallback when API key is unconfigured in development
      replyText = generatePedagogicalFallback(prompt, mode, lessonTitle, topic);
    }

    // Record AI usage log
    const usageLog = {
      id: `ai_log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      studentId: student.id,
      prompt: prompt.slice(0, 300),
      topic: topic || lessonTitle || 'General',
      tokenCount: Math.round(replyText.length / 4),
      createdAt: new Date().toISOString(),
    };
    data.aiUsageLogs.unshift(usageLog);
    if (data.aiUsageLogs.length > 500) data.aiUsageLogs.pop();
    db.save();

    res.json({
      reply: replyText,
      mode,
      remainingToday: Math.max(0, config.dailyStudentLimit - (studentDailyUsage + 1)),
    });
  } catch (err: any) {
    console.error('Error generating AI response with Gemini:', err);
    // Graceful fallback response
    const fallback = generatePedagogicalFallback(prompt, mode, lessonTitle, topic);
    res.json({
      reply: fallback,
      mode,
      remainingToday: Math.max(0, config.dailyStudentLimit - (studentDailyUsage + 1)),
    });
  }
});

function generatePedagogicalFallback(
  prompt: string,
  mode: string,
  lessonTitle?: string,
  topic?: string
): string {
  const p = prompt.toLowerCase();

  if (p.includes('contrast') || p.includes('color') || p.includes('wcag')) {
    return `### 🎨 Color & Contrast Guidance from Morni Mitr
Great question on visual accessibility!

1. **The 4.5:1 Standard**: Normal text must always have at least a 4.5:1 luminance ratio against its background.
2. **Tools to Test**: Use Figma plugins like Stark or web tools like WebAIM Contrast Checker.
3. **Pro-Tip**: Don't rely solely on color to convey state (e.g. use an icon next to an error message, not just red text).

*What color combination are you experimenting with right now?*`;
  }

  if (p.includes('robot') || p.includes('resistor') || p.includes('sensor') || p.includes('ohm')) {
    return `### ⚡ Circuit & Robotics Mentor Note
Let's break down the physical computing principle:

1. **Ohm's Law**: $V = I \\times R$. If voltage is fixed (e.g., 5V), increasing resistance reduces the current flow.
2. **Protecting LEDs**: A 220Ω resistor prevents excessive amperage from burning out standard diodes.
3. **Debugging Step**: Always check your ground (GND) rail first if your sensor values jump erratically.

*Are you working with digital GPIO or analog PWM pins?*`;
  }

  if (p.includes('story') || p.includes('animation') || p.includes('keyframe')) {
    return `### 🎬 Animation Principles in Practice
Remember the 12 Principles of Animation:

1. **Anticipation**: Before a character jumps, they must crouch down.
2. **Squash and Stretch**: Gives weight and flexibility to drawn objects while preserving volume.
3. **Timing**: The number of drawings between poses determines the feeling of speed and weight.

*Try sketching a quick 3-frame bouncing ball thumbnail to test your timing!*`;
  }

  return `### 💡 Morni Mitr Concept Breakdown
Hello! I'm here to help you unpack this topic step by step.

**1. Understand the Core Goal**:
When approaching **${topic || lessonTitle || 'your creative work'}**, ask yourself: what is the user or viewer trying to accomplish or feel?

**2. Guiding Hint**:
Break the problem down into smaller chunks:
- Identify the inputs (what data, asset, or component do you start with?)
- What transformation needs to take place?
- What is the output or validation criteria?

**3. Practice Recommendation**:
Try drawing or writing out a mini prototype on paper before jumping straight into the final tool!

*Feel free to ask a specific follow-up question on any part of this!*`;
}

export default router;
