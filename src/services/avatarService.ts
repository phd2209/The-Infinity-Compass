// Avatar generation service using Replicate API via backend
import type { NumerologyData } from '@/utils/numerology';

export interface AvatarGenerationResult {
  imageUrl: string;
  prompt: string;
  cached: boolean;
}

/**
 * Map Life Path number to character archetype and visual style
 */
const getLifePathArchetype = (lifePathNumber: number): string => {
  const archetypes: Record<number, string> = {
    1: "confident leader standing tall, pioneering spirit, bold and independent",
    2: "gentle diplomat, harmonious and balanced, peaceful mediator",
    3: "creative artist with expressive energy, joyful and communicative",
    4: "grounded builder, practical and structured, stable foundation",
    5: "adventurous explorer, dynamic and free-spirited, world traveler",
    6: "nurturing caregiver, loving and compassionate, harmonious presence",
    7: "mystical seeker, spiritual and introspective, wisdom keeper",
    8: "powerful manifester, abundant and authoritative, successful achiever",
    9: "universal humanitarian, wise and compassionate, enlightened teacher",
    11: "spiritual illuminator, visionary and intuitive, divine messenger",
    22: "master builder of worlds, architect of dreams, grand visionary",
    33: "ascended master teacher, unconditional love embodied, spiritual guide"
  };

  return archetypes[lifePathNumber] || archetypes[9];
};

/**
 * Map Expression number to pose, expression, and energy
 */
const getExpressionStyle = (expressionNumber: number): string => {
  const styles: Record<number, string> = {
    1: "confident pose, determined expression, dynamic energy",
    2: "gentle stance, calm expression, serene energy",
    3: "expressive gesture, joyful smile, vibrant energy",
    4: "grounded posture, focused expression, steady energy",
    5: "dynamic movement, curious expression, adventurous energy",
    6: "open arms, warm smile, nurturing energy",
    7: "contemplative pose, knowing gaze, mystical energy",
    8: "powerful stance, authoritative expression, commanding energy",
    9: "expansive gesture, compassionate expression, universal energy"
  };

  return styles[expressionNumber % 10] || styles[9];
};

/**
 * Map Soul Urge number to color palette and aura
 */
const getSoulUrgeColors = (soulUrgeNumber: number): string => {
  const colors: Record<number, string> = {
    1: "bold reds and golds, fiery aura",
    2: "soft silvers and blues, gentle luminous aura",
    3: "vibrant yellows and oranges, radiant sunny aura",
    4: "earthy greens and browns, grounded emerald aura",
    5: "electric blues and purples, dynamic shifting aura",
    6: "soft pinks and rose golds, loving heart-centered aura",
    7: "deep purples and indigos, mystical violet aura",
    8: "rich golds and blacks, powerful golden aura",
    9: "rainbow iridescent colors, cosmic universal aura"
  };

  return colors[soulUrgeNumber % 10] || colors[9];
};

/**
 * Map Personality number to clothing, accessories, and aesthetic
 */
const getPersonalityAesthetic = (personalityNumber: number): string => {
  const aesthetics: Record<number, string> = {
    1: "modern sleek clothing, minimalist jewelry, contemporary style",
    2: "flowing soft fabrics, delicate jewelry, ethereal style",
    3: "colorful expressive clothing, artistic accessories, bohemian style",
    4: "structured classic clothing, practical jewelry, timeless style",
    5: "eclectic mixed clothing, unique accessories, worldly style",
    6: "harmonious elegant clothing, meaningful jewelry, refined style",
    7: "mystical robes, sacred geometry jewelry, spiritual style",
    8: "luxurious powerful clothing, statement jewelry, executive style",
    9: "universal timeless clothing, cosmic jewelry, transcendent style"
  };

  return aesthetics[personalityNumber % 10] || aesthetics[9];
};

/**
 * Get cosmic background based on birthday planet
 */
