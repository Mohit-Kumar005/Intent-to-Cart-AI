# Intent-to-Cart AI — V6

> Turn real-life situations into ready-to-checkout carts in seconds.
> No searching. No browsing. No comparing. Just describe the situation.

---

## Version History

| Version | Highlights |
|---------|-----------|
| V3 | Core refactor — subject/situation detection, zero-decision packs, reactive cart, category validation |
| V3.1 | Confidence-based clarification, multi-intent combined carts, single-source-of-truth pack architecture |
| V4 | Quantity intelligence, Intent Match (40%) scoring weight, header alignment, deterministic product images |
| V5 | Outdoor Adventure detection (trekking/hiking/camping), mobile responsive header, gifting intent, health safety disclaimers, structured context extraction |
| **V6** | **Curated gift products, needs-based intent scoring, recipient-aware gifting, dynamic pack names, hover effect removal, full product-image audit** |

---

## What's New in V6

### Curated Gifting Engine
18 dedicated giftable products added to the catalog — Premium Chocolate Box, Coffee Gift Pack, Scented Candle, Mini Plant, Photo Frame, Desk Organizer, Premium Pen Set, Gift Basket, and more. Gifting queries never recommend Party Cups, Towels, ORS, or Band-Aids.

### Recipient-Aware Gift Intelligence
Gift recommendations adapt to the detected recipient:
| Recipient | Recommendations |
|-----------|----------------|
| Friend | Chocolate Box, Coffee Pack, Mini Plant, Ceramic Mug, Greeting Card |
| Partner/Wife/Husband | Luxury Chocolates, Scented Candle, Photo Frame, Aromatic Diffuser |
| Colleague/Boss | Premium Pen Set, Desk Organizer, Coffee Gift Pack, Notebook Set |
| Family | Premium Tea, Dry Fruits Box, Gift Basket, Chocolate Box |

### Needs-Based Intent Scoring
Intent Match (40 pts) now scores products against detected **needs** rather than category names. Example: "Going trekking" → needs = [hydration, energy, safety, power] → ORS, Energy Drink, Band-Aid, Flashlight all score 100% intent match.

### Dynamic Pack Names
Pack titles adapt to the situation instead of generic "Budget/Standard/Premium":
| Situation | Budget | Standard | Premium |
|-----------|--------|----------|---------|
| Movie Night | Movie Night Starter | Movie Night Complete | Movie Night Ultimate |
| Trekking | Trail Basics | Adventure Ready Kit | Complete Outdoor Pack |
| Gifting | Budget Gift Box | Standard Gift Hamper | Premium Celebration Box |
| Study | Focus Essentials | Study Success Kit | Productivity Bundle |
| First Aid | Basic Wound Care | Complete First Aid | Emergency Response Kit |

### Static Product Cards
All hover zoom, lift, scale, and pop-out effects removed from product cards and pack cards. Buttons retain hover feedback. Cards remain visually stable.

### Guaranteed-Accurate Product Images
All 76+ products now use inline SVG tiles showing the product's actual name and category color. No more cross-category image mismatches (e.g., thermometer showing a laptop). Photos can be restored per-product via the `VERIFIED_PHOTOS` whitelist after visual verification.

---

## What It Does

```
Describe Situation
       ↓
AI Detects Subject + Situation + Context (people, duration, budget, recipient)
       ↓
AI Builds Category-Validated Cart (with quantity scaling for group sizes)
       ↓
AI Generates Situation-Named Packs (Budget < Standard < Premium)
       ↓
Needs-Based Scoring (Intent 40% · Availability 30% · Budget 20% · Delivery 10%)
       ↓
User Reviews — Edits Optional (Remove / Replace / Quantity / Why)
       ↓
Checkout → Order Confirmation → Delivery Tracking
```

---

## Demo Examples

| User Says | Situation | Mission | Special |
|-----------|-----------|---------|---------|
| "Ran out of dog food" | Pet Food Refill | Pet Care Refill | — |
| "Movie night for 6 people" | Movie Night | Entertainment Essentials | Qty ×6 for snacks/drinks |
| "Going trekking for 2 days" | Outdoor Adventure | Outdoor Essentials | ORS, Energy, Flashlight, Power Bank |
| "Gift pack" | Gifting | Gift Curation | Chocolates, Coffee, Greeting Card |
| "Birthday gift for friend" | Gifting | Gift Curation | Recipient: Friend, no refinement chips |
| "Gift for colleague under ₹500" | Gifting | Gift Curation | Pen Set, Desk Organizer, Notebook |
| "I have a fever" | Medicine Run | Health Essentials | ⚠️ Health disclaimer, no prescriptions |
| "Cut my finger" | First Aid | First Aid Response | Band-Aid, Antiseptic, Cotton |
| "Camping for 3 days" | Outdoor Adventure | Outdoor Essentials | Duration: 3 days detected |
| "Friends coming over in 30 mins" | Guest Arrival | Guest Welcome | Urgency: High |
| "Power cut at home" | Power Cut | Emergency Lighting | Candles, Flashlight, Power Bank |
| "Exam tomorrow need coffee" | Study Session | Exam Preparation | — |

