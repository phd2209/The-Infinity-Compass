// Talisman images - import statically for Vite bundling
import talisman1 from '@/assets/pendents/talisman-1-clear-quartz.png';
import talisman2 from '@/assets/pendents/talisman-2-moonstone.png';
import talisman3 from '@/assets/pendents/talisman-3-carnelian.png';
import talisman4 from '@/assets/pendents/talisman-4-black-tourmaline.png';
import talisman5 from '@/assets/pendents/talisman-5-aquamarine.png';
import talisman6 from '@/assets/pendents/talisman-6-rose-quartz-silver.png';
import talisman7 from '@/assets/pendents/talisman-7-amethyst.png';
import talisman8 from '@/assets/pendents/talisman-8-citrine.png';
import talisman9 from '@/assets/pendents/talisman-9-rose-quartz-gold.png';

export interface TalismanConfig {
  birthNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  crystal: string;
  metal: 'sterling-silver' | 'gold-vermeil';
  metalDisplay: string;
  meaning: string;
  description: string;
  imageUrl: string;
  price: number;
}

/**
 * Crystal associations based on numerology birth number (Life Path).
 * Each crystal is chosen to resonate with the spiritual energy of the number.
 */
export const TALISMAN_ASSOCIATIONS: Record<number, TalismanConfig> = {
  1: {
    birthNumber: 1,
    crystal: 'Clear Quartz',
    metal: 'gold-vermeil',
    metalDisplay: '18K Gold Vermeil',
    meaning: 'clarity and new beginnings',
    description: 'The master healer crystal amplifies your natural leadership energy and brings clarity to your path. Clear Quartz resonates with your pioneering spirit, enhancing focus and manifesting your ambitious visions into reality.',
    imageUrl: talisman1,
    price: 169
  },
  2: {
    birthNumber: 2,
    crystal: 'Moonstone',
    metal: 'sterling-silver',
    metalDisplay: 'Sterling Silver (.925)',
    meaning: 'intuition and harmony',
    description: 'This ethereal stone enhances your intuitive gifts and brings emotional balance to relationships. Moonstone\'s gentle energy mirrors your diplomatic nature, fostering deeper connections and inner peace.',
    imageUrl: talisman2,
    price: 159
  },
  3: {
    birthNumber: 3,
    crystal: 'Carnelian',
    metal: 'gold-vermeil',
    metalDisplay: '18K Gold Vermeil',
    meaning: 'joy and self-expression',
    description: 'This vibrant stone ignites your creative fire and amplifies your natural charisma. Carnelian fuels your artistic expression, bringing confidence to share your unique gifts with the world.',
    imageUrl: talisman3,
    price: 169
  },
  4: {
    birthNumber: 4,
    crystal: 'Black Tourmaline',
    metal: 'sterling-silver',
    metalDisplay: 'Sterling Silver (.925)',
    meaning: 'grounding and protection',
    description: 'This powerful protective stone anchors your disciplined energy and shields you from negativity. Black Tourmaline supports your methodical nature, providing stability as you build lasting foundations.',
    imageUrl: talisman4,
    price: 159
  },
  5: {
    birthNumber: 5,
    crystal: 'Aquamarine',
    metal: 'sterling-silver',
    metalDisplay: 'Sterling Silver (.925)',
    meaning: 'freedom and courage',
    description: 'This serene ocean stone embodies your adventurous spirit and thirst for freedom. Aquamarine calms turbulent emotions while empowering you to embrace change and explore new horizons.',
    imageUrl: talisman5,
    price: 159
  },
  6: {
    birthNumber: 6,
    crystal: 'Rose Quartz',
    metal: 'sterling-silver',
    metalDisplay: 'Sterling Silver (.925)',
    meaning: 'love and compassion',
    description: 'The stone of unconditional love resonates deeply with your nurturing heart. Rose Quartz opens your heart chakra, enhancing your natural ability to create harmony and heal those around you.',
    imageUrl: talisman6,
    price: 159
  },
  7: {
    birthNumber: 7,
    crystal: 'Amethyst',
    metal: 'sterling-silver',
    metalDisplay: 'Sterling Silver (.925)',
    meaning: 'spirituality and wisdom',
    description: 'This mystical purple stone enhances your profound connection to higher realms. Amethyst deepens your spiritual insights and supports the introspective journey that defines your soul\'s path.',
    imageUrl: talisman7,
    price: 159
  },
  8: {
    birthNumber: 8,
    crystal: 'Citrine',
    metal: 'gold-vermeil',
    metalDisplay: '18K Gold Vermeil',
    meaning: 'abundance and success',
    description: 'The merchant\'s stone aligns perfectly with your natural ability to manifest prosperity. Citrine amplifies your ambitious energy, attracting wealth and success while maintaining positive momentum.',
    imageUrl: talisman8,
    price: 169
  },
  9: {
    birthNumber: 9,
    crystal: 'Rose Quartz',
    metal: 'gold-vermeil',
    metalDisplay: '18K Gold Vermeil',
    meaning: 'universal love and healing',
    description: 'Rose Quartz in gold honors your humanitarian spirit and capacity for unconditional love. This compassionate stone supports your soul mission to heal and uplift humanity.',
    imageUrl: talisman9,
    price: 169
  }
};

/**
 * Get talisman configuration for a given birth number (Life Path).
 * Handles master numbers (11, 22, 33) by reducing to single digit.
 */
export function getTalismanConfig(birthNumber: number): TalismanConfig {
  // Reduce master numbers or any number > 9 to single digit
  let reducedNumber = birthNumber;
  while (reducedNumber > 9) {
    reducedNumber = String(reducedNumber)
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }

  // Ensure we have a valid number 1-9
  if (reducedNumber < 1) reducedNumber = 1;
  if (reducedNumber > 9) reducedNumber = 9;

  return TALISMAN_ASSOCIATIONS[reducedNumber];
}

/**
 * Generate a unique serial number for talisman orders.
 * Format: IC-YYYY-XXXXX (e.g., IC-2025-00001)
 */
export function generateSerialNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
  return `IC-${year}-${random}`;
}

/**
 * Format price for display with currency symbol.
 */
export function formatPrice(price: number): string {
  return `$${price}`;
}
