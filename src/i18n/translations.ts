export type Language = 'en' | 'da';

export interface Translations {
  // Header & Branding
  appTitle: string;
  appTagline: string;

  // Fortune Teller Greetings
  greetings: string[];

  // Features
  featurePersonalTitle: string;
  featurePersonalDesc: string;
  featureYearTitle: string;
  featureYearDesc: string;
  featureShareableTitle: string;
  featureShareableDesc: string;

  // Buttons
  btnBeginReading: string;
  btnLoginDiscord: string;
  btnSeeDemo: string;
  btnGenerateReading: string;

  // Privacy & Info
  privacyNote: string;
  discordReadOnly: string;
  discordBrowserNote: string;

  // Discord Login Page
  discordLoginTitle: string;

  // Entry Page
  entrySubtitle: string;
  entryHeading: string;
  entryDescription: string;
  labelName: string;
  labelBirthDate: string;
  labelFocusArea: string;
  placeholderName: string;
  placeholderBirthDate: string;
  placeholderFocusArea: string;
  focusAreaHelp: string;
  entryPrivacyNote: string;

  // Focus Area Options
  focusGeneral: string;
  focusLove: string;
  focusCareer: string;
  focusHealth: string;
  focusSpirituality: string;
  focusFinances: string;

  // Current Energy Page
  currentEnergyTitle: string;
  currentEnergySubtitle: string;
  currentSeasonText: string;
  daysRemainingText: string;
  downloadCardBtn: string;
  shareEnergyBtn: string;
  exploreDeeper: string;
  seeCompleteProfile: string;
  upcomingShiftsTitle: string;
  inDaysText: string;
  unlockHint: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header & Branding
    appTitle: 'The Infinity Compass',
    appTagline: 'Unlock the ancient wisdom of numbers to reveal your life\'s path and cosmic forecast.',

    // Fortune Teller Greetings
    greetings: [
      "I've been expecting you...",
      "The stars whisper your arrival.",
      "Every soul must walk its path — yours begins here.",
      "Your cosmic journey awaits beyond this threshold.",
      "The universe has guided you to this moment."
    ],

    // Features
    featurePersonalTitle: 'Personal Reading',
    featurePersonalDesc: 'Your unique numerology diamond chart based on your name and birth date',
    featureYearTitle: 'Year Forecast',
    featureYearDesc: 'Discover the cosmic periods shaping your year ahead',
    featureShareableTitle: 'Shareable Card',
    featureShareableDesc: 'Generate beautiful cards to share on social media',

    // Buttons
    btnBeginReading: 'Begin My Reading',
    btnLoginDiscord: 'Login with Discord',
    btnSeeDemo: 'See How It Works (no login)',
    btnGenerateReading: 'Generate My Reading',

    // Privacy & Info
    privacyNote: 'Your reading data stays private and is never stored or shared',
    discordReadOnly: 'Discord verification is read-only — we only check your WoW holder role',
    discordBrowserNote: 'Use your main browser where you\'re already logged into Discord',

    // Discord Login Page
    discordLoginTitle: 'Login with Discord to verify you\'re a World of Women holder.',

    // Entry Page
    entrySubtitle: 'Discover your cosmic blueprint through the ancient wisdom of numerology',
    entryHeading: 'Enter Your Details',
    entryDescription: 'Share your name and birth date to unlock your cosmic reading',
    labelName: 'Your Birth Name',
    labelBirthDate: 'Your Birth Date',
    labelFocusArea: 'Focus Area (Optional)',
    placeholderName: 'Enter your full birth name',
    placeholderBirthDate: 'Select your birth date',
    placeholderFocusArea: 'What would you like guidance on?',
    focusAreaHelp: 'This helps contextualize your reading to what matters most to you right now',
    entryPrivacyNote: '🔒 Your name and birthdate are used locally to calculate your numerology. We never store or transmit this data.',

    // Focus Area Options
    focusGeneral: 'General Guidance',
    focusLove: 'Love & Relationships',
    focusCareer: 'Career & Purpose',
    focusHealth: 'Health & Wellness',
    focusSpirituality: 'Spiritual Growth',
    focusFinances: 'Finances & Abundance',

