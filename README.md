# WiseFind React — Find Smarter, Choose Wisely

![WiseFind Logo](/public/logo.png)

Next-generation tech product discovery, live price comparison, and certified advisor platform.

[Features](#-key-features) • [Tech Stack](#️-tech-stack) • [Quick Start](#-quick-start) • [Configuration](#️-environment-variables) • [Architecture](#-project-architecture)

---

## 📌 Overview

WiseFind is a modern, high-performance shopping intelligence platform designed to eliminate buyer regret. It aggregates real-time prices across major online retailers (Amazon, Flipkart, Croma, Reliance Digital) and local electronics stores, pairs shoppers with certified domain **Advisors** for personalized 1-on-1 consultations, and integrates **WiseBot AI** for natural-language product recommendations.

---

## ✨ Key Features

- **⚖️ Real-Time Multi-Platform Price Comparison**
  - Live side-by-side price tracking across Amazon, Flipkart, Croma, Reliance Digital, and local shops.
  - Price history tracking and price trend analytics powered by interactive Recharts charts.
  - Transparent deal badges highlighting all-time lows and authentic savings.

- **🧑‍💻 Certified Tech Advisors Hub**
  - Direct connection to verified hardware advisors for laptops, smartphones, custom PC builds, audio, and cameras.
  - In-app session bookings, consultation requests, and real-time live chat with instant messaging.
  - Advisor dashboard for managing incoming client inquiries, sessions, and ratings.

- **🤖 WiseBot AI Shopping Assistant**
  - Conversational product discovery powered by the **Google Gemini API** (`@google/genai`).
  - Intelligent context understanding for budgets, use cases, and technical trade-offs.
  - Graceful fallback with zero breaking errors when running offline or without an API key.

- **🔍 Interactive Comparison Matrix & Specs Decoder**
  - Side-by-side comparison of up to 4 devices simultaneously with spec-by-spec breakdown.
  - Built-in **Specs Decoder** that translates complex terminology (e.g., *Nits*, *OLED vs IPS*, *TDP*, *Sensor Size*) into plain English.

- **🏪 Local Retail Store Finder & Offline Deals**
  - Discover nearby physical electronics stores, current walk-in discounts, and official brand warranties.
  - Filter by verified retailers and distance.

- **📚 Curated Buying Guides**
  - Expert-crafted buying guides categorized by domain (Budget Gaming, Creator Laptops, Flagship Cameras, Audiophile Gear).
  - Checklists and key factors to inspect before completing a purchase.

- **🌓 Dual Theme Architecture**
  - Premium dark mode and clean light mode.
  - Inline head initialization to completely prevent Flash of Unstyled Theme (FOUT).

- **🗄️ Hybrid Resilient Data Engine**
  - Native MongoDB integration with automatic disk synchronization fallback (`db_storage/`).
  - Zero-configuration local startup even without a running MongoDB daemon.

---

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS v4, Motion (Framer Motion) |
| Icons and UI | Lucide React, Recharts |
| Backend | Node.js, Express 4 |
| Database | MongoDB (with automatic persistent disk fallback in `db_storage/`) |
| AI / LLM | Google GenAI SDK (`@google/genai`, Gemini 2.5 Flash) |
| Authentication | Google OAuth 2.0 & Firebase Auth |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 1. Installation

Clone or extract the repository and install all dependencies:

```bash
npm install
```

### 2. Configure Environment

Copy the example environment configuration:

```bash
# On Windows PowerShell:
Copy-Item .env.example .env

# On Linux/macOS:
cp .env.example .env
```

Open `.env` and configure your keys (all keys are optional for basic local preview):

```env
APP_URL="http://localhost:3000"
MONGODB_URI="mongodb://127.0.0.1:27017/wisefind"
GEMINI_API_KEY="your_gemini_api_key"
```

### 3. Launch Development Server

Start the unified Express + Vite development server:

```bash
npm run dev
```

Open your browser and navigate to:

```text
http://localhost:3000
```

---

## ⚙️ Environment Variables

| Variable | Description | Default / Example |
| --- | --- | --- |
| `APP_URL` | Base public URL of the application | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB connection URI (Atlas or local) | `mongodb://127.0.0.1:27017/wisefind` |
| `MONGODB_DB_NAME` | Active MongoDB database name | `wisefind` |
| `GEMINI_API_KEY` | Google Gemini API key for WiseBot AI | Optional (mock fallback enabled if unset) |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret | Optional |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | `http://localhost:3000/api/auth/google/callback` |
| `VITE_FIREBASE_API_KEY` | Firebase API Key (if using Firebase Auth) | Optional |

---

## 📜 Available NPM Scripts

- **`npm run dev`**: Starts the Express server with integrated Vite middleware on port 3000.
- **`npm run build`**: Compiles the React application into production-ready static assets in `/dist`.
- **`npm start`**: Runs the production Express server serving the built `/dist` assets.
- **`npm run clean`**: Cleans up previous build output directory.

---

## 📂 Project Architecture

```text
wisefind/
├── db/
│   └── mongo.js              # MongoDB connector with auto disk fallback
├── db_storage/               # Local JSON database backups & sync files
├── public/                   # Favicons, logo assets (SVG, PNG)
├── src/
│   ├── assets/               # Static illustrations & media
│   ├── components/           # React UI components
│   │   ├── AISearchResults.jsx
│   │   ├── AuthModal.jsx
│   │   ├── BuyingGuides.jsx
│   │   ├── ErrorBoundary.jsx  # Top-level fault tolerance boundary
│   │   ├── ExpertBookingModal.jsx
│   │   ├── ExpertChatModal.jsx
│   │   ├── ExpertDashboard.jsx
│   │   ├── ExpertHub.jsx      # Advisors Hub & consultation engine
│   │   ├── LocalStoreFinder.jsx
│   │   ├── PlatformPriceComparator.jsx
│   │   ├── ProductCatalog.jsx
│   │   ├── ProductComparer.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── SpecsDecoderModal.jsx
│   │   ├── TopUserBar.jsx
│   │   ├── UserDashboard.jsx
│   │   └── WiseBotPanel.jsx   # Gemini-powered shopping assistant
│   ├── context/
│   │   └── ThemeContext.jsx   # Dark / Light theme state management
│   ├── data/                 # Seed products, guides, and advisors data
│   ├── utils/
│   │   ├── authService.js     # User & Advisor authentication services
│   │   └── profileStorage.js  # Unified profile & role persistence
│   ├── App.jsx               # Main application controller
│   ├── index.css             # Tailwind v4 and CSS design tokens
│   └── main.jsx              # React DOM entry point
├── index.html                # HTML template with preconnect & meta tags
├── package.json              # Project dependencies & scripts
├── server.js                 # Express server & API routes
└── vite.config.js            # Vite build configuration
```

---

## 🛡️ Advisors & Role Management

- Users can switch between standard **Shopper** accounts and **Advisor** profiles.
- Any registered advisor (or accounts with advisor credentials) receives access to the dedicated **Advisor Dashboard** to answer inquiries, host 1-on-1 consultations, and track engagement.

---

## 📄 License

This project is licensed under the MIT License.
