# The Infinity Compass

<div align="center">
  <img src="public/logo_transp.png" alt="The Infinity Compass Logo" width="200"/>

  **A mystical numerology reading application that reveals your cosmic blueprint**

  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7-purple.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-teal.svg)](https://tailwindcss.com/)
</div>

## Overview

The Infinity Compass is a modern web application that generates personalized numerology readings based on your name and birth date. Using advanced numerological calculations and AI-powered interpretations, it creates a unique cosmic blueprint visualization in the form of an interactive diamond chart.

### Key Features

- **Personalized Numerology Calculations** - Generate detailed readings based on name and birth date
- **Interactive Diamond Chart** - Visualize your numerological blueprint with hover-enabled insights
- **AI-Enhanced Summaries** - Receive AI-generated interpretations of your numerological data
- **Mystical UI/UX** - Immersive cosmic theme with animated particles and sacred geometry
- **Export Capabilities** - Save your reading as an image
- **Mobile Responsive** - Full support for mobile and tablet devices
- **Form Validation** - Type-safe validation using Zod schemas

## Tech Stack

### Core Technologies

- **React 19** - Latest React with modern features
- **TypeScript 5.8** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **React Router v7** - Client-side routing

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework with custom theme
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful, reusable components
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

### Forms & Validation

- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation
- **date-fns** - Date manipulation utilities

### Backend & APIs

- **OpenAI API** - AI-powered reading summaries
- **Alchemy API** - NFT data fetching (optional integration)
- **Discord OAuth** - User verification (optional integration)
- **Vercel Serverless Functions** - Secure backend API endpoints

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/the-infinity-compass.git
cd the-infinity-compass
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Backend API Keys (for serverless functions)
OPENAI_API_KEY=sk-proj-...your-key...
ALCHEMY_API_KEY=...your-alchemy-key...
DISCORD_CLIENT_ID=...your-discord-id...
DISCORD_CLIENT_SECRET=...your-discord-secret...
```

> **Note**: API keys without the `VITE_` prefix are only accessible server-side via the backend API functions, keeping them secure.

4. **Run the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
the-infinity-compass/
├── api/                          # Vercel serverless functions
│   ├── health.js                 # Health check endpoint
│   ├── get-reading.js            # Generate/fetch cached readings
│   ├── generate-reading.js       # OpenAI reading generation
│   ├── fetch-nfts.js             # NFT data via Alchemy
│   ├── verify-discord.js         # Discord OAuth handler
│   └── utils/                    # Shared utilities
│       ├── cache.js              # In-memory caching
│       ├── rateLimiter.js        # Rate limiting
│       └── retry.js              # Retry logic
├── public/                       # Static assets
│   ├── logo.png                  # Application logo
│   ├── logo_transp.png           # Transparent logo
│   └── favicon-*.png             # Favicon files
├── src/
│   ├── components/
│   │   └── ui/                   # shadcn/ui components
│   ├── pages/
│   │   ├── IndividualReadingPage.tsx  # Form input page
│   │   └── ReadingPage.tsx            # Results display page
│   ├── utils/
│   │   └── numerology.ts         # Core numerology calculations
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # Application entry point
├── .env.local                    # Environment variables (not committed)
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
└── vercel.json                   # Vercel deployment config
```

## API Endpoints

The application uses serverless backend functions for secure API operations:

### `POST /api/get-reading`

Generate or fetch a cached numerology reading.

**Request Body:**
```json
{
  "name": "John Doe",
  "birthdate": "1990-05-15",
  "diamondData": {
    "top": 5,
    "left": 3,
    "center": 8,
    "right": 7
  },
  "nftId": "12345",
  "showName": true
}
```

**Response:**
```json
{
  "archetype": {
    "title": "The Cosmic Wanderer",
    "tagline": "You walk between worlds..."
  },
  "oneLiner": "Your cosmic blueprint reveals...",
  "summary": "Detailed reading summary...",
  "highlightWords": ["Leadership", "Wisdom", "Transformation"],
  "visualCue": ["✨", "🌟", "🔮"],
  "cached": false
}
```

**Features:**
- 30-day caching for identical readings
- Rate limiting: 5 requests/minute per IP
- Automatic retry with exponential backoff

### `GET /api/fetch-nfts?wallet=0x...`

Fetch NFT data for a given wallet address (optional feature).

**Response:**
```json
{
  "nfts": [
    {
      "tokenId": "1234",
      "contractAddress": "0xe785...",
      "imageUrl": "https://...",
      "name": "WoW #1234",
      "collection": "WoW"
    }
  ],
  "cached": false,
  "count": 1
}
```

**Cache TTL:** 15 minutes

### `GET /api/verify-discord?code=...`

Handle Discord OAuth verification (optional feature).

**Response:**
```json
{
  "verified": true,
  "discordId": "123456789",
  "username": "johndoe",
  "avatar": "...",
  "cached": false
}
```

**Cache TTL:** 10 minutes

### `GET /api/health`

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-15T...",
  "cache": {
    "total": 5,
    "expired": 0,
    "active": 5
  },
  "environment": "production"
}
```

## Numerology Calculation System

The Infinity Compass uses a sophisticated numerology calculation system based on Chaldean numerology principles:

### Core Calculations

- **Letter-to-Number Mapping** - Each letter is assigned a number (1-9)
- **Name Values** - Calculate numerological values from full name
- **Birthday Interpretation** - Planetary associations and personality traits
- **Compound Numbers** - Advanced interpretations (10/1 through 99/9)
- **Diamond Chart** - Visual representation of numerological relationships

### Diamond Chart Structure

The diamond chart displays four key positions:

- **Top (Upper)** - Birth day reduced to single digit
- **Left (First Name)** - First name numerology value
- **Center (Essence)** - Core life path number
- **Right (Last Name)** - Last name numerology value

Additional layers include mid values, circle values, and compound number interpretations.

## Deployment

### Local Development Setup

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend Variables (VITE_ prefix - exposed to browser)
VITE_API_URL=http://localhost:3001
VITE_DISCORD_CLIENT_ID=your_discord_client_id_here

# Backend Variables (server-side only - NO VITE_ prefix)
OPENAI_API_KEY=sk-proj-...your-key...
ALCHEMY_API_KEY=...your-alchemy-key...
DISCORD_CLIENT_ID=...your-discord-client-id...
DISCORD_CLIENT_SECRET=...your-discord-client-secret...
DISCORD_REDIRECT_URI=http://localhost:3001/api/verify-discord
FRONTEND_CALLBACK_URL=http://localhost:3001/auth/callback
WOW_GUILD_ID=...your-guild-id...
WOW_ROLE_ID=...your-wow-role-id...
WOWG_ROLE_ID=...your-wowg-role-id...
```

