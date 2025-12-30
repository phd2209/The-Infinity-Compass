// Numerology calculation utilities extracted from Redux slice
export interface NumerologyData {
  name: string;
  birthDate: Date | null;
  birthDay: number;
  nameValues: (string | number)[];
  midNameValues: (string | number)[];
  dateValue: number;
  diamond_upper_value: number;
  diamond_lower_value: string | number;
  diamond_upper_mid: (string | number)[];
  diamond_lower_mid: (string | number)[];
  diamond_upper_circle: (string | number)[];
  diamond_upper_lower_circle: (string | number)[];
  diamond_lower_circle: (string | number)[];
  diamond_lower_lower_circle: (string | number)[];
  birthdayInterpretation?: BirthdayInterpretation;
  compoundNumberInterpretations?: CompoundNumberInterpretation[];
}

export interface BirthdayInterpretation {
  planetName: string;
  description: string;
  temperament: string;
  loveLife: string;
  workLife: string;
  luckyNumbers: string;
  luckyDays: string;
  amulet: string;
}

export interface CompoundNumberInterpretation {
  number: string;
  caption: string;
  captionDa?: string; // Danish caption
  description: string;
  descriptionDa?: string; // Danish full description
  shortDescription?: string; // 2-3 sentence summary (English)
  shortDescriptionDa?: string; // Danish short description
  actionTip?: string; // How to work with this energy (English)
  actionTipDa?: string; // Danish action tip
  category: number; // The base number (1-9)
}

// Letter to number mapping dictionary
const letterToNumberMap: Record<string, number> = {
  "A": 1, "I": 1, "J": 1, "Q": 1, "Å": 1, "Y": 1,
  "B": 2, "K": 2, "R": 2,
  "C": 3, "G": 3, "L": 3, "S": 3,
  "D": 4, "M": 4, "T": 4,
  "E": 5, "H": 5, "N": 5, "X": 5,
  "U": 6, "V": 6, "W": 6, "Æ": 6,
  "O": 7, "Z": 7, "Ø": 7,
  "F": 8, "P": 8
};

// Birthday interpretation lookup data based on reduced birthday number (1-9)
const birthdayInterpretations: Record<number, BirthdayInterpretation> = {
  1: {
    planetName: "Sun",
    description: "Represents identity and individuality, i.e. our innermost being. Without the Sun there would be no life on Earth. It is therefore our most important source of vitality and self-expression. The Sun represents the innermost experience of ourselves.",
    temperament: "You are strong-willed, active and goal-oriented and go after what you set out to do. Your strong will, optimism, endurance and persistence mean that you are often lucky and successful. Your mood depends on whether things go as you have set out. This can cause you to fluctuate from being a charming cheerleader to a cold candlelighter. It is important for you to keep up the facade emotionally, as showing emotions could be perceived as a sign of weakness, and therefore you are a bit closed off. You are welcoming and can captivate others due to your great knowledge of and understanding of many things.",
    loveLife: "You have a great desire for freedom, and you prefer to be the leader in love relationships, where you can therefore be quite dominant. You have a strong power of attraction and your vitality is pronounced. You are a loving and warm person, for whom security means a lot. If your partner knows how to accept you and your needs, without hurting your pride, you are ready to give him or her everything. Your partner will be protected and safe in your hands.",
    workLife: "You are a born boss or leader, and you are also a good organizer who knows how to delegate work. No matter whether it is your own business or whether you are employed, you are very enthusiastic, but you expect the same from your colleagues. You almost demand admiration for your efforts. You are strong-willed, thorough and expect trust from your colleagues and superiors in everything you do. In addition, you always take responsibility and stand behind it. You love challenges, new ideas and plans and are always on the move. The initiative is not lacking, and many times you manage to succeed.",
    luckyNumbers: "1, 10, 19, 28 and 2, 4, 7, 11, 13, 16, 20, 22, 25, 29 and 31",
    luckyDays: "Sunday and Monday",
    amulet: "If you wear your number 1 as an amulet, your endurance will be strengthened and you will gain many new opportunities."
  },
  2: {
    planetName: "The Moon",
    description: "Represents the ability to experience emotions and moods. It signifies our instinctive reactions and receptivity. Indicates empathy and emotional needs, such as care and security.",
    temperament: "You are quite a sensitive and profound person with telepathic abilities. You are strongly influenced by your surroundings. You empathize deeply with your fellow humans and have strong compassion for others, especially those who are struggling. You can forget yourself and become emotionally unbalanced because you identify so strongly with others. You have high ideals and always strive for harmony. You are very idealistic, but others don't always understand you, so you prefer to go your own way. You are something of a mood lifter with many talents and ideas. But you may have some difficulty showing gratitude.",
    loveLife: "You enjoy love life fully, but you are also particular in your choice of partner, both regarding appearance, clothing, behavior and style. You give yourself easily and like to be conquered, preferring to play the passive, receiving role in a relationship where you leave the initiative to your partner. You are fundamentally a sensual emotional person who loves to enjoy life.",
    workLife: "You are a talented person with great artistic ability. You have talent as a writer, musician, singer, dancer, painter etc. You are a true artist of life with a vivid imagination that provides many creative and useful ideas, but you don't always fully understand the economic game. You are always very diligent, whether working for yourself or others, but your restlessness makes it a bit difficult for you to concentrate.",
    luckyNumbers: "2, 11, 20, 29 and 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31",
    luckyDays: "Monday and Sunday",
    amulet: "Wearing your 2-number as an amulet gives you cosmic support in your endeavors."
  },
  3: {
    planetName: "Jupiter",
    description: "Called the growth planet, meaning it represents yearning towards distant horizons. This applies to both outer and inner landscapes. It therefore stands for contact with foreign countries and foreigners, as well as higher education and thinking such as philosophy and religion. Nevertheless, it indicates joy, happiness, humor, optimism and zest for life.",
    temperament: "You have ambition in life, are usually lucky and have progress in what you undertake - even though it can go up and down. You are curious and infect others with your joy of life. You are honest and sincere, but emotionally you hide behind a facade and can appear emotionally cold to others. This is due to your need to have control over things, which is why you can also appear superficial. Your pride is great, you are stubborn, but at the same time you are considerate, fair and merciful. Perfectionism is of great importance, and nothing is left to chance, both in your personal taste and in your home. In addition, you are a hedonist, and you enjoy a good laugh, because you love to have fun.",
    loveLife: "You have a strong charisma and easily attract the opposite sex. You can be reserved and picky, and this can cause you to lose several fine opportunities, as you have difficulty taking the final step - the question for you is whether he or she gives you the status and joy you need. Once you really fall in love, you are very passionate, faithful and persistent.",
    workLife: "You are the born leader, are very independent, purposeful and persistent, which is why you often go far. You don't find it easy to work under others, unless they give you freedom and respect. You can be stubborn, dominating and uncompromising. You are good at delegating work and your perfectionism ensures that nothing is left to chance. You love success and always move forward, even though it sometimes looks a bit unsolvable, as you have the luck and the skills.",
    luckyNumbers: "3, 12, 21, 30 and 6, 9, 15, 18, 24, 27",
    luckyDays: "Thursday, Friday and Tuesday",
    amulet: "Wearing your 3-number as an amulet makes you much braver."
  },
  4: {
    planetName: "Uranus",
    description: "Called the planet of freedom. It represents the ability for foresight, originality, inventiveness and new thinking. It breaks down our accustomed boundaries for what is possible and permissible. The originality is based on abstract thinking and visions of distant possibilities and connections.",
    temperament: "You are full of surprises, a thinker who thinks a lot about things. Some perceive you as a profound philosopher. You have a quick mind and sometimes express yourself a bit incomprehensibly and have a lively shift between topics. You can seem confused and withdrawn, but this is often because you need things to come together in a clear picture. You can feel restless and torn, and self-confidence can also fluctuate, but your perseverance helps you find balance again. You have a noble character and a big heart, and you are generous towards those you love. Sometimes you forget yourself. You are positive and cheerful, but can also be a bit clownish, unfocused and clumsy. Your different ideas, quirky and funny impulses can put others in a good mood.",
    loveLife: "You are imaginative in your love life and your imagination and creativity make this often rich, exciting and filled with surprises. Your passion and intensity are pronounced. Regarding your partner, you are extremely picky and critical, and you demand absolute loyalty. You yourself can enjoy a flirtation, but all in all you are the faithful, devoted type.",
    workLife: "You don't like routine work, nor authorities. You seek prestige and strive for advancement on the social ladder. Modesty is almost a foreign concept in your world. You are a persistent worker bee when you get started. Unfortunately, you are sometimes hit by misfortune just before the goal, but you fight your way back. You can be a bit fanatical, because you have a deep desire to reform the world. Your spiritual abilities make you feel comfortable working with stones and crystals, healing, new sciences and technical areas.",
    luckyNumbers: "4, 13, 22, 31 and 1, 2, 7, 10, 11, 16, 19, 20, 25, 28, 29",
    luckyDays: "Sunday and Monday",
    amulet: "Wearing your 4-number as an amulet strengthens your optimism and thus your progress."
  },
  5: {
    planetName: "Mercury",
    description: "Represents concrete thinking ability, i.e. the ability to learn, book education and the ability to pass on and communicate learned knowledge. Also stands for speech gifts, writing skills and communication ability.",
    temperament: "You are a versatile person who likes to embark on unusual and bold adventures. In dealing with other people, you are lively, quick-witted but friendly. Your perception is admirable, and you are an excellent judge of character. Restlessness, agitation and nervousness can sometimes overcome you and the result can be that you flare up, because then your fuse is short. Relaxation is a foreign word to you and you very much like things to happen all the time. You are a more sensitive person than you express, and your night's sleep is important, as you use a lot of energy being active.",
    loveLife: "Your lively and outgoing mind can give you many love relationships. Also your impulsive search for new adventures. In the relationship, you demand variety and you also expect your partner's full understanding and support. You yourself are very devoted and loving, but if you get bored, you start looking around in new directions. You are like quicksilver: if one drops you on the floor, you run in all directions, which can confuse yourself.",
    workLife: "You have good communication skills and are actually the born salesperson. With your lively and cheerful charisma, it is possible for you to behave anywhere. You strive for progress and to make money. However, sometimes you go to extremes and completely indulge in unnecessary expenses and consumption. You usually have many balls in the air, but must be careful to maintain overview and avoid stress.",
    luckyNumbers: "5, 14 and 23",
    luckyDays: "Wednesday",
    amulet: "Wearing your 5-number as an amulet strengthens your energy and ability to take action."
  },
  6: {
    planetName: "Venus",
    description: "This planet is the planet of sensual receptivity. It allows us to appreciate the beauty in the harmony of forms and loving feelings in the surroundings. It represents values in existence such as: economy, money, luxury and convenience.",
    temperament: "You are a loving, sensitive and generous person who always helps others. Often you give too much and forget to set boundaries, which makes you sad and gives you a feeling of being used. Since you can also be very stubborn, this can result in you showing them the door and having difficulty forgiving the exploitation of your kindness. You have a charisma with magnetic attraction to others. Gentleness is also a characteristic, and you love to cozy up, entertain and have fun, preferably in the bosom of family and among friends. However, it would be good for yourself if you learned to 'cut the umbilical cord' to those you love, as they may feel that they don't always get space to be themselves.",
    loveLife: "Already in your young years, your unprejudiced interest in the pleasures of eroticism is awakened. You can seem quite flirtatious, as you have a special erotic charisma that can cause jealousy in your partner or friends. Family means a lot to you and you are protective, attentive, caring and attentive. The woman is the maternal type, and this is strengthened with age, and the man becomes more inclined to domestic coziness.",
    workLife: "You feel particularly well in the social sector, where you can use your innate care for others. You are persistent and persevering and show up when needed because you feel it is necessary. You also have a tendency to volunteer for e.g. association work, boards etc., where your help and support can benefit others. Pure, unspoiled nature plays a big role for you, which is why walks in forest and fields work as a healing energy.",
    luckyNumbers: "6, 15 and 24",
    luckyDays: "Friday, Tuesday and Thursday",
    amulet: "Wearing your 6-number as an amulet gives you support and help in all heart and love matters."
  },
  7: {
    planetName: "Neptune",
    description: "This planet is the planet of intuition. It represents everything irrational and non-concrete in life, such as dreams, fantasies and faith. It can lead to illusions and escape from reality, but also to crystal-clear knowledge and insight. Meditation, healing and mysticism are natural areas for Neptune.",
    temperament: "You have innate spiritual and clairvoyant abilities. You have a magnetic charisma, as you are born with 'angel energies'. You are friendly, helpful and cheerful, but you also have a pronounced 'ego-feeling', which can make you somewhat selfish in your thinking and behavior. You can be so brutally honest and direct that you end up hurting others, without noticing it yourself. If others are just as direct towards you, you can feel hurt. To justify yourself, you sometimes make accusations against others, because deep down you are sensitive and insecure about yourself. Your ego-feeling and stubbornness mean that you can lock yourself into a dream world where others should not disturb. You like to enthusiastically take on great burdens and responsibilities to get ahead and gain influence and co-determination for everyone's benefit.",
    loveLife: "Also in love relationships, you prefer to be in control. You have a great need for variety and with your different and well-developed imagination you bubble with ideas and impulses seasoned with romance. You are very intense, and the experiences should preferably be anything but boring.",
    workLife: "You have a pronounced creative talent. 7 is the number of successful artists, as well as charmers and adventurers. Your well-developed imagination and many ideas give you great opportunities to reach the top in the business world. Your enthusiasm and good speaking skills mean that you can go far. However, you have a tendency to postpone plans because other ideas emerge. Recognition and appreciation from others give you strength to continue your progress.",
    luckyNumbers: "7, 16 and 25",
    luckyDays: "Monday and Sunday",
    amulet: "Wearing your 7-number as an amulet wins you the sympathy of your surroundings and takes a big step in your development."
  },
  8: {
    planetName: "Saturn",
    description: "This planet is the planet of experience. It gives us certain limitations in the form of responsibility, duty, discipline, demands, expectations etc. It represents obligations in relation to the surroundings. It indicates concentration, stability, structure and self-control.",
    temperament: "You have rock-solid opinions and attitudes that you rarely deviate from. You fight tooth and nail for what you have set yourself, rather than give up. You are a stubborn rebel who preferably does not make any compromises. However, your arrogance can trip you up a bit in your progress, and you can feel misunderstood and hit in your self-confidence. You prefer to hide your feelings behind your somewhat harsh facade, which is why others can perceive you as cold and arrogant, but behind the facade lie the tears. Sometimes you benefit from having a shoulder to lean on. Deep down you have a big heart and you fight for those you love.",
    loveLife: "Your restrained emotions can confuse your partner. You have difficulty showing and saying what you think and feel, which is why your partner doesn't always have it so easy with you. You are easily hurt and sensitive about the smallest thing that doesn't go according to your wishes and needs, because you rarely give in or sacrifice yourself. On the other hand, you are very trusting if you have a partner who gives you the necessary loyalty and security.",
    workLife: "With your stubbornness, purposefulness and obstinacy, you are something of an ambitious individualist. You prefer to carry out your own plans, without listening to others' advice and admonitions, which can lead to conflicts. You are usually very hardworking yourself and are good at getting others going, because the goal must be reached. As a boss, you are usually shown respect, but sometimes it's to avoid coming into conflict with you. You yourself think you do it for everyone's benefit, so you don't always understand the reactions of your surroundings.",
    luckyNumbers: "8, 17 and 26",
    luckyDays: "Saturday",
    amulet: "Wearing your 8-number as an amulet gives you support in your challenging and high-flying plans."
  },
  9: {
    planetName: "Mars",
    description: "This planet represents action and also determination. It represents will and initiative to change the world with. Mars is the business planet, as it represents drive. It gives us courage, striking power, driving force and go-ahead spirit in work.",
    temperament: "You are strong, brave and persistent, so you usually overcome any obstacle in your life, as you rarely give up. You are straightforward in your criticism of others, who may have difficulty taking this directness and when it comes to temperament, you certainly weren't at the back of the queue. You can therefore be perceived as hard and cold and be the cause of discord and quarrels, but your criticism is rarely personal. You simply express yourself in your own, direct way. Some 9s can be gentler in their appearance, but this is due to 'fear' of their own strength and temperament. You like to dominate and be in focus. You like to have fun, though sometimes at others' expense. Deep down you are sensitive and gentle, which others will see if you let them in behind the shield. The number 9 is the Divine number, and you are born with spiritual abilities. However, you rarely use them until you open up to them. In that case, you will change and become less materialistic, more free and nuanced.",
    loveLife: "You like to be dominating and trend-setting in your relationship. Actually, you tolerate no opposition, but you have learned the difficult art of self-control. If your partner has a different opinion, you control yourself outwardly, but deep down it doesn't suit you. If your relationship is well-founded, you are happy to stand together with your partner if problems arise externally.",
    workLife: "You are a committed, hardworking person. You have high goals and with your willpower and perseverance you often have progress. You know and understand the word power, which is why with your charm you are good at gaining influence. You manage to activate and give enthusiasm to colleagues and subordinates, as they feel that you fight for them and want their best.",
    luckyNumbers: "9, 18 and 27",
    luckyDays: "Tuesday, Thursday and Friday",
    amulet: "Wearing your 9-number as an amulet strengthens your physical strength, your courage and your endurance."
  }
};

