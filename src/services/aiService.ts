// OpenAI logic moved to backend API for security
// No more dangerouslyAllowBrowser!
import type { DiamondData } from '@/pages/ShareableReadingPage';

export interface AISummary {
  archetype: {
    title: string;
    tagline: string;
  };
  oneLiner: string;
  summary: string;
  highlightWords: string[];
  visualCue: string[];
  // V2 extended fields (optional for backward compatibility)
  loveStyle?: string;
  careerGifts?: string;
  spiritualGifts?: string;
  growthPath?: string;
  fortuneInsight?: string;
}

export const generateNumerologySummary = async (
  data: DiamondData,
  focusArea: string = "general",
  language: 'en' | 'da' = 'en'
): Promise<AISummary> => {
  console.log('AI Service - Generating summary via backend API with focus:', focusArea, 'language:', language);

  try {
    // Call backend API V2 for extended fields
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/get-reading-v2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'user', // Could pass actual name if needed
        birthdate: new Date().toISOString().split('T')[0], // Could pass actual birthdate
        diamondData: data,
        focusArea,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`);
    }

    const result = await response.json();

    // Backend returns the AISummary format with v2 extended fields
    return {
      archetype: result.archetype || {
        title: "The Cosmic Soul",
        tagline: "You carry light within your being."
      },
      oneLiner: result.oneLiner || "Your cosmic blueprint reveals unique spiritual gifts.",
      summary: result.summary || "You possess natural intuitive abilities and a deep connection to the universal energies.",
      highlightWords: result.highlightWords || ["Intuition", "Creativity", "Wisdom", "Growth", "Light"],
      visualCue: result.visualCue || ["✨", "💫", "🌟"],
      // V2 extended fields
      loveStyle: result.loveStyle,
      careerGifts: result.careerGifts,
      spiritualGifts: result.spiritualGifts,
      growthPath: result.growthPath,
      fortuneInsight: result.fortuneInsight,
    };
  } catch (error) {
    console.error('Error generating AI summary via backend:', error);

    // Return fallback content if API call fails (language-aware)
    if (language === 'da') {
      return {
        archetype: {
          title: "Den Kosmiske Vandrer",
          tagline: "Du vandrer mellem verdener med visdom og ynde."
        },
        oneLiner: "Dit kosmiske fingeraftryk afslører en naturlig leder med dyb spirituel visdom.",
        summary: "Du er bestemt til betydelig personlig transformation og vækst. Din naturlige karisma tiltrækker muligheder for lederroller, og dine intuitive gaver guider dig gennem livets rejse. Stol på din indre visdom, da den belyser din vej fremad.",
        highlightWords: ["Lederskab", "Visdom", "Transformation", "Intuition", "Karisma"],
        visualCue: ["✨", "🌟", "🔮"],
        loveStyle: "Du bringer magnetisk tilstedeværelse og dyb følelsesmæssig visdom til dine relationer. Dine partnere tiltrækkes af din autentiske natur og din evne til at skabe helligt rum for ægte forbindelse.",
        careerGifts: "Du udmærker dig i roller, der giver dig mulighed for at lede med vision og inspirere andre til transformation. Din naturlige karisma og strategiske tænkning gør dig til en kraftfuld kraft i enhver professionel sammenhæng.",
        spiritualGifts: "Du besidder medfødte intuitive evner, der gør det muligt for dig at opfatte sandheder under overfladen. Din forbindelse til universel visdom guider dig i både personlige og kollektive anliggender.",
        growthPath: "Din sjælerejse involverer at lære at balancere din kraftfulde tilstedeværelse med sårbarhed, og opdage at sand styrke kommer fra at omfavne alle aspekter af dig selv.",
        fortuneInsight: "Kosmos er på linje med dig i tider med modige handlinger. Stol på tegnene og synkroniteterne, der viser sig på din vej.",
      };
    }

    return {
      archetype: {
        title: "The Cosmic Wanderer",
        tagline: "You walk between worlds with wisdom and grace."
      },
      oneLiner: "Your cosmic blueprint reveals a natural leader with deep spiritual wisdom.",
      summary: "You are destined for significant personal transformation and growth. Your natural charisma attracts opportunities for leadership roles, and your intuitive gifts guide you through life's journey. Trust in your inner wisdom as it illuminates your path forward.",
      highlightWords: ["Leadership", "Wisdom", "Transformation", "Intuition", "Charisma"],
      visualCue: ["✨", "🌟", "🔮"],
      loveStyle: "You bring magnetic presence and deep emotional wisdom to your relationships. Your partners are drawn to your authentic nature and your ability to create sacred space for genuine connection.",
      careerGifts: "You excel in roles that allow you to lead with vision and inspire others toward transformation. Your natural charisma and strategic thinking make you a powerful force in any professional setting.",
      spiritualGifts: "You possess innate intuitive abilities that allow you to perceive truths beyond the surface. Your connection to universal wisdom guides you in both personal and collective matters.",
      growthPath: "Your soul journey involves learning to balance your powerful presence with vulnerability, discovering that true strength comes from embracing all aspects of yourself.",
      fortuneInsight: "The cosmos aligns in your favor during times of bold action. Trust the signs and synchronicities that appear on your path.",
    };
  }
};
