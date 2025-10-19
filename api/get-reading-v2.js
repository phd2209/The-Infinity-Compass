import cache, { CacheKeys, TTL } from './utils/cache.js';
import { RateLimiter } from './utils/rateLimiter.js';

/**
 * Get cached reading or generate new one with IMPROVED PROMPT (v2)
 * POST /api/get-reading-v2
 * Body: { name, birthdate, diamondData, nftId?, showName? }
 *
 * This endpoint uses an enhanced prompt with expanded output fields
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

    // Generate cache key with v2 prefix
    const cacheKey = `v2:${CacheKeys.reading(
      normalizedName,
      normalizedDate,
      normalizedNftId,
      showName
    )}`;

    console.log('Checking cache for reading v2:', cacheKey);

    // Check cache first
    const cachedReading = cache.get(cacheKey);
    if (cachedReading) {
      console.log('Cache hit! Returning cached reading v2');
      return res.status(200).json({
        ...cachedReading,
        cached: true,
        version: 'v2',
        cacheKey: cacheKey.substring(0, 16) + '...', // Return partial key for debugging
      });
    }

    console.log('Cache miss. Generating new reading v2...');
    console.log('\n========== DIAMOND DATA RECEIVED ==========');
    console.log('Name:', name);
    console.log('Birthdate:', birthdate);
    console.log('Diamond Data:', JSON.stringify(diamondData, null, 2));
    console.log('===========================================\n');

    // Cache miss - generate new reading with v2 prompt
    const reading = await generateReadingV2(diamondData);

    // Store in cache
    cache.set(cacheKey, reading, TTL.READING);
    console.log(`Reading v2 cached for ${TTL.READING} seconds`);

    return res.status(200).json({
      ...reading,
      cached: false,
      version: 'v2',
      cacheKey: cacheKey.substring(0, 16) + '...', // Return partial key for debugging
    });
  } catch (error) {
    console.error('Error in get-reading-v2:', error);

    return res.status(500).json({
      error: 'internal_error',
      message: 'Failed to generate reading. Please try again.',
    });
  }
}

/**
 * Generate reading with IMPROVED PROMPT V2
 * Includes expanded fields: loveStyle, careerGifts, spiritualGifts, growthPath, fortuneInsight
 */
