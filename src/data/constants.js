export const PLAYERS_DATA = [
  { id: 1, name: "You", av: "Y", color: "#DC2626", chips: 10 },
  { id: 2, name: "Mia", av: "M", color: "#8B5CF6", chips: 10 },
  { id: 3, name: "Kai", av: "K", color: "#0EA5E9", chips: 10 },
  { id: 4, name: "Zoe", av: "Z", color: "#F59E0B", chips: 10 },
];

export const PACKS = [
  { name: "Mixed",       icon: "🎲", desc: "A bit of everything" },
  { name: "Pop Culture", icon: "🎬", desc: "Movies, music, memes" },
  { name: "History",     icon: "📜", desc: "Events that shaped the world" },
  { name: "Science",     icon: "🔬", desc: "From atoms to galaxies" },
];

export const ROUNDS_DATA = [
  {
    num: 3, category: "SCIENCE",
    fragment: "In 2006, astronomers voted...",
    otherFragments: [
      "...to reclassify a celestial body...",
      "...orbiting beyond Neptune...",
      "...stripping it of its status as a planet.",
    ],
    answer: "Pluto", type: "normal", poison: false,
  },
  {
    num: 4, category: "HISTORY",
    fragment: "This wall divided a European capital...",
    otherFragments: [
      "...for nearly three decades...",
      "...until crowds dismantled it...",
      "...in November 1989.",
    ],
    answer: "Berlin Wall", type: "steal", poison: false,
  },
  {
    num: 7, category: "POP CULTURE",
    fragment: "This artist's 'Eras' concert tour...",
    otherFragments: [
      "...became the highest-grossing tour...",
      "...discovered by the Hubble telescope in 1996...",
      "...spanning 146 shows worldwide.",
    ],
    answer: "Taylor Swift", type: "poison", poison: true,
    poisonHolder: "Kai", poisonFragment: "...discovered by the Hubble telescope in 1996...",
  },
];