---

## Supported Situations (17)

| Situation | Scenario Key | Domain |
|-----------|-------------|--------|
| Pet Food Refill | pet_food_refill | pet |
| Baby Care | baby_care | baby |
| Study Session | exam_tomorrow | work |
| House Party | house_party | party |
| Movie Night | movie_night | food |
| Snack Run | snack_run | food |
| Rainy Day | rainy_day | weather |
| Medicine Run | medicine_run | health |
| First Aid | first_aid | health |
| Power Cut | power_cut | power |
| Gym Recovery | gym_recovery | gym |
| Outdoor Adventure | outdoor_adventure | outdoor |
| Road Trip | road_trip | travel |
| Guest Arrival | guest_arrival | party |
| Office Essentials | office_essentials | work |
| Grocery Refill | grocery_refill | grocery |
| **Gifting** | **gifting** | **gifting** |

---

## Scoring System (V6)

### Weight Distribution
| Dimension | Points | What It Measures |
|-----------|--------|-----------------|
| **Intent Match** | 40 | Do products satisfy the detected **needs**? |
| Availability | 30 | Are items in stock? |
| Budget Fit | 20 | Does total fit the target budget? |
| Delivery Speed | 10 | Can items arrive within urgency window? |

### Needs-Based Matching
Instead of matching category names (which fails for outdoor/travel/gifting), the scorer checks products against a needs vocabulary:

```
Outdoor Adventure → [hydration, energy, safety, power, light, first-aid, protein, ors, flashlight, battery, charge]
Gifting → [gift, chocolate, premium, greeting, card, candle, plant, mug, frame, pen, basket, hamper, tea, coffee, luxury]
Movie Night → [snacks, drinks, popcorn, chips, entertainment, movie, dessert]
```

**Result:** A trekking cart with ORS + Energy Drink + Band-Aid + Flashlight + Power Bank scores **40/40 Intent Match** (not 0/40 as before).

### Health Labels
| Score | Health |
|-------|--------|
| 90–100 | 🟢 Excellent |
| 75–89 | 🟡 Good |
| 60–74 | 🟠 Fair |
| 0–59 | 🔴 Needs Improvement |

---

## Gifting System (V6)

### Intent Detection
Keywords: `gift`, `gift pack`, `gift hamper`, `present`, `birthday gift`, `anniversary gift`, `surprise gift`, `gift for friend/wife/colleague`, etc.

### Immediate Cart Generation (No Clarification)
```
"gift pack" → Immediate cart with Premium Chocolate Box, Coffee Gift Pack, Greeting Card, Mini Plant, Ceramic Mug
```
Never shows "Work / Food / Health / Comfort" clarification for gift queries.

### Optional Refinement Chips
For generic gift queries (no recipient/occasion detected), optional chips appear **after** the cart:
```
[Friend] [Family] [Partner] [Colleague]
```
Clicking a chip regenerates the cart optimized for that recipient.

### Skip Refinement When Context Exists
```
"birthday gift for friend"  → Recipient: Friend, Occasion: Birthday → No chips shown
"gift for colleague under ₹500" → Recipient: Colleague, Budget: ₹500 → Direct cart
```

### Dedicated Gift Products (18 items)
| Product | Price | Best For |
|---------|-------|----------|
| Premium Chocolate Box | ₹399 | Friend, Family, Partner |
| Luxury Chocolate Collection | ₹699 | Partner, Anniversary |
| Coffee Gift Pack | ₹349 | Friend, Colleague |
| Premium Tea Collection | ₹449 | Family, Colleague |
| Greeting Card | ₹49 | All recipients |
| Scented Candle (Lavender) | ₹299 | Partner, Anniversary |
| Mini Indoor Plant | ₹249 | Friend, Colleague |
| Decorative Ceramic Mug | ₹199 | Friend, Colleague |
| Photo Frame (Wooden) | ₹349 | Partner, Family |
| Desk Organizer Set | ₹399 | Colleague, Boss |
| Premium Notebook Set | ₹299 | Colleague, Friend |
| Premium Pen Set (Gift Box) | ₹449 | Colleague, Boss |
| Gift Basket (Assorted Treats) | ₹599 | Family, Friend |
| Keychain (Designer) | ₹149 | Friend |
| Soft Toy (Teddy Bear) | ₹349 | Partner, Friend |
| Scented Soap Set | ₹199 | Friend, Family |
| Dry Fruits Box (250g) | ₹499 | Family, Festival |
| Aromatic Diffuser Set | ₹549 | Partner, Housewarming |