/**
 * Gets the birthday interpretation based on the reduced birthday number
 */
export const getBirthdayInterpretation = (birthdayNumber: number): BirthdayInterpretation | undefined => {
  return birthdayInterpretations[birthdayNumber];
};

// Compound number interpretations from "de højere sammensatte tal"
// Also includes single numbers (1-9) for when the energy period is a base number
const compoundNumberInterpretations: Record<string, CompoundNumberInterpretation> = {
  // Single numbers (1-9) - base energies
  "1": {
    number: "1",
    caption: "The Leader",
    captionDa: "Lederen",
    description: "The number 1 represents leadership, independence, and new beginnings. It is the energy of initiators and pioneers who forge their own path.",
    descriptionDa: "Tallet 1 repræsenterer lederskab, uafhængighed og nye begyndelser. Det er energien fra initiativtagere og pionerer der former deres egen vej.",
    shortDescription: "Leadership energy surges through you. You'll feel a strong urge for independence and a drive to forge new paths. Pioneer spirit awakens, calling you to step forward boldly.",
    shortDescriptionDa: "Lederskabsenergi strømmer gennem dig. Du vil føle en stærk trang til uafhængighed og en drivkraft til at skabe nye veje. Pionérånd vågner og kalder dig til at træde modigt frem.",
    actionTip: "Take initiative. Start that project you've been thinking about—now is the time to lead.",
    actionTipDa: "Tag initiativ. Start det projekt du har tænkt på—nu er tiden til at lede.",
    category: 1
  },
  "2": {
    number: "2",
    caption: "The Diplomat",
    captionDa: "Diplomaten",
    description: "The number 2 represents partnership, balance, and harmony. It is the energy of cooperation, sensitivity, and finding common ground.",
    descriptionDa: "Tallet 2 repræsenterer partnerskab, balance og harmoni. Det er energien af samarbejde, sensitivitet og at finde fælles grund.",
    shortDescription: "Sensitivity heightens and you'll feel drawn toward others. Partnership energy flows strongly—expect to crave harmony, connection, and cooperation. Emotions may feel more tender than usual.",
    shortDescriptionDa: "Sensitiviteten øges og du vil føle dig draget mod andre. Partnerskabsenergi flyder stærkt—forvent at længes efter harmoni, forbindelse og samarbejde. Følelser kan føles mere ømme end sædvanligt.",
    actionTip: "Collaborate rather than compete. Your sensitivity is a strength—use it to build bridges.",
    actionTipDa: "Samarbejd frem for at konkurrere. Din sensitivitet er en styrke—brug den til at bygge broer.",
    category: 2
  },
  "3": {
    number: "3",
    caption: "The Creator",
    captionDa: "Skaberen",
    description: "The number 3 represents creativity, self-expression, and joy. It is the energy of artists, communicators, and those who bring ideas to life.",
    descriptionDa: "Tallet 3 repræsenterer kreativitet, selvudtryk og glæde. Det er energien fra kunstnere, kommunikatorer og dem der bringer idéer til live.",
    shortDescription: "Creative energy bubbles up from within. You'll feel joyful, expressive, and inspired to communicate. Ideas flow freely and a playful, artistic spirit takes hold.",
    shortDescriptionDa: "Kreativ energi bobler op indefra. Du vil føle dig glad, udtryksfuld og inspireret til at kommunikere. Idéer flyder frit og en legende, kunstnerisk ånd tager over.",
    actionTip: "Create something! Express yourself through art, words, or any medium that calls to you.",
    actionTipDa: "Skab noget! Udtryk dig selv gennem kunst, ord eller et hvilket som helst medie der kalder på dig.",
    category: 3
  },
  "4": {
    number: "4",
    caption: "The Builder",
    captionDa: "Bygmesteren",
    description: "The number 4 represents stability, hard work, and building solid foundations. It is the energy of discipline, structure, and practical achievement.",
    descriptionDa: "Tallet 4 repræsenterer stabilitet, hårdt arbejde og at bygge solide fundamenter. Det er energien af disciplin, struktur og praktisk opnåelse.",
    shortDescription: "Grounding energy anchors you to practical reality. You'll feel a strong pull toward stability, structure, and methodical progress. Hard work feels natural and foundations solidify.",
    shortDescriptionDa: "Jordende energi forankrer dig i praktisk virkelighed. Du vil føle et stærkt træk mod stabilitet, struktur og metodisk fremgang. Hårdt arbejde føles naturligt og fundamenter bliver solide.",
    actionTip: "Create structure in your life. Lay the groundwork now for what you want to build.",
    actionTipDa: "Skab struktur i dit liv. Læg grundlaget nu for hvad du vil bygge.",
    category: 4
  },
  "5": {
    number: "5",
    caption: "The Adventurer",
    captionDa: "Eventyreren",
    description: "The number 5 represents freedom, change, and adventure. It is the energy of explorers, communicators, and those who embrace new experiences.",
    descriptionDa: "Tallet 5 repræsenterer frihed, forandring og eventyr. Det er energien fra opdagelsesrejsende, kommunikatorer og dem der omfavner nye oplevelser.",
    shortDescription: "Restless, adventurous energy stirs within. You'll feel a craving for freedom, change, and new experiences. Routine feels stifling as the urge to explore takes over.",
    shortDescriptionDa: "Rastløs, eventyrlystent energi rører sig indeni. Du vil føle en længsel efter frihed, forandring og nye oplevelser. Rutine føles kvælende mens trangen til at udforske tager over.",
    actionTip: "Say yes to adventure. Break free from routine and explore something new.",
    actionTipDa: "Sig ja til eventyr. Bryd fri fra rutinen og udforsk noget nyt.",
    category: 5
  },
  "6": {
    number: "6",
    caption: "The Nurturer",
    captionDa: "Omsorgsgiveren",
    description: "The number 6 represents love, family, and responsibility. It is the energy of caregivers, healers, and those who create harmony in the home.",
    descriptionDa: "Tallet 6 repræsenterer kærlighed, familie og ansvar. Det er energien fra omsorgsgivere, healere og dem der skaber harmoni i hjemmet.",
    shortDescription: "Nurturing, loving energy fills your heart. You'll feel deeply connected to family, home, and those you care for. A strong sense of responsibility and desire for harmony arises.",
    shortDescriptionDa: "Nærende, kærlig energi fylder dit hjerte. Du vil føle dig dybt forbundet med familie, hjem og dem du holder af. En stærk følelse af ansvar og ønske om harmoni opstår.",
    actionTip: "Nurture your relationships. Create beauty and harmony in your home and community.",
    actionTipDa: "Plej dine relationer. Skab skønhed og harmoni i dit hjem og fællesskab.",
    category: 6
  },
  "7": {
    number: "7",
    caption: "The Seeker",
    captionDa: "Søgeren",
    description: "The number 7 represents spirituality, introspection, and wisdom. It is the energy of philosophers, seekers, and those on a quest for deeper truth.",
    descriptionDa: "Tallet 7 repræsenterer spiritualitet, introspektion og visdom. Det er energien fra filosoffer, søgere og dem på en søgen efter dybere sandhed.",
    shortDescription: "Introspective, spiritual energy draws you inward. You'll feel a deep pull toward solitude, contemplation, and seeking truth. Questions about meaning and purpose arise naturally.",
    shortDescriptionDa: "Introspektiv, spirituel energi trækker dig indad. Du vil føle et dybt træk mod ensomhed, kontemplation og søgen efter sandhed. Spørgsmål om mening og formål opstår naturligt.",
    actionTip: "Go within. Meditate, study, and trust your intuition to guide you to deeper understanding.",
    actionTipDa: "Gå indad. Mediter, studer og stol på din intuition til at guide dig til dybere forståelse.",
    category: 7
  },
  "8": {
    number: "8",
    caption: "The Achiever",
    captionDa: "Opnåeren",
    description: "The number 8 represents abundance, power, and material success. It is the energy of executives, entrepreneurs, and those who manifest wealth.",
    descriptionDa: "Tallet 8 repræsenterer overflod, magt og materiel succes. Det er energien fra ledere, iværksættere og dem der manifesterer velstand.",
    shortDescription: "Powerful, ambitious energy activates your drive for success. You'll feel focused on achievement, material goals, and manifesting abundance. Authority and personal power strengthen.",
    shortDescriptionDa: "Kraftfuld, ambitiøs energi aktiverer din drivkraft for succes. Du vil føle dig fokuseret på opnåelse, materielle mål og at manifestere overflod. Autoritet og personlig magt styrkes.",
    actionTip: "Think big and take action. Your efforts toward success are supported now.",
    actionTipDa: "Tænk stort og tag handling. Dine bestræbelser mod succes er støttet nu.",
    category: 8
  },
  "9": {
    number: "9",
    caption: "The Humanitarian",
    captionDa: "Humanisten",
    description: "The number 9 represents completion, wisdom, and service to humanity. It is the energy of those who give selflessly and see the bigger picture.",
    descriptionDa: "Tallet 9 repræsenterer fuldendelse, visdom og tjeneste for menneskeheden. Det er energien fra dem der giver uselvisk og ser det større billede.",
    shortDescription: "Completion energy sweeps through—cycles are ending and wisdom deepens. You'll feel compassionate, expansive, and drawn toward serving something greater than yourself.",
    shortDescriptionDa: "Fuldendelsesenergi skyller igennem—cyklusser slutter og visdom dybnes. Du vil føle dig medfølende, ekspansiv og draget mod at tjene noget større end dig selv.",
    actionTip: "Complete what you've started. Let go of the old to make space for the new.",
    actionTipDa: "Fuldfør hvad du har startet. Slip det gamle for at gøre plads til det nye.",
    category: 9
  },
  // Compound numbers (10 and above)
  "10/1": {
    number: "10/1",
    caption: "The Wheel of Fate / Wheel of Fortune",
    captionDa: "Skæbnens Hjul / Lykkens Hjul",
    description: "A vibration that deals with luck, being loved and guided by the cosmos. In balance one is lucky, optimistic and loved. In imbalance one can become flighty, stressed and hyperactive as well as experience being 'loved or hated'. (e.g. If there are too many wheels of fortune or it 'spins' with a bad number)",
    descriptionDa: "En vibration der handler om held, at være elsket og guidet af kosmos. I balance er man heldig, optimistisk og elsket. I ubalance kan man blive flagrende, stresset og hyperaktiv samt opleve at være 'elsket eller hadet'.",
    shortDescription: "Luck and cosmic favor surround you. You'll feel optimistic, loved, and guided by unseen forces. Opportunities appear seemingly out of nowhere—fortune is spinning in your direction.",
    shortDescriptionDa: "Held og kosmisk gunst omgiver dig. Du vil føle dig optimistisk, elsket og guidet af usynlige kræfter. Muligheder dukker op tilsyneladende ud af ingenting—lykken spinner i din retning.",
    actionTip: "Say yes to new opportunities. Trust your instincts and take bold action when doors open.",
    actionTipDa: "Sig ja til nye muligheder. Stol på din intuition og tag modige skridt når døre åbner sig.",
    category: 1
  },
  "19/1": {
    number: "19/1",
    caption: "Prince of Heaven",
    captionDa: "Himmelens Prins",
    description: "A vibration that is also called 'everything one touches turns to gold/success'. Exceptional drive, luck and winner mentality, pure thoughts and a pure heart. In balance one is lucky, guided and successful. In imbalance one can be selfish, spoiled and childish.",
    descriptionDa: "En vibration der også kaldes 'alt man rører ved bliver til guld/succes'. Enestående drivkraft, held og vindermentalitet, rene tanker og et rent hjerte. I balance er man heldig, guidet og succesfuld. I ubalance kan man være egoistisk, forkælet og barnlig.",
    shortDescription: "Golden, blessed energy flows through you. Everything you touch seems to succeed. You'll feel a pure-hearted drive and winner mentality—success comes naturally now.",
    shortDescriptionDa: "Gylden, velsignet energi flyder gennem dig. Alt du rører ved synes at lykkes. Du vil føle en rendjertet drivkraft og vindermentalitet—succes kommer naturligt nu.",
    actionTip: "Lead with your heart. Your natural charisma opens doors—use it for good.",
    actionTipDa: "Led med dit hjerte. Din naturlige karisma åbner døre—brug den til noget godt.",
    category: 1
  },
  "28/1": {
    number: "28/1",
    caption: "The Broken Promise",
    captionDa: "Det Brudte Løfte",
    description: "A vibration that deals with big promises that come to nothing, and also potentially deals with lawsuits and conflict. One promises more than one keeps, being deceitful or a 'faker'. Trust in the wrong people who do not wish one well. Loss, tears, starting over",
    descriptionDa: "En vibration der handler om store løfter der ikke bliver til noget, og potentielt handler om retssager og konflikt. Man lover mere end man holder, er bedragerisk eller en 'faker'. Tillid til de forkerte mennesker der ikke ønsker én godt. Tab, tårer, at starte forfra.",
    shortDescription: "Cautionary energy surrounds commitments. You may encounter empty promises or feel the weight of unfulfilled expectations. Trust issues and potential disappointments linger in the air.",
    shortDescriptionDa: "Advarselsenergier omgiver forpligtelser. Du kan støde på tomme løfter eller føle vægten af uopfyldte forventninger. Tillidsproblemer og potentielle skuffelser hænger i luften.",
    actionTip: "Only promise what you can deliver. Verify others' intentions before investing your trust.",
    actionTipDa: "Lov kun hvad du kan holde. Verificer andres intentioner før du investerer din tillid.",
    category: 1
  },
  "37/1": {
    number: "37/1",
    caption: "The Rising Star",
    captionDa: "Den Stigende Stjerne",
    description: "A vibration that gives a 'celebrity' vibe, and is about the courage and self-confidence to stand by oneself, live out one's dreams and step forward as who one is. In balance one is respected and admired and has a good love and sex life and enormous charisma. Luck in friendships, business and everything with money. In imbalance one can be surrounded by drama, scandals, financial and relationship problems.",
    descriptionDa: "En vibration der giver en 'kendis' vibe, og handler om modet og selvtilliden til at stå ved sig selv, leve sine drømme ud og træde frem som den man er. I balance er man respekteret og beundret med et godt kærlighedsliv og enorm karisma. Held i venskaber, forretning og alt med penge. I ubalance kan man være omgivet af drama, skandaler, økonomiske og relationsproblemer.",
    shortDescription: "Celebrity energy radiates from you. You'll feel magnetic, admired, and drawn to step into the spotlight. Charisma intensifies and attention naturally flows your way.",
    shortDescriptionDa: "Kendis-energi stråler fra dig. Du vil føle dig magnetisk, beundret og draget mod at træde ind i rampelyset. Karisma intensiveres og opmærksomhed flyder naturligt din vej.",
    actionTip: "Be authentically you. Share your unique gifts boldly—the world is ready to receive them.",
    actionTipDa: "Vær autentisk dig selv. Del dine unikke gaver modigt—verden er klar til at modtage dem.",
    category: 1
  },
  "46/1": {
    number: "46/1",
    caption: "The World Transformer",
    captionDa: "Verdensforvandleren",
    description: "A vibration that deals with improving and transforming the surroundings for the common good, and breaking through in one's career, often with large projects and philanthropic ideas. In balance one has great leadership abilities, charisma, strength and political acumen. One wants to change the world with 'peace, love & harmony'. Luck in money, love and friendships. In imbalance there is a tendency to skip necessary steps and radiate a superficial 'glamorous image' vibe.",
    descriptionDa: "En vibration der handler om at forbedre og transformere omgivelserne til fælles bedste, og gennembrud i karrieren, ofte med store projekter og filantropiske idéer. I balance har man store lederevner, karisma, styrke og politisk sans. Man vil forandre verden med 'fred, kærlighed og harmoni'. Held i penge, kærlighed og venskaber. I ubalance er der tendens til at springe nødvendige trin over og udstråle en overfladisk 'glamour' vibe.",
    shortDescription: "Visionary, transformative energy awakens. You'll feel called to improve the world around you with philanthropic ideals. Leadership abilities strengthen alongside a desire for meaningful change.",
    shortDescriptionDa: "Visionær, transformerende energi vågner. Du vil føle dig kaldet til at forbedre verden omkring dig med filantropiske idealer. Lederevner styrkes sammen med et ønske om meningsfuld forandring.",
    actionTip: "Think big but act step by step. Your philanthropic ideas deserve solid foundations.",
    actionTipDa: "Tænk stort men handl skridt for skridt. Dine filantropiske idéer fortjener solide fundamenter.",
    category: 1
  },
  "55/1": {
    number: "55/1",
    caption: "The Communication Master",
    captionDa: "Kommunikationsmesteren",
    description: "A vibration that deals with reaching the top by becoming a master of communication. 55 is a master number (two of the same number) which means it takes time to master the number. In balance it's about having a huge radiance that gives success with media and various communication channels and achieving great success. Luck in money, friendships, love. In imbalance it's very much about going after what one wants at any cost, and being so ambitious that one resorts to unethical methods.",
    descriptionDa: "En vibration der handler om at nå toppen ved at blive mester i kommunikation. 55 er et mestertal (to af samme tal) hvilket betyder det tager tid at mestre tallet. I balance handler det om at have en enorm udstråling der giver succes med medier og forskellige kommunikationskanaler og opnå stor succes. Held i penge, venskaber, kærlighed. I ubalance handler det meget om at gå efter hvad man vil for enhver pris, og være så ambitiøs at man tyr til uetiske metoder.",
    shortDescription: "Master communicator energy amplifies your presence. You'll feel extraordinarily articulate with powerful radiance. Words flow with impact and your message carries far.",
    shortDescriptionDa: "Mesterkommunikatør-energi forstærker din tilstedeværelse. Du vil føle dig ekstraordinært veltalende med kraftfuld udstråling. Ord flyder med effekt og dit budskab bærer langt.",
    actionTip: "Use your voice for good. Your message can reach millions—make sure it's ethical and authentic.",
    actionTipDa: "Brug din stemme til noget godt. Dit budskab kan nå millioner—sørg for at det er etisk og autentisk.",
    category: 1
  },
  "64/1": {
    number: "64/1",
    caption: "The Wise Reformer",
    captionDa: "Den Vise Reformator",
    description: "A vibration that deals with seeing what works and what doesn't work, and creating the necessary changes. In balance one is a wise man with great ideas that take into account the common good/love in the world. In imbalance one can appear a bit dry, overly critical/stubborn, know-it-all and like a 'know-it-all'.",
    descriptionDa: "En vibration der handler om at se hvad der virker og hvad der ikke virker, og skabe de nødvendige forandringer. I balance er man en vismand med store idéer der tager hensyn til fælles bedste/kærlighed i verden. I ubalance kan man fremstå lidt tør, overkritisk/stædig, bedrevidende og som en 'besserwisser'.",
    shortDescription: "Reformer's clarity sharpens your vision. You'll see what works and what doesn't with unusual precision. Wise insights about necessary changes arise naturally.",
    shortDescriptionDa: "Reformatorens klarhed skærper din vision. Du vil se hvad der virker og hvad der ikke gør med usædvanlig præcision. Vise indsigter om nødvendige forandringer opstår naturligt.",
    actionTip: "Balance critique with kindness. Your reforms land better when delivered with warmth.",
    actionTipDa: "Balancer kritik med venlighed. Dine reformer lander bedre når de leveres med varme.",
    category: 1
  },
  "73/1": {
    number: "73/1",
    caption: "The Ingenious Pioneer",
    captionDa: "Den Geniale Pioner",
    description: "A vibration that deals with creating brilliant and innovative things for the benefit of a better world, which can lead to great wealth without it being noticed. One has an enormous pioneer spirit and ability to lead and becomes wealthy. In balance one radiates beauty, strength and genius. Here it's not 'for money's sake'. In imbalance there can be a fatigue of being with other people and excessive need for privacy.",
    descriptionDa: "En vibration der handler om at skabe geniale og innovative ting til gavn for en bedre verden, hvilket kan føre til stor rigdom uden at det bemærkes. Man har en enorm pionérånd og evne til at lede og bliver velhavende. I balance udstråler man skønhed, styrke og genialitet. Her er det ikke 'for pengenes skyld'. I ubalance kan der være træthed ved at være sammen med andre mennesker og overdrevet behov for privatliv.",
    shortDescription: "Genius innovation flows through you. You'll feel brilliantly creative with pioneering spirit that could lead to unexpected wealth. A pull toward solitude may accompany this inventive energy.",
    shortDescriptionDa: "Genial innovation flyder gennem dig. Du vil føle dig strålende kreativ med pionérånd der kan føre til uventet velstand. Et træk mod ensomhed kan ledsage denne opfindsomme energi.",
    actionTip: "Create from inspiration, not obligation. Balance your need for solitude with meaningful connections.",
    actionTipDa: "Skab fra inspiration, ikke forpligtelse. Balancer dit behov for ensomhed med meningsfulde forbindelser.",
    category: 1
  },
  "82/1": {
    number: "82/1",
    caption: "The Invincible Leader",
    captionDa: "Den Uovervindelige Leder",
    description: "A vibration that gives an invincible and strong winner mentality, with many talents used to lift a community. In balance one is talented, expansive and a strong leader who lifts as a flock. In imbalance it gives anger, lack of consideration, and inner struggle without results, and can attract lawsuits. Very vulnerable",
    descriptionDa: "En vibration der giver en uovervindelig og stærk vindermentalitet, med mange talenter brugt til at løfte et fællesskab. I balance er man talentfuld, ekspansiv og en stærk leder der løfter som en flok. I ubalance giver det vrede, mangel på hensyn, og indre kamp uden resultater, og kan tiltrække retssager. Meget sårbar.",
    shortDescription: "Invincible, powerful energy surges through you. You'll feel an unshakeable winner mentality and drive to uplift your community. Many talents activate simultaneously.",
    shortDescriptionDa: "Uovervindelig, kraftfuld energi strømmer gennem dig. Du vil føle en urokkelig vindermentalitet og drivkraft til at løfte dit fællesskab. Mange talenter aktiveres samtidigt.",
    actionTip: "Lead with your heart, not your ego. Your vulnerability is actually your greatest strength.",
    actionTipDa: "Led med dit hjerte, ikke dit ego. Din sårbarhed er faktisk din største styrke.",
    category: 1
  },
  "91/1": {
    number: "91/1",
    caption: "The World Conqueror",
    captionDa: "Verdenseroberen",
    description: "A magnificent and expansive vibration that wants to conquer the world with its new ideas. In balance it gives enormous success and has great inspiration and speaking gifts. Focused, strong, luck in money and business. In imbalance there can be strong egoism, narcissistic tendencies, tendency to megalomania where one feels small inside but projects an exaggerated belief in one's own abilities. Inflexible",
    descriptionDa: "En storslået og ekspansiv vibration der vil erobre verden med sine nye idéer. I balance giver det enorm succes og har stor inspiration og talegaver. Fokuseret, stærk, held i penge og forretning. I ubalance kan der være stærk egoisme, narcissistiske tendenser, tendens til storhedsvanvid hvor man føler sig lille indeni men projicerer en overdreven tro på egne evner. Ufleksibel.",
    shortDescription: "World-conquering ambition ignites within. You'll feel magnificently expansive with bold ideas demanding expression. Success magnetism and speaking gifts amplify powerfully.",
    shortDescriptionDa: "Verdenserobrende ambition tændes indeni. Du vil føle dig storslået ekspansiv med modige idéer der kræver udtryk. Succesmagnetisme og talegaver forstærkes kraftigt.",
    actionTip: "Stay humble in victory. True world-changers lift others as they rise.",
    actionTipDa: "Forbliv ydmyg i sejr. Sande verdens-forandrere løfter andre mens de stiger.",
    category: 1
  },
  // 2 numbers
  "11/2": {
    number: "11/2",
    caption: "The Gentle Soul",
    captionDa: "Den Blide Sjæl",
    description: "An overly gentle, soft and naive vibration that is too good-natured and has difficulty saying no. It deals with inner division, and is conflict-averse, a 'people pleaser' and creates a need to numb one's emotions e.g. through overeating or other dependencies. Others' betrayal, hidden dangers, tears",
    descriptionDa: "En overfølsom, blid og naiv vibration der er for godtroende og har svært ved at sige nej. Den handler om indre splittelse, og er konfliktsky, en 'people pleaser' og skaber et behov for at bedøve sine følelser f.eks. gennem overspisning eller andre afhængigheder. Andres forræderi, skjulte farer, tårer.",
    shortDescription: "Extreme gentleness and sensitivity wash over you. You'll feel tender, soft-hearted, and perhaps too easily affected by others. Boundaries may blur as you absorb surrounding emotions.",
    shortDescriptionDa: "Ekstrem blødhed og sensitivitet skyller over dig. Du vil føle dig øm, blødhjertet og måske for let påvirket af andre. Grænser kan blive uklare når du absorberer omgivende følelser.",
    actionTip: "Learn to say no with love. Your kindness is a gift—protect it with healthy boundaries.",
    actionTipDa: "Lær at sige nej med kærlighed. Din venlighed er en gave—beskyt den med sunde grænser.",
    category: 2
  },
  "20/2": {
    number: "20/2",
    caption: "The Guided Angel",
    captionDa: "Den Guidede Engel",
    description: "A harmonious, sensitive and gentle vibration that attracts gentle, positive angel energies around oneself/an angel that guides through life. In balance things come incredibly easily to one, and one is placed on the right shelf, and gets to do what one loves; to follow one's passion. Pure line to the first floor. In imbalance one can be flighty, stressed and have great changeability. Can be a bit uncertain about where 'one should stand.'",
    descriptionDa: "En harmonisk, sensitiv og blid vibration der tiltrækker blide, positive engle-energier omkring sig/en engel der guider gennem livet. I balance kommer tingene utroligt let til én, og man bliver placeret på den rigtige hylde, og får lov til at gøre det man elsker; at følge sin passion. Ren linje til første sal. I ubalance kan man være flagrende, stresset og have stor foranderlighed. Kan være lidt usikker på hvor 'man skal stå'.",
    shortDescription: "Angelic, harmonious energy surrounds you. Things flow with remarkable ease as if guided by unseen forces. You'll feel drawn toward your passion with unusual clarity about your path.",
    shortDescriptionDa: "Englelig, harmonisk energi omgiver dig. Ting flyder med bemærkelsesværdig lethed som om guidet af usynlige kræfter. Du vil føle dig draget mod din passion med usædvanlig klarhed om din vej.",
    actionTip: "Listen to your intuition—it's your angel speaking. Follow what lights you up.",
    actionTipDa: "Lyt til din intuition—det er din engel der taler. Følg det der tænder dig.",
    category: 2
  },
  "29/2": {
    number: "29/2",
    caption: "The Betrayed Innocent",
    captionDa: "Den Forrådte Uskyldige",
    description: "A vibration that gives tendency for others to overstep one's boundaries and for one to be deceived, cheated, badly treated and exploited. Great tendency to be naive and close one's eyes to the realities of reality. This brings sorrow and disappointment and misfortune, so one loses. Dangers",
    descriptionDa: "En vibration der giver tendens til at andre overskrider ens grænser og til at man bliver bedraget, snydt, dårligt behandlet og udnyttet. Stor tendens til at være naiv og lukke øjnene for virkelighedens realiteter. Dette bringer sorg og skuffelse og uheld, så man taber. Farer.",
    shortDescription: "Vulnerable, innocent energy makes you more susceptible to disappointment. You may feel naively trusting while others overstep boundaries. Hidden dangers and potential betrayals lurk.",
    shortDescriptionDa: "Sårbar, uskyldig energi gør dig mere modtagelig for skuffelse. Du kan føle dig naivt tillidsfuld mens andre overskrider grænser. Skjulte farer og potentielle forræderier lurer.",
    actionTip: "Trust, but verify. Your open heart is beautiful—pair it with discerning eyes.",
    actionTipDa: "Stol på, men verificer. Dit åbne hjerte er smukt—par det med skarpsynede øjne.",
    category: 2
  },
  "38/2": {
    number: "38/2",
    caption: "The Unvalued Heart",
    captionDa: "Det Uværdsatte Hjerte",
    description: "It is predominantly imbalanced in the numeroscope, and one typically feels unappreciated, unheard and unseen. An inner division and disharmony characterizes the mind. One is filled with sorrow and disappointment, and can be really unlucky.",
    descriptionDa: "Det er overvejende i ubalance i numeroskopet, og man føler sig typisk uværdsat, uhørt og uset. En indre splittelse og disharmoni karakteriserer sindet. Man er fyldt med sorg og skuffelse, og kan være rigtig uheldig.",
    shortDescription: "You may feel unappreciated, unheard, or unseen during this period. Inner disharmony and a sense of being undervalued can dominate. Sorrow and disappointment may surface.",
    shortDescriptionDa: "Du kan føle dig uværdsat, uhørt eller uset i denne periode. Indre disharmoni og en følelse af at blive undervurderet kan dominere. Sorg og skuffelse kan dukke op.",
    actionTip: "Speak up for what you need. Your voice matters—let it be heard.",
    actionTipDa: "Sig fra om hvad du har brug for. Din stemme betyder noget—lad den blive hørt.",
    category: 2
  },
  "47/2": {
    number: "47/2",
    caption: "The Dreaming Recluse",
    captionDa: "Den Drømmende Eneboer",
    description: "A vibration that deals with dreams, hope and great sensitivity. However, one often becomes disappointed and is quite unlucky. There is a tendency to be otherworldly, and one might prefer books or computers over people.",
    descriptionDa: "En vibration der handler om drømme, håb og stor sensitivitet. Dog bliver man ofte skuffet og er ret uheldig. Der er en tendens til at være verdensfjern, og man foretrækker måske bøger eller computere frem for mennesker.",
    shortDescription: "Dreamy, otherworldly energy pulls you inward. You'll feel highly sensitive and drawn to imagination over reality. A preference for solitude and inner worlds intensifies.",
    shortDescriptionDa: "Drømmende, verdenfjern energi trækker dig indad. Du vil føle dig meget sensitiv og draget mod fantasi frem for virkelighed. En præference for ensomhed og indre verdener intensiveres.",
    actionTip: "Step out of your comfort zone. Connection with others can bring your dreams to life.",
    actionTipDa: "Træd ud af din komfortzone. Forbindelse med andre kan bringe dine drømme til live.",
    category: 2
  },
  "56/2": {
    number: "56/2",
    caption: "The Insecure Manipulator",
    captionDa: "Den Usikre Manipulator",
    description: "A vibration that deals with personal charisma and has a playful energy that easily and elegantly convinces others. It manipulates through drama, can be verbally aggressive and dominating due to a great inner insecurity. Here one is also unlucky, disappointed, hurt due to other people's actions",
    descriptionDa: "En vibration der handler om personlig karisma og har en legende energi der nemt og elegant overbeviser andre. Den manipulerer gennem drama, kan være verbalt aggressiv og dominerende på grund af en stor indre usikkerhed. Her er man også uheldig, skuffet, såret på grund af andre menneskers handlinger.",
    shortDescription: "Charismatic but unstable energy swirls. You'll feel playfully persuasive yet driven by inner insecurity. Drama and emotional intensity may surface as you seek validation.",
    shortDescriptionDa: "Karismatisk men ustabil energi hvirvler. Du vil føle dig legende overbevisende men drevet af indre usikkerhed. Drama og emotionel intensitet kan dukke op mens du søger bekræftelse.",
    actionTip: "Express your needs directly. Honest communication is more powerful than manipulation.",
    actionTipDa: "Udtryk dine behov direkte. Ærlig kommunikation er mere kraftfuld end manipulation.",
    category: 2
  },
  "65/2": {
    number: "65/2",
    caption: "The Protective Controller",
    captionDa: "Den Beskyttende Kontrollør",
    description: "A vibration that deals very much with protecting others. There can be a tendency to give others advice in order to dominate or to feel loved, and can be verbally aggressive. Disappointed and hurt by other people. Misfortune",
    descriptionDa: "En vibration der handler meget om at beskytte andre. Der kan være en tendens til at give andre råd for at dominere eller føle sig elsket, og kan være verbalt aggressiv. Skuffet og såret af andre mennesker. Uheld.",
    shortDescription: "Strong protective urges arise, sometimes veering into control. You'll feel compelled to guide others, though disappointment and hurt from relationships may color this period.",
    shortDescriptionDa: "Stærke beskyttende trang opstår, som nogle gange glider over i kontrol. Du vil føle dig tvunget til at guide andre, selvom skuffelse og smerte fra relationer kan farve denne periode.",
    actionTip: "Offer guidance without attachment. True care means trusting others to find their way.",
    actionTipDa: "Tilbyd vejledning uden tilknytning. Sand omsorg betyder at stole på at andre finder deres vej.",
    category: 2
  },
  "74/2": {
    number: "74/2",
    caption: "The Emotionally Elusive",
    captionDa: "Den Følelsesmæssigt Undvigende",
    description: "One can keep their emotions secret, drown in their emotions, 'tune out' (nobody's home) or numb their emotions with e.g. sugar or dependencies. In balance there is a philosophical, strategic and artistic side united in one and the same person. Flighty and confused, unlucky, disappointed and sad",
    descriptionDa: "Man kan holde sine følelser hemmelige, drukne i sine følelser, 'tune ud' (ingen hjemme) eller bedøve sine følelser med f.eks. sukker eller afhængigheder. I balance er der en filosofisk, strategisk og kunstnerisk side forenet i én og samme person. Flagrende og forvirret, uheldig, skuffet og trist.",
    shortDescription: "Emotional elusiveness characterizes this period. You may feel detached, secretive about feelings, or tempted to numb emotions. Confusion and sadness may linger beneath the surface.",
    shortDescriptionDa: "Følelsesmæssig undvigelighed karakteriserer denne periode. Du kan føle dig distanceret, hemmelighedsfuld om følelser, eller fristet til at bedøve følelser. Forvirring og tristhed kan lure under overfladen.",
    actionTip: "Stay present with your feelings. What you feel is valid—don't escape, explore.",
    actionTipDa: "Forbliv nærværende med dine følelser. Hvad du føler er gyldigt—flygt ikke, udforsk.",
    category: 2
  },
  "83/2": {
    number: "83/2",
    caption: "The Fearful Controller",
    captionDa: "Den Bange Kontrollør",
    description: "Fear and tendency to over-control. So one can become a bit preachy, and think one is a bit above others, so one gets an aura that causes one to attract disappointments, sorrows, misfortune; one is a bit sensitive and feels unfairly treated",
    descriptionDa: "Frygt og tendens til overkontrol. Så man kan blive lidt prædikende, og tro man er lidt over andre, så man får en aura der gør at man tiltrækker skuffelser, sorger, uheld; man er lidt sensitiv og føler sig uretfærdigt behandlet.",
    shortDescription: "Fear-driven control energy takes hold. You may feel anxious, preachy, or superior while attracting disappointments. Sensitivity to unfair treatment heightens.",
    shortDescriptionDa: "Frygtdrevet kontrolenergi tager fat. Du kan føle dig ængstelig, prædikende eller overlegen mens du tiltrækker skuffelser. Sensitivitet over for uretfærdig behandling intensiveres.",
    actionTip: "Practice letting go. Not everything needs your oversight—trust the process.",
    actionTipDa: "Øv dig i at slippe. Ikke alt behøver dit tilsyn—stol på processen.",
    category: 2
  },
  "92/2": {
    number: "92/2",
    caption: "The Naive Romantic",
    captionDa: "Den Naive Romantiker",
    description: "A vibration that deals with a tendency to naivety, to become unhappily in love, or be unrealistic about one's relationships and be exploited by others. Others don't really know where they have one = sorrows, misfortune, disappointments, losing",
    descriptionDa: "En vibration der handler om en tendens til naivitet, at blive ulykkelig forelsket, eller være urealistisk om sine relationer og blive udnyttet af andre. Andre ved ikke rigtig hvor de har én = sorger, uheld, skuffelser, at tabe.",
    shortDescription: "Naive romantic energy makes you vulnerable to unrealistic expectations in love. You may feel exploited or misunderstood, with sorrow and disappointment arising from relationships.",
    shortDescriptionDa: "Naiv romantisk energi gør dig sårbar over for urealistiske forventninger i kærlighed. Du kan føle dig udnyttet eller misforstået, med sorg og skuffelse der opstår fra relationer.",
    actionTip: "Be clear about who you are. Consistency builds trust in relationships.",
    actionTipDa: "Vær klar på hvem du er. Konsistens bygger tillid i relationer.",
    category: 2
  },
  // 3 numbers
  "12/3": {
    number: "12/3",
    caption: "The Sacrifice Number",
    captionDa: "Offertallet",
    description: "A vibration that deals with being misunderstood, over-interpreting, turning and twisting things in one's head and having a distorted view of reality. There is a chaotic mind with stress and mental clutter, where one tries their way through life with 'quick fixes' that go wrong. Tendency to be clumsy in speech or action. Victim of others' pressure that must be numbed. One trips oneself up (victim)",
    descriptionDa: "En vibration der handler om at blive misforstået, over-tolke, vende og dreje ting i sit hoved og have et forvrænget syn på virkeligheden. Der er et kaotisk sind med stress og mentalt rod, hvor man prøver sig frem gennem livet med 'hurtige løsninger' der går galt. Tendens til at være klodset i tale eller handling. Offer for andres pres der skal bedøves. Man snubler over sig selv (offer).",
    shortDescription: "Mental intensity runs high—expect racing thoughts, overthinking, and a busy mind seeking answers. You may feel misunderstood or overwhelmed by mental clutter as clarity seems just out of reach.",
    shortDescriptionDa: "Mental intensitet kører på højtryk—forvent jagende tanker, overtænkning og et travlt sind der søger svar. Du kan føle dig misforstået eller overvældet af mentalt rod mens klarhed synes lige uden for rækkevidde.",
    actionTip: "Slow down your racing mind. Clarity comes when you stop overthinking and trust your first instinct.",
    actionTipDa: "Sænk farten på dit jagende sind. Klarhed kommer når du stopper med at overtænke og stoler på din første indskydelse.",
    category: 3
  },
  "21/3": {
    number: "21/3",
    caption: "The Magician's Crown (Crown of Magic)",
    captionDa: "Magikerens Krone (Magiens Krone)",
    description: "A vibration that deals with resting in the process towards success, having high ambitions, and taking things one step at a time towards the completion of one's goals. One cracks their personal key to success, and understands the importance of thorough preparation. Progress and success in life. A bit strong for a baby",
    descriptionDa: "En vibration der handler om at hvile i processen mod succes, have høje ambitioner, og tage tingene ét skridt ad gangen mod fuldendelsen af sine mål. Man knækker sin personlige nøgle til succes, og forstår vigtigheden af grundig forberedelse. Fremgang og succes i livet. Lidt stærk for en baby.",
    shortDescription: "Magical, methodical energy guides you toward success. You'll feel ambitious yet patient, understanding that each step builds toward your crown achievement. High aspirations feel attainable.",
    shortDescriptionDa: "Magisk, metodisk energi guider dig mod succes. Du vil føle dig ambitiøs men tålmodig, forstående at hvert skridt bygger mod din kroningspræstation. Høje aspirationer føles opnåelige.",
    actionTip: "Prepare thoroughly. Your success is built on solid foundations, not shortcuts.",
    actionTipDa: "Forbered dig grundigt. Din succes er bygget på solide fundamenter, ikke genveje.",
    category: 3
  },
  "30/3": {
    number: "30/3",
    caption: "The Powerful Competitor",
    captionDa: "Den Kraftfulde Konkurrent",
    description: "A vibration that gives lots of energy and strength, drive and ambition, as well as a strong strategic sense and personal power. There is a strong intellectual power, and one expresses oneself sincerely and honestly. It takes energy from what lies around and can therefore become best or worst. In imbalance there is tendency to know-it-all attitude, arrogance, competition and comparing oneself with others. There is tendency to put on masks.",
    descriptionDa: "En vibration der giver masser af energi og styrke, drivkraft og ambition, samt en stærk strategisk sans og personlig magt. Der er en stærk intellektuel kraft, og man udtrykker sig ærligt og oprigtigt. Den tager energi fra det der ligger omkring og kan derfor blive bedst eller værst. I ubalance er der tendens til bedrevidende holdning, arrogance, konkurrence og at sammenligne sig med andre. Der er tendens til at tage masker på.",
    shortDescription: "Powerful, competitive energy surges through you. You'll feel intellectually sharp, strategically focused, and driven to excel. Personal power amplifies but may tip toward arrogance.",
    shortDescriptionDa: "Kraftfuld, konkurrencepræget energi strømmer gennem dig. Du vil føle dig intellektuelt skarp, strategisk fokuseret og drevet til at excellere. Personlig magt forstærkes men kan tippe mod arrogance.",
    actionTip: "Compete with yourself, not others. Your greatest rival is yesterday's version of you.",
    actionTipDa: "Konkurrer med dig selv, ikke andre. Din største rival er gårsdagens udgave af dig.",
    category: 3
  },
  "39/3": {
    number: "39/3",
    caption: "The Controlling Boss",
    captionDa: "Den Kontrollerende Chef",
    description: "Imbalanced in the numeroscope. There is a tendency to tell others what they should and shouldn't do, and can easily overstep others' boundaries. One has difficulty relaxing in the leadership role. Outwardly one is 'bossy', but inwardly one can feel like a victim with lots of mental clutter and self-doubt. Too much control and superiority",
    descriptionDa: "Ubalanceret i numeroskopet. Der er en tendens til at fortælle andre hvad de skal og ikke skal gøre, og kan nemt overskride andres grænser. Man har svært ved at slappe af i lederrollen. Udadtil er man 'bossy', men indadtil kan man føle sig som et offer med masser af mentalt rod og selvtvivl. For meget kontrol og overlegenhed.",
    shortDescription: "Controlling, bossy energy emerges. Outwardly you'll feel driven to direct others, while inwardly mental clutter and self-doubt may brew. The urge to overstep boundaries intensifies.",
    shortDescriptionDa: "Kontrollerende, dominerende energi dukker op. Udadtil vil du føle dig drevet til at styre andre, mens indadtil mentalt rod og selvtvivl kan brygge. Trangen til at overskride grænser intensiveres.",
    actionTip: "Ask questions instead of giving orders. Empower others to find their own solutions.",
    actionTipDa: "Stil spørgsmål i stedet for at give ordrer. Styrk andre til at finde deres egne løsninger.",
    category: 3
  },
  "48/3": {
    number: "48/3",
    caption: "The Analytical Perfectionist",
    captionDa: "Den Analytiske Perfektionist",
    description: "A vibration that deals with delving deeply into things and turning and twisting the smallest detail. Best at intellectual, complex and intricate work, research as well as political strategy. A tendency for the inner and outer forces to be pulled apart, and one can feel enormously split inside about the things one sets in motion. Imbalanced due to the inner 4-8 tension and it requires great awareness to bring it out positively.",
    descriptionDa: "En vibration der handler om at dykke dybt ned i ting og vende og dreje den mindste detalje. Bedst til intellektuelt, komplekst og indviklet arbejde, forskning samt politisk strategi. En tendens til at de indre og ydre kræfter trækkes fra hinanden, og man kan føle sig enormt splittet indeni om de ting man sætter i gang. Ubalanceret på grund af den indre 4-8 spænding og det kræver stor bevidsthed at bringe det ud positivt.",
    shortDescription: "Analytical, perfectionist energy intensifies. You'll feel drawn to examine every detail, potentially becoming split between inner and outer demands. Inner tension may cause analysis paralysis.",
    shortDescriptionDa: "Analytisk, perfektionistisk energi intensiveres. Du vil føle dig draget til at undersøge hver detalje, potentielt blive splittet mellem indre og ydre krav. Indre spænding kan forårsage analyselammelse.",
    actionTip: "Done is better than perfect. Ship your work and iterate—perfection is the enemy of progress.",
    actionTipDa: "Færdig er bedre end perfekt. Send dit arbejde ud og iterer—perfektion er fremgangenes fjende.",
    category: 3
  },
  "57/3": {
    number: "57/3",
    caption: "The Restless Explorer",
    captionDa: "Den Rastløse Opdagelsesrejsende",
    description: "A vibration that gives a great need to explore new places, ideas and deals with longing for foreign lands. A polar explorer or adventurer vibration. One can be insensitive and jog in the spinach or step on others' toes with their big arm movements. Great desire for new experiences. Profound conclusions",
    descriptionDa: "En vibration der giver et stort behov for at udforske nye steder, idéer og handler om længsel efter fremmede lande. En polarforsker eller eventyrer vibration. Man kan være ufølsom og trampe i spinaten eller træde andre over tæerne med sine store armbevægelser. Stor lyst til nye oplevelser. Dybe konklusioner.",
    shortDescription: "Restless explorer energy awakens a deep longing for new places and ideas. You'll feel adventurous and drawn to foreign horizons, though you may accidentally step on toes in your excitement.",
    shortDescriptionDa: "Rastløs opdagelsesrejsende-energi vækker en dyb længsel efter nye steder og idéer. Du vil føle dig eventyrlystent og draget mod fremmede horisonter, selvom du ved et uheld kan træde andre over tæerne i din begejstring.",
    actionTip: "Plan your next adventure. New experiences expand your wisdom and perspective.",
    actionTipDa: "Planlæg dit næste eventyr. Nye oplevelser udvider din visdom og perspektiv.",
    category: 3
  },
  "66/3": {
    number: "66/3",
    caption: "The Earth Mother",
    captionDa: "Jordmoderen",
    description: "A vibration that deals with great feminine power in the more earthly, motherly way, where one organizes, takes care of and acts in the world on the physical plane. There can be a bit of roughness, hardness, controlling, stubbornness and dominance.",
    descriptionDa: "En vibration der handler om stor feminin kraft på den mere jordnære, moderlige måde, hvor man organiserer, tager sig af og handler i verden på det fysiske plan. Der kan være lidt barskhed, hårdhed, kontrol, stædighed og dominans.",
    shortDescription: "Powerful earth-mother energy grounds you in practical nurturing. You'll feel driven to organize, protect, and care for others on the physical plane—though roughness or stubbornness may surface.",
    shortDescriptionDa: "Kraftfuld jordmoder-energi jordforbinder dig i praktisk omsorg. Du vil føle dig drevet til at organisere, beskytte og tage dig af andre på det fysiske plan—selvom barskhed eller stædighed kan dukke op.",
    actionTip: "Balance strength with softness. Your protective instincts serve best when tempered with patience.",
    actionTipDa: "Balancer styrke med blødhed. Dine beskyttende instinkter tjener bedst når de hærdes med tålmodighed.",
    category: 3
  },
  "75/3": {
    number: "75/3",
    caption: "The Philosophical Adventurer",
    description: "A vibration with a strong, focused energy and inner direction towards philosophy and ideas. In balance it's an adventurous and freedom-seeking vibration with a religious and elevated touch, but also a tendency to exaggerate one's own importance, or have excessive focus on one's own inner ideals and be pompous about them.",
    category: 3
  },
  "84/3": {
    number: "84/3",
    caption: "The Visionary Victim",
    description: "A vibration with an inner vision of a better and more peaceful world. Good at leading, and getting others to understand the importance of its ideas. Is predominantly imbalanced in the numeroscope, as it brings many trials with it due to the built-in 4-8 conflict, which can lead to one feeling like a victim.",
    category: 3
  },
  "93/3": {
    number: "93/3",
    caption: "The Talented Dynamo",
    description: "A vibration that gives a great, quick energy and ability to get into new things. One masters the knowledge of number 3 with the systematics of number 9, has great humor and many talents and skills. A small tendency to overstep others' boundaries without noticing it oneself through insensitive comments.",
    category: 3
  },
  // 4 numbers
  "13/4": {
    number: "13/4",
    caption: "The Mystical Transformer",
    captionDa: "Den Mystiske Forvandler",
    description: "The number 13 is one of the most deep and mystical numbers, which stands for both death, transformational power and a unique beauty. One removes the old to make room for the new, and it can both frighten and inspire others. One therefore cannot help but do things in their own completely unique way. If it stands with bad numbers in the numeroscope, it gives an inner dissatisfaction, where one always longs for something other than what one has, and one feels like the black sheep. Unique, thinks differently and outside the box, and always has new ideas that can transform the surroundings. A number that strengthens art, innovation and genius. Can also give money",
    descriptionDa: "Tallet 13 er et af de mest dybe og mystiske tal, som står for både død, transformationskraft og en unik skønhed. Man fjerner det gamle for at gøre plads til det nye, og det kan både skræmme og inspirere andre. Man kan derfor ikke lade være med at gøre tingene på sin helt unikke måde. Hvis det står med dårlige tal i numeroskopet, giver det en indre utilfredshed, hvor man altid længes efter noget andet end det man har, og man føler sig som det sorte får. Unik, tænker anderledes og uden for boksen, og har altid nye idéer der kan transformere omgivelserne. Et tal der styrker kunst, innovation og genialitet. Kan også give penge.",
    shortDescription: "Transformation is your superpower. Release the old to welcome profound new beginnings with unique beauty.",
    shortDescriptionDa: "Transformation er din superkraft. Slip det gamle for at byde dybe nye begyndelser velkommen med unik skønhed.",
    actionTip: "Embrace your uniqueness. What makes you different is what makes you powerful.",
    actionTipDa: "Omfavn din unikhed. Det der gør dig anderledes er det der gør dig kraftfuld.",
    category: 4
  },
  "22/4": {
    number: "22/4",
    caption: "The Fool",
    captionDa: "Narren",
    description: "The tarot card for the number 22/4 is 'The Fool' or the jester. We see a man stepping out over the cliff edge. The number stands for naivety and delusion for better and worse. It stands for new ways of doing things and that one is always ready to jump into nothingness. One puts on 'rose-colored glasses', is far too naive and gets deceived by others. Annoyances, disappointments, too good-natured",
    descriptionDa: "Tarotkortet for tallet 22/4 er 'Narren' eller gøgleren. Vi ser en mand der træder ud over klippekanten. Tallet står for naivitet og vildfarelse på godt og ondt. Det står for nye måder at gøre tingene på og at man altid er klar til at springe ud i intetheden. Man tager 'rosenrøde briller' på, er alt for naiv og bliver bedraget af andre. Irritationer, skuffelser, for godtroende.",
    shortDescription: "Take a leap of faith, but look before you jump. Your innocent heart needs the protection of wise discernment.",
    shortDescriptionDa: "Tag et spring ud i det ukendte, men kig før du springer. Dit uskyldige hjerte har brug for beskyttelse fra klog dømmekraft.",
    actionTip: "Balance optimism with realism. Trust, but keep your eyes open.",
    actionTipDa: "Balancer optimisme med realisme. Stol på, men hold øjnene åbne.",
    category: 4
  },
  "31/4": {
    number: "31/4",
    caption: "The Withdrawn Outsider",
    description: "Not a number in balance: it gives a tendency to vulnerability, autism, withdrawal, isolation. A feeling of not being able to fit in and a tendency to look down on others. Not materially fortunate",
    category: 4
  },
  "40/4": {
    number: "40/4",
    caption: "The Intellectual Isolator",
    description: "This number gives high intelligence and a tendency to number-nerdiness. One has strong and distinctive opinions about life and society, and a contrasting personality. The number contains a direct and imbalanced 4-8 tension, and should therefore preferably not stand in the numeroscope itself. Not materially fortunate. One withdraws from others, isolation",
    category: 4
  },
  "49/4": {
    number: "49/4",
    caption: "The Chaos Organizer",
    description: "A vibration that gives a great inner urge to create order out of chaos. The vibration can actually attract a lot of chaos and upheavals, which therefore necessitates that one is able to absorb the chaos and put order into it. The number also gives a very strong ability to develop step-by-step systems, and to follow them - there is an attraction to perform work that puts order into things. Inner conflict",
    category: 4
  },
  "58/4": {
    number: "58/4",
    caption: "The World Conqueror (Innovation)",
    description: "The world conqueror wants to conquer the world with new innovative ideas, which come out with enormous force. The vibration contains enormous growth potential due to the built-in number sequence 5,8,13/4. It is a number that requires strength to master, and if one cannot keep up with the pace one will end up feeling like a victim. In balance it is a super growth potential that strengthens one's career which will often be both unique and within something established. In imbalance there is chaos, disorder and one gets nothing done due to stress",
    category: 4
  },
  "67/4": {
    number: "67/4",
    caption: "The Mystical Beauty",
    description: "This vibration gives enormous charisma and mystical beauty, where those who observe become spellbound. The number 6 gives beauty and perfection and the number 7 gives transcendence and spirituality - and the transition from 6 to 7 symbolizes the journey from life until death. In balance there is love, mysticism, aesthetic sense and spirituality. Tendency to be inhibited, not grounded, shy and to feel alone and misunderstood.",
    category: 4
  },
  "76/4": {
    number: "76/4",
    caption: "The Artistic Dreamer",
    description: "This vibration gives great access to artistic creativity and aesthetics. One is very occupied with inner energies and daydreams from which one draws artistic ambition. One can become otherworldly. One can feel misunderstood and lonely, and doesn't realize that it's due to inner criticism of others and judgmental attitudes. Not very realistic",
    category: 4
  },
  "85/4": {
    number: "85/4",
    caption: "The Controlled Conqueror",
    description: "This vibration is a world conqueror combination, like 58/4 and with many of the same aspects. One is more controlled here, and thinks about the consequences of one's actions. Interested in politics, business and expansion both materially and regarding influence. Tendency to be competitive, power-hungry and insensitive. Growth potential that strengthens one's career, which will often be both unique and within something established.",
    category: 4
  },
  "94/4": {
    number: "94/4",
    caption: "The Transformational Healer",
    description: "This vibration is about changing, transforming and healing. There is a great desire to create order out of chaos, and bring harmony to disharmonious vibrations both inner and outer. One may have gone through trials in life oneself. Great inner tensions and unresolved traumas. Deep knowledge, and conveying this further in a systematic way.",
    category: 4
  },
  // 5 numbers
  "14/5": {
    number: "14/5",
    caption: "The Master Communicator",
    captionDa: "Mesterkommunikatoren",
    description: "A vibration that represents perfect mastery of the senses, right timing and mastering the art of communication and situational awareness. When balanced, one is skilled at networking, business and has luck with money, deals, and has great activity and action power on all levels of life. There can be stress, an overactive mind and one talks so much that it irritates others, if one has too many in the numeroscope. Luck with money and deals",
    descriptionDa: "En vibration der repræsenterer perfekt beherskelse af sanserne, rigtig timing og beherskelse af kommunikationskunsten og situationsbevidsthed. Når man er i balance, er man dygtig til netværk, forretning og har held med penge, aftaler, og har stor aktivitet og handlekraft på alle livets niveauer. Der kan være stress, et overaktivt sind og man taler så meget at det irriterer andre, hvis man har for mange i numeroskopet. Held med penge og aftaler.",
    shortDescription: "Communication flows effortlessly from you. Your timing is impeccable—use your networking gifts wisely.",
    shortDescriptionDa: "Kommunikation flyder ubesværet fra dig. Din timing er upåklagelig—brug dine netværksevner klogt.",
    actionTip: "Network strategically. Your words open doors—make every conversation count.",
    actionTipDa: "Netværk strategisk. Dine ord åbner døre—gør hver samtale betydningsfuld.",
    category: 5
  },
  "23/5": {
    number: "23/5",
    caption: "The Lion's Royal Star",
    captionDa: "Løvens Kongelige Stjerne",
    description: "The number called the highest vibration, gives great protection in life in everything we do. It gives great flow and luck in life, where things come to one with incredible ease. It adds healing, love and self-confidence as well as enormous charisma and protection. In addition, great speech gifts and a feeling of abundance in life. One of the greatest money numbers in numerology. Success, joy, love, self-confidence.",
    descriptionDa: "Tallet kaldes den højeste vibration, giver stor beskyttelse i livet i alt hvad vi gør. Det giver stort flow og held i livet, hvor tingene kommer til én med utrolig lethed. Det tilføjer healing, kærlighed og selvtillid samt enorm karisma og beskyttelse. Derudover store talegaver og en følelse af overflod i livet. Et af de største pengetal i numerologi. Succes, glæde, kærlighed, selvtillid.",
    shortDescription: "Royal energy protects and blesses you. Everything flows with ease—embrace this abundant, charismatic time.",
    shortDescriptionDa: "Kongelig energi beskytter og velsigner dig. Alt flyder med lethed—omfavn denne overflods- og karismatiske tid.",
    actionTip: "Share your abundance. When you're blessed, bless others—the flow multiplies.",
    actionTipDa: "Del din overflod. Når du er velsignet, velsign andre—flowet multipliceres.",
    category: 5
  },
  "32/5": {
    number: "32/5",
    caption: "The Influential Communicator",
    description: "The vibration gives strong communication that makes others want to follow one. A successful communicator who brings others along. It has great strength and dignity, and has strong charisma, magic and leadership abilities. It's a fantastic career and money number that also gives luck in love and with groups of people.",
    category: 5
  },
  "41/5": {
    number: "41/5",
    caption: "The Innovative Leader",
    description: "The vibration gives an innovative mind, the ability to communicate original ideas and a strong business mindset. One is good at setting healthy boundaries, has a winner mentality and drive, luck in money and love, and creates a strong foundation in life. One knows what one wants and goes after it. One masters one's emotions and has good situational awareness. (4 & 1 are shadow numbers of each other; super match)",
    category: 5
  },
  "50/5": {
    number: "50/5",
    caption: "The Cosmic Communicator",
    description: "The 0 in 50/5 adds a spiritual or cosmic dimension to one's communication. The number gives great spellbinding charisma and communication. Enormous amounts of love and a giving attitude. One easily gets into the media and formulates complex and philosophical principles in a playfully light and free way. Luck in money, love and business; a magical number",
    category: 5
  },
  "59/5": {
    number: "59/5",
    caption: "The Extreme Achiever",
    description: "A super-ambitious, eloquent and goal-oriented vibration. One loves a career with lots of change, travel activity and new connections. One may have a preference for extreme experiences such as bungee jumping and fast driving. It adds strong 'branding skills', ambitions, eloquence and charismatic communication that hits right to the essence. Also luck in money, love and business",
    category: 5
  },
  "68/5": {
    number: "68/5",
    caption: "The Social Organizer",
    description: "A vibration with high social consciousness and high ideals around society and family. It is aesthetic, strong, harmonious, loving and has organizational and networking talent. Luck in money, love and business",
    category: 5
  },
  "77/5": {
    number: "77/5",
    caption: "The Spiritual Master",
    description: "A vibration that deals with strong spirituality and the ability to transform one's own emotions and lower tendencies to a higher vibration. It is a master number (double 7) that requires strength to master, but in return gives enormous spiritual strength and power, as well as luck in money, business and love.",
    category: 5
  },
  "86/5": {
    number: "86/5",
    caption: "The Event Organizer",
    description: "The vibration gives great ability to organize social events and mobilize large groups of people. One is service-minded, loving and has strong self-control. Good aesthetic sense and cares about details as well as the overall picture and wholeness. In balance it adds a strong, loving vibe, organizational talent, luck in money, love, business and good speech gifts.",
    category: 5
  },
  "95/5": {
    number: "95/5",
    caption: "The Spin Doctor",
    description: "A strong vibration that masters communication in every conceivable way. A real spin doctor number or branding expert. Great media coverage and the ability to sell sand in the Sahara. The number for luck in business, love, money, and for great speech gifts, a brilliantly quick mind, fantastic at brainstorming and getting smart ideas. One can control energy with will, endurance and focus.",
    category: 5
  },
  // 6 numbers
  "15/6": {
    number: "15/6",
    caption: "The Magical Temptress",
    captionDa: "Den Magiske Fristersske",
    description: "A strong, feminine vibration that contains great erotic and magical power, pleasure and sensuality, aesthetic sense and artistic abilities. The number 'shines into the darkness' and heals others. When appearing more than once in a numeroscope, there is a tendency to be manipulative, moody, jealous and deceitful. The ego and unprocessed emotions rule. The number is the most occult number, which gives the ability to travel between worlds and consciousness planes or mental illness/instability.",
    descriptionDa: "En stærk, feminin vibration der indeholder stor erotisk og magisk kraft, nydelse og sensualitet, æstetisk sans og kunstneriske evner. Tallet 'lyser ind i mørket' og healer andre. Når det optræder mere end én gang i et numeroskop, er der en tendens til at være manipulerende, lunefuld, jaloux og bedragerisk. Egoet og uforarbejdede følelser styrer. Tallet er det mest okkulte tal, som giver evnen til at rejse mellem verdener og bevidsthedsniveauer eller mental sygdom/ustabilitet.",
    shortDescription: "Magnetic power flows through you. Channel your sensuality and creativity into healing light, not shadow play.",
    shortDescriptionDa: "Magnetisk kraft flyder gennem dig. Kanaliser din sensualitet og kreativitet ind i helbredende lys, ikke skyggeleg.",
    actionTip: "Use your allure consciously. Your magic transforms when aligned with integrity.",
    actionTipDa: "Brug din tiltrækning bevidst. Din magi transformerer når den er på linje med integritet.",
    category: 6
  },
  "24/6": {
    number: "24/6",
    caption: "The Venus Power",
    captionDa: "Venuskraften",
    description: "The vibration stands for strength united with wisdom, harmony, creativity and gentleness. It is a Venus vibration that deals with love and harmonious family life, personal magnetism and attractiveness. One is full of love, trust, femininity and has luck in business. One attracts help from people in 'higher positions' and one has great luck in love",
    descriptionDa: "Vibrationen står for styrke forenet med visdom, harmoni, kreativitet og blødhed. Det er en Venus-vibration der handler om kærlighed og harmonisk familieliv, personlig magnetisme og tiltrækningskraft. Man er fuld af kærlighed, tillid, femininitet og har held i forretning. Man tiltrækker hjælp fra mennesker i 'højere positioner' og man har stort held i kærlighed.",
    shortDescription: "Venus blesses you with love, beauty and harmony. Your magnetism attracts wonderful people and opportunities.",
    shortDescriptionDa: "Venus velsigner dig med kærlighed, skønhed og harmoni. Din magnetisme tiltrækker vidunderlige mennesker og muligheder.",
    actionTip: "Nurture your relationships. Love given freely returns multiplied.",
    actionTipDa: "Plej dine relationer. Kærlighed givet frit vender tilbage mangedoblet.",
    category: 6
  },
  "33/6": {
    number: "33/6",
    caption: "The Pillar of Light",
    description: "A vibration that deals with inner strength and transforming one's lower emotions to a higher, loving energy. There is an inner core of wisdom and strong principles that one is supported in living up to. In balance, the vibration adds the ability to overcome one's own lower tendencies and become a strong pillar of light and love. It is a master number (double 3). Good at achieving what one desires, as one can complete one's dreams without too many ups and downs.",
    category: 6
  },
  "42/6": {
    number: "42/6",
    caption: "The World Healer",
    description: "The vibration deals with healing, love and creating positive changes in the world, and one meets help to heal oneself. In balance, the vibration adds idealism, love and power to change the world in a unique way. Help from other people",
    category: 6
  },
  "51/6": {
    number: "51/6",
    caption: "The Ruthless Climber",
    description: "The vibration deals with advancing to new heights through one's charismatic, strategic and social abilities. It is a warlike vibration where the end can justify the means, and it is not used in the numeroscope. There can be a tendency to interfere and pry into others' affairs to reach the top oneself. Warns against enemies",
    category: 6
  },
  "60/6": {
    number: "60/6",
    caption: "The Dramatic Victim",
    description: "Stubborn, dramatic, warlike and dissatisfied, feeling like a victim and being afraid of getting hurt. Enemies. Warnings",
    category: 6
  },
  "69/6": {
    number: "69/6",
    caption: "The Yin-Yang Manipulator",
    description: "The vibration is one of the most mystical numbers that contains a strong tension between masculine and feminine energy, and is a symbol of yin and yang. It works from the hidden/concealed and can use feminine cunning, charm and charisma to achieve its desires in a 'political' way i.e. drama, manipulation and using one's powers selfishly. 'Assassination'",
    category: 6
  },
  "78/6": {
    number: "78/6",
    caption: "The Dark Occultist",
    description: "There lies great knowledge of the occult as well as exceptional intuition in this vibration. It is the most occult number, for example there are 78 tarot cards. One uses one's occult abilities to 'see through' the enemy and pull strings in the hidden, which leads to drama, manipulation and selfishness, as well as a split between the material and spiritual. Warlike, scheming in a bad way",
    category: 6
  },
  "87/6": {
    number: "87/6",
    caption: "The Hidden Master",
    description: "A vibration that is the occultist's (78/6) teacher, who keeps his abilities to himself and is more adapted in society and more conforming on the outer plane. But inside he is a master who controls the universal laws and has great occult abilities. The number gives the ability to get things done in an easy, elegant and super smart way, where one makes use of one's many abilities and social 'skills', strategic sense and speech gifts. One is a master in both the outer and inner world and can easily advance within army, navy and politics.",
    category: 6
  },
  "96/6": {
    number: "96/6",
    caption: "The Charmer",
    description: "A vibration that masters the interplay between masculine and feminine energy. In balance, the number is full of love and consciousness. One masters one's emotions, charm and charisma and simultaneously has high awareness about oneself and others. It gives strong charisma and attractiveness that makes one charming and attractive to others, not least to the opposite sex. Here this power is used selfishly/in a warlike manner",
    category: 6
  },
  // 7 numbers
  "16/7": {
    number: "16/7",
    caption: "The Fallen Tower",
    captionDa: "Det Faldne Tårn",
    description: "A vibration traditionally called 'the loss number' and deals with being struck by loss like lightning from a clear sky. The number as an essence number deals with one of the deepest life lessons; that nothing lasts forever. And it is a reminder not to hold onto anything of the physical world. The number is never used in the numeroscope, as it can attract a feeling of isolation, loneliness, struggling, loss, anxiety and fear. Life-threatening fate, wounds on the soul, jealousy, violence, destruction of one's plans.",
    descriptionDa: "En vibration der traditionelt kaldes 'tabstallet' og handler om at blive ramt af tab som lyn fra en klar himmel. Tallet som essenstal handler om en af de dybeste livslektioner; at intet varer evigt. Og det er en påmindelse om ikke at holde fast i noget af den fysiske verden. Tallet bruges aldrig i numeroskopet, da det kan tiltrække en følelse af isolation, ensomhed, kamp, tab, angst og frygt. Livstruende skæbne, sår på sjælen, jalousi, vold, ødelæggelse af ens planer.",
    shortDescription: "A tower falls to make way for something new. Release attachments and trust that loss opens doors to rebirth.",
    shortDescriptionDa: "Et tårn falder for at gøre plads til noget nyt. Slip tilknytninger og stol på at tab åbner døre til genfødsel.",
    actionTip: "Let go of what's crumbling. Your hands need to be empty to receive what's coming.",
    actionTipDa: "Slip hvad der smuldrer. Dine hænder skal være tomme for at modtage hvad der kommer.",
    category: 7
  },
  "25/7": {
    number: "25/7",
    caption: "The Passionate Seeker",
    description: "The vibration deals with following one's passion, knowing oneself, awakening one's intuition and following one's heart. It is an international vibe that can attract travel, adventurous spirit and friends from other countries. One uses the senses, sensuality and creativity to achieve deeper wisdom and has a playful, spiritual and universally loving energy. Gives strength through experiences, money and success. Too strong for a small child",
    category: 7
  },
  "34/7": {
    number: "34/7",
    caption: "The Spiritual Businessman",
    description: "The vibration deals with connecting the spiritual with the material. One has an ability to create step-by-step systems to achieve deeper recognition, and can be a professional leader in a field, or a business with a higher purpose. In balance, the number adds an almost priest-like vibe that attracts others around due to one's great wisdom. The ability to get the inner spiritual wisdom acted out and get something out of it. Strength, money and success. Too strong for a small child",
    category: 7
  },
  "43/7": {
    number: "43/7",
    caption: "The Revolutionary",
    description: "The vibration gives great political abilities. He has great, revolutionary ideals, and can communicate with strength and grand gestures. It shows a new and higher way. There is a tendency to be rebellious, and create chaotic upheavals that are not constructive = conflict and fiascos.",
    category: 7
  },
  "52/7": {
    number: "52/7",
    caption: "The Chaotic Philosopher",
    description: "Philosophical, popular and curious about experiences and other people. This vibration adds in balance great adventurousness, sense of humor, warmth and universality. The number is full of problems, obstacles, conflict and fiascos. Chaotic upheavals, verbally aggressive",
    category: 7
  },
  "61/7": {
    number: "61/7",
    caption: "The Joyless Preacher",
    description: "Letting go of the material world to move onto a spiritual path. There are too many principles about correct living that are imposed on others against their wishes and a lack of joy in life. Revolution, conflict and trials",
    category: 7
  },
  "70/7": {
    number: "70/7",
    caption: "The Cosmic Analyst",
    description: "A spiritual, cosmic, intuitive and introspective vibration. One analyzes problems on all planes of life and finds the most 'mature' and profound solutions. A literary and scientific vibe that accumulates knowledge, which over time becomes wisdom. One is surrounded by chaos, is super critical and doesn't want to be present in the world. Obstacles, upheavals",
    category: 7
  },
  "79/7": {
    number: "79/7",
    caption: "The Polarized Seeker",
    description: "A vibration that is often either super spiritual or super scientific/atheistic. But common to these two 'types' is the ability to analyze and understand the underlying truth. Tendency to be fearful, self-critical and expect the worst. Very unbalanced; like living at the North Pole and working at the South Pole (an angel and a general)",
    category: 7
  },
  "88/7": {
    number: "88/7",
    caption: "The Paralyzed Mystic",
    description: "Charisma and fascinating power. But also a fearful nature where one is afraid of the consequences of one's actions. In the number lies a strong lesson about learning from one's mistakes, from this or previous lives. Difficult energy to handle. One can feel paralyzed, and unable to take action due to inner conflict and doubt. Revolution",
    category: 7
  },
  "97/7": {
    number: "97/7",
    caption: "The Dark Guru",
    description: "The number stands for transcendence of reality, and getting all the way to the essence of things. The number gives an understanding of the most existentialist aspects of existence, and is not afraid to go out into the mind's corners and explore the edge between life and death, light and dark, emptiness, eternity and truth. An incredibly profound and intuitive vibration. 'Unscrupulous guru', a frightening opponent. Deep anxiety and fear, obstacles, fiascos",
    category: 7
  },
  // 8 numbers
  "17/8": {
    number: "17/8",
    caption: "The Star of Magic",
    captionDa: "Magiens Stjerne",
    description: "A vibration that deals with peace, love, the universe and art. It adds a 'celebrity' vibe and unique charm that attracts positive attention and star status; one's name is remembered and one can become famous. In balance it is a number that adds archetypal beauty, and an ability to channel divine art or wisdom, great learning ability and high intellect. In imbalance one attracts negative spotlight, can become unpopular for the slightest 'mistake' or receive great public criticism. It is therefore a vibration that is only good in a 100% pure numeroscope.",
    descriptionDa: "En vibration der handler om fred, kærlighed, universet og kunst. Den tilføjer en 'kendis' vibe og unik charme der tiltrækker positiv opmærksomhed og stjernestatus; ens navn huskes og man kan blive berømt. I balance er det et tal der tilføjer arketypisk skønhed, og en evne til at kanalisere guddommelig kunst eller visdom, stor læringsevne og høj intelligens. I ubalance tiltrækker man negativt spotlight, kan blive upopulær for den mindste 'fejl' eller modtage stor offentlig kritik. Det er derfor en vibration der kun er god i et 100% rent numeroskop.",
    shortDescription: "Star quality shines through you. Your unique charm attracts recognition—channel it into art and wisdom.",
    shortDescriptionDa: "Stjernekvalitet skinner gennem dig. Din unikke charme tiltrækker anerkendelse—kanaliser det ind i kunst og visdom.",
    actionTip: "Create with intention. Your spotlight illuminates whatever you focus on—choose wisely.",
    actionTipDa: "Skab med intention. Dit spotlight oplyser hvad end du fokuserer på—vælg klogt.",
    category: 8
  },
  "26/8": {
    number: "26/8",
    caption: "The Catastrophic Lesson",
    description: "A very bad number. In the number lies a lesson about following one's own path and not leaving responsibility to others, but being one's own best teacher, as one must be on guard not to be cheated in work and money. It brings disasters through others, ruin through speculation, bad partners and wrong advice. It can also deal with violence",
    category: 8
  },
  "35/8": {
    number: "35/8",
    caption: "The Warrior Chief",
    description: "The vibration deals with learning lessons about strength, influence and personal power. One can be the 'good' chief who protects and stands up for the chosen others, but there is a tendency to be warlike, power-hungry and vengeful. It is a hard vibration where one is on guard not to be cheated. Disasters through others and ruin",
    category: 8
  },
  "44/8": {
    number: "44/8",
    caption: "The Master Transformer",
    description: "This is a master number that requires great work to master fully. It deals with changing, healing, regenerating and building through disasters through others, and one must be on guard all the time. One goes through a long learning process. One can face tremendous resistance in life.",
    category: 8
  },
  "53/8": {
    number: "53/8",
    caption: "The Powerful Fighter",
    description: "The vibration is stronger and more balanced than the reverse 35/8. It deals with taking one's power and strength home; however through struggle. One fights for the things one holds dear, yes everything in life, and stands up for one's cause. It gives a strong ability to earn money, high self-confidence and great authority in one's appearance. One meets the wrong partners and wrong advice, so one can be ruined and end up in disasters.",
    category: 8
  },
  "62/8": {
    number: "62/8",
    caption: "The Controlling Protector",
    description: "There is a tendency to want to organize one's family and take care of them. Sometimes more than they wish. There is a tendency to be controlling and dominating. But one will do anything to defend those one holds dear; one is also stubborn. One experiences disasters, ruin, wrong advice, being cheated in work and money",
    category: 8
  },
  "71/8": {
    number: "71/8",
    caption: "The Magic Creator",
    description: "The vibration is a reversal of 17/8, the star of magic, but here there is more focus on having total control over the magical, charismatic aspects. Where 17/8 is a channel for divine energy, 71/8 is the one who creates the magic. With depth one creates fascinating products or creations. The number can be the magician's magical control, where one has the audience in the palm of one's hand, or there is a tendency toward negative spotlight, and being seen as manipulative and warlike. Here one also experiences ruin and disasters through others",
    category: 8
  },
  "80/8": {
    number: "80/8",
    caption: "The Cosmic Power",
    description: "The vibration contains the 0 which creates a cosmic flow to the 8 energy which becomes elevated in its spiritual, but powerful vibe. It adds magical, occult forces that can be used in everything from art to business or influence in society. It is also hard, violence, and one must be on guard not to be cheated emotionally, in work and with money. It can be catastrophic",
    category: 8
  },
  "89/8": {
    number: "89/8",
    caption: "The Artistic Genius",
    description: "The vibration deals with artistic genius, refined emotions and aesthetic sense. One masters something fully and perfects it. One has occult abilities and knowledge. There is a tendency to feel that life is hard and filled with karma and trials, which can make one use one's occult powers for one's own benefit and thereby go wrong, choose wrong and one can be ruined due to wrong advice, bad partners and being cheated financially, professionally and emotionally",
    category: 8
  },
  "98/8": {
    number: "98/8",
    caption: "The Eternal Builder",
    description: "The vibration deals with what one builds lasting for eternity. Everything one does is measured against a greater purpose. One efficiently builds what is needed to reach the next level. Great art, great projects that raise consciousness. One does things for humanity rather than to promote material gain. One feels sunk in problems and attracts negative attention, trials on all levels and conflicts. Great learning processes",
    category: 8
  },
  // 9 numbers
  "18/9": {
    number: "18/9",
    caption: "The Principled Warrior",
    captionDa: "Den Principfaste Kriger",
    description: "This vibration deals with postponing needs to achieve goals one has set for oneself, and thereby gaining even greater joy. One is a warrior with principles, and has a strong understanding of hierarchy, and the ability to sacrifice oneself for the service of a higher cause. It is not used in the numeroscope as it can represent too hard an energy that shuts down emotions.",
    descriptionDa: "Denne vibration handler om at udsætte behov for at opnå mål man har sat for sig selv, og derved opnå endnu større glæde. Man er en kriger med principper, og har en stærk forståelse af hierarki, og evnen til at ofre sig selv i tjeneste for en højere sag. Det bruges ikke i numeroskopet da det kan repræsentere for hård en energi der lukker ned for følelser.",
    shortDescription: "Discipline serves your highest purpose. Your principles guide you to meaningful victories worth the sacrifice.",
    shortDescriptionDa: "Disciplin tjener dit højeste formål. Dine principper guider dig til meningsfulde sejre der er ofret værd.",
    actionTip: "Stay true to your values. Delayed gratification brings greater rewards.",
    actionTipDa: "Forbliv tro mod dine værdier. Udskudt tilfredsstillelse bringer større belønninger.",
    category: 9
  },
  "27/9": {
    number: "27/9",
    caption: "The Self-Leader",
    captionDa: "Selvlederen",
    description: "This vibration deals with creating strong inner self-leadership where one both does what needs to be done, but at a pace and in a way where one is true to oneself and takes care of one's needs and feelings. One is also a team leader, an authority who understands people and is motivating. There is also a tendency to work hard and complete one's ideas with success. A strong and lucky number with lots of love",
    descriptionDa: "Denne vibration handler om at skabe stærkt indre selvlederskab hvor man både gør hvad der skal gøres, men i et tempo og på en måde hvor man er tro mod sig selv og tager sig af sine behov og følelser. Man er også en teamleder, en autoritet der forstår mennesker og er motiverende. Der er også en tendens til at arbejde hårdt og fuldende sine idéer med succes. Et stærkt og heldigt tal med masser af kærlighed.",
    shortDescription: "Lead yourself first, then inspire others. Your balanced authority motivates teams toward success.",
    shortDescriptionDa: "Led dig selv først, inspirer så andre. Din balancerede autoritet motiverer teams mod succes.",
    actionTip: "Model what you teach. Your self-mastery is your greatest leadership tool.",
    actionTipDa: "Modeller hvad du underviser. Din selvbeherskelse er dit største ledelsesværktøj.",
    category: 9
  },
  "36/9": {
    number: "36/9",
    caption: "The Magical Leader",
    captionDa: "Den Magiske Leder",
    description: "This vibration deals with leadership, success and expansion. With its 3-6-9 triad it is one of the most treasured 9 numbers, which gives a 'magical' strength where one manages to attract what one desires in life. It adds personal power and strength, intelligence, leadership and the ability to create something big and meaningful in the world. Strong and goal-oriented and a bit 'egoistic and controlling'. Lucky",
    descriptionDa: "Denne vibration handler om lederskab, succes og ekspansion. Med sin 3-6-9 triade er det et af de mest skattede 9-tal, som giver en 'magisk' styrke hvor man formår at tiltrække hvad man ønsker i livet. Det tilføjer personlig magt og styrke, intelligens, lederskab og evnen til at skabe noget stort og meningsfuldt i verden. Stærk og målrettet og lidt 'egoistisk og kontrollerende'. Heldig.",
    shortDescription: "Magical leadership flows through you. Attract what you desire by creating meaningful impact in the world.",
    shortDescriptionDa: "Magisk lederskab flyder gennem dig. Tiltræk hvad du ønsker ved at skabe meningsfuld indflydelse i verden.",
    actionTip: "Dream big, then execute. Your 3-6-9 power manifests when vision meets action.",
    actionTipDa: "Drøm stort, derefter eksekvér. Din 3-6-9 kraft manifesterer når vision møder handling.",
    category: 9
  },
  "45/9": {
    number: "45/9",
    caption: "The Innovative Visionary",
    description: "This vibration is innovative, action-oriented and communicative. Is results-oriented and 'cool' under stress. Builds strong foundations for the future and is interested in new technology, philanthropy and charity. One can be a bit choleric, contrary and lack situational awareness, but it is a visionary thought leader who paves the way for the future's positive development, and one completes one's ideas with success.",
    category: 9
  },
  "54/9": {
    number: "54/9",
    caption: "The Master Communicator",
    description: "In addition to strong leadership, this vibration also has super clear and structured communication. Networking abilities, eloquence and able to change behavior in smart, scientific and well-thought-out/innovative ways. A natural talent in communication, leadership and execution. Strong and lucky",
    category: 9
  },
  "63/9": {
    number: "63/9",
    caption: "The Strategic Powerhouse",
    description: "The vibration is enormously strong and power-conscious, and masculine-feminine. Has great strategic sense and ability to accomplish one's goals and also to get one's personal will through. With great strength also comes great responsibility. There can be a bit of acting and drama to get one's initiatives through. Good persuasion techniques and the ability to achieve success with one's ideas. Love.",
    category: 9
  },
  "72/9": {
    number: "72/9",
    caption: "The Wise Humanitarian",
    description: "The vibration deals with wisdom, professional competence and thoroughness. A very humanistic number that wants humanity's well-being and has a great spiritual approach to life. Focused on finding solutions, great compassion and sense of community. One carries out one's ideas with success (also for the benefit of others). Love and strength",
    category: 9
  },
  "81/9": {
    number: "81/9",
    caption: "The Mental Warrior",
    description: "The vibration is like a mental warrior who practices, trains or improves until things fit perfectly, and one is sure that one is the best, and able to win. Can be exceptionally warlike, impatient and hot-tempered. Doesn't tolerate being contradicted well and may have control issues. A bit too hard. Choose one of the other numbers in the series",
    category: 9
  },
  "90/9": {
    number: "90/9",
    caption: "The Cosmic Warrior",
    description: "The vibration deals with finding the essence of things, and one is a cosmic warrior who is always in full action and activity - but is always a 'channel' for a universal cause - human and universe. It is a bit uncompromising and things are said without circumlocution, and one can seem fanatical - but often it is because a person with ordinary consciousness level is not able to see the divine source behind 90/9's actions. Authority, power and strength, completion",
    category: 9
  },
  "99/9": {
    number: "99/9",
    caption: "The Ultimate Completer",
    description: "The vibration deals with completing one's life lessons, goals, dreams and initiatives, no matter what it costs. Sometimes completion is the goal in itself. 99/9 is the end of a cycle, and the completion of the ultimate goal. It is self-discipline in its extreme consequence. It is ultimate strength and courage from the triple 9 energy. One is often misunderstood by other numbers who cannot keep up. It can seem hard and powerful to more emotionally oriented people. The number adds power, strength, drive and ability to complete.",
    category: 9
  }
};

