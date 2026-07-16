# Zero-Decision Shopping Engine

## Architecture

1. User input enters the existing intent analyzer.
2. Intent analysis and product matching stay unchanged.
3. The cart is optimized by `optimizationService` for availability, delivery time, and budget.
4. The zero-decision layer classifies the situation and generates ready-made packs.
5. Each pack is independently optimized before being exposed to the UI.

### Backend modules

- `backend/src/services/bedrockService.js` - intent detection and product recommendations.
- `backend/src/services/optimizationService.js` - cart optimization rules.
- `backend/src/services/zeroDecisionService.js` - situation pack generation.
- `backend/src/data/optimizationMockData.js` - mock inventory and delivery inputs.
- `backend/src/data/zeroDecisionPacks.js` - pack templates and scenario rules.

## Logical Schema

The project does not persist shopping sessions yet, so the schema is described for a future database layer.

### `shopping_sessions`

```sql
id UUID PRIMARY KEY
user_input TEXT NOT NULL
scenario_key TEXT NOT NULL
intent_json JSONB NOT NULL
created_at TIMESTAMP NOT NULL
```

### `cart_optimizations`

```sql
id UUID PRIMARY KEY
session_id UUID REFERENCES shopping_sessions(id)
original_cart JSONB NOT NULL
optimized_cart JSONB NOT NULL
optimization_score INT NOT NULL
explanation TEXT NOT NULL
created_at TIMESTAMP NOT NULL
```

### `situation_packs`

```sql
id UUID PRIMARY KEY
session_id UUID REFERENCES shopping_sessions(id)
scenario_key TEXT NOT NULL
tier TEXT NOT NULL
title TEXT NOT NULL
target_budget NUMERIC(10,2)
pack_json JSONB NOT NULL
created_at TIMESTAMP NOT NULL
```

### `pack_items`

```sql
id UUID PRIMARY KEY
pack_id UUID REFERENCES situation_packs(id)
product_id TEXT NOT NULL
name TEXT NOT NULL
price NUMERIC(10,2) NOT NULL
delivery_time_minutes INT NOT NULL
replacement_reason TEXT
```

## API Design

### `POST /api/intent/analyze`

Returns the existing intent payload plus:

- `optimization`
- `zeroDecision`

### `POST /api/zero-decision/generate`

Request:

```json
{
  "intentResult": {},
  "userInput": "House party tonight"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "scenario": {
      "key": "house_party",
      "label": "House Party",
      "prompt": "Host a party fast with drinks, snacks, and serving essentials."
    },
    "packs": [],
    "primary_pack_id": "house-party-budget",
    "explanation": "Generated 3 zero-decision pack(s) for House Party."
  }
}
```

## Bedrock Prompt Contract

The current implementation uses deterministic pack templates, but the prompt below can be used when this feature is moved into Bedrock.

```text
You are a zero-decision shopping engine for quick commerce.

Given a shopping intent, classify the situation and produce ready-made packs.

Output only JSON with this shape:
{
  "scenario": {
    "key": "house_party | exam_tomorrow | rainy_day | power_cut | default",
    "label": "string",
    "prompt": "string"
  },
  "packs": [
    {
      "id": "string",
      "title": "string",
      "tier": "Budget | Standard | Premium | Essentials | Comfort | Emergency",
      "targetBudget": number,
      "items": [
        {
          "name": "string",
          "reason": "string",
          "priority": number,
          "tags": ["string"]
        }
      ],
      "rationale": "string"
    }
  ],
  "primary_pack_id": "string",
  "explanation": "string"
}

Rules:
- Optimize for budget, availability, delivery speed, and urgency.
- Generate no more than 3 packs for one scenario.
- Prefer fast-deliverable, in-stock products.
- Every replacement must include a reason.
- If budget is present, keep the full pack within budget where possible.
```

## React UI

- Show the optimized cart summary.
- Show the situation label and zero-decision explanation.
- Render selectable pack cards for each generated pack.
- When a user selects a pack, swap the active cart to that pack.