const getBirthdayBackground = (planetName?: string): string => {
  if (!planetName) return "cosmic starfield background, nebula clouds";

  const backgrounds: Record<string, string> = {
    'Sun': "brilliant golden sunburst background, radiant light",
    'Moon': "silvery moonlit night background, gentle lunar glow",
    'Mars': "red warrior planet background, dynamic energy field",
    'Mercury': "swift messenger background, communication symbols",
    'Jupiter': "expansive purple cosmic background, abundant energy",
    'Venus': "loving rose-pink background, beauty and harmony",
    'Saturn': "structured crystalline background, sacred geometry",
    'Uranus': "electric innovative background, revolutionary energy",
    'Neptune': "dreamy mystical ocean background, spiritual depths",
    'Pluto': "transformative dark cosmic background, phoenix energy"
  };

  return backgrounds[planetName] || backgrounds['Sun'];
};

/**
 * Generate comprehensive prompt for cosmic avatar based on numerology data
 */
export const generateAvatarPrompt = (data: NumerologyData): string => {
  // Get the first value from nameValues as the primary numerology number
  const lifePathNumber = data.diamond_upper_value;
  const expressionNumber = data.nameValues[0] as number;
  const soulUrgeNumber = data.nameValues[data.nameValues.length - 1] as number;
  const personalityNumber = data.diamond_lower_value;
  const planetName = data.birthdayInterpretation?.planetName;

  const archetype = getLifePathArchetype(lifePathNumber);
  const expressionStyle = getExpressionStyle(expressionNumber);
  const colors = getSoulUrgeColors(soulUrgeNumber);
  const aesthetic = getPersonalityAesthetic(personalityNumber);
  const background = getBirthdayBackground(planetName);

  // Construct the comprehensive prompt
  const prompt = `Portrait of a mystical cosmic being, ${archetype}, ${expressionStyle},
${colors}, ${aesthetic}, ${background},
ethereal and magical atmosphere, divine light, sacred energy,
portrait photography style, centered composition, facing camera,
highly detailed face, luminous eyes, spiritual essence,
fantasy art, digital painting, professional quality,
soft lighting with cosmic glow, otherworldly beauty,
transcendent presence, numerology symbolism subtle in background`;

  // Clean up the prompt (remove extra whitespace)
  return prompt.replace(/\s+/g, ' ').trim();
};

/**
 * Generate cosmic avatar using Replicate API via backend
 */
export const generateCosmicAvatar = async (
  data: NumerologyData,
  forceRegenerate: boolean = false
): Promise<AvatarGenerationResult> => {
  console.log('Avatar Service - Generating cosmic avatar via backend API');

  // Generate the prompt
  const prompt = generateAvatarPrompt(data);
  console.log('Generated prompt:', prompt);

  // Create a cache key based on numerology data
  const cacheKey = `avatar_${data.diamond_upper_value}_${data.nameValues.join('_')}_${data.diamond_lower_value}`;

  // Check localStorage cache unless force regenerate
  if (!forceRegenerate) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      console.log('Using cached avatar');
      return {
        imageUrl: cached,
        prompt,
        cached: true
      };
    }
  }

  try {
    // Call backend API to generate avatar
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/generate-avatar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        numerologyData: data
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Avatar generation failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (!result.imageUrl) {
      throw new Error('No image URL returned from API');
    }

    // Cache the result
    localStorage.setItem(cacheKey, result.imageUrl);

    console.log('Avatar generated successfully:', result.imageUrl);

    return {
      imageUrl: result.imageUrl,
      prompt,
      cached: false
    };
  } catch (error) {
    console.error('Error generating avatar via backend:', error);

    // Return a fallback placeholder image
    // In production, you might want to have a set of default cosmic avatars
    const fallbackUrl = '/placeholder-avatar.png'; // You'll need to add this to public folder

    return {
      imageUrl: fallbackUrl,
      prompt,
      cached: false
    };
  }
};

/**
 * Clear cached avatar for regeneration
 */
export const clearAvatarCache = (data: NumerologyData): void => {
  const cacheKey = `avatar_${data.diamond_upper_value}_${data.nameValues.join('_')}_${data.diamond_lower_value}`;
  localStorage.removeItem(cacheKey);
  console.log('Avatar cache cleared');
};