---

## Structured Context Extraction (V5+)

The classifier extracts structured information from natural language:

| Input | Extracted |
|-------|-----------|
| "Movie night for 6 people" | peopleCount: 6, activity: Movie Night |
| "Going trekking for 2 days" | duration: 2 days, activity: Trekking |
| "Guests arriving in 20 minutes" | urgencyHint: High |
| "Snacks under ₹500" | budgetHint: 500 |
| "Birthday gift for friend" | giftRecipient: Friend, giftOccasion: Birthday |

### People Count → Quantity Scaling
When `peopleCount` is detected, shareable items (Snacks, Beverages, Party, Dessert) get default quantity = `min(peopleCount, 10)`. Non-shareable items stay at 1.

---

## Health Safety (V5+)

### Symptom-Based Queries
For fever, cold, cough, headache, illness:
- Recommends **Health Essentials Kit**: Digital Thermometer, ORS, Wet Wipes, Cotton Balls
- Does NOT recommend specific medicines (Paracetamol, painkillers)
- Displays: ⚠️ *"This cart contains general wellness and first-aid essentials. Consult a healthcare professional for medical advice."*

### First Aid (Allowed)
For cut, wound, injury, bleeding:
- Band-Aid, Antiseptic Liquid, Cotton Balls, Gauze — allowed and recommended
- No health disclaimer needed

---

## Outdoor Adventure (V5+)

Trekking, hiking, and camping are classified as **Outdoor Adventure** (not Road Trip).

| Category | Road Trip | Outdoor Adventure |
|----------|-----------|-------------------|
| Keywords | road trip, long drive, car journey | trekking, hiking, camping, trek, hike |
| Products | Chips, Soft Drinks, Coffee, Power Bank | ORS, Energy Bars, First Aid, Flashlight, Power Bank |
| Never | Flashlight, ORS | Popcorn, Movie snacks |

---

## Mobile Responsive (V5+)

### Header Layout
- **Mobile (< 768px):** Stacked — Row 1: Logo + Cart, Row 2: Search bar, Row 3: Categories
- **Desktop (≥ 768px):** Single flex row — Logo, Search, Cart

### Shared Container
All sections use `max-w-7xl mx-auto px-4 lg:px-6` — consistent alignment at 320px through 1440px+.

---

## Quantity Persistence (V4+)

Quantities are stored independently from pack selection. Switching packs preserves user-set quantities for products that exist in both packs.

```
Budget Pack: Chips ×3 → Switch to Standard → Chips ×3 preserved
```

---

## Static Cards (V6)

All hover zoom, lift, scale, and translate effects removed from:
- Product cards (storefront)
- Editable product cards (Smart Cart)
- Smart Shopping Pack cards (Budget/Standard/Premium)

Buttons retain hover feedback (color change, shadow). Cards remain fixed in place.

---

## Product Image System (V6)

### Strategy: Guaranteed-Accurate SVG Tiles
Every product renders an inline SVG data-URI that displays:
- Product name (prominently)
- Category color scheme
- No network request required

### Why Not .jpg Files?
Physical `.jpg` files cannot be visually verified in automated environments. A file named `thermometer.jpg` might contain a laptop image. SVG tiles are generated from the product's own metadata — always 100% accurate.

