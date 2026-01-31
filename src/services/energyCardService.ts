// Energy Card generation service using Replicate API via backend
// Generates tarot-style card artwork for each energy number

export interface EnergyCardGenerationResult {
  imageUrl: string;
  prompt: string;
  cached: boolean;
}

/**
 * Map energy number to visual prompt elements based on its meaning
 */
const getEnergyVisualPrompt = (
  energyNumber: string,
  caption: string,
  _description: string
): string => {
  // Extract the base number for visual mapping
  const baseNumber = parseInt(energyNumber.split('/')[0]) || parseInt(energyNumber);
  // Base visual elements mapped to numerology meanings
  const visualElements: Record<number, string> = {
    // Single digits (1-9)
    1: "a powerful figure standing alone at the peak of a mountain, golden sun rising, new beginnings energy, pioneering spirit, leadership aura",
    2: "two figures in harmony, yin-yang balance, gentle moonlight, partnership energy, diplomatic presence, flowing water reflection",
    3: "creative explosion of colors, artistic expression, joyful dancing figure, musical notes becoming stars, expressive communication",
    4: "solid foundation being built, structured sacred geometry, stable earth energy, master builder at work, practical manifestation",
    5: "figure breaking free from chains, adventure and travel symbols, dynamic wind energy, transformation butterflies, freedom spirit",
    6: "nurturing heart-centered figure, home and family symbols, roses blooming, harmonious domestic scene, loving embrace",
    7: "mystical seeker in meditation, spiritual eye opening, sacred knowledge scrolls, introspective cave of wisdom, cosmic truth",
    8: "powerful manifestor with abundance flowing, infinity symbol, material and spiritual wealth, authoritative presence, success energy",
    9: "enlightened humanitarian, universal love radiating, completion cycle, letting go of the old, compassionate teacher",

    // Compound numbers (10-22)
    10: "wheel of fortune turning, new cycle beginning, karmic completion, fresh start energy, destiny unfolding",
    11: "illuminated visionary, twin pillars of light, master intuition, spiritual awakening, divine messenger",
    12: "figure surrendering to higher wisdom, sacrifice for growth, mental fog clearing, trust emerging from chaos",
    13: "phoenix rising from transformation, death and rebirth, profound change, ending leading to new beginning",
    14: "balanced alchemist mixing elements, temperance and moderation, harmonious blend, patient transformation",
    15: "figure confronting shadow self, temptation and liberation, breaking free from illusion, material vs spiritual",
    16: "tower struck by lightning, sudden revelation, old structures crumbling, liberation through destruction, awakening flash",
    17: "star maiden pouring cosmic water, hope renewed, inspiration flowing, healing starlight, wishes manifesting",
    18: "figure navigating moonlit path, intuition guiding through illusion, dreams and subconscious, mystery unfolding",
    19: "radiant sun figure, vitality and success, clarity achieved, joy and achievement, inner child awakening",
    20: "cosmic judgment call, spiritual awakening, resurrection energy, life review, higher calling answered",
    21: "dancer within cosmic mandala, world completion, achievement of goals, integration and wholeness, celebration",
    22: "master architect building grand vision, unlimited potential, large-scale manifestation, cosmic builder",

    // Higher compound numbers (23-31)
    23: "messenger with wings of light, words becoming reality, creative communication, social butterfly surrounded by swirling letters and symbols",
    24: "guardian of the hearth, protective family energy, domestic harmony, figure surrounded by loving home and garden abundance",
    25: "sage receiving divine download, spiritual antenna, mystical wisdom keeper, figure with cosmic knowledge streaming from above",
    26: "golden throne of material mastery, business empire builder, karmic wealth, figure balancing scales of power and responsibility",
    27: "lighthouse keeper illuminating the way, spiritual leadership, guiding light for others, compassionate wisdom teacher on cosmic shore",
    28: "crowned pioneer blazing new trails, independent authority, self-made leader, figure standing at crossroads choosing bold path",
    29: "dreamer walking between worlds, master of intuition, spiritual bridge builder, figure with one foot in material and one in spiritual realm",
    30: "cosmic artist creating worlds, divine creative expression, playful manifestation, figure painting reality with stardust",
    31: "ancient builder with modern vision, practical magic, structured creativity, figure constructing sacred temple with golden tools"
  };

  const baseVisual = visualElements[baseNumber] || visualElements[9];

  // Incorporate the caption and key themes from description
  const captionTheme = caption.toLowerCase().includes('sacrifice') ? 'surrender and release' :
                       caption.toLowerCase().includes('complet') ? 'endings and fulfillment' :
                       caption.toLowerCase().includes('power') ? 'strength and authority' :
                       caption.toLowerCase().includes('creat') ? 'artistic expression' :
                       caption.toLowerCase().includes('spirit') ? 'mystical awakening' :
                       'cosmic transformation';

  return `${baseVisual}, theme of ${captionTheme}`;
};

