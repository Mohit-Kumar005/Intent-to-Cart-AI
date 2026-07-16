# 🛒 Intent-to-Cart AI

> **AI-powered shopping assistant that transforms real-life situations into ready-to-checkout shopping carts using Natural Language Processing and Amazon Bedrock.**

Instead of searching through hundreds of products, users simply describe their situation (e.g., *"Movie night with friends"*, *"Going trekking for 2 days"*, or *"Birthday gift for my friend"*). The system intelligently understands the intent, extracts contextual information, and generates an optimized shopping cart within seconds.

---

## 🚀 Features

### 🧠 AI Intent Detection

* Converts natural language into structured shopping intents.
* Understands situations instead of keywords.
* Extracts context such as:

  * Number of people
  * Budget
  * Duration
  * Recipient
  * Urgency

### 🛍 Smart Cart Generation

* Automatically recommends relevant products.
* Generates Budget, Standard, and Premium shopping packs.
* Suggests missing essentials.

### 🎁 Intelligent Gift Recommendations

* Recipient-aware gift suggestions.
* Occasion-based recommendations.
* Budget-aware product selection.

### 📊 Cart Optimization Engine

Every generated cart is evaluated using:

* Intent Match
* Product Availability
* Budget Fit
* Delivery Speed

to recommend the most suitable shopping experience.

### ⚡ Dynamic Quantity Scaling

Automatically adjusts quantities for group shopping.

Example:

> "Movie night for 6 people"

The system intelligently increases snacks and beverages while keeping non-shareable items unchanged.

### 📱 Responsive User Interface

* Mobile-first design
* Interactive shopping experience
* Clean Amazon-inspired UI

### 🤖 Amazon Bedrock Integration

Supports Claude-powered intent understanding with a local fallback engine when cloud credentials are unavailable.

---

# 🏗 System Architecture

```text
User Input
      │
      ▼
AI Intent Detection
      │
      ▼
Context Extraction
(People • Budget • Duration • Recipient)
      │
      ▼
Product Matching
      │
      ▼
Cart Optimization
      │
      ▼
Shopping Packs
      │
      ▼
Checkout
```

---

# 📸 Screenshots

> Replace these with screenshots from your application.

* Home Page
* AI Processing
* Generated Shopping Cart
* Shopping Pack Selection
* Checkout Flow

---

# 🛠 Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Lucide Icons

## Backend

* Node.js
* Express.js

## AI

* Amazon Bedrock
* Claude 3 Sonnet
* Local AI Fallback Engine

## Deployment

* Docker
* Docker Compose

---

# 📂 Project Structure

```text
Intent-to-Cart-AI
│
├── frontend/
├── backend/
├── docs/
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/Mohit-Kumar005/Intent-to-Cart-AI.git
cd Intent-to-Cart-AI
```

## Backend

```bash
cd backend
npm install
npm run dev
```

Runs at:

```
http://localhost:3001
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at:

```
http://localhost:5173
```

---

# 🐳 Docker

```bash
docker-compose up --build
```

---

# 💡 Future Improvements

* Voice-based shopping assistant
* Personalized recommendations
* Amazon Product Advertising API integration
* Multi-language support
* Real-time inventory updates
* AI-powered budget optimization

---

# 📈 Why This Project?

Traditional online shopping requires users to manually search, compare, and filter products.

Intent-to-Cart AI eliminates this friction by allowing users to simply describe their situation in natural language. The system interprets user intent, understands contextual information, and instantly creates an optimized shopping cart, making online shopping faster, smarter, and more intuitive.

---

# 👨‍💻 Author

**Mohit Kumar**

Computer Engineering Student
Army Institute of Technology, Pune

GitHub: **https://github.com/Mohit-Kumar005**

---

⭐ If you found this project interesting, consider giving it a star!
