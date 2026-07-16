/**
 * Zero-Decision Pack Catalog - V3
 *
 * Rules enforced:
 * - Every scenario has exactly Budget / Standard / Premium packs
 * - Budget < Standard < Premium in targetBudget AND in actual product cost
 * - All products belong to the scenario's allowedCategories
 * - Premium must cost MORE than Standard, Standard MORE than Budget
 */

export const scenarioCatalog = {

  // ── PET FOOD REFILL ──────────────────────────────────────────────────────
  pet_food_refill: {
    label: 'Pet Food Refill',
    missionName: 'Pet Care Refill',
    allowedCategories: ['Pet Care'],
    keywords: ['dog food', 'cat food', 'pet food', 'ran out of dog', 'ran out of cat',
               'dog', 'cat', 'puppy', 'kitten', 'pet', 'animal food'],
    prompt: 'Replenish pet food supply with essential nutrition and supplementary treats.',
    missingEssentials: [
      { name: 'Dog Treats', reason: 'Complement food refills with rewarding treats.' },
      { name: 'Dental Chews', reason: 'Dental hygiene is often overlooked during refills.' }
    ],
    packs: [
      {
        id: 'pet-refill-budget',
        title: 'Budget Pack',
        subtitle: 'Core food refill only',
        tier: 'Budget',
        targetBudget: 399,
        allowedCategories: ['Pet Care'],
        items: [
          ['dog food', 'pet food'],
          ['pet poop bags', 'hygiene']
        ]
      },
      {
        id: 'pet-refill-standard',
        title: 'Standard Pack',
        subtitle: 'Food + treats bundle',
        tier: 'Standard',
        targetBudget: 599,
        allowedCategories: ['Pet Care'],
        items: [
          ['dog food', 'pet food'],
          ['dog treats', 'treats'],
          ['pet poop bags', 'hygiene']
        ]
      },
      {
        id: 'pet-refill-premium',
        title: 'Premium Pack',
        subtitle: 'Complete pet care bundle',
        tier: 'Premium',
        targetBudget: 899,
        allowedCategories: ['Pet Care'],
        items: [
          ['dog food', 'pet food'],
          ['dog treats', 'treats'],
          ['dental chews', 'dental'],
          ['pet bowl', 'feeding'],
          ['chew sticks', 'chew']
        ]
      }
    ]
  },

  // ── STUDY SESSION / EXAM ─────────────────────────────────────────────────
  exam_tomorrow: {
    label: 'Study Session',
    missionName: 'Exam Preparation',
    allowedCategories: ['Stationery', 'Beverages', 'Food'],
    keywords: ['exam tomorrow', 'study', 'study session', 'deadline', 'assignment', 'homework', 'exam'],
    prompt: 'Create a focused study pack that keeps the user alert and organized.',
    missingEssentials: [
      { name: 'Highlighter Set (5 Colors)', reason: 'Students often need highlighters for revision.' },
      { name: 'Sticky Notes (Pack of 3)', reason: 'Useful for quick memory prompts.' }
    ],
    packs: [
      {
        id: 'study-budget',
        title: 'Budget Pack',
        subtitle: 'Essential study fuel',
        tier: 'Budget',
        targetBudget: 299,
        allowedCategories: ['Stationery', 'Beverages'],
        items: [
          ['coffee', 'energy'],
          ['notebook', 'notes'],
          ['pen', 'writing']
        ]
      },
      {
        id: 'study-standard',
        title: 'Standard Pack',
        subtitle: 'Focus, notes, and energy',
        tier: 'Standard',
        targetBudget: 499,
        allowedCategories: ['Stationery', 'Beverages'],
        items: [
          ['coffee', 'energy'],
          ['energy drink', 'awake'],
          ['notebook', 'notes'],
          ['highlighter', 'study'],
          ['sticky notes', 'reminder']
        ]
      },
      {
        id: 'study-premium',
        title: 'Premium Pack',
        subtitle: 'Full exam prep bundle',
        tier: 'Premium',
        targetBudget: 699,
        allowedCategories: ['Stationery', 'Beverages'],
        items: [
          ['coffee', 'energy'],
          ['energy drink', 'awake'],
          ['notebook', 'notes'],
          ['highlighter', 'study'],
          ['sticky notes', 'reminder'],
          ['pen', 'writing']
        ]
      }
    ]
  },

  // ── HOUSE PARTY ──────────────────────────────────────────────────────────
  house_party: {
    label: 'House Party',
    missionName: 'Quick Guest Preparation',
    allowedCategories: ['Party', 'Beverages', 'Snacks', 'Dessert'],
    keywords: ['party', 'party coming', 'guests', 'friends', 'birthday', 'celebration', 'house party'],
    prompt: 'Host a party fast with drinks, snacks, and serving essentials.',
    missingEssentials: [
      { name: 'Paper Plates (Pack of 20)', reason: 'People often add paper plates for party serving.' },
      { name: 'Party Cups (Pack of 25)', reason: 'Party drinks are easier to serve in cups.' }
    ],
    packs: [
      {
        id: 'house-party-budget',
        title: 'Budget Pack',
        subtitle: 'Low-cost party basics',
        tier: 'Budget',
        targetBudget: 499,
        allowedCategories: ['Party', 'Beverages', 'Snacks'],
        items: [
          ['soft drinks', 'drinks'],
          ['chips', 'snacks'],
          ['party cups', 'cups'],
          ['paper plates', 'plates']
        ]
      },
      {
        id: 'house-party-standard',
        title: 'Standard Pack',
        subtitle: 'Balanced party setup',
        tier: 'Standard',
        targetBudget: 799,
        allowedCategories: ['Party', 'Beverages', 'Snacks', 'Dessert'],
        items: [
          ['soft drinks', 'drinks'],
          ['chips', 'snacks'],
          ['party cups', 'cups'],
          ['paper plates', 'plates'],
          ['birthday candles', 'candles'],
          ['balloons', 'party']
        ]
      },
      {
        id: 'house-party-premium',
        title: 'Premium Pack',
        subtitle: 'Full host-ready bundle',
        tier: 'Premium',
        targetBudget: 1299,
        allowedCategories: ['Party', 'Beverages', 'Snacks', 'Dessert'],
        items: [
          ['soft drinks', 'drinks'],
          ['chips', 'snacks'],
          ['party cups', 'cups'],
          ['paper plates', 'plates'],
          ['birthday candles', 'candles'],
          ['balloons', 'party'],
          ['chocolate cake', 'dessert'],
          ['ice cream', 'dessert']
        ]
      }
    ]
  },

  // ── RAINY DAY ────────────────────────────────────────────────────────────
  rainy_day: {
    label: 'Rainy Day',
    missionName: 'Rain Preparedness',
    allowedCategories: ['Accessories', 'Beverages', 'Personal Care'],
    keywords: ['rain', 'raining', 'wet', 'storm', 'umbrella', 'rainy day'],
    prompt: 'Prepare a dry, comfortable pack for a rainy commute or stay-at-home day.',
    missingEssentials: [
      { name: 'Umbrella (Compact)', reason: 'Rainy day protection is usually the first need.' },
      { name: 'Raincoat (Disposable)', reason: 'Useful if the rain lasts longer than expected.' }
    ],
    packs: [
      {
        id: 'rain-budget',
        title: 'Budget Pack',
        subtitle: 'Essential rain protection',
        tier: 'Budget',
        targetBudget: 399,
        allowedCategories: ['Accessories'],
        items: [
          ['umbrella', 'rain'],
          ['raincoat', 'rain']
        ]
      },
      {
        id: 'rain-standard',
        title: 'Standard Pack',
        subtitle: 'Stay dry and warm',
        tier: 'Standard',
        targetBudget: 599,
        allowedCategories: ['Accessories', 'Beverages'],
        items: [
          ['umbrella', 'rain'],
          ['raincoat', 'rain'],
          ['coffee', 'comfort']
        ]
      },
      {
        id: 'rain-premium',
        title: 'Premium Pack',
        subtitle: 'Full rainy day comfort kit',
        tier: 'Premium',
        targetBudget: 799,
        allowedCategories: ['Accessories', 'Beverages', 'Personal Care'],
        items: [
          ['umbrella', 'rain'],
          ['raincoat', 'rain'],
          ['coffee', 'comfort'],
          ['energy drink', 'energy'],
          ['towel', 'dry']
        ]
      }
    ]
  },

  // ── POWER CUT ────────────────────────────────────────────────────────────
  power_cut: {
    label: 'Power Cut',
    missionName: 'Emergency Lighting',
    allowedCategories: ['Electronics', 'Home'],
    keywords: ['power cut', 'blackout', 'no electricity', 'power outage', 'dark', 'storm outage'],
    prompt: 'Build an emergency pack for immediate light, charging, and backup power.',
    missingEssentials: [
      { name: 'Candles (Pack of 6)', reason: 'Backup light is essential during an outage.' },
      { name: 'Power Bank (10000mAh)', reason: 'Phone charging is often critical.' }
    ],
    packs: [
      {
        id: 'power-cut-budget',
        title: 'Budget Pack',
        subtitle: 'Basic lighting only',
        tier: 'Budget',
        targetBudget: 399,
        allowedCategories: ['Home', 'Electronics'],
        items: [
          ['candles', 'light'],
          ['aa batteries', 'battery']
        ]
      },
      {
        id: 'power-cut-standard',
        title: 'Standard Pack',
        subtitle: 'Light and charging',
        tier: 'Standard',
        targetBudget: 699,
        allowedCategories: ['Home', 'Electronics'],
        items: [
          ['led flashlight', 'light'],
          ['candles', 'light'],
          ['aa batteries', 'battery']
        ]
      },
      {
        id: 'power-cut-premium',
        title: 'Premium Pack',
        subtitle: 'Full emergency readiness',
        tier: 'Premium',
        targetBudget: 1199,
        allowedCategories: ['Home', 'Electronics'],
        items: [
          ['led flashlight', 'light'],
          ['candles', 'light'],
          ['aa batteries', 'battery'],
          ['power bank', 'charge'],
          ['usb-c charging cable', 'charge']
        ]
      }
    ]
  },

  // ── MOVIE NIGHT ──────────────────────────────────────────────────────────
  movie_night: {
    label: 'Movie Night',
    missionName: 'Entertainment Essentials',
    allowedCategories: ['Snacks', 'Beverages', 'Dessert'],
    keywords: ['movie night', 'watch movie', 'snacks and drinks', 'home theater', 'movie'],
    prompt: 'Create a relaxed entertainment pack with snacks and drinks.',
    missingEssentials: [
      { name: 'Popcorn Tub', reason: 'A classic movie-night snack.' },
      { name: 'Disposable Cups', reason: 'Useful for sharing drinks during movie night.' }
    ],
    packs: [
      {
        id: 'movie-budget',
        title: 'Budget Pack',
        subtitle: 'Simple snack setup',
        tier: 'Budget',
        targetBudget: 299,
        allowedCategories: ['Snacks', 'Beverages'],
        items: [
          ['chips', 'snacks'],
          ['soft drinks', 'drinks']
        ]
      },
      {
        id: 'movie-standard',
        title: 'Standard Pack',
        subtitle: 'Snacks and drinks for a movie night',
        tier: 'Standard',
        targetBudget: 499,
        allowedCategories: ['Snacks', 'Beverages', 'Dessert'],
        items: [
          ['chips', 'snacks'],
          ['soft drinks', 'drinks'],
          ['popcorn', 'movie'],
          ['chocolate cake', 'dessert']
        ]
      },
      {
        id: 'movie-premium',
        title: 'Premium Pack',
        subtitle: 'Full cinema experience at home',
        tier: 'Premium',
        targetBudget: 799,
        allowedCategories: ['Snacks', 'Beverages', 'Dessert'],
        items: [
          ['chips', 'snacks'],
          ['soft drinks', 'drinks'],
          ['popcorn', 'movie'],
          ['chocolate cake', 'dessert'],
          ['ice cream', 'frozen'],
          ['energy drink', 'energy']
        ]
      }
    ]
  },

  // ── BABY CARE ────────────────────────────────────────────────────────────
  baby_care: {
    label: 'Baby Care',
    missionName: 'Baby Care Emergency',
    allowedCategories: ['Health', 'Baby Care'],
    keywords: ['baby', 'infant', 'newborn', 'toddler', 'baby fever'],
    prompt: 'Create a baby care pack with health and hygiene essentials.',
    missingEssentials: [
      { name: 'Wet Wipes (Pack of 72)', reason: 'Baby hygiene needs are usually immediate.' },
      { name: 'ORS Sachets (Pack of 10)', reason: 'Hydration support is often important.' }
    ],
    packs: [
      {
        id: 'baby-care-budget',
        title: 'Budget Pack',
        subtitle: 'Core fever care',
        tier: 'Budget',
        targetBudget: 299,
        allowedCategories: ['Health', 'Baby Care'],
        items: [
          ['paracetamol', 'medicine'],
          ['ors', 'hydration']
        ]
      },
      {
        id: 'baby-care-standard',
        title: 'Standard Pack',
        subtitle: 'Health and hygiene basics',
        tier: 'Standard',
        targetBudget: 599,
        allowedCategories: ['Health', 'Baby Care'],
        items: [
          ['digital thermometer', 'health'],
          ['paracetamol', 'medicine'],
          ['ors', 'hydration'],
          ['wet wipes', 'hygiene']
        ]
      },
      {
        id: 'baby-care-premium',
        title: 'Premium Pack',
        subtitle: 'Complete baby emergency bundle',
        tier: 'Premium',
        targetBudget: 899,
        allowedCategories: ['Health', 'Baby Care'],
        items: [
          ['digital thermometer', 'health'],
          ['paracetamol', 'medicine'],
          ['ors', 'hydration'],
          ['wet wipes', 'hygiene'],
          ['cotton', 'first-aid'],
          ['antiseptic', 'clean']
        ]
      }
    ]
  },

  // ── FIRST AID ────────────────────────────────────────────────────────────
  first_aid: {
    label: 'First Aid',
    missionName: 'First Aid Response',
    allowedCategories: ['Health'],
    keywords: ['wound', 'cut', 'injury', 'bleeding', 'hurt', 'first aid'],
    prompt: 'Create a first-aid pack for immediate wound care.',
    missingEssentials: [
      { name: 'Antiseptic Liquid (100ml)', reason: 'Cleaning the wound area is usually necessary.' },
      { name: 'Band-Aid Strips (Pack of 20)', reason: 'Wound coverage is typically required.' }
    ],
    packs: [
      {
        id: 'first-aid-budget',
        title: 'Budget Pack',
        subtitle: 'Basic wound care',
        tier: 'Budget',
        targetBudget: 199,
        allowedCategories: ['Health'],
        items: [
          ['band-aid', 'wound'],
          ['cotton', 'first-aid']
        ]
      },
      {
        id: 'first-aid-standard',
        title: 'Standard Pack',
        subtitle: 'Cover, clean, and protect',
        tier: 'Standard',
        targetBudget: 399,
        allowedCategories: ['Health'],
        items: [
          ['band-aid', 'wound'],
          ['antiseptic', 'clean'],
          ['cotton', 'first-aid'],
          ['wet wipes', 'hygiene']
        ]
      },
      {
        id: 'first-aid-premium',
        title: 'Premium Pack',
        subtitle: 'Complete first aid response',
        tier: 'Premium',
        targetBudget: 699,
        allowedCategories: ['Health'],
        items: [
          ['band-aid', 'wound'],
          ['antiseptic', 'clean'],
          ['cotton', 'first-aid'],
          ['wet wipes', 'hygiene'],
          ['ors', 'hydration'],
          ['paracetamol', 'medicine']
        ]
      }
    ]
  },

  // ── GYM RECOVERY ────────────────────────────────────────────────────────
  gym_recovery: {
    label: 'Gym Recovery',
    missionName: 'Recovery Reset',
    allowedCategories: ['Beverages', 'Food', 'Health'],
    keywords: ['gym', 'workout', 'recovery', 'protein', 'post workout'],
    prompt: 'Create a recovery pack for after a workout session.',
    missingEssentials: [
      { name: 'Protein Bar (Pack of 4)', reason: 'Protein support is often a post-workout need.' },
      { name: 'Energy Drink (250ml)', reason: 'Hydration support after exercise is helpful.' }
    ],
    packs: [
      {
        id: 'gym-recovery-budget',
        title: 'Budget Pack',
        subtitle: 'Core hydration',
        tier: 'Budget',
        targetBudget: 249,
        allowedCategories: ['Beverages', 'Health'],
        items: [
          ['energy drink', 'energy'],
          ['ors', 'hydration']
        ]
      },
      {
        id: 'gym-recovery-standard',
        title: 'Standard Pack',
        subtitle: 'Hydrate and recharge',
        tier: 'Standard',
        targetBudget: 499,
        allowedCategories: ['Beverages', 'Food', 'Health'],
        items: [
          ['energy drink', 'energy'],
          ['ors', 'hydration'],
          ['protein bar', 'protein']
        ]
      },
      {
        id: 'gym-recovery-premium',
        title: 'Premium Pack',
        subtitle: 'Complete recovery bundle',
        tier: 'Premium',
        targetBudget: 699,
        allowedCategories: ['Beverages', 'Food', 'Health'],
        items: [
          ['energy drink', 'energy'],
          ['ors', 'hydration'],
          ['protein bar', 'protein'],
          ['milk', 'dairy'],
          ['coffee', 'energy']
        ]
      }
    ]
  },

  // ── OUTDOOR ADVENTURE (TREKKING / HIKING / CAMPING) ─────────────────────
  outdoor_adventure: {
    label: 'Outdoor Adventure',
    missionName: 'Outdoor Essentials',
    allowedCategories: ['Health', 'Beverages', 'Electronics', 'Food'],
    keywords: ['trekking', 'hiking', 'camping', 'outdoor', 'trek', 'hike', 'camp', 'nature'],
    prompt: 'Build an outdoor adventure pack with hydration, energy, safety, and power backup.',
    missingEssentials: [
      { name: 'Power Bank (10000mAh)', reason: 'Phone charging is critical during outdoor trips.' },
      { name: 'Band-Aid Strips (Pack of 20)', reason: 'Minor injuries are common outdoors.' }
    ],
    packs: [
      {
        id: 'outdoor-budget',
        title: 'Budget Pack',
        subtitle: 'Basic hydration and energy',
        tier: 'Budget',
        targetBudget: 299,
        allowedCategories: ['Health', 'Beverages'],
        items: [
          ['ors', 'hydration'],
          ['energy drink', 'energy']
        ]
      },
      {
        id: 'outdoor-standard',
        title: 'Standard Pack',
        subtitle: 'Hydration, energy, and first aid',
        tier: 'Standard',
        targetBudget: 599,
        allowedCategories: ['Health', 'Beverages', 'Electronics'],
        items: [
          ['ors', 'hydration'],
          ['energy drink', 'energy'],
          ['protein bar', 'energy'],
          ['band-aid', 'first-aid'],
          ['led flashlight', 'light']
        ]
      },
      {
        id: 'outdoor-premium',
        title: 'Premium Pack',
        subtitle: 'Complete outdoor safety bundle',
        tier: 'Premium',
        targetBudget: 1199,
        allowedCategories: ['Health', 'Beverages', 'Electronics', 'Food'],
        items: [
          ['ors', 'hydration'],
          ['energy drink', 'energy'],
          ['protein bar', 'energy'],
          ['band-aid', 'first-aid'],
          ['antiseptic', 'first-aid'],
          ['cotton', 'first-aid'],
          ['led flashlight', 'light'],
          ['power bank', 'charge'],
          ['aa batteries', 'battery']
        ]
      }
    ]
  },

  // ── ROAD TRIP ────────────────────────────────────────────────────────────
  road_trip: {
    label: 'Road Trip',
    missionName: 'Travel Essentials',
    allowedCategories: ['Snacks', 'Beverages', 'Electronics', 'Accessories'],
    keywords: ['road trip', 'travel', 'trip', 'journey', 'car ride'],
    prompt: 'Create a travel-ready pack for a road trip.',
    missingEssentials: [
      { name: 'Chips (Large, Assorted)', reason: 'Road trips are easier with snacks on hand.' },
      { name: 'Power Bank (10000mAh)', reason: 'Useful for long trips and navigation.' }
    ],
    packs: [
      {
        id: 'road-trip-budget',
        title: 'Budget Pack',
        subtitle: 'Basic travel snacks',
        tier: 'Budget',
        targetBudget: 399,
        allowedCategories: ['Snacks', 'Beverages'],
        items: [
          ['chips', 'snacks'],
          ['soft drinks', 'drinks']
        ]
      },
      {
        id: 'road-trip-standard',
        title: 'Standard Pack',
        subtitle: 'Snacks and power for the journey',
        tier: 'Standard',
        targetBudget: 699,
        allowedCategories: ['Snacks', 'Beverages', 'Electronics'],
        items: [
          ['chips', 'snacks'],
          ['soft drinks', 'drinks'],
          ['coffee', 'energy'],
          ['energy drink', 'energy']
        ]
      },
      {
        id: 'road-trip-premium',
        title: 'Premium Pack',
        subtitle: 'Full road trip ready bundle',
        tier: 'Premium',
        targetBudget: 1199,
        allowedCategories: ['Snacks', 'Beverages', 'Electronics', 'Accessories'],
        items: [
          ['chips', 'snacks'],
          ['soft drinks', 'drinks'],
          ['coffee', 'energy'],
          ['energy drink', 'energy'],
          ['power bank', 'charge'],
          ['usb-c charging cable', 'cable']
        ]
      }
    ]
  },

  // ── GROCERY REFILL ───────────────────────────────────────────────────────
  grocery_refill: {
    label: 'Grocery Refill',
    missionName: 'Household Refill',
    allowedCategories: ['Food'],
    keywords: ['groceries', 'milk', 'bread', 'kitchen', 'reorder', 'grocery refill'],
    prompt: 'Create a household grocery refill pack.',
    missingEssentials: [
      { name: 'Milk (1 Liter)', reason: 'Milk is a common grocery refill item.' },
      { name: 'Bread (White, Sliced)', reason: 'Bread is a common daily staple.' }
    ],
    packs: [
      {
        id: 'grocery-budget',
        title: 'Budget Pack',
        subtitle: 'Core daily staples',
        tier: 'Budget',
        targetBudget: 299,
        allowedCategories: ['Food'],
        items: [
          ['milk', 'dairy'],
          ['bread', 'breakfast'],
          ['eggs', 'protein']
        ]
      },
      {
        id: 'grocery-standard',
        title: 'Standard Pack',
        subtitle: 'Full kitchen restock',
        tier: 'Standard',
        targetBudget: 499,
        allowedCategories: ['Food'],
        items: [
          ['milk', 'dairy'],
          ['bread', 'breakfast'],
          ['eggs', 'protein'],
          ['butter', 'breakfast'],
          ['rice', 'staple']
        ]
      },
      {
        id: 'grocery-premium',
        title: 'Premium Pack',
        subtitle: 'Complete weekly grocery bundle',
        tier: 'Premium',
        targetBudget: 699,
        allowedCategories: ['Food'],
        items: [
          ['milk', 'dairy'],
          ['bread', 'breakfast'],
          ['eggs', 'protein'],
          ['butter', 'breakfast'],
          ['rice', 'staple'],
          ['pasta', 'dinner'],
          ['pasta sauce', 'dinner']
        ]
      }
    ]
  },

  // ── GUEST ARRIVAL ────────────────────────────────────────────────────────
  guest_arrival: {
    label: 'Guest Arrival',
    missionName: 'Guest Welcome',
    allowedCategories: ['Party', 'Beverages', 'Personal Care'],
    keywords: ['guest', 'guests', 'visitor', 'friends coming', 'staying over'],
    prompt: 'Create a guest welcome pack for quick hosting.',
    missingEssentials: [
      { name: 'Tissues Box', reason: 'Guests often expect tissues in common areas.' },
      { name: 'Disposable Cups', reason: 'Useful for quick serving.' }
    ],
    packs: [
      {
        id: 'guest-arrival-budget',
        title: 'Budget Pack',
        subtitle: 'Basic hosting essentials',
        tier: 'Budget',
        targetBudget: 299,
        allowedCategories: ['Party', 'Personal Care'],
        items: [
          ['soap bar', 'hygiene'],
          ['party cups', 'cups']
        ]
      },
      {
        id: 'guest-arrival-standard',
        title: 'Standard Pack',
        subtitle: 'Hosting made easy',
        tier: 'Standard',
        targetBudget: 599,
        allowedCategories: ['Party', 'Beverages', 'Personal Care'],
        items: [
          ['party cups', 'cups'],
          ['paper plates', 'plates'],
          ['soap bar', 'hygiene'],
          ['towel', 'bath']
        ]
      },
      {
        id: 'guest-arrival-premium',
        title: 'Premium Pack',
        subtitle: 'Complete guest welcome bundle',
        tier: 'Premium',
        targetBudget: 899,
        allowedCategories: ['Party', 'Beverages', 'Personal Care'],
        items: [
          ['party cups', 'cups'],
          ['paper plates', 'plates'],
          ['soap bar', 'hygiene'],
          ['towel', 'bath'],
          ['shampoo', 'bath'],
          ['toothbrush', 'oral']
        ]
      }
    ]
  },

  // ── OFFICE ESSENTIALS ────────────────────────────────────────────────────
  office_essentials: {
    label: 'Office Essentials',
    missionName: 'Office Readiness',
    allowedCategories: ['Stationery', 'Beverages'],
    keywords: ['office', 'work', 'meeting', 'desk', 'printer', 'stationery'],
    prompt: 'Create a productivity pack for office work.',
    missingEssentials: [
      { name: 'Notebook (200 Pages)', reason: 'Office work often needs a place for notes.' },
      { name: 'Pen Set (Blue, Black, Red)', reason: 'Basic writing tools are easy to forget.' }
    ],
    packs: [
      {
        id: 'office-budget',
        title: 'Budget Pack',
        subtitle: 'Core writing tools',
        tier: 'Budget',
        targetBudget: 199,
        allowedCategories: ['Stationery'],
        items: [
          ['notebook', 'notes'],
          ['pen', 'writing']
        ]
      },
      {
        id: 'office-standard',
        title: 'Standard Pack',
        subtitle: 'Focused productivity kit',
        tier: 'Standard',
        targetBudget: 399,
        allowedCategories: ['Stationery', 'Beverages'],
        items: [
          ['notebook', 'notes'],
          ['pen', 'writing'],
          ['highlighter', 'notes'],
          ['coffee', 'energy']
        ]
      },
      {
        id: 'office-premium',
        title: 'Premium Pack',
        subtitle: 'Full office readiness bundle',
        tier: 'Premium',
        targetBudget: 599,
        allowedCategories: ['Stationery', 'Beverages'],
        items: [
          ['notebook', 'notes'],
          ['pen', 'writing'],
          ['highlighter', 'notes'],
          ['sticky notes', 'reminder'],
          ['coffee', 'energy'],
          ['energy drink', 'energy']
        ]
      }
    ]
  },

  // ── MEDICINE RUN (FEVER / COLD / GENERAL ILLNESS) ─────────────────────────
  medicine_run: {
    label: 'Medicine Run',
    missionName: 'Medicine & Fever Relief',
    allowedCategories: ['Health'],
    keywords: ['medicine', 'fever', 'sick', 'cold', 'cough', 'flu', 'headache', 'pain',
               'paracetamol', 'tablet', 'ors', 'temperature', 'illness'],
    prompt: 'Build a fever and general-illness relief pack with medicine and hydration.',
    missingEssentials: [
      { name: 'ORS Sachets (Pack of 10)', reason: 'Hydration support is important during fever.' },
      { name: 'Digital Thermometer', reason: 'Useful for monitoring temperature.' }
    ],
    packs: [
      {
        id: 'medicine-run-budget',
        title: 'Budget Pack',
        subtitle: 'Core fever relief',
        tier: 'Budget',
        targetBudget: 199,
        allowedCategories: ['Health'],
        items: [
          ['paracetamol', 'medicine'],
          ['ors', 'hydration']
        ]
      },
      {
        id: 'medicine-run-standard',
        title: 'Standard Pack',
        subtitle: 'Medicine, hydration and monitoring',
        tier: 'Standard',
        targetBudget: 499,
        allowedCategories: ['Health'],
        items: [
          ['paracetamol', 'medicine'],
          ['ors', 'hydration'],
          ['digital thermometer', 'health']
        ]
      },
      {
        id: 'medicine-run-premium',
        title: 'Premium Pack',
        subtitle: 'Complete illness care bundle',
        tier: 'Premium',
        targetBudget: 799,
        allowedCategories: ['Health'],
        items: [
          ['paracetamol', 'medicine'],
          ['ors', 'hydration'],
          ['digital thermometer', 'health'],
          ['antiseptic', 'clean'],
          ['band-aid', 'wound']
        ]
      }
    ]
  },

  // ── SNACK RUN (SNACKS & DRINKS) ───────────────────────────────────────────
  snack_run: {
    label: 'Snack Run',
    missionName: 'Snack Stock-Up',
    allowedCategories: ['Snacks', 'Beverages', 'Dessert'],
    keywords: ['snacks', 'snack', 'chips', 'munchies', 'popcorn', 'drinks', 'soft drinks', 'juice', 'nachos'],
    prompt: 'Stock up on snacks and drinks for a quick craving fix.',
    missingEssentials: [
      { name: 'Popcorn Tub', reason: 'A popular snacking choice.' },
      { name: 'Soft Drinks (6 Pack)', reason: 'Drinks pair well with snacks.' }
    ],
    packs: [
      {
        id: 'snack-run-budget',
        title: 'Budget Pack',
        subtitle: 'Snacks and a drink',
        tier: 'Budget',
        targetBudget: 399,
        allowedCategories: ['Snacks', 'Beverages'],
        items: [
          ['chips', 'snacks'],
          ['soft drinks', 'drinks']
        ]
      },
      {
        id: 'snack-run-standard',
        title: 'Standard Pack',
        subtitle: 'Snack variety with drinks',
        tier: 'Standard',
        targetBudget: 599,
        allowedCategories: ['Snacks', 'Beverages'],
        items: [
          ['chips', 'snacks'],
          ['soft drinks', 'drinks'],
          ['popcorn', 'snack']
        ]
      },
      {
        id: 'snack-run-premium',
        title: 'Premium Pack',
        subtitle: 'Full snack and treat spread',
        tier: 'Premium',
        targetBudget: 899,
        allowedCategories: ['Snacks', 'Beverages', 'Dessert'],
        items: [
          ['chips', 'snacks'],
          ['soft drinks', 'drinks'],
          ['popcorn', 'snack'],
          ['chocolate cake', 'dessert'],
          ['ice cream', 'frozen']
        ]
      }
    ]
  },

  // ── GIFTING ────────────────────────────────────────────────────────────────
  gifting: {
    label: 'Gifting',
    missionName: 'Gift Curation',
    allowedCategories: ['Gifting'],
    keywords: ['gift', 'present', 'hamper', 'gifting', 'surprise', 'birthday gift', 'anniversary'],
    prompt: 'Curate a thoughtful gift pack with premium giftable products.',
    missingEssentials: [
      { name: 'Greeting Card', reason: 'A personal card adds a thoughtful touch to any gift.' },
      { name: 'Scented Candle (Lavender)', reason: 'A luxury finishing touch for the gift.' }
    ],
    packs: [
      {
        id: 'gift-budget',
        title: 'Budget Pack',
        subtitle: 'Thoughtful budget-friendly gift',
        tier: 'Budget',
        targetBudget: 649,
        allowedCategories: ['Gifting'],
        items: [
          ['chocolate box', 'chocolate'],
          ['greeting card', 'card'],
          ['keychain', 'accessory']
        ]
      },
      {
        id: 'gift-standard',
        title: 'Standard Pack',
        subtitle: 'Delightful gift hamper',
        tier: 'Standard',
        targetBudget: 1199,
        allowedCategories: ['Gifting'],
        items: [
          ['chocolate box', 'chocolate'],
          ['coffee gift pack', 'coffee'],
          ['greeting card', 'card'],
          ['mini plant', 'plant']
        ]
      },
      {
        id: 'gift-premium',
        title: 'Premium Pack',
        subtitle: 'Premium celebration box',
        tier: 'Premium',
        targetBudget: 2799,
        allowedCategories: ['Gifting'],
        items: [
          ['luxury chocolate', 'chocolate'],
          ['premium tea', 'tea'],
          ['scented candle', 'candle'],
          ['gift basket', 'hamper'],
          ['greeting card', 'card'],
          ['aromatic diffuser', 'diffuser']
        ]
      }
    ]
  },

  // ── DEFAULT FALLBACK ─────────────────────────────────────────────────────
  default: {
    label: 'Essential Kit',
    missionName: 'Quick Essentials',
    allowedCategories: ['Stationery', 'Beverages', 'Food'],
    keywords: [],
    prompt: 'Build a practical zero-decision pack from the user\'s situation.',
    missingEssentials: [],
    packs: [
      {
        id: 'default-budget',
        title: 'Budget Pack',
        subtitle: 'Basic essentials',
        tier: 'Budget',
        targetBudget: 299,
        allowedCategories: ['Stationery', 'Beverages'],
        items: [
          ['notebook', 'notes'],
          ['pen', 'writing']
        ]
      },
      {
        id: 'default-standard',
        title: 'Standard Pack',
        subtitle: 'Practical essentials',
        tier: 'Standard',
        targetBudget: 499,
        allowedCategories: ['Stationery', 'Beverages'],
        items: [
          ['notebook', 'notes'],
          ['pen', 'writing'],
          ['coffee', 'energy'],
          ['sticky notes', 'reminder']
        ]
      },
      {
        id: 'default-premium',
        title: 'Premium Pack',
        subtitle: 'Complete essentials bundle',
        tier: 'Premium',
        targetBudget: 699,
        allowedCategories: ['Stationery', 'Beverages'],
        items: [
          ['notebook', 'notes'],
          ['pen', 'writing'],
          ['coffee', 'energy'],
          ['sticky notes', 'reminder'],
          ['highlighter', 'notes'],
          ['energy drink', 'awake']
        ]
      }
    ]
  }
};

export default scenarioCatalog;