    // Current Energy Page
    currentEnergyTitle: 'Your Current Energy',
    currentEnergySubtitle: 'Discover your cosmic blueprint through the ancient wisdom of numerology',
    currentSeasonText: 'This is your current cosmic season. Align with this energy to flow with the universe.',
    daysRemainingText: 'days remaining in this energy',
    downloadCardBtn: 'Download Card',
    shareEnergyBtn: 'Share Energy',
    exploreDeeper: 'Want to explore deeper?',
    seeCompleteProfile: 'See Your Complete Profile',
    upcomingShiftsTitle: 'Your 2025 Energy Shifts',
    inDaysText: 'In',
    unlockHint: '🔮 Come back to unlock each energy as it arrives...',
  },

  da: {
    // Header & Branding
    appTitle: 'The Infinity Compass',
    appTagline: 'Lås op for tallenes ældgamle visdom for at afsløre din livsvej og kosmiske fremtid.',

    // Fortune Teller Greetings
    greetings: [
      "Jeg har ventet på dig...",
      "Stjernerne hvisker om din ankomst.",
      "Hver sjæl må gå sin vej — din begynder her.",
      "Din kosmiske rejse venter hinsides denne tærskel.",
      "Universet har guidet dig til dette øjeblik."
    ],

    // Features
    featurePersonalTitle: 'Personlig Læsning',
    featurePersonalDesc: 'Dit unikke numerologi diamant kort baseret på dit navn og fødselsdato',
    featureYearTitle: 'Års Prognose',
    featureYearDesc: 'Opdag de kosmiske perioder der former dit kommende år',
    featureShareableTitle: 'Delbar Kort',
    featureShareableDesc: 'Generer smukke kort til at dele på sociale medier',

    // Buttons
    btnBeginReading: 'Begynd Min Læsning',
    btnLoginDiscord: 'Log ind med Discord',
    btnSeeDemo: 'Se Hvordan Det Virker (ingen login)',
    btnGenerateReading: 'Generer Min Læsning',

    // Privacy & Info
    privacyNote: 'Dine læsningsdata forbliver private og bliver aldrig gemt eller delt',
    discordReadOnly: 'Discord verifikation er skrivebeskyttet — vi tjekker kun din WoW holder rolle',
    discordBrowserNote: 'Brug din primære browser hvor du allerede er logget ind på Discord',

    // Discord Login Page
    discordLoginTitle: 'Log ind med Discord for at verificere at du er en World of Women holder.',

    // Entry Page
    entrySubtitle: 'Opdag dit kosmiske blueprint gennem tallenes ældgamle visdom',
    entryHeading: 'Indtast Dine Oplysninger',
    entryDescription: 'Del dit navn og fødselsdato for at låse op for din kosmiske læsning',
    labelName: 'Dit Fødselsnavn',
    labelBirthDate: 'Din Fødselsdato',
    labelFocusArea: 'Fokusområde (Valgfrit)',
    placeholderName: 'Indtast dit fulde fødselsnavn',
    placeholderBirthDate: 'Vælg din fødselsdato',
    placeholderFocusArea: 'Hvad vil du gerne have vejledning om?',
    focusAreaHelp: 'Dette hjælper med at kontekstualisere din læsning til det, der betyder mest for dig lige nu',
    entryPrivacyNote: '🔒 Dit navn og fødselsdato bruges lokalt til at beregne din numerologi. Vi gemmer eller transmitterer aldrig disse data.',

    // Focus Area Options
    focusGeneral: 'Generel Vejledning',
    focusLove: 'Kærlighed & Relationer',
    focusCareer: 'Karriere & Formål',
    focusHealth: 'Sundhed & Velvære',
    focusSpirituality: 'Spirituel Vækst',
    focusFinances: 'Økonomi & Overflod',

    // Current Energy Page
    currentEnergyTitle: 'Din Nuværende Energi',
    currentEnergySubtitle: 'Opdag dit kosmiske blueprint gennem tallenes ældgamle visdom',
    currentSeasonText: 'Dette er din nuværende kosmiske sæson. Tilpas dig denne energi for at flyde med universet.',
    daysRemainingText: 'dage tilbage i denne energi',
    downloadCardBtn: 'Download Kort',
    shareEnergyBtn: 'Del Energi',
    exploreDeeper: 'Vil du udforske dybere?',
    seeCompleteProfile: 'Se Din Komplette Profil',
    upcomingShiftsTitle: 'Dine 2025 Energi Skift',
    inDaysText: 'Om',
    unlockHint: '🔮 Kom tilbage for at låse op for hver energi efterhånden som den ankommer...',
  }
};