/**
 * Gets the compound number interpretation based on the compound number string
 */
export const getCompoundNumberInterpretation = (compoundNumber: string): CompoundNumberInterpretation | undefined => {
  return compoundNumberInterpretations[compoundNumber];
};

/**
 * Reduces a multi-digit number to a single digit by repeatedly summing its digits
 */
export const reduceToSingleDigit = (number: number): number => {
  while (number >= 10) {
    let sum = 0;
    let tempNumber = number;
    while (tempNumber > 0) {
      sum += tempNumber % 10;
      tempNumber = Math.floor(tempNumber / 10);
    }
    number = sum;
  }
  return number;
};

/**
 * Calculates mid values for an array by adding a value to each element
 */
export const calculateMidValues = (array: (string | number)[], add: string | number): (string | number)[] => {
  const newArray: (string | number)[] = [];

  let addValue: number;
  if (add.toString().includes("/")) {
    addValue = parseInt(add.toString().split("/")[1]);
  } else {
    addValue = parseInt(add.toString());
  }

  for (const value of array) {
    let lastPart: number;
    if (value.toString().includes("/")) {
      lastPart = parseInt(value.toString().split("/")[1]);
    } else {
      lastPart = parseInt(value.toString());
    }

    let newValue: number | string = lastPart + addValue;
    if (newValue > 9) {
      newValue = newValue + "/" + reduceToSingleDigit(newValue);
    }
    newArray.push(newValue);
  }

  return newArray;
};