async function generateReadingV2(diamondData) {
  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    console.log('OpenAI API key not configured, returning placeholder data');
    return getPlaceholderReadingV2();
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

---

### 1. YOUR ASSIGNMENT

Create a reading that synthesizes these energies into ONE unified cosmic blueprint:

**Base Energy (${diamondData.top})** - Ruled by ${diamondData.birthdayInterpretation?.planetName || 'cosmic forces'}
- This is their emotional core and personality foundation

**Life Path Numbers:**
- Left: ${diamondData.left}
${diamondData.center && diamondData.center !== 'N/A' && diamondData.center !== null ? `- Center: ${diamondData.center}` : ''}
${diamondData.center2 ? `- Center 2: ${diamondData.center2}` : ''}
- Right: ${diamondData.right}

These represent their journey, purpose, and destiny path${diamondData.center && diamondData.center !== 'N/A' && diamondData.center !== null ? ' - with the center path(s) bridging and integrating the energies' : ''}.

**CRITICAL:** Weave ALL these numbers together into a unified, inspiring narrative. Don't just list traits - show how they work together to create this person's unique magic.

---

### 2. REQUIRED ELEMENTS IN YOUR SUMMARY

Your summary paragraph MUST include:
✅ The planet "${diamondData.birthdayInterpretation?.planetName || 'cosmic energy'}" and how it shapes their nature
✅ Specific traits from their life path numbers (see "Life path extra info" section)
✅ At least ONE concrete gift/strength from the data below (be specific, not generic)
✅ Reference to love style, career gifts, OR spiritual abilities
✅ An empowering growth theme (reframe challenges as evolution)

**Make them feel SEEN and SPECIAL.** Use actual details from their data.

---

### 3. DATA TO DRAW FROM

Synthesize insights from these areas:
- Life Purpose & Destiny (compound number descriptions)
- Spiritual & Intuitive Gifts (temperament profile)
- Emotional Nature (planet description, temperament)
- Love & Relationship Style (Love & Relationships section)
- Career Strengths & Talents (Career & Work Style section)
- Growth Themes (reframe challenges as opportunities)
- Fortune Patterns (lucky numbers, days, cosmic support)

**Read ALL data carefully, then choose the most beautiful, specific details.**

---

### 4. PERSONALIZATION DATA

**Core Numbers**
- Base energy: ${diamondData.top}
- Life path (Left): ${diamondData.left}
${diamondData.center2 ? `- Life path (Center): ${diamondData.center}\n- Life path (Center 2): ${diamondData.center2}` : (diamondData.center && diamondData.center !== 'N/A' && diamondData.center !== null ? `- Life path (Center): ${diamondData.center}` : '- Life path (Center): N/A')}
- Life path (Right): ${diamondData.right}

${birthdaySection}

${compoundNumbersSection}

---

### 5. OUTPUT FORMAT (JSON)

Return exactly this structure:

{
  "archetype": {
    "title": "...",     // Max 30 chars. Creative name based on their numbers. Examples: "The Moonlit Visionary", "The Empathic Creator"
    "tagline": "..."    // Max 80 chars. Poetic phrase capturing their essence
  },

  "oneLiner": "...",    // Max 120 chars. Beautiful one-sentence summary

  "summary": "...",     // 4-6 sentences. THE MOST IMPORTANT FIELD.
                        // MUST mention planet "${diamondData.birthdayInterpretation?.planetName || 'cosmic energy'}"
                        // MUST use specific traits from the data (not generic)
                        // MUST feel personal, inspiring, shareable

  "highlightWords": ["...", "...", "..."],  // 3-5 single words (capitalized). Most resonant traits from their data.

  "visualCue": ["...", "..."],  // 2-3 emojis matching their archetype/planet

  "loveStyle": "...",           // 2-3 sentences. Use "Love & Relationships" data. Mystical & empowering tone.

  "careerGifts": "...",         // 2-3 sentences. Use "Career & Work Style" data. Describe vocational strengths.

  "spiritualGifts": "...",      // 2-3 sentences. Use "Temperament Profile" data. Frame abilities as sacred gifts.

  "growthPath": "...",          // 2-3 sentences. Reframe challenges from data as soul lessons. Empowering, not negative.

  "fortuneInsight": "..."       // 1-2 sentences. Use "Fortune & Luck" data. Create magical statement about cosmic support.
}

**TONE REQUIREMENTS:**
- Mystical yet believable
- Elegant, not cheesy
- Empowering and uplifting
- Specific to THEIR data (avoid generic horoscope language)
- NO negativity - challenges become "growth opportunities" or "soul lessons"
- Complete sentences with proper grammar
- Flowing, beautiful prose (no bullet points)

---

**IMPORTANT:** All fields are required. Write in complete, flowing sentences. Make every word count - this is their cosmic story.`;

    // DEBUG: Log the complete prompt being sent to OpenAI
    console.log('\n========== OPENAI PROMPT (V2) ==========');
    console.log(prompt);
    console.log('========================================\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a mystical numerology expert who provides personalized, inspiring insights based on numerological calculations. Your responses should be uplifting, meaningful, and specific to the person\'s numbers. You MUST return valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: "json_object" }, // Force valid JSON output
      max_tokens: 700, // Increased for expanded fields
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // DEBUG: Log the response from OpenAI
    console.log('\n========== OPENAI RESPONSE (V2) ==========');
    console.log(responseText);
    console.log('==========================================\n');

    const parsedResponse = JSON.parse(responseText);

    // Return with expanded fields, with fallbacks for each
    return {
      archetype: parsedResponse.archetype || {
        title: 'The Cosmic Soul',
        tagline: 'You carry light within your being.',
      },
      oneLiner: parsedResponse.oneLiner || 'Your cosmic blueprint reveals unique spiritual gifts.',
      summary: parsedResponse.summary || 'You possess natural intuitive abilities and a deep connection to the universal energies.',
      highlightWords: parsedResponse.highlightWords || ['Intuition', 'Creativity', 'Wisdom', 'Growth', 'Light'],
      visualCue: parsedResponse.visualCue || ['✨', '💫', '🌟'],
      loveStyle: parsedResponse.loveStyle || 'You bring deep emotional richness to your relationships, valuing authenticity and soulful connection.',
      careerGifts: parsedResponse.careerGifts || 'Your creative talents and intuitive insights position you as a natural guide and visionary in your field.',
      spiritualGifts: parsedResponse.spiritualGifts || 'You possess a rare ability to sense energies and understand the deeper patterns that connect all things.',
      growthPath: parsedResponse.growthPath || 'Your journey involves learning to balance your sensitivity with healthy boundaries, transforming empathy into empowered compassion.',
      fortuneInsight: parsedResponse.fortuneInsight || 'The universe supports your path with abundant cosmic guidance, especially during key moments of transformation.',
    };
  } catch (error) {
    console.error('Error generating reading v2:', error);
    return getPlaceholderReadingV2();
  }
}

/**
 * Placeholder reading for fallback (v2 with expanded fields)
 */
function getPlaceholderReadingV2() {
  return {
    archetype: {
      title: 'The Cosmic Wanderer',
      tagline: 'You walk between worlds with wisdom and grace.',
    },
    oneLiner: 'Your cosmic blueprint reveals a natural leader with deep spiritual wisdom.',
    summary: 'You are destined for significant personal transformation and growth. Your natural charisma attracts opportunities for leadership roles, and your intuitive gifts guide you through life\'s journey. Trust in your inner wisdom as it illuminates your path forward.',
    highlightWords: ['Leadership', 'Wisdom', 'Transformation', 'Intuition', 'Charisma'],
    visualCue: ['✨', '🌟', '🔮'],
    loveStyle: 'You bring magnetic presence and deep emotional wisdom to your relationships. Your partners are drawn to your authentic nature and your ability to create sacred space for genuine connection.',
    careerGifts: 'You excel in roles that allow you to lead with vision and inspire others toward transformation. Your natural charisma and strategic thinking make you a powerful force in any professional setting.',
    spiritualGifts: 'You possess innate intuitive abilities that allow you to perceive truths beyond the surface. Your connection to universal wisdom guides you in both personal and collective matters.',
    growthPath: 'Your soul journey involves learning to balance your powerful presence with vulnerability, discovering that true strength comes from embracing all aspects of yourself.',
    fortuneInsight: 'The cosmos aligns in your favor during times of bold action. Trust the signs and synchronicities that appear on your path.',
  };
}
