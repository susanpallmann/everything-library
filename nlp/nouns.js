// Function that checks the provided word against various plurality patterns
// Returns the original word, the word converted (if different) to singular form, and the plurality of the original word
function evaluateNounPlurality(word) {
  
  // Nouns where the plural and singular form are the same (e.g., "deer", "fish")
  const pluralMatchesSingular = [
    'bison', 'buffalo', 'carp', 'cod', 'deer', 
    'moose', 'elk', 'gazelle', 'fish', 'pike', 
    'salmon', 'sheep', 'shrimp', 'squid', 'series', 
    'species'
  ];
  
  // Nouns where the plural form doesn't follow a common suffix-adding pattern
  const irregularPlurals = {
    people: 'person',
    dice: 'die',
    children: 'child',
    brethren: 'brother',
    feet: 'foot',
    geese: 'goose',
    mice: 'mouse',
    teeth: 'tooth',
    men: 'man',
    women: 'women',
    crises: 'crisis',
    oxen: 'ox'
  };

  // Nouns that receive plural semantic treatment and have no singular form (e.g., "pants", "glasses", "cattle")
  const pluralsWithoutSingulars = [
      'clothes', 'cattle', 'shorts', 'panties', 'pliers', 
      'suspenders', 'tweezers', 'tongs', 'trousers', 'pants', 
      'glasses', 'scissors'
    ];
  
  // Nouns that receive plural semantic treatment and, while they have singular forms, they are rarely used (e.g., "nuptials", "phalanges", "tidings")
  const pluralsWithRareSingulars = [
      'nuptials', 'phalanges', 'tidings'
    ];
  
  // Nouns that describe abstract concepts and thus don't follow conventional singular/plural semantics (e.g., "evil", "goodness")
  const abstractNouns = [
      'goodness', 'evil', 'curiosity'
    ];
  
  // Nouns that are used in sentences as singular nouns (though they often look like plurals) and have no plural form (e.g., "mathematics", "aerodynamics", "impressionism")
  const singularsWithoutPlurals = [
      'mathematics', 'aerodynamics', 'electronics', 'robotics', 'science', 
      'ethics', 'gold', 'copper', 'aluminum', 'aluminium', 
      'oxygen', 'nitrogen', 'carbon', 'equipment', 'furniture', 
      'traffic', 'air', 'water', 'gas'
    ];
  
  let singularWord = null;
  let plurality = null;
  
  // Nouns where the plural and singular form are the same (e.g., "deer", "fish")
  if (pluralMatchesSingular.includes(word)) {
    singularWord = word;
    plurality = 'either';
    
  // Nouns where the plural form doesn't follow a common suffix-adding pattern
  } else if (word in irregularPlurals) {
    singularWord = irregularPlurals[word];
    plurality = 'plural';

  // Nouns that receive plural semantic treatment and have no singular form (e.g., "pants", "glasses", "cattle")
  } else if (pluralsWithoutSingulars.includes(word)) {
    singularWord = word;
    plurality = 'plural';
    
  // Nouns that receive plural semantic treatment and, while they have singular forms, they are rarely used (e.g., "nuptials", "phalanges", "tidings")
  } else if (pluralsWithRareSingulars.includes(word)) {
    singularWord = word;
    plurality = 'plural';
    
  // Nouns that describe abstract concepts and thus don't follow conventional singular/plural semantics (e.g., "evil", "goodness")
  } else if (abstractNouns.includes(word)) {
    singularWord = word;
    plurality = 'singular';
    
  // Nouns that are used in sentences as singular nouns (though they often look like plurals) and have no plural form (e.g., "mathematics", "aerodynamics", "impressionism")
  } else if (singularsWithoutPlurals.includes(word)) {
    singularWord = word;
    plurality = 'singular';
  
  // Nouns ending in "zzes" (e.g., "quizzes", "whizzes")
  } else if (word.endsWith('zzes')) {
  
    // quizzes -> quiz
    singularWord = word.slice(0, -3);
  
  // Nouns ending in "ies" (e.g., "cities", "parties")
  } else if (word.endsWith('ies')) {
    
    const singularI = ['chilies', 'chillies', 'alkalies'];
    const singularIE = ['aunties', 'birdies', 'boogies', 'cuties', 'foodies', 'hippies', 'hotties', 'movies', 'prairies', 'smoothies', 'biggies', 'brownies', 'cookies', 'genies', 'homies', 'indies', 'junkies', 'lies', 'pies', 'nellies', 'rookies', 'sweeties', 'veggies', 'zombies', 'barbies', 'calories', 'curries', 'eeries', 'goalies', 'hoodies', 'minnies', 'newbies', 'pixies', 'selfies', 'ties'];
  
    // chillies -> chilli
    if (word === 'chilies' || word === 'chillies' || word === 'alkalies') {
      singularWord = word.slice(0, -2);
    
    // movies -> movie
    } else if (singularIE.includes(word)) {
      singularWord = word.slice(0, -1);
      
    // cities -> city
    } else {
      singularWord = word.slice(0, -3);
      singularWord = singularWord + 'y';
    }
  
  // Nouns ending in "sses" (e.g., "kisses", "losses")
  } else if (word.endsWith('sses')) {
  
    // posses -> posse
    if (word === 'posses') {
      singularWord = word.slice(0, -1);
    
    // kisses -> kiss
    } else {
      singularWord = word.slice(0, -2);
    }
  
  // Nouns ending in "oes" (e.g., "tomatoes", "echoes")
  } else if (word.endsWith('oes')) {
  
    // woes -> woe
    if (word === 'woes' || word === 'foes' || word === 'does' || word === 'toes' || word === 'shoes' || word === 'canoes' || word === 'hoes' || word === 'joes' || word === 'aloes') {
      singularWord = word.slice(0, -1);
      
    // tomatoes -> tomato
    } else {
      singularWord = word.slice(0, -2);
    }
        
  // Nouns ending in "ves" (e.g., "wives", "leaves")
  } else if (word.endsWith('ves')) {
    
    // wives -> wife
    if (word === 'wives' || word === 'knives' || word === 'lives') {
      singularWord = word.slice(0, -3);
      singularWord = singularWord + 'fe';
      
    // staves -> staff
    } else if (word === 'staves' || word === 'turves') {
      singularWord = word.slice(0, -3);
      singularWord = singularWord + 'ff';
      
    // wolves -> wolf
    } else if (word.endsWith('wolves') || word.endsWith('selves') || word.endsWith('shelves') || word.endsWith('halves') || word === 'elves' || word === 'calves' || word === 'leaves') {
      singularWord = word.slice(0, -3);
      singularWord = singularWord + 'f';
      
    // groves -> grove
    } else {
      singularWord = word.slice(0, -1);
    }
  
  // Nouns ending in "es" that weren't accounted for above (e.g., "buses", "beaches", "fuses", "faces")
  } else if (word.endsWith('es')) {
    const sesExceptions = ['buses', 'biases', 'campuses', 'corpuses', 'focuses', 'gases', 'guesses', 'hypotheses', 'parentheses', 'bonuses', 'geniuses', 'lenses', 'viruses', 'irises'];

    // buses -> bus
    // beaches -> beach
    // ashes -> ash
    // foxes -> fox
    if (sesExceptions.includes(word) || (word.endsWith('ches') && word !== 'aches') || word.endsWith('shes') || (word.endsWith('xes') && word !== "axes")) {
      singularWord = word.slice(0, -2);
    
    // fuses -> fuse
    // aches -> aches
    // axes -> axe
    } else {
      singularWord = word.slice(0, -1);
    }
    
  // Nouns ending in "s" (e.g., "dogs", "days")
  } else if (word.endsWith('s')) {
  
    // dogs -> dog
    singularWord = word.slice(0, -1);
  }
  
  // If we didn't match the noun to any plural pattern, we'll assume it's singular
  if (singularWord === null) {
    singularWord = word;
    plurality = 'singular';
    
  // If we did match the noun to a pattern, but didn't already define the plurality, do so now
  } else if (plurality === null) {
    plurality = 'plural';
  }
  
  // Return the original word, the converted (if different) singular form, and the plurality
  return {
    originalForm: word,
    singularForm: singularWord,
    plurality: plurality
  };
}
