/**
 * Blindspot Question Bank
 * 24 hand-authored questions — 8 per pack.
 * Each question has:
 *   - pack: "Science" | "History" | "Pop Culture"  (Mixed draws from all three)
 *   - category: display label shown in the app
 *   - type: "normal" | "steal" | "poison"
 *   - fragment: the clue fragment shown to "You"
 *   - otherFragments: [Mia, Kai, Zoe] — for poison questions Kai's fragment is the decoy
 *   - poisonFragment: (poison only) the fake fragment Kai holds
 *   - poisonHolder: (poison only) always "Kai" in the current 4-player demo
 *   - answer: canonical answer string (checked case-insensitively)
 */

const QUESTIONS = [

  /* ─── SCIENCE ─── */

  {
    id: "s1", pack: "Science", category: "SCIENCE", type: "normal",
    answer: "Pluto",
    fragment: "In 2006, astronomers voted...",
    otherFragments: [
      "...to reclassify a celestial body...",
      "...orbiting beyond Neptune...",
      "...stripping it of its status as a full planet.",
    ],
  },
  {
    id: "s2", pack: "Science", category: "SCIENCE", type: "normal",
    answer: "Penicillin",
    fragment: "In 1928, a Scottish scientist returned from holiday...",
    otherFragments: [
      "...to find mould growing on a petri dish...",
      "...that appeared to be killing all nearby bacteria...",
      "...accidentally discovering the world's first antibiotic.",
    ],
  },
  {
    id: "s3", pack: "Science", category: "SCIENCE", type: "normal",
    answer: "Isaac Newton",
    fragment: "In 1687, an English mathematician published Principia Mathematica...",
    otherFragments: [
      "...laying out his three laws of motion...",
      "...and the theory of universal gravitation...",
      "...inspired, according to legend, by a falling apple.",
    ],
  },
  {
    id: "s4", pack: "Science", category: "SCIENCE", type: "steal",
    answer: "DNA",
    fragment: "In 1953, two Cambridge scientists built a model using metal rods...",
    otherFragments: [
      "...to describe the shape of a famous molecule...",
      "...now recognised as a double helix...",
      "...that carries all genetic information in living things.",
    ],
  },
  {
    id: "s5", pack: "Science", category: "SCIENCE", type: "steal",
    answer: "Moon",
    fragment: "Earth's only natural satellite...",
    otherFragments: [
      "...rotates at exactly the same rate as it orbits our planet...",
      "...meaning the same face is always turned toward us...",
      "...a phenomenon called tidal locking.",
    ],
  },
  {
    id: "s6", pack: "Science", category: "SCIENCE", type: "steal",
    answer: "Speed of Light",
    fragment: "At approximately 299,792 kilometres per second...",
    otherFragments: [
      "...this fundamental constant of the universe...",
      "...defines the cosmic speed limit...",
      "...and underpins Einstein's theory of special relativity.",
    ],
  },
  {
    id: "s7", pack: "Science", category: "SCIENCE", type: "poison",
    answer: "Hubble Telescope",
    fragment: "Launched in 1990 aboard the Space Shuttle Discovery...",
    otherFragments: [
      "...this orbiting observatory suffered an initial setback...",
      "...when engineers discovered its mirror had been ground to the wrong shape by NASA's rival agency, ESA...",
      "...before astronauts repaired it during a 1993 spacewalk.",
    ],
    poisonFragment: "...when engineers discovered its mirror had been ground to the wrong shape by NASA's rival agency, ESA...",
    poisonHolder: "Kai",
  },
  {
    id: "s8", pack: "Science", category: "SCIENCE", type: "poison",
    answer: "Big Bang",
    fragment: "The leading scientific theory about the origin of the universe...",
    otherFragments: [
      "...proposes that everything began from an infinitely dense point...",
      "...roughly 13.8 billion years ago...",
      "...a name coined approvingly by astronomer Fred Hoyle in the 1940s.",
    ],
    poisonFragment: "...a name coined approvingly by astronomer Fred Hoyle in the 1940s.",
    poisonHolder: "Kai",
    // Hoyle coined the term in 1949 — but mockingly, as a critic of the theory, not approvingly.
  },

  /* ─── HISTORY ─── */

  {
    id: "h1", pack: "History", category: "HISTORY", type: "steal",
    answer: "Berlin Wall",
    fragment: "This structure divided a European capital city...",
    otherFragments: [
      "...for nearly three decades...",
      "...until jubilant crowds began tearing it down...",
      "...on the night of November 9th, 1989.",
    ],
  },
  {
    id: "h2", pack: "History", category: "HISTORY", type: "normal",
    answer: "Nelson Mandela",
    fragment: "South Africa's first democratically elected president...",
    otherFragments: [
      "...spent 27 years imprisoned on Robben Island...",
      "...before his release in February 1990...",
      "...and was awarded the Nobel Peace Prize in 1993.",
    ],
  },
  {
    id: "h3", pack: "History", category: "HISTORY", type: "normal",
    answer: "Apollo 11",
    fragment: "On July 20th, 1969...",
    otherFragments: [
      "...two American astronauts became the first humans...",
      "...to walk on the surface of another world...",
      "...while a third crewmate orbited above in the command module.",
    ],
  },
  {
    id: "h4", pack: "History", category: "HISTORY", type: "steal",
    answer: "Titanic",
    fragment: "On its maiden voyage from Southampton in April 1912...",
    otherFragments: [
      "...this ocean liner struck an iceberg...",
      "...in the freezing North Atlantic...",
      "...and sank within hours, killing over 1,500 people.",
    ],
  },
  {
    id: "h5", pack: "History", category: "HISTORY", type: "steal",
    answer: "D-Day",
    fragment: "On June 6th, 1944...",
    otherFragments: [
      "...Allied forces launched the largest seaborne invasion in history...",
      "...storming five beaches along the Normandy coastline...",
      "...marking the beginning of the end for Nazi-occupied Europe.",
    ],
  },
  {
    id: "h6", pack: "History", category: "HISTORY", type: "normal",
    answer: "Cleopatra",
    fragment: "The last active ruler of the Ptolemaic Kingdom of Egypt...",
    otherFragments: [
      "...formed powerful alliances with both Julius Caesar and Mark Antony...",
      "...spoke nine languages, unlike most of her predecessors...",
      "...before her death in 30 BC ended an era.",
    ],
  },
  {
    id: "h7", pack: "History", category: "HISTORY", type: "poison",
    answer: "World War I",
    fragment: "This global conflict began in the summer of 1914...",
    otherFragments: [
      "...sparked by the assassination of Archduke Franz Ferdinand...",
      "...which took place in Vienna, the capital of Austria-Hungary...",
      "...triggering a chain of declarations of war across the continent.",
    ],
    poisonFragment: "...which took place in Vienna, the capital of Austria-Hungary...",
    poisonHolder: "Kai",
    // The assassination took place in Sarajevo, Bosnia — not Vienna.
  },
  {
    id: "h8", pack: "History", category: "HISTORY", type: "poison",
    answer: "The Bastille",
    fragment: "In July 1789, a Parisian crowd stormed a royal fortress...",
    otherFragments: [
      "...long seen as a symbol of royal tyranny...",
      "...discovering over 300 political prisoners awaiting execution inside...",
      "...in an act that ignited the French Revolution.",
    ],
    poisonFragment: "...discovering over 300 political prisoners awaiting execution inside...",
    poisonHolder: "Kai",
    // Only 7 prisoners were actually found inside (4 forgers, 2 lunatics, 1 aristocrat).
  },

  /* ─── POP CULTURE ─── */

  {
    id: "p1", pack: "Pop Culture", category: "POP CULTURE", type: "poison",
    answer: "Taylor Swift",
    fragment: "This artist's 'Eras' concert tour...",
    otherFragments: [
      "...became the highest-grossing music tour of all time...",
      "...breaking the record for most countries visited in a single tour with 57 nations...",
      "...spanning over 149 shows worldwide.",
    ],
    poisonFragment: "...breaking the record for most countries visited in a single tour with 57 nations...",
    poisonHolder: "Kai",
  },
  {
    id: "p2", pack: "Pop Culture", category: "POP CULTURE", type: "normal",
    answer: "Harry Potter",
    fragment: "This author's debut novel was rejected by twelve publishers...",
    otherFragments: [
      "...before being accepted by Bloomsbury in 1997...",
      "...telling the story of a boy who discovers he is a wizard...",
      "...and spawning the best-selling book series of all time.",
    ],
  },
  {
    id: "p3", pack: "Pop Culture", category: "POP CULTURE", type: "steal",
    answer: "Avengers Endgame",
    fragment: "This 2019 superhero film...",
    otherFragments: [
      "...became the highest-grossing movie ever made at the time of release...",
      "...taking in over $2.79 billion at the global box office...",
      "...unseating the long-standing record held by Avatar.",
    ],
  },
  {
    id: "p4", pack: "Pop Culture", category: "POP CULTURE", type: "normal",
    answer: "Breaking Bad",
    fragment: "This AMC television drama follows...",
    otherFragments: [
      "...a high school chemistry teacher diagnosed with terminal cancer...",
      "...who partners with a former student to manufacture methamphetamine...",
      "...and is widely regarded as one of the greatest TV series ever made.",
    ],
  },
  {
    id: "p5", pack: "Pop Culture", category: "POP CULTURE", type: "steal",
    answer: "Titanic",
    fragment: "James Cameron's 1997 romantic disaster epic...",
    otherFragments: [
      "...spent fifteen consecutive weeks at number one at the box office...",
      "...won eleven Academy Awards including Best Picture and Best Director...",
      "...and was the highest-grossing film ever made at the time of its release.",
    ],
  },
  {
    id: "p6", pack: "Pop Culture", category: "POP CULTURE", type: "normal",
    answer: "Game of Thrones",
    fragment: "Based on a series of fantasy novels by George R.R. Martin...",
    otherFragments: [
      "...this HBO drama ran for eight seasons between 2011 and 2019...",
      "...following noble families fighting for control of the Iron Throne...",
      "...with a finale that deeply divided its global fan base.",
    ],
  },
  {
    id: "p7", pack: "Pop Culture", category: "POP CULTURE", type: "poison",
    answer: "The Beatles",
    fragment: "This iconic band from Liverpool...",
    otherFragments: [
      "...launched the British Invasion of America...",
      "...with their record-breaking debut appearance on The Tonight Show in 1964...",
      "...and went on to release 13 studio albums over seven years.",
    ],
    poisonFragment: "...with their record-breaking debut appearance on The Tonight Show in 1964...",
    poisonHolder: "Kai",
    // They appeared on The Ed Sullivan Show, not The Tonight Show.
  },
  {
    id: "p8", pack: "Pop Culture", category: "POP CULTURE", type: "normal",
    answer: "Friends",
    fragment: "This beloved American sitcom ran for ten seasons...",
    otherFragments: [
      "...following six friends navigating life and love in New York City...",
      "...filmed in front of a live studio audience in Burbank, California...",
      "...and remains one of the most-watched TV shows in history.",
    ],
  },

];

export default QUESTIONS;

/**
 * Returns [normalQ, stealQ, poisonQ] randomly selected from the given pack.
 * "Mixed" draws from the full bank.
 * If a pack doesn't have enough of a given type, falls back to the full bank.
 */
export function selectRounds(pack) {
  const pool = pack === "Mixed" ? QUESTIONS : QUESTIONS.filter(q => q.pack === pack);

  const pick = (type) => {
    const candidates = pool.filter(q => q.type === type);
    const fallback   = QUESTIONS.filter(q => q.type === type);
    const source     = candidates.length > 0 ? candidates : fallback;
    return source[Math.floor(Math.random() * source.length)];
  };

  // Pick one of each type, ensuring no duplicates
  const normal = pick("normal");
  let steal, poison;

  do { steal = pick("steal"); } while (steal.id === normal.id);
  do { poison = pick("poison"); } while (poison.id === normal.id || poison.id === steal.id);

  // Attach display round numbers
  return [
    { ...normal, num: 1 },
    { ...steal,  num: 2 },
    { ...poison, num: 3 },
  ];
}