**Important:**

- Frontend variables need `VITE_` prefix (exposed to browser)
- Backend variables have NO prefix (server-side only, secure)
- The `.env` file is gitignored and will never be committed

#### 3. Configure Discord Developer Portal

Add these redirect URIs to your Discord app:

- `http://localhost:3001/api/verify-discord`
- `http://localhost:3001/auth/callback`

#### 4. Run Development Server

```bash
vercel dev --listen 3001
```

Access the app at: <http://localhost:3001>

**Note:** Port 3001 is required for Discord OAuth redirects to work correctly.

---

### Production Deployment to Vercel

#### 1. Connect Repository

- Go to <https://vercel.com/new>
- Import your GitHub repository
- Vercel will auto-detect the Vite framework

#### 2. Set Environment Variables in Vercel Dashboard

Go to **Settings → Environment Variables** and add all variables from your `.env` file.

**Update these 3 for production:**

```env
VITE_API_URL=https://your-app.vercel.app
DISCORD_REDIRECT_URI=https://your-app.vercel.app/api/verify-discord
FRONTEND_CALLBACK_URL=https://your-app.vercel.app/auth/callback
```

Replace `your-app.vercel.app` with your actual Vercel domain.

#### 3. Update Discord Developer Portal

Add production redirect URIs:

- `https://your-app.vercel.app/api/verify-discord`
- `https://your-app.vercel.app/auth/callback`

#### 4. Deploy

##### Option A: Auto-deploy via Git (Recommended)

```bash
git push origin main
```

Vercel automatically deploys on push.

##### Option B: Manual deploy via CLI

```bash
npm install -g vercel
vercel --prod
```

---

### Environment Variable Reference

**When switching between local/production, update these 3 variables:**

| Variable | Local | Production |
|----------|-------|------------|
| `VITE_API_URL` | `http://localhost:3001` | `https://your-app.vercel.app` |
| `DISCORD_REDIRECT_URI` | `http://localhost:3001/api/verify-discord` | `https://your-app.vercel.app/api/verify-discord` |
| `FRONTEND_CALLBACK_URL` | `http://localhost:3001/auth/callback` | `https://your-app.vercel.app/auth/callback` |

**Rule:** All three should use the **SAME base URL**.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

### Testing Backend APIs Locally

Once your server is running with `vercel dev --listen 3001`, you can test the API endpoints:

#### Health Check

```bash
curl http://localhost:3001/api/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-10-15T...",
  "cache": {
    "total": 0,
    "expired": 0,
    "active": 0
  },
  "environment": "development"
}
```

#### Generate Reading

```bash
curl -X POST http://localhost:3001/api/get-reading \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "birthdate": "1990-05-15",
    "diamondData": {
      "top": 5,
      "left": 3,
      "center": 8,
      "right": 7
    },
    "nftId": "12345",
    "showName": true
  }'
```

**Expected Response:**

```json
{
  "archetype": {
    "title": "The Cosmic Wanderer",
    "tagline": "You walk between worlds..."
  },
  "oneLiner": "Your cosmic blueprint reveals...",
  "summary": "...",
  "highlightWords": ["Leadership", "Wisdom", "Transformation"],
  "visualCue": ["✨", "🌟", "🔮"],
  "cached": false
}
```

Second call with same data should return `"cached": true` and be instant.

#### Fetch NFTs

```bash
curl "http://localhost:3001/api/fetch-nfts?wallet=0x1234567890abcdef1234567890abcdef12345678"
```

**Expected Response:**

```json
{
  "nfts": [
    {
      "tokenId": "1234",
      "contractAddress": "0xe785E82358879F061BC3dcAC6f0444462D4b5330",
      "imageUrl": "https://...",
      "name": "WoW #1234",
      "collection": "WoW"
    }
  ],
  "cached": false,
  "count": 1
}
```

### Troubleshooting

#### Environment variables not working

- Backend APIs use `process.env.VARIABLE_NAME` (no `VITE_` prefix)
- Frontend uses `import.meta.env.VITE_VARIABLE_NAME` (with `VITE_` prefix)
- Restart `vercel dev` after changing `.env`

#### Discord Auth Error: "service_unavailable"

- Check that all Discord env vars are set in `.env`
- Verify redirect URIs match exactly in Discord Developer Portal

#### Function timeout

Increase timeout in `vercel.json`:

```json
{
  "functions": {
    "api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

## Security

- **API Key Protection** - All sensitive keys stored server-side only
- **Rate Limiting** - Prevents abuse with configurable limits
- **Input Validation** - Zod schemas validate all user input
- **CORS Configuration** - Proper origin restrictions
- **No Client-Side Secrets** - No `dangerouslyAllowBrowser` flags

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary. All rights reserved.

## Acknowledgments

- Numerology calculations based on Chaldean numerology system
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI-powered by [OpenAI](https://openai.com/)

## Support

For issues or questions:
- Open an issue on GitHub
- Contact the development team

---

<div align="center">
  Made with cosmic energy ✨
</div>
