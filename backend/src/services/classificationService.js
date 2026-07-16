/**
 * Subject & Situation Detection Engine - V3.1
 *
 * Responsibilities:
 *  - Detect WHO the request is for (subject).
 *  - Detect WHAT is needed (one or more situations).
 *  - Support MULTIPLE intents in a single request (e.g. "snacks and medicine").
 *  - Decide, with confidence, whether the request is truly ambiguous and needs
 *    a clarification prompt — obvious requests never ask for clarification.
 *
 * Key rules:
 *  - Clarification is only requested when NO situation keyword is detected
 *    (i.e. the request is genuinely vague like "I need something").
 *  - When two distinct domains are detected (e.g. Food + Health), both are
 *    returned as `topics` so a single combined cart can be generated.
 *  - Baby requests always resolve to Baby Care (they imply health + hygiene),
 *    so "my baby has a fever and needs medicine" is NOT treated as multi-intent.
 */

// ─── SUBJECT PATTERNS ───────────────────────────────────────────────────────
const SUBJECT_PATTERNS = [
  {
    subject: 'Pet',
    keywords: [
      'dog food', 'cat food', 'pet food', 'puppy food', 'kitten food',
      'dog treats', 'cat treats', 'dog collar', 'cat litter', 'pet bowl',
      'chew toy', 'chew toys', 'dog toy', 'cat toy',
      'my dog', 'my cat', 'my puppy', 'my kitten', 'my pet',
      'for dog', 'for cat', 'for pet', 'for puppy', 'for kitten',
      'dog', 'cat', 'puppy', 'kitten', 'pet'
    ],
    petType: null,
    category: 'Pet Supplies',
    situation: 'Pet Food Refill',
    allowedCategories: ['Pet Care'],
    clarification: { question: 'What does your pet need?', options: ['Food', 'Treats', 'Toys', 'Grooming'] }
  },
  {
    subject: 'Baby',
    keywords: [
      'my baby', 'the baby', 'baby has', 'baby needs', 'baby fever', 'baby sick',
      'newborn', 'infant', 'toddler', 'diaper', 'diapers', 'baby'
    ],
    petType: null,
    category: 'Baby Care',
    situation: 'Baby Care',
    allowedCategories: ['Health', 'Baby Care'],
    clarification: { question: 'What does the baby need?', options: ['Medicine', 'Diapers', 'Feeding', 'Hygiene'] }
  },
  {
    subject: 'Guest',
    keywords: [
      'friends coming', 'guests coming', 'guests arriving', 'friends arriving',
      'someone staying', 'staying over', 'overnight guest', 'house party',
      'guest coming', 'visitor coming', 'guest', 'guests', 'visitor', 'visitors'
    ],
    petType: null,
    category: 'Hosting Essentials',
    situation: 'Guest Arrival',
    allowedCategories: ['Party', 'Beverages', 'Snacks', 'Personal Care'],
    clarification: { question: 'What do your guests need?', options: ['Snacks', 'Drinks', 'Serving Items', 'Toiletries'] }
  },
  {
    subject: 'Child',
    keywords: [
      'my child', 'my kid', 'my son', 'my daughter', 'school age',
      'child needs', 'kid needs', 'child', 'kid', 'kids'
    ],
    petType: null,
    category: 'Child Care',
    situation: 'Study Session',
    allowedCategories: ['Stationery', 'Beverages', 'Food', 'Personal Care'],
    clarification: { question: 'What does your child need?', options: ['Food', 'Study Supplies', 'Hygiene', 'Medicine'] }
  },
  {
    subject: 'Family',
    keywords: [
      'for my family', 'whole family', 'everyone at home', 'family needs',
      'parents need', 'my family', 'family'
    ],
    petType: null,
    category: 'Household Essentials',
    situation: 'Grocery Refill',
    allowedCategories: ['Food', 'Cleaning', 'Personal Care', 'Health'],
    clarification: { question: 'What does your family need?', options: ['Groceries', 'Cleaning', 'Cooking', 'Medicine'] }
  },
  {
    subject: 'Self',
    keywords: [
      'i have fever', 'i am sick', 'i hurt', 'i need', 'i want',
      'for me', 'my study', 'my work', 'my office', 'i'
    ],
    petType: null,
    category: 'Personal Essentials',
    situation: 'Office Essentials',
    allowedCategories: ['Stationery', 'Beverages', 'Food', 'Personal Care'],
    clarification: { question: 'What do you need?', options: ['Work', 'Food', 'Health', 'Comfort'] }
  }
];

