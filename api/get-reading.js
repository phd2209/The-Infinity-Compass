import cache, { CacheKeys, TTL } from './utils/cache.js';
import { RateLimiter, rateLimitMiddleware } from './utils/rateLimiter.js';

// Import the generate-reading handler
// Note: In production with proper module setup, this would work
// For now, we'll inline the generation logic or use a shared module

/**
 * Get cached reading or generate new one
 * POST /api/get-reading
 * Body: { name, birthdate, diamondData, nftId?, showName? }
 *
 * This is the main endpoint the frontend should call
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, birthdate, diamondData, nftId = 'default', showName = false } = req.body;

  // Validate required fields
  if (!name || !birthdate || !diamondData) {
    return res.status(400).json({
      error: 'invalid_request',
      message: 'Missing required fields: name, birthdate, diamondData',
    });
  }

  // Apply rate limiting
  const limiter = new RateLimiter(5, 1); // 5 requests per minute
  const identifier = req.body?.wallet || name || req.ip || 'unknown';
  const rateLimitResult = limiter.check(identifier);

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', limiter.maxRequests);
  res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
  res.setHeader('X-RateLimit-Reset', Math.floor(rateLimitResult.resetTime / 1000));

  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      error: 'rate_limit_exceeded',
      message: 'The cosmic winds are swirling too strongly right now — try again in a few minutes.',
      retryAfter: Math.floor((rateLimitResult.resetTime - Date.now()) / 1000),
    });
  }

  try {
    // Normalize inputs for consistent cache keys
    const normalizedName = name.trim().toLowerCase();
    const normalizedDate = birthdate.trim();
    const normalizedNftId = nftId.trim();

    // Generate cache key
    const cacheKey = CacheKeys.reading(
      normalizedName,
      normalizedDate,
      normalizedNftId,
      showName
    );

    console.log('Checking cache for reading:', cacheKey);

    // Check cache first
    const cachedReading = cache.get(cacheKey);
    if (cachedReading) {
      console.log('Cache hit! Returning cached reading');
      return res.status(200).json({
        ...cachedReading,
        cached: true,
        cacheKey: cacheKey.substring(0, 16) + '...', // Return partial key for debugging
      });
    }

    console.log('Cache miss. Generating new reading...');

    // Cache miss - generate new reading
    // We'll call the generation logic inline here
    const reading = await generateReading(diamondData);

    // Store in cache
    cache.set(cacheKey, reading, TTL.READING);
    console.log(`Reading cached for ${TTL.READING} seconds`);

    return res.status(200).json({
      ...reading,
      cached: false,
      cacheKey: cacheKey.substring(0, 16) + '...', // Return partial key for debugging
    });
  } catch (error) {
    console.error('Error in get-reading:', error);

    return res.status(500).json({
      error: 'internal_error',
      message: 'Failed to generate reading. Please try again.',
    });
  }
}

/**
 * Generate reading logic (extracted from generate-reading.js)
 * This avoids circular dependencies in serverless functions
 */
async function generateReading(diamondData, focusArea = 'general') {
  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    console.log('OpenAI API key not configured, returning placeholder data');
    return getPlaceholderReading();
  }

  try {
    // Dynamic import of OpenAI (works in serverless)
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });

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

    const prompt = `Based on the numerology reading data, generate a **share-worthy, emotionally captivating cosmic summary**.

**Goal:**
Create a mystical yet grounded reading that feels *beautiful, collectible, and personal* — something users would be proud to share publicly (e.g., "This is so me!").

### STRUCTURE

Provide a BALANCED READING covering all major life areas:
- Interpret the **Base Energy (${diamondData.top})** for core personality and emotional signature.
- Summarize the **Life Path Numbers (${diamondData.left}${diamondData.center && diamondData.center !== 'N/A' && diamondData.center !== null ? `, ${diamondData.center}` : ''}${diamondData.center2 ? `, ${diamondData.center2}` : ''}, ${diamondData.right})** for purpose, potential, and life direction.
- Integrate **Birthday Planet** influence and **compound number meanings**.
- Include an elegant balance of *strengths, spiritual lessons, and personal magnetism*.

### PERSONALIZATION DATA

**Core Numbers**
- Base energy: ${diamondData.top}
- Life path (Left): ${diamondData.left}
${diamondData.center2 ? `- Life path (Center 1): ${diamondData.center}\n- Life path (Center 2): ${diamondData.center2}` : (diamondData.center && diamondData.center !== 'N/A' && diamondData.center !== null ? `- Life path (Center): ${diamondData.center}` : '')}
- Life path (Right): ${diamondData.right}

${birthdaySection}

${compoundNumbersSection}

### OUTPUT FORMAT

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

    const parsedResponse = JSON.parse(responseText);

    return {
      archetype: parsedResponse.archetype || {
        title: 'The Cosmic Soul',
        tagline: 'You carry light within your being.',
      },
      oneLiner: parsedResponse.oneLiner || 'Your cosmic blueprint reveals unique spiritual gifts.',
      summary: parsedResponse.summary || 'You possess natural intuitive abilities and a deep connection to the universal energies.',
      highlightWords: parsedResponse.highlightWords || ['Intuition', 'Creativity', 'Wisdom', 'Growth', 'Light'],
      visualCue: parsedResponse.visualCue || ['✨', '💫', '🌟'],
    };
  } catch (error) {
    console.error('Error generating reading:', error);
    return getPlaceholderReading();
  }
}

/**
 * Placeholder reading for fallback
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
