// Life Path Archetype Service
// Maps Life Path numbers (1-9) to static archetype images

import lifepath1 from '@/assets/archetypes/lifepath-1-pioneer.png';
import lifepath2 from '@/assets/archetypes/lifepath-2-diplomat.png';
import lifepath3 from '@/assets/archetypes/lifepath-3-creative.png';
import lifepath4 from '@/assets/archetypes/lifepath-4-builder.png';
import lifepath5 from '@/assets/archetypes/lifepath-5-adventurer.png';
import lifepath6 from '@/assets/archetypes/lifepath-6-nurturer.png';
import lifepath7 from '@/assets/archetypes/lifepath-7-mystic.png';
import lifepath8 from '@/assets/archetypes/lifepath-8-powerhouse.png';
import lifepath9 from '@/assets/archetypes/lifepath-9-humanitarian.png';

export interface ArchetypeInfo {
  number: number;
  title: string;
  titleDa: string;
  imageUrl: string;
}

const ARCHETYPE_DATA: Record<number, ArchetypeInfo> = {
  1: {
    number: 1,
    title: 'The Pioneer',
    titleDa: 'Pioneren',
    imageUrl: lifepath1,
  },
  2: {
    number: 2,
    title: 'The Diplomat',
    titleDa: 'Diplomaten',
    imageUrl: lifepath2,
  },
  3: {
    number: 3,
    title: 'The Creative',
    titleDa: 'Den Kreative',
    imageUrl: lifepath3,
  },
  4: {
    number: 4,
    title: 'The Builder',
    titleDa: 'Bygmesteren',
    imageUrl: lifepath4,
  },
  5: {
    number: 5,
    title: 'The Adventurer',
    titleDa: 'Eventyreren',
    imageUrl: lifepath5,
  },
  6: {
    number: 6,
    title: 'The Nurturer',
    titleDa: 'Omsorgsgiveren',
    imageUrl: lifepath6,
  },
  7: {
    number: 7,
    title: 'The Mystic',
    titleDa: 'Mystikeren',
    imageUrl: lifepath7,
  },
  8: {
    number: 8,
    title: 'The Powerhouse',
    titleDa: 'Kraftværket',
    imageUrl: lifepath8,
  },
  9: {
    number: 9,
    title: 'The Humanitarian',
    titleDa: 'Humanisten',
    imageUrl: lifepath9,
  },
};

/**
 * Get archetype info for a Life Path number
 * Handles master numbers (11, 22, 33) by reducing to single digit
 */
export const getArchetypeInfo = (lifePathNumber: number): ArchetypeInfo => {
  // Reduce master numbers to their base
  let reducedNumber = lifePathNumber;
  if (lifePathNumber === 11) reducedNumber = 2;
  else if (lifePathNumber === 22) reducedNumber = 4;
  else if (lifePathNumber === 33) reducedNumber = 6;
  else if (lifePathNumber > 9) {
    // Reduce any other number to single digit
    reducedNumber = lifePathNumber % 9 || 9;
  }

  return ARCHETYPE_DATA[reducedNumber] || ARCHETYPE_DATA[9];
};

/**
 * Get just the image URL for a Life Path number
 */
export const getArchetypeImage = (lifePathNumber: number): string => {
  return getArchetypeInfo(lifePathNumber).imageUrl;
};
