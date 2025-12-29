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
 * Get age descriptor based on birth date
 */
const getAgeAppearance = (birthDate?: Date): string => {
  if (!birthDate) return '';

  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  if (age < 25) {
    return 'youthful, in their early twenties';
  } else if (age < 35) {
    return 'young adult, in their late twenties to early thirties';
  } else if (age < 45) {
    return 'mature adult, in their late thirties to early forties';
  } else if (age < 55) {
    return 'distinguished, in their late forties to early fifties';
  } else if (age < 65) {
    return 'wise and seasoned, in their late fifties to early sixties';
  } else {
    return 'elder sage, with graceful aging and wisdom in their features';
  }
};

/**
 * Get gender-specific appearance descriptor for avatar prompt
 */
const getGenderAppearance = (gender?: 'woman' | 'man' | 'non-binary', birthDate?: Date): string => {
  const ageDesc = getAgeAppearance(birthDate);
  const ageClause = ageDesc ? `, ${ageDesc}` : '';

  switch (gender) {
    case 'woman':
      return `beautiful woman${ageClause}, feminine features, elegant`;
    case 'man':
      return `handsome man${ageClause}, masculine features, strong`;
    case 'non-binary':
      return `androgynous person${ageClause}, balanced features, ethereal`;
    default:
      return 'mystical being, otherworldly features';
  }
};

/**
 * Generate comprehensive prompt for cosmic avatar based on numerology data
 */
export const generateAvatarPrompt = (
  data: NumerologyData,
  gender?: 'woman' | 'man' | 'non-binary',
  birthDate?: Date
): string => {
  // Get the first value from nameValues as the primary numerology number
  const lifePathNumber = data.diamond_upper_value;
  const expressionNumber = data.nameValues[0] as number;
  const soulUrgeNumber = data.nameValues[data.nameValues.length - 1] as number;
  const personalityNumber = typeof data.diamond_lower_value === 'number'
    ? data.diamond_lower_value
    : parseInt(String(data.diamond_lower_value), 10) || 9;
  const planetName = data.birthdayInterpretation?.planetName;

  const genderAppearance = getGenderAppearance(gender, birthDate);
  const archetype = getLifePathArchetype(lifePathNumber);
  const expressionStyle = getExpressionStyle(expressionNumber);
  const colors = getSoulUrgeColors(soulUrgeNumber);
  const aesthetic = getPersonalityAesthetic(personalityNumber);
  const background = getBirthdayBackground(planetName);

  // Construct the comprehensive prompt
  const prompt = `Portrait of a ${genderAppearance}, mystical cosmic being, ${archetype}, ${expressionStyle},
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
  forceRegenerate: boolean = false,
  gender?: 'woman' | 'man' | 'non-binary',
  birthDate?: Date
): Promise<AvatarGenerationResult> => {
  console.log('Avatar Service - Generating cosmic avatar via backend API');

  // Generate the prompt with gender and birthDate for age
  const prompt = generateAvatarPrompt(data, gender, birthDate);
  console.log('Generated prompt:', prompt);

  // Create a cache key based on numerology data, gender, and birth year (for age range)
  const birthYear = birthDate ? birthDate.getFullYear() : 'unknown';
  const cacheKey = `avatar_${data.diamond_upper_value}_${data.nameValues.join('_')}_${data.diamond_lower_value}_${gender || 'default'}_${birthYear}`;

  // Check localStorage cache unless force regenerate
  // Replicate URLs expire after ~24 hours, so we add expiry check
  if (!forceRegenerate) {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const { imageUrl, timestamp } = JSON.parse(cachedData);
        const cacheAge = Date.now() - timestamp;
        const MAX_CACHE_AGE = 20 * 60 * 60 * 1000; // 20 hours (before Replicate's ~24h expiry)

        if (cacheAge < MAX_CACHE_AGE && imageUrl) {
          console.log('Using cached avatar (age:', Math.round(cacheAge / 1000 / 60), 'minutes)');
          return {
            imageUrl,
            prompt,
            cached: true
          };
        } else {
          console.log('Cached avatar expired, regenerating...');
          localStorage.removeItem(cacheKey);
        }
      } catch {
        // Old format cache (just URL string), remove it
        console.log('Old cache format detected, removing...');
        localStorage.removeItem(cacheKey);
      }
    }
  }

  try {
    // Call backend API to generate avatar
    // Use relative URL so Vite's proxy can handle the request
    const response = await fetch('/api/generate-avatar', {
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
      console.error('API Error Response:', errorText);
      throw new Error(`Avatar generation failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('API Response:', JSON.stringify(result, null, 2));

    if (!result.imageUrl) {
      console.error('No imageUrl in response:', result);
      throw new Error(`No image URL returned from API. Response: ${JSON.stringify(result)}`);
    }

    // Cache the result with timestamp for expiry checking
    localStorage.setItem(cacheKey, JSON.stringify({
      imageUrl: result.imageUrl,
      timestamp: Date.now()
    }));

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
