/**
 * Pure game logic — no socket.io dependencies.
 *
 * Question types:
 *   "normal"  — standard question; all four fragments are true clues.
 *   "poison"  — one player receives a subtly false poisonFragment instead of a real one.
 *
 * Fragment layout:
 *   normal  →  fragment + otherFragments[0,1,2]   (four real clues)
 *   poison  →  fragment + otherFragments[0,1]     (three real clues)
 *              + poisonFragment                   (one false clue, given to one random player)
 */

const QUESTIONS = [

  /* ═══════════════════════════════════════════
     SCIENCE
  ═══════════════════════════════════════════ */

  { id: "s1", pack: "Science", category: "SCIENCE", type: "normal", answer: "Pluto",
    fragment: "In 2006, astronomers voted...",
    otherFragments: ["...to reclassify a celestial body...", "...orbiting beyond Neptune...", "...stripping it of its status as a full planet."] },

  { id: "s2", pack: "Science", category: "SCIENCE", type: "normal", answer: "Penicillin",
    fragment: "In 1928, a Scottish scientist returned from holiday...",
    otherFragments: ["...to find mould growing on a petri dish...", "...that appeared to be killing all nearby bacteria...", "...accidentally discovering the world's first antibiotic."] },

  { id: "s3", pack: "Science", category: "SCIENCE", type: "normal", answer: "Isaac Newton",
    fragment: "In 1687, an English mathematician published Principia Mathematica...",
    otherFragments: ["...laying out his three laws of motion...", "...and the theory of universal gravitation...", "...inspired, according to legend, by a falling apple."] },

  { id: "s4", pack: "Science", category: "SCIENCE", type: "normal", answer: "DNA",
    fragment: "In 1953, two Cambridge scientists built a model using metal rods...",
    otherFragments: ["...to describe the shape of a famous molecule...", "...now recognised as a double helix...", "...that carries all genetic information in living things."] },

  { id: "s5", pack: "Science", category: "SCIENCE", type: "normal", answer: "Moon",
    fragment: "Earth's only natural satellite...",
    otherFragments: ["...rotates at exactly the same rate as it orbits our planet...", "...meaning the same face is always turned toward us...", "...a phenomenon called tidal locking."] },

  { id: "s6", pack: "Science", category: "SCIENCE", type: "normal", answer: "Speed of Light",
    fragment: "At approximately 299,792 kilometres per second...",
    otherFragments: ["...this fundamental constant of the universe...", "...defines the cosmic speed limit...", "...and underpins Einstein's theory of special relativity."] },

  { id: "s9", pack: "Science", category: "SCIENCE", type: "normal", answer: "Charles Darwin",
    fragment: "In 1859, a British naturalist published a book that would change the scientific world forever...",
    otherFragments: ["...proposing that all species of life had descended from common ancestors...", "...through a process of gradual change he called natural selection...", "...after years of research collected during a five-year voyage aboard HMS Beagle."] },

  { id: "s10", pack: "Science", category: "SCIENCE", type: "normal", answer: "Marie Curie",
    fragment: "This pioneering scientist became the first person in history to win Nobel Prizes in two different sciences...",
    otherFragments: ["...receiving the Physics prize in 1903 for her research into radiation...", "...and the Chemistry prize in 1911 for discovering two new elements...", "...making her the first and still only woman to achieve this distinction."] },

  { id: "s11", pack: "Science", category: "SCIENCE", type: "normal", answer: "Albert Einstein",
    fragment: "In 1905, working as a patent clerk in Bern, a young physicist published four papers that transformed science...",
    otherFragments: ["...including his special theory of relativity...", "...which introduced the famous equation expressing the equivalence of mass and energy...", "...later winning him the Nobel Prize in Physics in 1921."] },

  { id: "s12", pack: "Science", category: "SCIENCE", type: "normal", answer: "Black Hole",
    fragment: "In April 2019, a global network of telescopes achieved something many had thought impossible...",
    otherFragments: ["...capturing the first-ever direct image of one of the universe's most extreme objects...", "...a colossal one in the centre of galaxy Messier 87...", "...with a mass equivalent to 6.5 billion suns, surrounded by a glowing ring of superheated gas."] },

  { id: "s13", pack: "Science", category: "SCIENCE", type: "normal", answer: "Oxygen",
    fragment: "This colourless, odourless gas makes up approximately 21% of Earth's atmosphere...",
    otherFragments: ["...and was independently discovered in the 1770s by Swedish chemist Carl Scheele and British scientist Joseph Priestley...", "...though it was the French chemist Antoine Lavoisier who named it...", "...and demonstrated its essential role in both burning and breathing."] },

  { id: "s14", pack: "Science", category: "SCIENCE", type: "normal", answer: "Periodic Table",
    fragment: "In 1869, a Russian chemist published a table that organised all known chemical elements...",
    otherFragments: ["...arranging them by increasing atomic mass and shared chemical properties...", "...deliberately leaving gaps for elements that had not yet been discovered...", "...and correctly predicting the properties of several unknown elements that were later found."] },

  { id: "s15", pack: "Science", category: "SCIENCE", type: "normal", answer: "Chuck Yeager",
    fragment: "On the 14th of October 1947, an American test pilot made aviation history over the Mojave Desert...",
    otherFragments: ["...becoming the first person to officially break the sound barrier in level flight...", "...reaching Mach 1.06 aboard the experimental Bell X-1 rocket plane...", "...just two days after cracking two ribs in a horse-riding accident he had kept secret from his superiors."] },

  { id: "s7", pack: "Science", category: "SCIENCE", type: "poison", answer: "Hubble Telescope",
    fragment: "Launched in 1990 aboard the Space Shuttle Discovery...",
    otherFragments: ["...this orbiting observatory suffered an initial setback...", "...before astronauts repaired it during a 1993 spacewalk."],
    poisonFragment: "...when engineers discovered its mirror had been ground to the wrong shape by NASA's rival agency, ESA..." },

  { id: "s8", pack: "Science", category: "SCIENCE", type: "poison", answer: "Big Bang",
    fragment: "The leading scientific theory about the origin of the universe...",
    otherFragments: ["...proposes that everything began from an infinitely dense point...", "...roughly 13.8 billion years ago..."],
    poisonFragment: "...a name coined approvingly by astronomer Fred Hoyle in the 1940s." },

  { id: "s16", pack: "Science", category: "SCIENCE", type: "poison", answer: "Dolly the Sheep",
    fragment: "In 1996, scientists at the Roslin Institute in Edinburgh announced a world first in biology...",
    otherFragments: ["...having successfully cloned a mammal from an adult cell for the very first time...", "...naming their creation after the country singer Dolly Parton."],
    poisonFragment: "...the sheep went on to live a long and healthy life of fourteen years, roughly double the normal lifespan for her breed..." },

  { id: "s17", pack: "Science", category: "SCIENCE", type: "poison", answer: "International Space Station",
    fragment: "This structure has been continuously inhabited since November 2000, orbiting Earth at around 400 kilometres altitude...",
    otherFragments: ["...travelling at roughly 28,000 kilometres per hour...", "...and completing sixteen full orbits of the planet every twenty-four hours."],
    poisonFragment: "...built and operated solely by NASA and the European Space Agency, after Russia declined to participate in the programme..." },


  /* ═══════════════════════════════════════════
     HISTORY
  ═══════════════════════════════════════════ */

  { id: "h1", pack: "History", category: "HISTORY", type: "normal", answer: "Berlin Wall",
    fragment: "This structure divided a European capital city...",
    otherFragments: ["...for nearly three decades...", "...until jubilant crowds began tearing it down...", "...on the night of November 9th, 1989."] },

  { id: "h2", pack: "History", category: "HISTORY", type: "normal", answer: "Nelson Mandela",
    fragment: "South Africa's first democratically elected president...",
    otherFragments: ["...spent 27 years imprisoned on Robben Island...", "...before his release in February 1990...", "...and was awarded the Nobel Peace Prize in 1993."] },

  { id: "h3", pack: "History", category: "HISTORY", type: "normal", answer: "Apollo 11",
    fragment: "On July 20th, 1969...",
    otherFragments: ["...two American astronauts became the first humans...", "...to walk on the surface of another world...", "...while a third crewmate orbited above in the command module."] },

  { id: "h4", pack: "History", category: "HISTORY", type: "normal", answer: "Titanic",
    fragment: "On its maiden voyage from Southampton in April 1912...",
    otherFragments: ["...this ocean liner struck an iceberg...", "...in the freezing North Atlantic...", "...and sank within hours, killing over 1,500 people."] },

  { id: "h5", pack: "History", category: "HISTORY", type: "normal", answer: "D-Day",
    fragment: "On June 6th, 1944...",
    otherFragments: ["...Allied forces launched the largest seaborne invasion in history...", "...storming five beaches along the Normandy coastline...", "...marking the beginning of the end for Nazi-occupied Europe."] },

  { id: "h6", pack: "History", category: "HISTORY", type: "normal", answer: "Cleopatra",
    fragment: "The last active ruler of the Ptolemaic Kingdom of Egypt...",
    otherFragments: ["...formed powerful alliances with both Julius Caesar and Mark Antony...", "...spoke nine languages, unlike most of her predecessors...", "...before her death in 30 BC ended an era."] },

  { id: "h9", pack: "History", category: "HISTORY", type: "normal", answer: "Julius Caesar",
    fragment: "This Roman general and statesman was assassinated in the Senate on the 15th of March, 44 BC...",
    otherFragments: ["...stabbed twenty-three times by a group of senators who feared he would make himself king...", "...an event Shakespeare immortalised with the line 'Et tu, Brute?'...", "...which triggered a series of civil wars that eventually ended the Roman Republic."] },

  { id: "h10", pack: "History", category: "HISTORY", type: "normal", answer: "The Black Death",
    fragment: "Between 1347 and 1351, a catastrophic pandemic swept across Europe...",
    otherFragments: ["...killing an estimated one-third to one-half of the continent's entire population...", "...caused by a bacterium spread primarily by fleas living on black rats...", "...and considered the most devastating pandemic in recorded European history."] },

  { id: "h11", pack: "History", category: "HISTORY", type: "normal", answer: "Mahatma Gandhi",
    fragment: "In 1930, an Indian independence leader embarked on a 240-mile march to the sea...",
    otherFragments: ["...in protest against British colonial taxation on salt...", "...inspiring millions across India to peacefully defy British rule...", "...in one of the defining acts of non-violent civil disobedience in history."] },

  { id: "h12", pack: "History", category: "HISTORY", type: "normal", answer: "Christopher Columbus",
    fragment: "On the 12th of October 1492, a Genoese explorer made landfall in the Americas...",
    otherFragments: ["...having set sail from Spain with three ships under commission from Ferdinand and Isabella...", "...believing until his death that he had reached islands off the coast of Asia...", "...in a voyage that permanently connected the Eastern and Western hemispheres."] },

  { id: "h13", pack: "History", category: "HISTORY", type: "normal", answer: "French Revolution",
    fragment: "In 1789, a period of radical political and social upheaval began in one of Europe's most powerful kingdoms...",
    otherFragments: ["...triggered by financial crisis, food shortages, and popular resentment of the aristocracy...", "...during which the monarchy was abolished and both the king and queen executed by guillotine...", "...setting the stage for the rise of Napoleon Bonaparte."] },

  { id: "h14", pack: "History", category: "HISTORY", type: "normal", answer: "Boston Tea Party",
    fragment: "On the night of the 16th of December 1773, American colonists boarded three ships in a Massachusetts harbour...",
    otherFragments: ["...and dumped 342 chests of imported goods into the water...", "...in protest against taxation imposed by the British Parliament without colonial representation...", "...in an act of defiance that helped spark the American Revolutionary War."] },

  { id: "h15", pack: "History", category: "HISTORY", type: "normal", answer: "Magna Carta",
    fragment: "In 1215, English barons forced a king to sign a royal charter at Runnymede...",
    otherFragments: ["...establishing for the first time that the monarch was subject to the rule of law...", "...guaranteeing certain rights to freemen...", "...and becoming a foundational document for constitutional law in England and beyond."] },

  { id: "h7", pack: "History", category: "HISTORY", type: "poison", answer: "World War I",
    fragment: "This global conflict began in the summer of 1914...",
    otherFragments: ["...sparked by the assassination of Archduke Franz Ferdinand...", "...triggering a chain of declarations of war across the continent."],
    poisonFragment: "...which took place in Vienna, the capital of Austria-Hungary..." },

  { id: "h8", pack: "History", category: "HISTORY", type: "poison", answer: "The Bastille",
    fragment: "In July 1789, a Parisian crowd stormed a royal fortress...",
    otherFragments: ["...long seen as a symbol of royal tyranny...", "...in an act that ignited the French Revolution."],
    poisonFragment: "...discovering over 300 political prisoners awaiting execution inside..." },

  { id: "h16", pack: "History", category: "HISTORY", type: "poison", answer: "Battle of Waterloo",
    fragment: "On the 18th of June 1815, one of history's most famous military commanders suffered his final defeat...",
    otherFragments: ["...at the hands of the Duke of Wellington and a coalition of European forces...", "...near a small village in present-day Belgium that gave its name to the battle."],
    poisonFragment: "...fought across two days of heavy rain, with Napoleon routing the British on the first before fresh Prussian reinforcements turned the tide..." },

  { id: "h17", pack: "History", category: "HISTORY", type: "poison", answer: "Hiroshima",
    fragment: "On the 6th of August 1945, an American bomber dropped an atomic weapon over a Japanese city for the first time in history...",
    otherFragments: ["...instantly killing tens of thousands of civilians and flattening the city centre...", "...in an attack that hastened Japan's surrender and the end of the Second World War."],
    poisonFragment: "...making it the second atomic bombing, carried out three days after a similar strike on the city of Nagasaki..." },


  /* ═══════════════════════════════════════════
     POP CULTURE
  ═══════════════════════════════════════════ */

  { id: "p2", pack: "Pop Culture", category: "POP CULTURE", type: "normal", answer: "Harry Potter",
    fragment: "This author's debut novel was rejected by twelve publishers...",
    otherFragments: ["...before being accepted by Bloomsbury in 1997...", "...telling the story of a boy who discovers he is a wizard...", "...and spawning the best-selling book series of all time."] },

  { id: "p3", pack: "Pop Culture", category: "POP CULTURE", type: "normal", answer: "Avengers Endgame",
    fragment: "This 2019 superhero film...",
    otherFragments: ["...became the highest-grossing movie ever made at the time of release...", "...taking in over $2.79 billion at the global box office...", "...unseating the long-standing record held by Avatar."] },

  { id: "p4", pack: "Pop Culture", category: "POP CULTURE", type: "normal", answer: "Breaking Bad",
    fragment: "This AMC television drama follows...",
    otherFragments: ["...a high school chemistry teacher diagnosed with terminal cancer...", "...who partners with a former student to manufacture methamphetamine...", "...and is widely regarded as one of the greatest TV series ever made."] },

  { id: "p5", pack: "Pop Culture", category: "POP CULTURE", type: "normal", answer: "Titanic",
    fragment: "James Cameron's 1997 romantic disaster epic...",
    otherFragments: ["...spent fifteen consecutive weeks at number one at the box office...", "...won eleven Academy Awards including Best Picture and Best Director...", "...and was the highest-grossing film ever made at the time of its release."] },

  { id: "p6", pack: "Pop Culture", category: "POP CULTURE", type: "normal", answer: "Game of Thrones",
    fragment: "Based on a series of fantasy novels by George R.R. Martin...",
    otherFragments: ["...this HBO drama ran for eight seasons between 2011 and 2019...", "...following noble families fighting for control of the Iron Throne...", "...with a finale that deeply divided its global fan base."] },

  { id: "p8", pack: "Pop Culture", category: "POP CULTURE", type: "normal", answer: "Friends",
    fragment: "This beloved American sitcom ran for ten seasons...",
    otherFragments: ["...following six friends navigating life and love in New York City...", "...filmed in front of a live studio audience in Burbank, California...", "...and remains one of the most-watched TV shows in history."] },

  { id: "p9", pack: "Pop Culture", category: "POP CULTURE", type: "normal", answer: "Star Wars",
    fragment: "This 1977 science fiction film, made on a modest budget by a then-unknown director...",
    otherFragments: ["...went on to become the highest-grossing film of its time...", "...spawning one of the most valuable entertainment franchises in history...", "...and establishing its creator George Lucas as one of cinema's most influential figures."] },

  { id: "p10", pack: "Pop Culture", category: "POP CULTURE", type: "normal", answer: "The Dark Knight",
    fragment: "Released in 2008, this superhero film is widely considered one of the greatest movies ever made...",
    otherFragments: ["...featuring a performance as the Joker that earned its actor a posthumous Academy Award...", "...for Heath Ledger, who died of an accidental overdose before the film was released...", "...and the first superhero film to gross over one billion dollars worldwide."] },

  { id: "p11", pack: "Pop Culture", category: "POP CULTURE", type: "normal", answer: "Minecraft",
    fragment: "This open-world sandbox game, developed by a single Swedish programmer and first released in 2011...",
    otherFragments: ["...allows players to build virtually anything using textured blocks...", "...has sold over 238 million copies across all platforms...", "...making it the best-selling video game of all time."] },

  { id: "p12", pack: "Pop Culture", category: "POP CULTURE", type: "normal", answer: "Thriller",
    fragment: "Released in 1982, this album became the best-selling record in music history...",
    otherFragments: ["...featuring seven singles that all reached the top ten...", "...accompanied by a groundbreaking 14-minute music video directed by John Landis...", "...certified at over 66 million copies sold worldwide."] },

  { id: "p13", pack: "Pop Culture", category: "POP CULTURE", type: "normal", answer: "The Shawshank Redemption",
    fragment: "This 1994 prison drama, based on a Stephen King novella, was a box office disappointment on first release...",
    otherFragments: ["...but went on to become the highest-rated film of all time on IMDb...", "...following seven Academy Award nominations and a growing cult following on home video...", "...telling the story of a banker wrongly convicted of murdering his wife."] },

  { id: "p1", pack: "Pop Culture", category: "POP CULTURE", type: "poison", answer: "Taylor Swift",
    fragment: "This artist's 'Eras' concert tour...",
    otherFragments: ["...became the highest-grossing music tour of all time...", "...spanning over 149 shows worldwide."],
    poisonFragment: "...breaking the record for most countries visited in a single tour with 57 nations..." },

  { id: "p7", pack: "Pop Culture", category: "POP CULTURE", type: "poison", answer: "The Beatles",
    fragment: "This iconic band from Liverpool...",
    otherFragments: ["...launched the British Invasion of America...", "...and went on to release 13 studio albums over seven years."],
    poisonFragment: "...with their record-breaking debut appearance on The Tonight Show in 1964..." },

  { id: "p14", pack: "Pop Culture", category: "POP CULTURE", type: "poison", answer: "Beyoncé",
    fragment: "This American singer and performer holds the record for the most Grammy Awards ever won by any artist...",
    otherFragments: ["...accumulating over 30 Grammy wins across a career that began as a teenager with Destiny's Child...", "...and included landmark solo albums that each broke streaming and sales records."],
    poisonFragment: "...surpassing the previous all-time record of 28, which had been held by Elvis Presley for over four decades..." },

  { id: "p15", pack: "Pop Culture", category: "POP CULTURE", type: "poison", answer: "Frozen",
    fragment: "This 2013 animated film became the highest-grossing animated movie of all time on its release...",
    otherFragments: ["...featuring a soundtrack that dominated music charts worldwide...", "...with its showstopping centrepiece song winning the Academy Award for Best Original Song."],
    poisonFragment: "...loosely adapted from a Brothers Grimm fairy tale called The Snow Queen, first published in 1812..." },

];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(pool, type, exclude = []) {
  const candidates = pool.filter(q => q.type === type && !exclude.includes(q.id));
  const fallback   = QUESTIONS.filter(q => q.type === type && !exclude.includes(q.id));
  const source     = candidates.length > 0 ? candidates : fallback;
  return source[Math.floor(Math.random() * source.length)];
}