/**
 * Calculates circle values from an array by summing first and last elements
 */
export const calculateCircleValues = (array: (string | number)[]): string | number => {
  let firstValue = array[0];
  if (firstValue.toString().includes("/")) {
    firstValue = parseInt(firstValue.toString().split("/")[1]);
  }

  let lastValue = array[array.length - 1];
  if (lastValue.toString().includes("/")) {
    lastValue = parseInt(lastValue.toString().split("/")[1]);
  }

  const sum = parseInt(firstValue.toString()) + parseInt(lastValue.toString());
  if (sum > 9) {
    return sum + "/" + reduceToSingleDigit(sum);
  }
  return sum;
};

/**
 * Sanitizes a name for numerology calculation by handling special characters
 * - Apostrophes are removed (o'brien → obrien)
 * - Hyphens become spaces (anne-dorthe → anne dorthe)
 * - Other special characters become spaces
 */
export const sanitizeNameForCalculation = (name: string): string => {
  // First, remove apostrophes completely (o'brien → obrien)
  let sanitized = name.replace(/'/g, '');

  // Replace hyphens and other special characters (except apostrophes, already removed) with spaces
  // Keep only letters and spaces
  sanitized = sanitized.replace(/[^a-zA-ZÅÆØåæø\s]/g, ' ');

  // Replace multiple spaces with single space and trim
  return sanitized.replace(/\s+/g, ' ').trim();
};

/**
 * Creates name values from a full name and upper diamond value
 */
export const createNameValues = (name: string, upper: number): (string | number)[] => {
  const nameArray: (string | number)[] = [];
  const newArray: (string | number)[] = [];

  // Sanitize the name to replace special characters with spaces
  const sanitizedName = sanitizeNameForCalculation(name);
  const nameWords = sanitizedName.split(" ").filter(word => word.length > 0);

  for (const word of nameWords) {
    let tempResult = 0;
    for (const char of word.toUpperCase()) {
      if (letterToNumberMap[char]) {
        tempResult += letterToNumberMap[char];
      }
    }

    const nameValue = tempResult;
    const secondPart = reduceToSingleDigit(tempResult);
    const finalValue = nameValue + "/" + secondPart;
    nameArray.push(finalValue);
  }

  for (let i = 0; i < nameArray.length; i++) {
    const value = nameArray[i];
    if (parseInt(value.toString()) < 10) {
      const sum = parseInt(value.toString()) + upper;
      const newValue = sum + "/" + reduceToSingleDigit(sum);
      newArray.push(newValue);
    } else {
      newArray.push(value);
    }
  }

  return newArray;
};

/**
 * Calculates the complete numerology data from name and birth date
 */
export const calculateNumerologyData = (name: string, birthDate: Date | null): NumerologyData => {
  if (!birthDate) {
    throw new Error("Birth date is required");
  }

  const birthDay = birthDate.getDate();
  const dateValue = reduceToSingleDigit(birthDay);
  const diamond_upper_value = reduceToSingleDigit(birthDay);

  // Calculate name values
  const nameValues = createNameValues(name, diamond_upper_value);

  // Calculate diamond lower value (sum of last part of name values)
  let sum_second_part_values = 0;
  for (const value of nameValues) {
    let lastPart: number;
    if (value.toString().includes("/")) {
      lastPart = parseInt(value.toString().split("/")[1]);
    } else {
      lastPart = parseInt(value.toString());
    }
    sum_second_part_values += lastPart;
  }

  let diamond_lower_value: string | number = sum_second_part_values;
  if (sum_second_part_values > 9) {
    diamond_lower_value = sum_second_part_values + "/" + reduceToSingleDigit(sum_second_part_values);
  }

  // Calculate mid values
  const diamond_lower_mid = calculateMidValues(nameValues, diamond_lower_value);
  const diamond_upper_mid = calculateMidValues(nameValues, diamond_upper_value);

  // Calculate circle values
  const upper_circle = calculateCircleValues(diamond_upper_mid);
  const lower_circle = calculateCircleValues(diamond_lower_mid);

  const diamond_upper_circle = [upper_circle];
  const diamond_lower_circle = [lower_circle];

  // Handle middle names if present
  let midNameValues: (string | number)[] = [];
  let diamond_upper_lower_circle: (string | number)[] = [];
  let diamond_lower_lower_circle: (string | number)[] = [];

  if (nameValues.length > 2) {
    midNameValues = nameValues.slice(1, -1);
    diamond_upper_lower_circle = calculateMidValues(midNameValues, diamond_upper_circle[0]);
    diamond_lower_lower_circle = calculateMidValues(midNameValues, diamond_lower_circle[0]);
  }

  // Get birthday interpretation
  const birthdayInterpretation = getBirthdayInterpretation(dateValue);

  // Get compound number interpretations for name values
  const compoundNumberInterpretations: CompoundNumberInterpretation[] = [];

  for (const nameValue of nameValues) {
    const compoundKey = nameValue.toString();
    const interpretation = getCompoundNumberInterpretation(compoundKey);
    if (interpretation) {
      compoundNumberInterpretations.push(interpretation);
    }
  }

  return {
    name,
    birthDate,
    birthDay,
    nameValues,
    midNameValues,
    dateValue,
    diamond_upper_value,
    diamond_lower_value,
    diamond_upper_mid,
    diamond_lower_mid,
    diamond_upper_circle,
    diamond_upper_lower_circle,
    diamond_lower_circle,
    diamond_lower_lower_circle,
    birthdayInterpretation,
    compoundNumberInterpretations
  };
};