/**
 * Generate comprehensive prompt for energy card based on numerology data
 */
export const generateEnergyCardPrompt = (
  energyNumber: string,
  caption: string,
  shortDescription: string
): string => {
  const visualElements = getEnergyVisualPrompt(energyNumber, caption, shortDescription);

  // Extract key emotional/energetic words from description
  const descWords = shortDescription.toLowerCase();
  const emotionalTone = descWords.includes('intens') ? 'intense and powerful' :
                        descWords.includes('peace') ? 'peaceful and serene' :
                        descWords.includes('chaos') ? 'dynamic and swirling' :
                        descWords.includes('clarity') ? 'clear and illuminated' :
                        descWords.includes('transform') ? 'metamorphic and changing' :
                        'mystical and ethereal';

  const prompt = `Mystical tarot card illustration, dark indigo and purple cosmic background,
${visualElements},
${emotionalTone} atmosphere,
golden sacred geometry accents, stars and cosmic dust,
art nouveau style with intricate golden line work and celestial symbols,
swirling cosmic energy, ethereal glow,
vertical tarot card composition, centered focal point,
no text, no numbers, no letters, no words, no frame, no border,
mystical spiritual aesthetic, professional card game art quality,
highly detailed, luminous magical atmosphere`;

  return prompt.replace(/\s+/g, ' ').trim();
};

/**
 * Generate energy card using Replicate API via backend
 */
export const generateEnergyCard = async (
  energyNumber: string,
  caption: string,
  shortDescription: string,
  forceRegenerate: boolean = false
): Promise<EnergyCardGenerationResult> => {
  const prompt = generateEnergyCardPrompt(energyNumber, caption, shortDescription);

  // Create cache key based on energy number (cards are the same for same number)
  const cacheKey = `energy_card_${energyNumber.replace('/', '_')}`;

  // Check localStorage cache unless force regenerate
  if (!forceRegenerate) {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const { imageUrl, timestamp } = JSON.parse(cachedData);
        const cacheAge = Date.now() - timestamp;
        const MAX_CACHE_AGE = 1 * 60 * 60 * 1000; // 1 hour (Replicate URLs can expire quickly)

        if (cacheAge < MAX_CACHE_AGE && imageUrl) {
          return {
            imageUrl,
            prompt,
            cached: true
          };
        } else {
          localStorage.removeItem(cacheKey);
        }
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }
  }

  try {
    // Call backend API to generate energy card
    const response = await fetch('/api/generate-energy-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        energyNumber,
        caption
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Energy card generation failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    if (!result.imageUrl) {
      console.error('No imageUrl in response:', result);
      throw new Error(`No image URL returned from API. Response: ${JSON.stringify(result)}`);
    }

    // Try to convert image to base64 for permanent storage (Replicate URLs expire)
    let finalImageUrl = result.imageUrl;

    try {
      const base64Image = await convertImageToBase64(result.imageUrl);

      // Try to cache the base64 image data
      try {
        localStorage.setItem(cacheKey, JSON.stringify({
          imageUrl: base64Image,
          timestamp: Date.now()
        }));
        finalImageUrl = base64Image;
      } catch (storageError) {
        // localStorage quota exceeded - use URL directly (will work for this session)
        console.warn('localStorage quota exceeded, using URL directly:', storageError);
        // Clear old energy card caches to make room for future cards
        clearOldEnergyCardCaches();
      }
    } catch (conversionError) {
      console.warn('Failed to convert to base64, using URL:', conversionError);
    }

    return {
      imageUrl: finalImageUrl,
      prompt,
      cached: false
    };
  } catch (error) {
    console.error('Error generating energy card via backend:', error);

    // Return null to indicate failure - component should handle fallback
    throw error;
  }
};

/**
 * Clear cached energy card for regeneration
 */
export const clearEnergyCardCache = (energyNumber: string): void => {
  const cacheKey = `energy_card_${energyNumber.replace('/', '_')}`;
  localStorage.removeItem(cacheKey);
};

/**
 * Clear all old energy card caches to free up localStorage space
 */
const clearOldEnergyCardCaches = (): void => {
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('energy_card_')) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
};

/**
 * Convert image URL to base64 data URL for permanent storage
 * This avoids Replicate URL expiration issues
 */
const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    // Get the blob
    const blob = await response.blob();

    // Convert blob to base64 using FileReader
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = () => {
        reject(new Error('Failed to convert image to base64'));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};