// ─── SITUATION PATTERNS ──────────────────────────────────────────────────────
// Each pattern carries:
//   scenarioKey      - maps to the zero-decision pack catalog
//   domain           - high-level area used for multi-intent detection
//   allowedCategories- categories products may come from
// Ordered most-specific first.
const SITUATION_PATTERNS = [
  {
    situation: 'Pet Food Refill', missionName: 'Pet Care Refill',
    scenarioKey: 'pet_food_refill', domain: 'pet', allowedCategories: ['Pet Care'],
    keywords: ['ran out of dog food', 'out of dog food', 'ran out of cat food', 'out of cat food',
      'dog food finished', 'cat food finished', 'no dog food', 'no cat food',
      'need dog food', 'need cat food', 'dog food', 'cat food', 'pet food',
      'dog treats', 'cat treats', 'pet treats', 'dog', 'cat', 'puppy', 'kitten', 'pet']
  },
  {
    situation: 'Baby Care', missionName: 'Baby Care Emergency',
    scenarioKey: 'baby_care', domain: 'baby', allowedCategories: ['Health', 'Baby Care'],
    keywords: ['baby has fever', 'baby is sick', 'baby needs medicine', 'infant fever',
      'toddler sick', 'baby care emergency', 'baby fever', 'baby sick',
      'diapers', 'diaper', 'baby', 'infant', 'newborn', 'toddler']
  },
  {
    situation: 'Study Session', missionName: 'Exam Preparation',
    scenarioKey: 'exam_tomorrow', domain: 'work', allowedCategories: ['Stationery', 'Beverages', 'Food'],
    keywords: ['exam tomorrow', 'study session', 'study for exam', 'exam preparation',
      'homework deadline', 'assignment due', 'late night study', 'all night study',
      'exam', 'study', 'homework', 'assignment']
  },
  {
    situation: 'House Party', missionName: 'Quick Guest Preparation',
    scenarioKey: 'house_party', domain: 'party', allowedCategories: ['Party', 'Beverages', 'Snacks', 'Dessert'],
    keywords: ['house party tonight', 'birthday party', 'throwing a party', 'having a party',
      'party tonight', 'birthday celebration', 'house party', 'party']
  },
  {
    situation: 'Movie Night', missionName: 'Entertainment Essentials',
    scenarioKey: 'movie_night', domain: 'food', allowedCategories: ['Snacks', 'Beverages', 'Dessert'],
    keywords: ['movie night', 'watch movies', 'watching movies', 'home theater', 'binge watch', 'movie']
  },
  {
    situation: 'Snack Run', missionName: 'Snack Stock-Up',
    scenarioKey: 'snack_run', domain: 'food', allowedCategories: ['Snacks', 'Beverages', 'Dessert'],
    keywords: ['need snacks', 'want snacks', 'snacks and drinks', 'something to munch',
      'snacks', 'snack', 'chips', 'munchies', 'nachos', 'popcorn', 'soft drinks', 'cold drink', 'juice']
  },
  {
    situation: 'Rainy Day', missionName: 'Rain Preparedness',
    scenarioKey: 'rainy_day', domain: 'weather', allowedCategories: ['Accessories', 'Beverages', 'Personal Care'],
    keywords: ['it is raining', "it's raining", 'caught in rain', 'heavy rain', 'stuck in rain',
      'raining outside', 'rainy day', 'rain started', 'rain', 'raining', 'wet outside', 'storm', 'umbrella']
  },
  {
    situation: 'Medicine Run', missionName: 'Medicine & Fever Relief',
    scenarioKey: 'medicine_run', domain: 'health', allowedCategories: ['Health'],
    keywords: ['needs medicine', 'need medicine', 'fever and cold', 'cold and cough', 'sore throat',
      'body ache', 'medicine', 'medicines', 'fever', 'sick', 'illness', 'ill', 'cough', 'cold',
      'flu', 'headache', 'pain', 'paracetamol', 'tablet', 'tablets', 'ors', 'temperature', 'nausea']
  },
  {
    situation: 'First Aid', missionName: 'First Aid Response',
    scenarioKey: 'first_aid', domain: 'health', allowedCategories: ['Health'],
    keywords: ['cut myself', 'injured myself', 'wound on', 'deep cut', 'cut my finger',
      'bleeding', 'wound', 'cut', 'injury', 'first aid', 'bandage', 'band-aid', 'antiseptic']
  },
  {
    situation: 'Power Cut', missionName: 'Emergency Lighting',
    scenarioKey: 'power_cut', domain: 'power', allowedCategories: ['Electronics', 'Home'],
    keywords: ['power cut', 'power outage', 'no electricity', 'electricity gone',
      'lights went out', 'blackout', 'dark at home', 'candles', 'flashlight']
  },
  {
    situation: 'Gym Recovery', missionName: 'Recovery Reset',
    scenarioKey: 'gym_recovery', domain: 'gym', allowedCategories: ['Beverages', 'Food', 'Health'],
    keywords: ['post workout', 'after gym', 'gym recovery', 'workout recovery',
      'after workout', 'gym session ended', 'gym', 'workout', 'protein']
  },
  {
    situation: 'Outdoor Adventure', missionName: 'Outdoor Essentials',
    scenarioKey: 'outdoor_adventure', domain: 'outdoor', allowedCategories: ['Health', 'Beverages', 'Electronics', 'Food'],
    keywords: ['going trekking', 'trekking', 'hiking', 'camping', 'going camping',
      'outdoor trip', 'outdoor', 'going hiking', 'trek', 'hike', 'camp',
      'trekking for', 'camping for', 'hiking trip', 'nature walk']
  },
  {
    situation: 'Road Trip', missionName: 'Travel Essentials',
    scenarioKey: 'road_trip', domain: 'travel', allowedCategories: ['Snacks', 'Beverages', 'Electronics', 'Accessories'],
    keywords: ['going on road trip', 'road trip tomorrow', 'long drive', 'car journey',
      'road trip', 'travel', 'journey', 'drive', 'driving']
  },
  {
    situation: 'Guest Arrival', missionName: 'Guest Welcome',
    scenarioKey: 'guest_arrival', domain: 'party', allowedCategories: ['Party', 'Beverages', 'Personal Care'],
    keywords: ['guests coming over', 'friends coming over', 'visitor coming', 'guests arriving',
      'friends arriving', 'staying overnight', 'friends coming', 'guests coming', 'guest', 'guests', 'visitor']
  },
  {
    situation: 'Office Essentials', missionName: 'Office Readiness',
    scenarioKey: 'office_essentials', domain: 'work', allowedCategories: ['Stationery', 'Beverages'],
    keywords: ['office tomorrow', 'need office supplies', 'work from office',
      'office', 'work supplies', 'meeting supplies', 'stationery', 'desk supplies', 'notebook', 'pen']
  },
  {
    situation: 'Grocery Refill', missionName: 'Household Refill',
    scenarioKey: 'grocery_refill', domain: 'grocery', allowedCategories: ['Food'],
    keywords: ['ran out of groceries', 'grocery refill', 'out of milk', 'no bread',
      'kitchen empty', 'groceries', 'reorder kitchen', 'grocery', 'milk', 'bread', 'eggs']
  },
  {
    situation: 'Gifting', missionName: 'Gift Curation',
    scenarioKey: 'gifting', domain: 'gifting', allowedCategories: ['Gifting'],
    keywords: ['gift pack', 'gift hamper', 'gift box', 'gift basket', 'gift set',
      'birthday gift', 'anniversary gift', 'surprise gift', 'festival gift', 'thank you gift',
      'congratulations gift', 'gift for friend', 'gift for wife', 'gift for husband',
      'gift for colleague', 'gift for boss', 'gift for family', 'gift for partner',
      'gifting ideas', 'present', 'gift', 'gifting', 'hamper']
  }
];