### Restoring Photos
The `VERIFIED_PHOTOS` whitelist in `productImages.js` enables per-product photo restoration after manual visual verification:
```js
const VERIFIED_PHOTOS = new Set([
  'prod_001', // Uncomment after confirming thermometer.jpg shows a thermometer
]);
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Lucide Icons |
| Backend | Node.js 22, Express |
| AI Engine | Amazon Bedrock (Claude 3 Sonnet) with local fallback |
| State | React useState + useEffect (event-driven reactive) |
| Deployment | Docker, Docker Compose |

---

## Project Structure

```
intent-to-cart-ai/
├── backend/
│   └── src/
│       ├── data/
│       │   ├── productCatalog.js          # 76+ products (including 18 giftable)
│       │   ├── productImages.js           # SVG tile generator + VERIFIED_PHOTOS whitelist
│       │   ├── zeroDecisionPacks.js       # 17 scenarios × 3 tiers
│       │   └── optimizationMockData.js    # Mock inventory & delivery profiles
│       ├── routes/
│       │   ├── intent.js                  # POST /api/intent/analyze (full pipeline)
│       │   ├── cart.js                    # Cart CRUD + checkout
│       │   ├── products.js                # Product catalog API
│       │   ├── optimization.js            # Standalone optimization
│       │   └── zeroDecision.js            # Standalone pack generation
│       ├── services/
│       │   ├── classificationService.js   # Subject + Situation + Context extraction
│       │   ├── bedrockService.js          # Bedrock AI + recipient-aware fallback
│       │   ├── cartService.js             # Product matching + totals
│       │   ├── optimizationService.js     # Dynamic cart optimization
│       │   ├── zeroDecisionService.js     # Pack generation + dynamic naming
│       │   ├── scoringService.js          # Score utilities
│       │   └── validationService.js       # Category validation + missing essentials
│       └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── ResultsPage.jsx            # Single results page + editable cart + gift chips
│       │   ├── SituationPacks.jsx         # Pack selector (static cards, no hover motion)
│       │   ├── StoreProductCard.jsx       # Storefront card (static, no hover motion)
│       │   ├── CartSummary.jsx            # Order summary + quantity-aware totals
│       │   ├── OrderConfirmation.jsx      # Post-order confirmation + delivery
│       │   ├── DeliveryProgress.jsx       # Delivery timeline (post-checkout only)
│       │   ├── LoadingSequence.jsx        # 6-step AI processing animation
│       │   ├── ScoreBreakdownTooltip.jsx  # Needs-based score breakdown
│       │   ├── CartHealthBadge.jsx        # Single health status badge
│       │   ├── MissingEssentials.jsx      # Optional add-on suggestions
│       │   ├── Header.jsx                 # Responsive header (stacked mobile)
│       │   └── ...
│       ├── utils/
│       │   ├── api.js                     # Backend API calls
│       │   ├── productImage.js            # Frontend SVG fallback (onError)
│       │   └── cartReactive.js            # Needs-based scoring + reactive recalc
│       └── App.jsx                        # Orchestrator (Smart Cart + Browse separate states)
│
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## Quick Start

```bash
# Clone
git clone https://github.com/Rakshit-Singh2004/intent-to-cart-ai
cd intent-to-cart-ai

# Backend (Terminal 1)
cd backend && npm install && npm run dev
# → http://localhost:3001

# Frontend (Terminal 2)
cd frontend && npm install && npm run dev
# → http://localhost:5173
```

---

## Docker

```bash
docker-compose up --build
# → http://localhost:3001
```

---

## AWS Bedrock (Optional)

Without credentials, the local fallback engine handles all 17 situations with accurate recommendations.

```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/intent/analyze` | Full pipeline: classify → AI → match → optimize → packs |
| POST | `/api/intent/refine` | Re-analyze with additional context |
| POST | `/api/cart/create` | Create cart with mission + pack metadata |
| POST | `/api/cart/:id/checkout` | Place order |
| GET | `/api/products` | List products (`?category=`, `?search=`) |
| GET | `/api/products/categories` | List categories |
| POST | `/api/optimization/cart` | Standalone optimization |
| POST | `/api/zero-decision/generate` | Standalone pack generation |
| GET | `/api/health` | Health check |

---

## Full Version Comparison

| Area | V3 | V3.1 | V4 | V5 | V6 |
|------|-----|------|-----|-----|-----|
| Situations | 13 | 15 | 15 | 17 | 17 (+Gifting) |
| Scoring weights | Avail 40, Deliv 30, Budget 20, Intent 10 | Same | Intent 40, Avail 30, Budget 20, Deliv 10 | Same | Needs-based intent matching |
| People count | Not extracted | Not extracted | Extracted, scales qty | Same | Same |
| Duration/Activity | Not extracted | Not extracted | Not extracted | Extracted (trekking, camping) | Same |
| Gifting | Not supported | Not supported | Not supported | Basic (Party Cups, Towels) | Dedicated giftable products, recipient-aware |
| Health safety | Recommends Paracetamol | Same | Same | Disclaimer + no prescriptions | Same |
| Header mobile | Single row (overflow) | Same | Alignment fix | Stacked rows | Same |
| Trekking | → Road Trip (chips) | Same | Same | → Outdoor Adventure (ORS, Flashlight) | Same |
| Card hover | Lift + scale + zoom | Same | Same | Same | **Removed** (static) |
| Product images | Shared .jpg (wrong) | Same | Deterministic mapping | Same | **SVG tiles** (guaranteed accurate) |
| Pack names | Generic (Budget/Standard/Premium) | Same | Same | Dynamic per situation | Same |
| Qty persistence | Resets on pack switch | Same | Persists across packs | Same | Same |
| Cart Health | 95+ Excellent | Same | Same | Same | 90+ Excellent (adjusted) |

---

*"From intent to doorstep in under a minute."*
#   I n t e n t - t o - C a r t - A I  
 