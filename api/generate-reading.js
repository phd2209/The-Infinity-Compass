import OpenAI from 'openai';
import { retryableApiCall } from './utils/retry.js';

/**
 * Generate numerology reading using OpenAI
 * POST /api/generate-reading
 * Body: { name, birthdate, diamondData, focusArea }
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { diamondData, focusArea = 'general' } = req.body;

  // Validate required fields
  if (!diamondData || !diamondData.top || !diamondData.left || !diamondData.right) {
    return res.status(400).json({
      error: 'invalid_request',
      message: 'Missing required diamond data (top, left, right)',
    });
  }

  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    console.log('OpenAI API key not configured, returning placeholder data');
    return res.status(200).json(getPlaceholderReading());
  }

  try {
    // Initialize OpenAI client (server-side only)
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Build the birthday interpretation section
    let birthdaySection = '';
    if (diamondData.birthdayInterpretation) {
      const bi = diamondData.birthdayInterpretation;
      birthdaySection = `

Base energy extra info:
- Planet: ${bi.planetName}
- Core Essence: ${bi.description}

Temperament Profile:
${bi.temperament}

Love & Relationships:
${bi.loveLife}

Career & Work Style:
${bi.workLife}

Fortune & Luck:
- Lucky Numbers: ${bi.luckyNumbers}
- Lucky Days: ${bi.luckyDays}
- Amulet Guidance: ${bi.amulet}`;
    }

    // Build compound numbers section
    let compoundNumbersSection = '';
    if (diamondData.compoundNumberInterpretations && diamondData.compoundNumberInterpretations.length > 0) {
      compoundNumbersSection = `

Life path extra info:
${diamondData.compoundNumberInterpretations.map(interpretation =>
  `- ${interpretation.number}${interpretation.caption ? ` (${interpretation.caption})` : ''}: ${interpretation.description}`
).join('\n')}`;
    }

    const focusPrompt = `
**Goal:**
Create a mystical yet grounded reading that feels *beautiful, collectible, and personal* — something users would be proud to share publicly (e.g., "This is so me!").

---

### 1. STRUCTURE

Provide a BALANCED READING covering all major life areas:
- Interpret the **Base Energy (${diamondData.top})** for core personality and emotional signature.
- Summarize the **Life Path Numbers (${diamondData.left}, ${diamondData.center || 'N/A'}, ${diamondData.right})** for purpose, potential, and life direction.
- Integrate **Birthday Planet** influence and **compound number meanings**.
- Include an elegant balance of *strengths, spiritual lessons, and personal magnetism*.

---`;

    const prompt = `Based on the numerology reading data, generate a **share-worthy, emotionally captivating cosmic summary**.

${focusPrompt}

### 2. FOCUS AREAS

Generate insights about:
- Life Purpose
- Spiritual Gifts
- Emotional Patterns
- Relationship Style
- Growth Opportunities
- Key Life Themes

---

### 3. PERSONALIZATION DATA

**Core Numbers**
- Base energy: ${diamondData.top}
- Life path  (Left): ${diamondData.left}
- Life path (Center): ${diamondData.center || 'N/A'}
- Life path (Right): ${diamondData.right}

${birthdaySection}

${compoundNumbersSection}


### 4. OUTPUT FORMAT

Please provide the response in **structured JSON** with short, beautiful, shareable text.

Include:
1. A unique **archetype name and tagline** based on their numerological and planetary profile.
   - Archetype title: max 30 characters (e.g., "The Cosmic Wanderer", "The Visionary Healer")
   - Tagline: max 80 characters
2. A poetic **one-liner** (max 120 characters) summarizing their essence.
3. A **short summary paragraph** (4–6 lines) describing their nature, purpose, and growth path.
   - **IMPORTANT**: Weave in the Birthday Planet influence naturally within the summary. Mention the planet name and how its energy shapes their personality and life path.
4. 3–5 **highlight words** (single words, capitalized) representing key traits.
5. 2–3 **visual cues** (emojis or glyphs) that fit the archetype's tone.

Tone: mystical, elegant, empowering. Avoid negativity; reframe challenges as growth themes.

Output JSON exactly like:
{
  "archetype": {"title": "...", "tagline": "..."},
  "oneLiner": "...",
  "summary": "...",
  "highlightWords": ["...", "...", "..."],
  "visualCue": ["...", "..."]
}`;

    // Call OpenAI with retry logic
    const reading = await retryableApiCall(
      async () => {
        console.log('Calling OpenAI API for reading generation...');

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a mystical numerology expert who provides personalized, inspiring insights based on numerological calculations. Your responses should be uplifting, meaningful, and specific to the person\'s numbers.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        });

        const responseText = completion.choices[0]?.message?.content;
        if (!responseText) {
          throw new Error('No response from OpenAI');
        }

        // Parse the JSON response
        const parsedResponse = JSON.parse(responseText);

        return {
          archetype: parsedResponse.archetype || {
            title: 'The Cosmic Soul',
            tagline: 'You carry light within your being.',
          },
          oneLiner: parsedResponse.oneLiner || 'Your cosmic blueprint reveals unique spiritual gifts.',
          summary: parsedResponse.summary || 'You possess natural intuitive abilities and a deep connection to the universal energies. Your path involves creative self-expression and sharing your unique gifts with the world. Trust in your inner wisdom as it guides you forward.',
          highlightWords: parsedResponse.highlightWords || ['Intuition', 'Creativity', 'Wisdom', 'Growth', 'Light'],
          visualCue: parsedResponse.visualCue || ['✨', '💫', '🌟'],
        };
      },
      {
        maxAttempts: 3,
        initialDelay: 1000,
      }
    );

    res.status(200).json(reading);
  } catch (error) {
    console.error('Error generating AI reading:', error);

    // Check if it's a timeout or service unavailable
    if (error.code === 'ETIMEDOUT' || error.response?.status >= 500) {
      return res.status(503).json({
        error: 'service_temporary_unavailable',
        message: 'The cosmic winds are swirling too strongly right now — try again in a few minutes.',
      });
    }

    // Return fallback reading on error
    return res.status(200).json(getPlaceholderReading());
  }
}

/**
 * Get placeholder reading when API is not configured or fails
 */
function getPlaceholderReading() {
  return {
    archetype: {
      title: 'The Cosmic Wanderer',
      tagline: 'You walk between worlds with wisdom and grace.',
    },
    oneLiner: 'Your cosmic blueprint reveals a natural leader with deep spiritual wisdom.',
    summary: 'You are destined for significant personal transformation and growth. Your natural charisma attracts opportunities for leadership roles, and your intuitive gifts guide you through life\'s journey. Trust in your inner wisdom as it illuminates your path forward.',
    highlightWords: ['Leadership', 'Wisdom', 'Transformation', 'Intuition', 'Charisma'],
    visualCue: ['✨', '🌟', '🔮'],
  };
}