/**
 * Select `count` questions from `pack`.
 * Cycles [normal, normal, poison] to keep roughly one poison round in three.
 */
function selectRounds(pack, count = 15) {
  const pool = pack === "Mixed" ? QUESTIONS : QUESTIONS.filter(q => q.pack === pack);
  const cycle = ["normal", "normal", "poison"];
  const rounds = [];
  const usedIds = new Set();

  for (let i = 0; i < count; i++) {
    const type = cycle[i % cycle.length];
    let q = pick(pool, type, [...usedIds]);
    if (!q) q = pick(pool, type, []); // allow repeats if bank exhausted
    usedIds.add(q.id);
    rounds.push({ ...q, num: i + 1 });
  }
  return rounds;
}

/**
 * Distribute fragments for a round across connected socket IDs.
 * Returns Map<socketId, { fragment, isPoison }>
 */
function distributeFragments(question, socketIds) {
  const ids = [...socketIds];
  const distribution = new Map();

  if (question.type === "poison") {
    const poisonIdx = Math.floor(Math.random() * ids.length);
    const realFragments = shuffle([question.fragment, ...question.otherFragments]);
    let realIdx = 0;
    for (let i = 0; i < ids.length; i++) {
      if (i === poisonIdx) {
        distribution.set(ids[i], { fragment: question.poisonFragment, isPoison: true });
      } else {
        distribution.set(ids[i], { fragment: realFragments[realIdx % realFragments.length], isPoison: false });
        realIdx++;
      }
    }
  } else {
    const all = shuffle([question.fragment, ...question.otherFragments]);
    for (let i = 0; i < ids.length; i++) {
      distribution.set(ids[i], { fragment: all[i % all.length], isPoison: false });
    }
  }

  return distribution;
}

/**
 * Normalise an answer string for comparison:
 * lowercase, strip a leading article (the/a/an), collapse whitespace.
 */
function normalizeAnswer(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/^(the|a|an)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Validate a submitted answer against the canonical answer.
 * Case-insensitive and tolerates leading articles ("the moon" == "Moon").
 */
function validateAnswer(submitted, canonical) {
  if (!submitted || typeof submitted !== "string") return false;
  return normalizeAnswer(submitted) === normalizeAnswer(canonical);
}

module.exports = { selectRounds, distributeFragments, validateAnswer, normalizeAnswer, QUESTIONS };
