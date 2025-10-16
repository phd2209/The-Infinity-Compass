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
  description: string;
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
const compoundNumberInterpretations: Record<string, CompoundNumberInterpretation> = {
  "10/1": {
    number: "10/1",
    caption: "The Wheel of Fate / Wheel of Fortune",
    description: "A vibration that deals with luck, being loved and guided by the cosmos. In balance one is lucky, optimistic and loved. In imbalance one can become flighty, stressed and hyperactive as well as experience being 'loved or hated'. (e.g. If there are too many wheels of fortune or it 'spins' with a bad number)",
    category: 1
  },
  "19/1": {
    number: "19/1",
    caption: "Prince of Heaven",
    description: "A vibration that is also called 'everything one touches turns to gold/success'. Exceptional drive, luck and winner mentality, pure thoughts and a pure heart. In balance one is lucky, guided and successful. In imbalance one can be selfish, spoiled and childish.",
    category: 1
  },
  "28/1": {
    number: "28/1",
    caption: "",
    description: "A vibration that deals with big promises that come to nothing, and also potentially deals with lawsuits and conflict. One promises more than one keeps, being deceitful or a 'faker'. Trust in the wrong people who do not wish one well. Loss, tears, starting over",
    category: 1
  },
  "37/1": {
    number: "37/1",
    caption: "",
    description: "A vibration that gives a 'celebrity' vibe, and is about the courage and self-confidence to stand by oneself, live out one's dreams and step forward as who one is. In balance one is respected and admired and has a good love and sex life and enormous charisma. Luck in friendships, business and everything with money. In imbalance one can be surrounded by drama, scandals, financial and relationship problems.",
    category: 1
  },
  "46/1": {
    number: "46/1",
    caption: "The World Transformer",
    description: "A vibration that deals with improving and transforming the surroundings for the common good, and breaking through in one's career, often with large projects and philanthropic ideas. In balance one has great leadership abilities, charisma, strength and political acumen. One wants to change the world with 'peace, love & harmony'. Luck in money, love and friendships. In imbalance there is a tendency to skip necessary steps and radiate a superficial 'glamorous image' vibe.",
    category: 1
  },
  "55/1": {
    number: "55/1",
    caption: "The Communication Master",
    description: "A vibration that deals with reaching the top by becoming a master of communication. 55 is a master number (two of the same number) which means it takes time to master the number. In balance it's about having a huge radiance that gives success with media and various communication channels and achieving great success. Luck in money, friendships, love. In imbalance it's very much about going after what one wants at any cost, and being so ambitious that one resorts to unethical methods.",
    category: 1
  },
  "64/1": {
    number: "64/1",
    caption: "The Wise Reformer",
    description: "A vibration that deals with seeing what works and what doesn't work, and creating the necessary changes. In balance one is a wise man with great ideas that take into account the common good/love in the world. In imbalance one can appear a bit dry, overly critical/stubborn, know-it-all and like a 'know-it-all'.",
    category: 1
  },
  "73/1": {
    number: "73/1",
    caption: "The Ingenious Pioneer",
    description: "A vibration that deals with creating brilliant and innovative things for the benefit of a better world, which can lead to great wealth without it being noticed. One has an enormous pioneer spirit and ability to lead and becomes wealthy. In balance one radiates beauty, strength and genius. Here it's not 'for money's sake'. In imbalance there can be a fatigue of being with other people and excessive need for privacy.",
    category: 1
  },
  "82/1": {
    number: "82/1",
    caption: "The Invincible Leader",
    description: "A vibration that gives an invincible and strong winner mentality, with many talents used to lift a community. In balance one is talented, expansive and a strong leader who lifts as a flock. In imbalance it gives anger, lack of consideration, and inner struggle without results, and can attract lawsuits. Very vulnerable",
    category: 1
  },
  "91/1": {
    number: "91/1",
    caption: "The World Conqueror",
    description: "A magnificent and expansive vibration that wants to conquer the world with its new ideas. In balance it gives enormous success and has great inspiration and speaking gifts. Focused, strong, luck in money and business. In imbalance there can be strong egoism, narcissistic tendencies, tendency to megalomania where one feels small inside but projects an exaggerated belief in one's own abilities. Inflexible",
    category: 1
  },
  // 2 numbers
  "11/2": {
    number: "11/2",
    caption: "The Gentle Soul",
    description: "An overly gentle, soft and naive vibration that is too good-natured and has difficulty saying no. It deals with inner division, and is conflict-averse, a 'people pleaser' and creates a need to numb one's emotions e.g. through overeating or other dependencies. Others' betrayal, hidden dangers, tears",
    category: 2
  },
  "20/2": {
    number: "20/2",
    caption: "The Guided Angel",
    description: "A harmonious, sensitive and gentle vibration that attracts gentle, positive angel energies around oneself/an angel that guides through life. In balance things come incredibly easily to one, and one is placed on the right shelf, and gets to do what one loves; to follow one's passion. Pure line to the first floor. In imbalance one can be flighty, stressed and have great changeability. Can be a bit uncertain about where 'one should stand.'",
    category: 2
  },
  "29/2": {
    number: "29/2",
    caption: "The Betrayed Innocent",
    description: "A vibration that gives tendency for others to overstep one's boundaries and for one to be deceived, cheated, badly treated and exploited. Great tendency to be naive and close one's eyes to the realities of reality. This brings sorrow and disappointment and misfortune, so one loses. Dangers",
    category: 2
  },
  "38/2": {
    number: "38/2",
    caption: "The Unvalued Heart",
    description: "It is predominantly imbalanced in the numeroscope, and one typically feels unappreciated, unheard and unseen. An inner division and disharmony characterizes the mind. One is filled with sorrow and disappointment, and can be really unlucky.",
    category: 2
  },
  "47/2": {
    number: "47/2",
    caption: "The Dreaming Recluse",
    description: "A vibration that deals with dreams, hope and great sensitivity. However, one often becomes disappointed and is quite unlucky. There is a tendency to be otherworldly, and one might prefer books or computers over people.",
    category: 2
  },
  "56/2": {
    number: "56/2",
    caption: "The Insecure Manipulator",
    description: "A vibration that deals with personal charisma and has a playful energy that easily and elegantly convinces others. It manipulates through drama, can be verbally aggressive and dominating due to a great inner insecurity. Here one is also unlucky, disappointed, hurt due to other people's actions",
    category: 2
  },
  "65/2": {
    number: "65/2",
    caption: "The Protective Controller",
    description: "A vibration that deals very much with protecting others. There can be a tendency to give others advice in order to dominate or to feel loved, and can be verbally aggressive. Disappointed and hurt by other people. Misfortune",
    category: 2
  },
  "74/2": {
    number: "74/2",
    caption: "The Emotionally Elusive",
    description: "One can keep their emotions secret, drown in their emotions, 'tune out' (nobody's home) or numb their emotions with e.g. sugar or dependencies. In balance there is a philosophical, strategic and artistic side united in one and the same person. Flighty and confused, unlucky, disappointed and sad",
    category: 2
  },
  "83/2": {
    number: "83/2",
    caption: "The Fearful Controller",
    description: "Fear and tendency to over-control. So one can become a bit preachy, and think one is a bit above others, so one gets an aura that causes one to attract disappointments, sorrows, misfortune; one is a bit sensitive and feels unfairly treated",
    category: 2
  },
  "92/2": {
    number: "92/2",
    caption: "The Naive Romantic",
    description: "A vibration that deals with a tendency to naivety, to become unhappily in love, or be unrealistic about one's relationships and be exploited by others. Others don't really know where they have one = sorrows, misfortune, disappointments, losing",
    category: 2
  },
  // 3 numbers
  "12/3": {
    number: "12/3",
    caption: "The Victim Number",
    description: "A vibration that deals with being misunderstood, over-interpreting, turning and twisting things in one's head and having a distorted view of reality. There is a chaotic mind with stress and mental clutter, where one tries their way through life with 'quick fixes' that go wrong. Tendency to be clumsy in speech or action. Victim of others' pressure that must be numbed. One trips oneself up (victim)",
    category: 3
  },
  "21/3": {
    number: "21/3",
    caption: "The Magician's Crown (Crown of Magic)",
    description: "A vibration that deals with resting in the process towards success, having high ambitions, and taking things one step at a time towards the completion of one's goals. One cracks their personal key to success, and understands the importance of thorough preparation. Progress and success in life. A bit strong for a baby",
    category: 3
  },
  "30/3": {
    number: "30/3",
    caption: "The Powerful Competitor",
    description: "A vibration that gives lots of energy and strength, drive and ambition, as well as a strong strategic sense and personal power. There is a strong intellectual power, and one expresses oneself sincerely and honestly. It takes energy from what lies around and can therefore become best or worst. In imbalance there is tendency to know-it-all attitude, arrogance, competition and comparing oneself with others. There is tendency to put on masks.",
    category: 3
  },
  "39/3": {
    number: "39/3",
    caption: "The Controlling Boss",
    description: "Imbalanced in the numeroscope. There is a tendency to tell others what they should and shouldn't do, and can easily overstep others' boundaries. One has difficulty relaxing in the leadership role. Outwardly one is 'bossy', but inwardly one can feel like a victim with lots of mental clutter and self-doubt. Too much control and superiority",
    category: 3
  },
  "48/3": {
    number: "48/3",
    caption: "The Analytical Perfectionist",
    description: "A vibration that deals with delving deeply into things and turning and twisting the smallest detail. Best at intellectual, complex and intricate work, research as well as political strategy. A tendency for the inner and outer forces to be pulled apart, and one can feel enormously split inside about the things one sets in motion. Imbalanced due to the inner 4-8 tension and it requires great awareness to bring it out positively.",
    category: 3
  },
  "57/3": {
    number: "57/3",
    caption: "The Restless Explorer",
    description: "A vibration that gives a great need to explore new places, ideas and deals with longing for foreign lands. A polar explorer or adventurer vibration. One can be insensitive and jog in the spinach or step on others' toes with their big arm movements. Great desire for new experiences. Profound conclusions",
    category: 3
  },
  "66/3": {
    number: "66/3",
    caption: "The Earth Mother",
    description: "A vibration that deals with great feminine power in the more earthly, motherly way, where one organizes, takes care of and acts in the world on the physical plane. There can be a bit of roughness, hardness, controlling, stubbornness and dominance.",
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
    description: "The number 13 is one of the most deep and mystical numbers, which stands for both death, transformational power and a unique beauty. One removes the old to make room for the new, and it can both frighten and inspire others. One therefore cannot help but do things in their own completely unique way. If it stands with bad numbers in the numeroscope, it gives an inner dissatisfaction, where one always longs for something other than what one has, and one feels like the black sheep. Unique, thinks differently and outside the box, and always has new ideas that can transform the surroundings. A number that strengthens art, innovation and genius. Can also give money",
    category: 4
  },
  "22/4": {
    number: "22/4",
    caption: "The Fool",
    description: "The tarot card for the number 22/4 is 'The Fool' or the jester. We see a man stepping out over the cliff edge. The number stands for naivety and delusion for better and worse. It stands for new ways of doing things and that one is always ready to jump into nothingness. One puts on 'rose-colored glasses', is far too naive and gets deceived by others. Annoyances, disappointments, too good-natured",
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
    description: "A vibration that represents perfect mastery of the senses, right timing and mastering the art of communication and situational awareness. When balanced, one is skilled at networking, business and has luck with money, deals, and has great activity and action power on all levels of life. There can be stress, an overactive mind and one talks so much that it irritates others, if one has too many in the numeroscope. Luck with money and deals",
    category: 5
  },
  "23/5": {
    number: "23/5",
    caption: "The Lion's Royal Star",
    description: "The number called the highest vibration, gives great protection in life in everything we do. It gives great flow and luck in life, where things come to one with incredible ease. It adds healing, love and self-confidence as well as enormous charisma and protection. In addition, great speech gifts and a feeling of abundance in life. One of the greatest money numbers in numerology. Success, joy, love, self-confidence.",
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
    description: "A strong, feminine vibration that contains great erotic and magical power, pleasure and sensuality, aesthetic sense and artistic abilities. The number 'shines into the darkness' and heals others. When appearing more than once in a numeroscope, there is a tendency to be manipulative, moody, jealous and deceitful. The ego and unprocessed emotions rule. The number is the most occult number, which gives the ability to travel between worlds and consciousness planes or mental illness/instability.",
    category: 6
  },
  "24/6": {
    number: "24/6",
    caption: "The Venus Power",
    description: "The vibration stands for strength united with wisdom, harmony, creativity and gentleness. It is a Venus vibration that deals with love and harmonious family life, personal magnetism and attractiveness. One is full of love, trust, femininity and has luck in business. One attracts help from people in 'higher positions' and one has great luck in love",
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
    description: "A vibration traditionally called 'the loss number' and deals with being struck by loss like lightning from a clear sky. The number as an essence number deals with one of the deepest life lessons; that nothing lasts forever. And it is a reminder not to hold onto anything of the physical world. The number is never used in the numeroscope, as it can attract a feeling of isolation, loneliness, struggling, loss, anxiety and fear. Life-threatening fate, wounds on the soul, jealousy, violence, destruction of one's plans.",
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
    description: "A vibration that deals with peace, love, the universe and art. It adds a 'celebrity' vibe and unique charm that attracts positive attention and star status; one's name is remembered and one can become famous. In balance it is a number that adds archetypal beauty, and an ability to channel divine art or wisdom, great learning ability and high intellect. In imbalance one attracts negative spotlight, can become unpopular for the slightest 'mistake' or receive great public criticism. It is therefore a vibration that is only good in a 100% pure numeroscope.",
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
    description: "This vibration deals with postponing needs to achieve goals one has set for oneself, and thereby gaining even greater joy. One is a warrior with principles, and has a strong understanding of hierarchy, and the ability to sacrifice oneself for the service of a higher cause. It is not used in the numeroscope as it can represent too hard an energy that shuts down emotions.",
    category: 9
  },
  "27/9": {
    number: "27/9",
    caption: "The Self-Leader",
    description: "This vibration deals with creating strong inner self-leadership where one both does what needs to be done, but at a pace and in a way where one is true to oneself and takes care of one's needs and feelings. One is also a team leader, an authority who understands people and is motivating. There is also a tendency to work hard and complete one's ideas with success. A strong and lucky number with lots of love",
    category: 9
  },
  "36/9": {
    number: "36/9",
    caption: "The Magical Leader",
    description: "This vibration deals with leadership, success and expansion. With its 3-6-9 triad it is one of the most treasured 9 numbers, which gives a 'magical' strength where one manages to attract what one desires in life. It adds personal power and strength, intelligence, leadership and the ability to create something big and meaningful in the world. Strong and goal-oriented and a bit 'egoistic and controlling'. Lucky",
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
 * Creates name values from a full name and upper diamond value
 */
export const createNameValues = (name: string, upper: number): (string | number)[] => {
  const nameArray: (string | number)[] = [];
  const newArray: (string | number)[] = [];

  const nameWords = name.split(" ");

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