// ─── HELPERS ────────────────────────────────────────────────────────────────
function normalize(value) {
  return String(value || '').toLowerCase().trim();
}

/**
 * Score how well a text matches a list of keywords.
 * Longer keywords get higher weight; whole-word matches for single tokens are
 * preferred to avoid substring noise (e.g. "pet" inside "carpet").
 */
function scoreKeywords(text, keywords) {
  let score = 0;
  for (const keyword of keywords) {
    const wordCount = keyword.split(' ').length;
    let matched = false;
    if (wordCount === 1) {
      // whole-word match for single tokens
      const re = new RegExp(`(^|[^a-z0-9])${escapeRegExp(keyword)}([^a-z0-9]|$)`, 'i');
      matched = re.test(text);
    } else {
      matched = text.includes(keyword);
    }
    if (matched) {
      score += wordCount >= 3 ? 5 : wordCount === 2 ? 3 : 1;
    }
  }
  return score;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function detectPetType(text) {
  if (text.includes('dog') || text.includes('puppy')) return 'Dog';
  if (text.includes('cat') || text.includes('kitten')) return 'Cat';
  return 'Pet';
}

function hasBabyContext(text) {
  return /(^|[^a-z])(baby|infant|newborn|toddler|diaper|diapers)([^a-z]|$)/i.test(text);
}

function toTopic(pattern) {
  return {
    situation: pattern.situation,
    missionName: pattern.missionName,
    scenarioKey: pattern.scenarioKey,
    domain: pattern.domain,
    allowedCategories: pattern.allowedCategories
  };
}

// ─── STRUCTURED CONTEXT EXTRACTION ──────────────────────────────────────────
/**
 * Extracts people count, duration, urgency, budget, and activity from user input.
 * This enriches the classification so packs can adjust quantities and sizes.
 */
function extractStructuredContext(text) {
  const context = {
    peopleCount: null,
    duration: null,
    activity: null,
    urgencyHint: null,
    budgetHint: null
  };

  // People count: "for 5 friends", "5 people", "4 guests", "3 of us", "6 people"
  // Also matches: "movie night for 6", "party for 8" (digit followed by end-of-string or non-time words)
  // IMPORTANT: Must NOT match "for 2 days" or "for 3 hours" (those are durations).
  const peopleMatch = text.match(/(?:for\s+)?(\d+)\s+(?:friends?|people|guests?|persons?|of us|members|kids?)/i)
    || text.match(/(\d+)\s+(?:friends?|people|guests?|persons?)/i);
  if (peopleMatch) {
    const count = parseInt(peopleMatch[1], 10);
    if (count >= 2 && count <= 50) {
      context.peopleCount = count;
    }
  }

  // Duration: "2 days", "3 hours", "whole weekend", "overnight"
  const durationMatch = text.match(/(?:for\s+)?(\d+)\s*(days?|hours?|hrs?|nights?)/i);
  if (durationMatch) {
    context.duration = { value: parseInt(durationMatch[1], 10), unit: durationMatch[2].replace(/s$/, '').toLowerCase() };
  } else if (/\bovernight\b/i.test(text)) {
    context.duration = { value: 1, unit: 'night' };
  } else if (/\bweekend\b/i.test(text)) {
    context.duration = { value: 2, unit: 'day' };
  }

  // Activity detection
  const ACTIVITIES = [
    { pattern: /\b(trekking|trek)\b/i, activity: 'Trekking' },
    { pattern: /\b(hiking|hike)\b/i, activity: 'Hiking' },
    { pattern: /\b(camping|camp)\b/i, activity: 'Camping' },
    { pattern: /\b(road trip|drive|driving)\b/i, activity: 'Road Trip' },
    { pattern: /\b(movie night|movie|movies)\b/i, activity: 'Movie Night' },
    { pattern: /\b(party|celebration|birthday)\b/i, activity: 'Party' },
    { pattern: /\b(study|exam|homework|assignment)\b/i, activity: 'Study Session' },
    { pattern: /\b(gym|workout|exercise)\b/i, activity: 'Gym' },
    { pattern: /\b(travel|traveling|travelling)\b/i, activity: 'Travel' }
  ];
  for (const { pattern, activity } of ACTIVITIES) {
    if (pattern.test(text)) {
      context.activity = activity;
      break;
    }
  }

  // Urgency: "in 20 minutes", "urgent", "immediately", "right now", "asap"
  const urgencyTimeMatch = text.match(/in\s+(\d+)\s*(?:min|mins|minutes)/i);
  if (urgencyTimeMatch) {
    const mins = parseInt(urgencyTimeMatch[1], 10);
    context.urgencyHint = mins <= 15 ? 'Critical' : mins <= 30 ? 'High' : 'Medium';
  } else if (/\b(urgent|immediately|right now|asap|emergency)\b/i.test(text)) {
    context.urgencyHint = 'Critical';
  } else if (/\b(soon|quickly|fast|hurry)\b/i.test(text)) {
    context.urgencyHint = 'High';
  }

  // Budget: "under 500", "budget 1000", "within ₹300"
  const budgetMatch = text.match(/(?:budget|under|within|max|up to)\s*(?:rs\.?|inr|₹)?\s*(\d{2,6})/i)
    || text.match(/₹\s*(\d{2,6})/);
  if (budgetMatch) {
    context.budgetHint = parseInt(budgetMatch[1], 10);
  }

  // Gift context: recipient and occasion
  context.giftRecipient = null;
  context.giftOccasion = null;

  // Words that follow "gift" but are NOT recipients
  const NON_RECIPIENTS = new Set(['pack', 'box', 'hamper', 'basket', 'set', 'card', 'ideas', 'idea', 'wrap', 'wrapping', 'bag', 'bags']);

  const recipientMatch = text.match(/(?:gift|present|hamper|surprise)\s+for\s+(?:my\s+)?(\w+)/i)
    || text.match(/for\s+(?:my\s+)?(friend|wife|husband|partner|colleague|boss|mom|dad|mother|father|brother|sister|family|son|daughter)\b/i);
  if (recipientMatch) {
    const candidate = recipientMatch[1].toLowerCase();
    if (!NON_RECIPIENTS.has(candidate)) {
      context.giftRecipient = candidate.charAt(0).toUpperCase() + candidate.slice(1);
    }
  }

  const OCCASIONS = [
    { pattern: /\b(birthday)\b/i, occasion: 'Birthday' },
    { pattern: /\b(anniversary)\b/i, occasion: 'Anniversary' },
    { pattern: /\b(festival|diwali|christmas|eid|holi)\b/i, occasion: 'Festival' },
    { pattern: /\b(thank you|thanks)\b/i, occasion: 'Thank You' },
    { pattern: /\b(congratulations|congrats)\b/i, occasion: 'Congratulations' },
    { pattern: /\b(farewell|goodbye)\b/i, occasion: 'Farewell' },
    { pattern: /\b(housewarming)\b/i, occasion: 'Housewarming' }
  ];
  for (const { pattern, occasion } of OCCASIONS) {
    if (pattern.test(text)) {
      context.giftOccasion = occasion;
      break;
    }
  }

  return context;
}

// ─── MAIN CLASSIFIER ────────────────────────────────────────────────────────
export function classifyShoppingNeed(input) {
  const text = normalize(input);

  // Score subjects
  const scoredSubjects = SUBJECT_PATTERNS
    .map(pattern => ({ pattern, score: scoreKeywords(text, pattern.keywords) }))
    .sort((a, b) => b.score - a.score);

  // Score situations (keep all that matched)
  const scoredSituations = SITUATION_PATTERNS
    .map(pattern => ({ pattern, score: scoreKeywords(text, pattern.keywords) }))
    .sort((a, b) => b.score - a.score);

  const matchedSituations = scoredSituations.filter(s => s.score > 0);
  const topSituationScore = matchedSituations[0]?.score || 0;

  // ── Baby precedence ──────────────────────────────────────────────────────
  // Baby requests imply health + hygiene; never split into a multi-intent cart.
  const babyContext = hasBabyContext(text);

  // ── Build topics (distinct domains, highest score per domain, top 2) ──────
  let topics = [];
  if (babyContext) {
    topics = [toTopic(SITUATION_PATTERNS.find(p => p.scenarioKey === 'baby_care'))];
  } else {
    const seenDomains = new Map();
    for (const { pattern } of matchedSituations) {
      if (!seenDomains.has(pattern.domain)) seenDomains.set(pattern.domain, pattern);
    }
    topics = [...seenDomains.values()].slice(0, 2).map(toTopic);
  }

  const multiIntent = topics.length >= 2;
  const primaryTopic = topics[0] || null;

  // ── Resolve subject ──────────────────────────────────────────────────────
  let chosenSubject = scoredSubjects[0].score > 0
    ? scoredSubjects[0].pattern
    : SUBJECT_PATTERNS.find(p => p.subject === 'Self');

  if (primaryTopic?.scenarioKey === 'pet_food_refill') {
    chosenSubject = SUBJECT_PATTERNS.find(p => p.subject === 'Pet');
  }
  if (babyContext || primaryTopic?.scenarioKey === 'baby_care') {
    chosenSubject = SUBJECT_PATTERNS.find(p => p.subject === 'Baby');
  }

  // ── Resolve primary situation (fall back to subject default) ──────────────
  const primarySituationPattern = primaryTopic
    ? SITUATION_PATTERNS.find(p => p.scenarioKey === primaryTopic.scenarioKey)
    : (SITUATION_PATTERNS.find(s => s.situation === chosenSubject.situation)
        || SITUATION_PATTERNS[SITUATION_PATTERNS.length - 1]);

  // If nothing matched, the primary topic falls back to the subject default so
  // downstream pack generation still has a scenario to work with.
  if (topics.length === 0 && primarySituationPattern) {
    topics = [toTopic(primarySituationPattern)];
  }

  // ── Confidence + clarification ────────────────────────────────────────────
  // Clarification is required ONLY when the request is genuinely ambiguous:
  // no situation keyword fired at all. Obvious requests skip clarification.
  const subjectScore = scoredSubjects[0].score;
  const confidence = Math.min(100, Math.round((subjectScore * 8) + (topSituationScore * 14)));
  const clarificationRequired = topSituationScore === 0;

  const petType = chosenSubject.subject === 'Pet' ? detectPetType(text) : null;

  // ── Build allowedCategories (union for multi-intent) ──────────────────────
  const allowedCategories = multiIntent
    ? [...new Set(topics.flatMap(t => t.allowedCategories))]
    : (primarySituationPattern?.allowedCategories || chosenSubject.allowedCategories || []);

  const situationLabel = multiIntent
    ? topics.map(t => t.situation).join(' & ')
    : (primarySituationPattern?.situation || chosenSubject.situation);

  const missionName = multiIntent
    ? 'Combined Essentials'
    : (primarySituationPattern?.missionName || 'Quick Essentials');

  // ── Task 5: Extract structured context (people, duration, urgency, budget)
  const structuredContext = extractStructuredContext(text);

  // ── Task 1: Health disclaimer flag ────────────────────────────────────────
  // If the primary situation is health/medicine-related (not First Aid which is
  // about wound care), flag it so the response includes a safety notice.
  const healthSituations = ['Medicine Run', 'Baby Care'];
  const isHealthSituation = healthSituations.includes(
    primarySituationPattern?.situation || ''
  );

  return {
    subject: chosenSubject.subject,
    petType,
    category: multiIntent ? 'Mixed Essentials' : chosenSubject.category,
    situation: situationLabel,
    missionName,
    allowedCategories,
    confidence,
    multiIntent,
    topics,
    structuredContext,
    healthDisclaimer: isHealthSituation,
    clarificationRequired,
    clarification: clarificationRequired ? chosenSubject.clarification : null
  };
}

export function getClarificationPrompt(subjectDetection) {
  return subjectDetection?.clarification?.question || 'Could you clarify what you need?';
}

export default { classifyShoppingNeed, getClarificationPrompt };
