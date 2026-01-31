# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Local Development Setup (IMPORTANT)

**To test the full app with backend API support, run both Vite and Vercel Dev together:**

1. **First time setup - Login to Vercel and install yarn:**

   ```bash
   vercel login
   npm install -g yarn
   ```

2. **Start full development environment (recommended):**

   ```bash
   npm run dev:full
   ```

   This runs two servers concurrently:
   - **Vite** (frontend) on port 3001
   - **Vercel Dev** (API functions) on port 3000
   - Vite proxies `/api/*` requests to Vercel Dev automatically

   Access app at: `http://localhost:3001`

3. **Test API is working:**

   Visit `http://localhost:3001/api/health` - should return JSON like:
   ```json
   {"status":"ok","timestamp":"...","cache":{...}}
   ```

### Alternative Commands

- **Frontend only** (no API): `npm run dev` - Vite dev server on port 3001 (API calls will fail)
- **API only**: `npm run dev:api` - Vercel Dev on port 3000 (no frontend)
- **Build**: `npm run build` - TypeScript compile followed by Vite production build
- **Lint**: `npm run lint` - Run ESLint on TypeScript/TSX files
- **Preview**: `npm run preview` - Preview production build locally on port 3001

### Port Configuration

- **Port 3001**: Vite frontend (what you access in browser)
- **Port 3000**: Vercel Dev API functions (proxied through Vite)
- Port 3001 is required for Discord OAuth callback

## Project Architecture

### Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with React plugin
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM v7
- **Date Handling**: date-fns library

### Application Structure

This is a numerology reading application with a two-page flow:

1. **IndividualReadingPage** (`src/pages/IndividualReadingPage.tsx`)
   - Initial form page for collecting user name and birth date
   - Uses React Hook Form with Zod schema validation
   - Contains mystical UI with cosmic particles and sacred geometry
   - Handles form submission and navigation to reading page

2. **ReadingPage** (`src/pages/ReadingPage.tsx`)
   - Displays calculated numerology results in diamond chart format
   - Shows grouped numerology data (Essence, Destiny Numbers, etc.)
   - Interactive diamond overlay with hover effects
   - Contains embedded numerology calculation logic

### Key Components

- **UI Components**: Located in `src/components/ui/` - shadcn/ui components (Button, Card, Form, Calendar, etc.)
- **Numerology Utils**: `src/utils/numerology.ts` - Core numerology calculation functions and interfaces
- **App Routing**: Simple two-route setup with user data state management in App component

### State Management

- Uses React useState in App component for userData flow
- No external state management library
- User data passed as props between components

### Path Aliases

- `@/*` maps to `src/*` for clean imports

### Styling Approach

- Custom gradient backgrounds and glass effects
- Mystical theme with purple/indigo color scheme
- Responsive design with mobile-first approach
- Custom CSS animations for particles and cosmic effects

### Numerology Calculations

The core numerology logic involves:
- Letter-to-number mapping for names
- Single digit reduction algorithms
- Diamond chart position calculations
- Multiple calculation phases (name values, mid values, circle values)

### Form Validation

- Zod schemas for type-safe validation
- Custom error messages for numerology context
- Date validation with reasonable birth date ranges

---

## Application User Flow

### The Shareable Card IS the Product

The core insight: **sharing creates viral growth**. The shareable card is not an afterthought — it's the primary output. Everything else (deep readings, full forecasts, talismans) is for those who want more.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   SHAREABLE CARD (what gets posted on X)                    │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                                                     │   │
│   │          ✧ THE INFINITY COMPASS ✧                   │   │
│   │                                                     │   │
│   │              TONI's 2025                            │   │
│   │                                                     │   │
│   │         Current Energy: 9                           │   │
│   │         "The Completer"                             │   │
│   │                                                     │   │
│   │    Finish what you started.                         │   │
│   │    Release what no longer serves.                   │   │
│   │                                                     │   │
│   │         ─────────────────────                       │   │
│   │         What's YOUR energy?                         │   │
│   │         theinfinitycompass.com                      │   │
│   │                                                     │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   This is what spreads.                                     │
│   Simple. Visual. Curiosity-inducing.                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### What Makes People Actually Share?

| Element | Why It Works |
|---------|--------------|
| Personal | "This is MY energy" - identity |
| Timely | "Right NOW" - relevance |
| Short | One number, one phrase - digestible |
| Mysterious | "The Completer" - intriguing |
| Question | "What's yours?" - invites engagement |
| Beautiful | Aesthetic matters on social |

### The Viral Funnel

```
See friend's share on X
        ↓
Curious → Click link
        ↓
Enter name + birthdate (10 seconds)
        ↓
See YOUR current energy (instant payoff)
        ↓
[Share yours] ← MOST WILL STOP HERE (and that's fine!)
        ↓
Some click "See full 2025" (Year Forecast)
        ↓
Fewer click "Deep profile" (Full Diamond Reading)
        ↓
Rare few → "Get your talisman" (Product)
```

**The magic:** Even if 90% only share and leave, they've brought more people in.

### Layered Journey (Progressive Depth)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LAYERED JOURNEY APPROACH                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LAYER 1         LAYER 2           LAYER 3              LAYER 4 (optional)  │
│  Landing         Entry             Shareable Card       Deep Dive            │
│  (/login)        (/enter)          (/share)             (accordions)         │
│                                                                              │
│  ┌─────────┐    ┌─────────┐       ┌─────────────┐      ┌─────────────┐      │
│  │ Welcome │    │ Name    │       │ YOUR 2025   │      │ Full        │      │
│  │         │ ►  │         │  ►    │ Current     │  ►   │ Diamond     │      │
│  │ Fortune │    │ Birth   │       │ Energy      │      │ Chart       │      │
│  │ Teller  │    │ Date    │       │             │      │             │      │
│  │         │    │         │       │ [SHARE]     │      │ Year Series │      │
│  │ Begin   │    │ Focus   │       │             │      │             │      │
│  │ Reading │    │ Area    │       │ See More ▼  │      │ Talisman    │      │
│  └─────────┘    └─────────┘       └─────────────┘      └─────────────┘      │
│                                                                              │
│  10 sec          30 sec            INSTANT PAYOFF       FOR CURIOUS          │
│  Set tone        Collect data      Most stop here       Few go deeper        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Page-by-Page Breakdown

#### Layer 1: Landing Page (`/login`)
**Purpose:** Welcome users, set mystical tone, single CTA

- Logo + Title + Tagline
- Fortune Teller with random greeting
- Three feature highlights (what they'll get)
- "Begin My Reading" button
- Privacy note

**Design:** No card container — content floats directly on cosmic background for immersion

#### Layer 2: Entry Page (`/enter`)
**Purpose:** Collect minimal data needed for calculation (10-30 seconds)

| Field | Required | Why |
|-------|----------|-----|
| Full Name | Yes | Letter-to-number mapping for numerology |
| Birth Date | Yes | Life path, personal year calculations |
| Focus Area | Optional | Contextualizes the reading |

**Design:** Simple form, cosmic background, clear submit button

#### Layer 3: Shareable Card Page (`/share`)
**Purpose:** Deliver instant payoff + encourage sharing

**Above the fold (what everyone sees):**
- Personal shareable card with current energy
- Share button (prominent)
- Download image button

**Below the fold (for the curious):**
- "See your full 2025" → Year Series Forecast accordion
- "Explore your diamond" → Full numerology chart accordion
- "Your sacred crystal" → Talisman product CTA

**Design:** The shareable card is the hero. Everything else is expandable accordions.

### Route Configuration

```
/login    → Landing Page (entry point)
/enter    → Entry Form (name + birthdate)
/share    → Shareable Card + Deep Content (accordions)
/forecast → Standalone Year Forecast (alternate entry, public)
```

### State Flow

```
Landing (/login)
    │
    ├─► bypassVerification() → isVerified = true
    │
    ▼
Entry (/enter)
    │
    ├─► onUnLock({ name, birthDate, focusArea })
    │
    ▼
Shareable Card (/share)
    │
    ├─► Calculate numerology from userData
    ├─► Generate shareable card
    ├─► Accordions reveal deeper content on demand
    │
    ▼
[User shares OR explores deeper content]
```

### Design Principles

1. **Shareable First** — The card is the product, not the app
2. **Progressive Depth** — Easy entry, depth available for curious
3. **Instant Payoff** — See your energy immediately after form
4. **Viral Loop** — Card includes "What's yours?" call-to-action
5. **Optional Depth** — Deep content in accordions, not forced

---

## Active Feature Development

### Feature: WoW/Non-WoW User Path Split

**Branch**: `feature/wow-non-wow-split`
**Status**: In Progress
**Started**: 2025-12-23

#### WoW/Non-WoW Split Goal

Split the user journey into two paths:

1. **WoW Holders**: Continue with existing NFT selection flow
2. **Non-WoW Users**: AI-generated personalized avatar based on numerology reading

#### WoW/Non-WoW Split Tasks

- [x] **1. Create Feature Branch**
  - Create and checkout `feature/wow-non-wow-split` branch
  - **Completion Notes**: Branch created and checked out successfully on 2025-12-23

- [x] **2. Design Path Selection UI**
  - Add initial path selection screen before current IndividualReadingPage
  - Two options: "I own a WoW NFT" / "Generate my cosmic avatar"
  - Design mockup with mystical theme matching existing UI
  - **Completion Notes**: Created `PathSelectionPage.tsx` with two card-based options matching existing mystical UI theme. Includes cosmic particles, sacred geometry background, and smooth animations.

- [x] **3. Research AI Avatar Generation Service**
  - Evaluate options: DALL-E 3, Midjourney API, Stable Diffusion, Replicate, etc.
  - Requirements:
    - Can generate portrait/avatar style images
    - API available (not just web interface)
    - Reasonable cost per generation (~$0.02-0.10)
    - Consistent mystical/cosmic art style
    - Fast generation (< 30 seconds)
  - Document chosen service and setup requirements
  - **Completion Notes**: Selected **Replicate** with Stability AI SDXL model. User created account, funded with $10, API token added to .env. Cost: ~$0.01-0.05 per avatar generation. Installed replicate npm package.

- [x] **4. Create Avatar Generation Prompt Engineering**
  - Design base prompt template for cosmic avatars
  - Map numerology data to visual attributes:
    - Life Path → overall archetype/character style
    - Expression Number → pose/expression/energy
    - Soul Urge → color palette/aura
    - Personality Number → clothing/accessories
    - Birthday Planet → cosmic background elements
  - Test prompts to ensure quality and consistency
  - **Completion Notes**: Comprehensive mapping system created in `avatarService.ts`. Each numerology number (1-9, 11, 22, 33) mapped to specific visual attributes. Prompts dynamically generated based on user's full numerology profile.

- [x] **5. Implement Avatar Generation Service**
  - Create `src/services/avatarService.ts`
  - Function: `generateCosmicAvatar(numerologyData: NumerologyData): Promise<string>`
  - Handle API calls, error handling, retry logic
  - Return image URL or base64 data
  - Add loading states and error states
  - **Completion Notes**: Created `src/services/avatarService.ts` with prompt generation functions and API integration. Created `api/generate-avatar.js` backend endpoint that calls Replicate API. Includes localStorage caching, error handling, rate limiting (3 req/min), and fallback placeholder support.

- [x] **6. Update AuthContext for Path Selection**
  - Add `userPath: 'wow' | 'non-wow' | null` to context
  - Add `generatedAvatar: string | null` for non-WoW users
  - Update setters and getters
  - **Completion Notes**: Updated `AuthContext.tsx` with `userPath` and `generatedAvatar` state management. Added `setUserPath()` and `setGeneratedAvatar()` functions with localStorage persistence. Path switching logic clears appropriate data (switching to non-wow clears NFT data, switching to wow clears avatar). Updated logout to clear all new state.

- [x] **7. Create PathSelectionPage Component**
  - New page component for initial path selection
  - Two prominent options with descriptions
  - Match existing mystical UI design
  - Navigate to appropriate flow based on selection
  - **Completion Notes**: Created `src/pages/PathSelectionPage.tsx` with two interactive cards: "I Own a WoW NFT" (Wallet icon) and "Generate My Cosmic Avatar" (User icon). Features matching cosmic theme, hover effects, and navigation to `/enter` after selection.

- [x] **8. Update IndividualReadingPage for Non-WoW Flow**
  - Skip wallet input and NFT selection if `userPath === 'non-wow'`
  - Show only name and birth date form
  - Update validation (remove NFT requirement for non-WoW)
  - Update submit handler
  - **Completion Notes**: Updated `IndividualReadingPage.tsx` to check `userPath` from AuthContext. For non-WoW users: skips wallet input, skips NFT selection, shows name/birthdate form immediately, removes NFT validation requirement. Updated page subtitle to show appropriate message for each path.

- [x] **9. Generate Avatar After Reading Calculation**
  - Trigger avatar generation in ShareableReadingPage for non-WoW users
  - Generate avatar based on calculated numerology data
  - Show loading state during generation
  - Cache generated avatar in context and localStorage
  - **Completion Notes**: Added avatar generation in `initializeReading()` function. Checks if `userPath === 'non-wow'` and `!generatedAvatar`, then calls `generateCosmicAvatar()` with numerology data. Shows loading state with spinner. Stores result in AuthContext via `setGeneratedAvatar()`. Includes error handling with graceful fallback.

- [x] **10. Update ShareableReadingPage for Both Avatar Types**
  - Detect if user has WoW NFT or generated avatar
  - Render appropriate image in card layout
  - Ensure layout works for both image types
  - Add "Generated Cosmic Avatar" badge/label for AI avatars
  - **Completion Notes**: Updated image display section to check for both `selectedNFT` and `generatedAvatar`. Shows loading spinner while generating avatar. Displays either NFT image or generated avatar. Badge shows "WoW #tokenId" for NFTs or "AI Generated Avatar" with sparkle icon for generated avatars. Layout identical for both types.

- [x] **11. Update App Routing**
  - Add PathSelectionPage as initial route
  - Update navigation flow: PathSelection → IndividualReading → ShareableReading
  - Preserve ability to go back and change path
  - **Completion Notes**: Updated `App.tsx` with new `/choose-path` route. Login now redirects to path selection. Added conditional routing: if `userPath` is null, redirect to `/choose-path`. Updated LoginPage to navigate to `/choose-path` after bypassing verification.

- [ ] **12. Handle Edge Cases**
  - What if avatar generation fails? (Fallback avatar/retry)
  - What if user wants to regenerate avatar? (Add button)
  - What if WoW user wants to try non-WoW? (Allow path switching)
  - LocalStorage persistence of path choice
  - **Completion Notes**: _Pending_

- [ ] **13. Testing**
  - Test WoW holder path (should work exactly as before)
  - Test non-WoW path end-to-end
  - Test avatar generation with various numerology profiles
  - Test error states and loading states
  - Test on mobile and desktop
  - **Completion Notes**: _Pending_

- [ ] **14. Code Review & Cleanup**
  - Remove any console.logs
  - Ensure TypeScript types are correct
  - Update CLAUDE.md documentation
  - Prepare for merge to main
  - **Completion Notes**: _Pending_

---

### Feature: Talisman/Product System

**Branch**: `feature/talisman-product`
**Status**: Not Started
**Started**: TBD

#### Talisman System Goal

Create an exclusive, premium crystal talisman product line positioned as small-scale luxury jewelry (think Tiffany & Co. aesthetic). Each talisman features a natural raw crystal with a personalized numerology number, delivered with luxury packaging and certificate of authenticity.

#### Brand Positioning: Exclusive Luxury

**Target Audience:**
- Numerology/spirituality enthusiasts
- Crystal collectors who attend crystal fairs/messes
- People seeking meaningful, personalized jewelry
- NOT: Commercial jewelry shoppers (Swarovski, fashion jewelry)

**Brand Differentiators:**

| Commercial Jewelry | Infinity Compass Talismans |
|-------------------|----------------------------|
| Perfect, identical pieces | Each crystal unique |
| Faceted, polished cuts | Natural raw/tumbled form |
| Fashion statement | Spiritual talisman |
| Mass manufactured | Hand-selected crystals |
| Crystal = decoration | Crystal = energy/meaning |

**Price Point:** $149-179 (signals quality, thoughtful purchase)

#### Core Concept

After receiving their numerology reading, users can purchase a personalized crystal talisman:

- Crystal type determined by **birth day reduced to single digit** (1-9)
- **Natural raw/tumbled crystal** (not polished geometric cuts)
- **Bail cap design** with engraved birth number laser engraving OR deep mechanical engraving
- Sterling silver or gold vermeil metals
- Luxury packaging with certificate of authenticity
- **9 representative images** (one per crystal type)
- Each crystal is unique - images are representative

#### Product Design: Bail Cap + Raw Crystal

```
        ┌─────┐
        │  7  │  ← Metal bail cap with engraved number
        └──┬──┘
           │
      ┌────┴────┐
      │ ▓▓▓▓▓▓▓ │
      │ ▓▓▓▓▓▓▓ │  ← Natural raw/tumbled crystal
      │ ▓▓▓▓▓▓▓ │    (organic shape, not geometric)
      │ ▓▓▓▓▓▓  │
      └─────────┘
```

**Design Elements:**
- **Crystal:** Natural tumbled or raw form, 22–26mm Reject outliers
- **Bail cap:** Metal cap that grips the crystal top
- **Engraving:** Single digit (1-9) on bail cap front
- **Chain:** Matching metal, 18" princess length, 1.3–1.6mm cable chain minimum, Lobster clasp, not spring ring
- **No name engraving** - keeps it cleaner, number is the personalization

#### Numerology-to-Crystal Mapping

| Number | Crystal | Metal | Spiritual Meaning |
|--------|---------|-------|-------------------|
| 1 | Clear Quartz | Gold Vermeil | Clarity, amplification, new beginnings, leadership |
| 2 | Moonstone | Sterling Silver | Intuition, emotional balance, harmony, receptivity |
| 3 | Carnelian | Gold Vermeil | Joy, creativity, motivation, self-expression |
| 4 | Black Tourmaline | Sterling Silver | Grounding, protection, stability, structure |
| 5 | Aquamarine | Sterling Silver | Freedom, courage, adventure, adaptability |
| 6 | Rose Quartz | Sterling Silver | Love, compassion, harmony, nurturing |
| 7 | Amethyst | Sterling Silver | Spirituality, wisdom, insight, introspection |
| 8 | Citrine | Gold Vermeil | Abundance, success, manifestation, ambition |
| 9 | Rose Quartz | Gold Vermeil | Universal love, empathy, healing, humanitarianism |

**Note:** Brass removed - using only sterling silver and gold vermeil for premium positioning.

#### Physical Specifications

**Crystal:**
- Form: Natural tumbled or raw (not faceted/cabochon)
- Size: 22–26mm
- Grade: Hand-selected, higher quality specimens
- Each piece unique (natural variation is a feature)

**Bail Cap:**
- Material: Sterling silver (.925) or 18K gold vermeil
- Design: Clean cap that grips crystal top
- Engraving: Single digit, 3-4mm, sans-serif font laser engraving OR deep mechanical engraving
- Stamped with .925 or metal purity mark

**Chain:**
- Material: Matching sterling silver or gold vermeil
- Length: 18" princess (sits at collarbone)
- Style: Delicate cable or rope chain

#### Luxury Packaging & Presentation

**Packaging Components:**

```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │  ← Outer sleeve (signature deep purple/indigo)
│  │                       │  │     with embossed logo
│  │   ┌───────────────┐   │  │
│  │   │   [Crystal]   │   │  │  ← Inner box (black velvet lined)
│  │   │  on silk pad  │   │  │
│  │   └───────────────┘   │  │
│  │                       │  │
│  │   Certificate below   │  │  ← Personalized certificate
│  │   Ritual card         │  │  ← Activation instructions
│  └───────────────────────┘  │
└─────────────────────────────┘
```

**Included Items:**
1. Outer sleeve in signature color (deep purple/indigo)
2. Inner velvet-lined box
3. Silk or satin cushion
4. Certificate of Authenticity
5. Crystal activation ritual card
6. Care instructions

#### Certificate of Authenticity

```
╔══════════════════════════════════════════════════╗
║                                                  ║
║          THE INFINITY COMPASS                    ║
║          Certificate of Authenticity             ║
║                                                  ║
║  ─────────────────────────────────────────────   ║
║                                                  ║
║  This talisman was created for:                  ║
║                                                  ║
║              [CUSTOMER NAME]                     ║
║              Birth Number: [X]                   ║
║                                                  ║
║  Crystal: Natural [Crystal Name]                 ║
║  Metal: Sterling Silver (.925)                   ║
║  Meaning: [Spiritual meaning]                    ║
║                                                  ║
║  "Your crystal was hand-selected to resonate     ║
║   with your unique numerological energy."        ║
║                                                  ║
║  Serial: IC-2024-XXXXX                           ║
║  Created: [Date]                                 ║
║                                                  ║
║  [Signature]                                     ║
║  The Infinity Compass                            ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

#### Crystal Activation Ritual Card

```
╭─────────────────────────────────────╮
│                                     │
│     ACTIVATING YOUR TALISMAN        │
│                                     │
│  1. Hold your crystal in moonlight  │
│     for one full night              │
│                                     │
│  2. Set your intention by speaking  │
│     your birth number aloud         │
│                                     │
│  3. Wear your talisman close to     │
│     your heart                      │
│                                     │
│  Your [Crystal] amplifies your      │
│  natural gifts of [meaning].        │
│                                     │
╰─────────────────────────────────────╯
```

#### Representative Image Strategy

**Total images needed: 9** (one per crystal type)

Since raw crystals vary naturally, we show representative images with explanatory text.

| Number | Crystal | Image |
|--------|---------|-------|
| 1 | Clear Quartz | ✓ |
| 2 | Moonstone | ✓ |
| 3 | Carnelian | ✓ |
| 4 | Black Tourmaline | ✓ |
| 5 | Aquamarine | ✓ |
| 6 | Rose Quartz | ✓ |
| 7 | Amethyst | ✓ |
| 8 | Citrine | ✓ |
| 9 | Rose Quartz (gold) | ✓ |

**Website Copy for Each Crystal:**

> "Your [Crystal Name] talisman will be unique - each crystal is hand-selected for its spiritual energy and natural beauty. The one that arrives is the one meant for you."

**AI Prompt Template for Representative Images:**

```
Professional product photograph of a raw natural [CRYSTAL] crystal pendant,
the crystal is in its natural tumbled form showing beautiful natural texture,
attached with a simple [METAL] bail cap at the top,
the bail cap has a flat circular front surface,
organic natural crystal shape not geometric or faceted,
hanging on a delicate [METAL] chain,
luxury spiritual jewelry aesthetic,
isolated on pure white background, solid white backdrop, no props, no decorations, nothing in background,
soft diffused studio lighting with subtle glow,
product photography, pendant only, no model, no person, no human, no hands, no fingers, no body parts,
8k, high detail, professional e-commerce jewelry photography,
avoid wire wrapping, no faceted cuts, no geometric shapes, no text or numbers visible
```

**Note:** Flux 1.1 Pro does not support negative prompts, so all exclusions must be inline in the main prompt.

#### All 9 Image Generation Prompts

Copy-paste these directly into Replicate (model: `black-forest-labs/flux-1.1-pro`, aspect ratio: 1:1).

**1. Clear Quartz / Gold Vermeil:**
```
Professional product photograph of a raw natural clear quartz crystal pendant,
the crystal is in its natural tumbled form showing beautiful transparency and natural texture,
attached with a simple gold vermeil bail cap at the top,
the bail cap has a flat circular front surface,
organic natural crystal shape not geometric or faceted,
hanging on a delicate gold vermeil chain,
luxury spiritual jewelry aesthetic,
isolated on pure white background, solid white backdrop, no props, no decorations, nothing in background,
soft diffused studio lighting with subtle glow through the crystal,
product photography, pendant only, no model, no person, no human, no hands, no fingers, no body parts,
8k, high detail, professional e-commerce jewelry photography,
avoid wire wrapping, no faceted cuts, no geometric shapes, no text or numbers visible
```

**2. Moonstone / Sterling Silver:**
```
Professional product photograph of a raw natural moonstone crystal pendant,
the crystal is in its natural tumbled form showing beautiful blue adularescence and milky sheen,
attached with a simple sterling silver bail cap at the top,
the bail cap has a flat circular front surface,
organic natural crystal shape not geometric or faceted,
hanging on a delicate sterling silver chain,
luxury spiritual jewelry aesthetic,
isolated on pure white background, solid white backdrop, no props, no decorations, nothing in background,
soft diffused studio lighting with subtle iridescent glow,
product photography, pendant only, no model, no person, no human, no hands, no fingers, no body parts,
8k, high detail, professional e-commerce jewelry photography,
avoid wire wrapping, no faceted cuts, no geometric shapes, no text or numbers visible
```

**3. Carnelian / Gold Vermeil:**
```
Professional product photograph of a raw natural carnelian crystal pendant,
the crystal is in its natural tumbled form showing beautiful warm orange-red color and translucency,
attached with a simple gold vermeil bail cap at the top,
the bail cap has a flat circular front surface,
organic natural crystal shape not geometric or faceted,
hanging on a delicate gold vermeil chain,
luxury spiritual jewelry aesthetic,
isolated on pure white background, solid white backdrop, no props, no decorations, nothing in background,
soft diffused studio lighting with warm glow through the stone,
product photography, pendant only, no model, no person, no human, no hands, no fingers, no body parts,
8k, high detail, professional e-commerce jewelry photography,
avoid wire wrapping, no faceted cuts, no geometric shapes, no text or numbers visible
```

**4. Black Tourmaline / Sterling Silver:**
```
Professional product photograph of a raw natural black tourmaline crystal pendant,
the crystal is in its natural form showing beautiful black color with natural striations and texture,
attached with a simple sterling silver bail cap at the top,
the bail cap has a flat circular front surface,
organic natural crystal shape not geometric or faceted,
hanging on a delicate sterling silver chain,
luxury spiritual jewelry aesthetic,
isolated on pure white background, solid white backdrop, no props, no decorations, nothing in background,
soft diffused studio lighting with subtle reflective surface,
product photography, pendant only, no model, no person, no human, no hands, no fingers, no body parts,
8k, high detail, professional e-commerce jewelry photography,
avoid wire wrapping, no faceted cuts, no geometric shapes, no text or numbers visible
```

**5. Aquamarine / Sterling Silver:**
```
Professional product photograph of a raw natural aquamarine crystal pendant,
the crystal is in its natural tumbled form showing beautiful pale blue-green color and transparency,
attached with a simple sterling silver bail cap at the top,
the bail cap has a flat circular front surface,
organic natural crystal shape not geometric or faceted,
hanging on a delicate sterling silver chain,
luxury spiritual jewelry aesthetic,
isolated on pure white background, solid white backdrop, no props, no decorations, nothing in background,
soft diffused studio lighting with subtle oceanic glow,
product photography, pendant only, no model, no person, no human, no hands, no fingers, no body parts,
8k, high detail, professional e-commerce jewelry photography,
avoid wire wrapping, no faceted cuts, no geometric shapes, no text or numbers visible
```

**6. Rose Quartz / Sterling Silver:**
```
Professional product photograph of a raw natural rose quartz crystal pendant,
the crystal is in its natural tumbled form showing beautiful soft pink color and gentle translucency,
attached with a simple sterling silver bail cap at the top,
the bail cap has a flat circular front surface,
organic natural crystal shape not geometric or faceted,
hanging on a delicate sterling silver chain,
luxury spiritual jewelry aesthetic,
isolated on pure white background, solid white backdrop, no props, no decorations, nothing in background,
soft diffused studio lighting with gentle pink glow,
product photography, pendant only, no model, no person, no human, no hands, no fingers, no body parts,
8k, high detail, professional e-commerce jewelry photography,
avoid wire wrapping, no faceted cuts, no geometric shapes, no text or numbers visible
```

**7. Amethyst / Sterling Silver:**
```
Professional product photograph of a raw natural amethyst crystal pendant,
the crystal is in its natural tumbled form showing beautiful deep purple color and natural clarity,
attached with a simple sterling silver bail cap at the top,
the bail cap has a flat circular front surface,
organic natural crystal shape not geometric or faceted,
hanging on a delicate sterling silver chain,
luxury spiritual jewelry aesthetic,
isolated on pure white background, solid white backdrop, no props, no decorations, nothing in background,
soft diffused studio lighting with rich purple glow,
product photography, pendant only, no model, no person, no human, no hands, no fingers, no body parts,
8k, high detail, professional e-commerce jewelry photography,
avoid wire wrapping, no faceted cuts, no geometric shapes, no text or numbers visible
```

**8. Citrine / Gold Vermeil:**
```
Professional product photograph of a raw natural citrine crystal pendant,
the crystal is in its natural tumbled form showing beautiful warm golden yellow color and sunny transparency,
attached with a simple gold vermeil bail cap at the top,
the bail cap has a flat circular front surface,
organic natural crystal shape not geometric or faceted,
hanging on a delicate gold vermeil chain,
luxury spiritual jewelry aesthetic,
isolated on pure white background, solid white backdrop, no props, no decorations, nothing in background,
soft diffused studio lighting with warm sunny glow,
product photography, pendant only, no model, no person, no human, no hands, no fingers, no body parts,
8k, high detail, professional e-commerce jewelry photography,
avoid wire wrapping, no faceted cuts, no geometric shapes, no text or numbers visible
```

**9. Rose Quartz / Gold Vermeil:**
```
Professional product photograph of a raw natural rose quartz crystal pendant,
the crystal is in its natural tumbled form showing beautiful soft pink color and gentle translucency,
attached with a simple gold vermeil bail cap at the top,
the bail cap has a flat circular front surface,
organic natural crystal shape not geometric or faceted,
hanging on a delicate gold vermeil chain,
luxury spiritual jewelry aesthetic,
isolated on pure white background, solid white backdrop, no props, no decorations, nothing in background,
soft diffused studio lighting with gentle pink glow,
product photography, pendant only, no model, no person, no human, no hands, no fingers, no body parts,
8k, high detail, professional e-commerce jewelry photography,
avoid wire wrapping, no faceted cuts, no geometric shapes, no text or numbers visible
```

**File Naming Convention:**
```
src/assets/pendents/talisman-1-clear-quartz.png
src/assets/pendents/talisman-2-moonstone.png
src/assets/pendents/talisman-3-carnelian.png
src/assets/pendents/talisman-4-black-tourmaline.png
src/assets/pendents/talisman-5-aquamarine.png
src/assets/pendents/talisman-6-rose-quartz-silver.png
src/assets/pendents/talisman-7-amethyst.png
src/assets/pendents/talisman-8-citrine.png
src/assets/pendents/talisman-9-rose-quartz-gold.png
```

**Replicate Settings:**
- Model: `black-forest-labs/flux-1.1-pro`
- Aspect Ratio: 1:1
- Output Format: PNG
- Output Quality: 100

**Quality Checklist for Each Image:**
- [ ] Crystal looks natural/tumbled (not faceted)
- [ ] Bail cap visible at top with flat front surface
- [ ] Chain matches metal color
- [ ] Background is clean white
- [ ] Lighting is consistent with other images
- [ ] Crystal color is accurate for type
- [ ] Overall luxury aesthetic achieved

#### Exclusivity Signals

**On Website:**
- "Hand-selected crystals"
- "Limited production"
- "Each piece unique"
- "Made to order"
- Serial numbers displayed
- "Not available in stores"

**Language Guidelines:**
- Say "Talisman" not "necklace" or "pendant"
- Say "Hand-selected" not "picked"
- Say "Crafted" not "made"
- Say "Your personal" not "a"
- Say "Natural" not "raw"

#### Production & Vendor Strategy (Premium)

**Vendor Requirements:**

- ✓ Natural tumbled gemstones (not synthetic)
- ✓ Sterling silver (.925) stamped
- ✓ Gold vermeil option (18K gold over sterling)
- ✓ Custom bail cap design with engraving
- ✓ Individual QC photos before shipping
- ✓ Premium packaging capability
- ✓ Certificate printing
- ✓ Gift-ready presentation

**Cost Structure (Target):**

| Component | Est. Cost |
|-----------|-----------|
| Natural crystal (quality) | $5-15 |
| Sterling silver bail + chain | $15-25 |
| Engraving | $3-5 |
| Premium packaging | $8-12 |
| Certificate + cards | $2-3 |
| Labor + QC | $10-15 |
| **Total COGS** | **$43-75** |
| **Retail Price** | **$149-179** |
| **Margin** | ~60% |

**Vendor Options:**

1. **Artisan Partnership (Recommended for MVP)**
   - Find Etsy jeweler who specializes in raw crystal jewelry
   - Partner for custom production
   - Higher cost but better quality control
   - Can start with small batches

2. **Alibaba Premium Manufacturers**
   - Wuzhou, Guangdong region
   - Request samples before committing
   - MOQ: 50-100 pieces
   - Longer lead time but scalable

#### User Flow

```
ShareableReadingPage → [See Reading] → "Claim Your Talisman" CTA
                                              ↓
                                    TalismanPage
                                              ↓
              [Display: Your crystal is [Name], symbolizing [meaning]]
                                              ↓
                     [Show representative image + uniqueness message]
                                              ↓
                      [Product details: materials, packaging, certificate]
                                              ↓
                              [Add to Cart - $149-179]
                                              ↓
                                    Checkout (Stripe)
```

#### Data Model

```typescript
interface TalismanConfig {
  birthNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  crystal: string;
  metal: 'sterling-silver' | 'gold-vermeil';
  meaning: string;
  description: string;
  representativeImageUrl: string;
  price: number;
}

const TALISMAN_ASSOCIATIONS: Record<number, TalismanConfig> = {
  1: {
    birthNumber: 1,
    crystal: 'Clear Quartz',
    metal: 'gold-vermeil',
    meaning: 'clarity and new beginnings',
    description: 'The master healer crystal amplifies your natural leadership energy and brings clarity to your path.',
    representativeImageUrl: '/src/assets/pendents/talisman-1-clear-quartz.png',
    price: 169
  },
  2: {
    birthNumber: 2,
    crystal: 'Moonstone',
    metal: 'sterling-silver',
    meaning: 'intuition and harmony',
    description: 'This ethereal stone enhances your intuitive gifts and brings emotional balance to relationships.',
    representativeImageUrl: '/src/assets/pendents/talisman-2-moonstone.png',
    price: 159
  },
  // ... etc for 3-9
};

interface TalismanOrder {
  serialNumber: string;        // IC-2024-XXXXX
  customerName: string;
  birthNumber: number;
  talismanConfig: TalismanConfig;
  createdAt: Date;
  certificateData: CertificateData;
}
```

#### Talisman System Tasks

- [ ] **1. Create Feature Branch**
  - Create and checkout `feature/talisman-product` branch
  - **Completion Notes**: _Pending_

- [x] **2. Generate 9 Representative Crystal Images**
  - Generate one image per crystal type via Replicate
  - Quality review each image, regenerate if needed
  - Ensure consistent style across all 9
  - Upload to cloud storage
  - **Completion Notes**: All 9 images generated using Flux 1.1 Pro on Replicate. Images stored in `src/assets/pendents/`. Completed 2025-12-25.

- [x] **3. Create Talisman Data Service**
  - Create `src/services/talismanService.ts`
  - Implement `TALISMAN_ASSOCIATIONS` mapping
  - Function: `getTalismanConfig(birthNumber): TalismanConfig`
  - Function: `generateSerialNumber(): string`
  - Function: `generateCertificateData(order): CertificateData`
  - **Completion Notes**: Created `src/services/talismanService.ts` with full crystal mappings for numbers 1-9. Images imported statically for Vite bundling. Completed 2025-12-25.

- [ ] **4. Create TalismanPage Component**
  - New page at `/talisman` route
  - Display user's assigned crystal with meaning
  - Show representative image with uniqueness message
  - Product details: materials, what's included
  - Premium pricing display
  - Match mystical UI theme
  - **Completion Notes**: _Pending_

- [x] **5. Add Talisman CTA to ShareableReadingPage**
  - "Claim Your Talisman" button (premium language)
  - Brief crystal meaning teaser
  - Navigation to TalismanPage
  - **Completion Notes**: Added "Your Sacred Crystal" accordion section after Deep Dive Insights. Shows crystal image, name, meaning, description, and CTA button. Completed 2025-12-25.

- [ ] **6. Design Certificate & Packaging Templates**
  - Certificate of Authenticity design (PDF generation)
  - Ritual card content for each crystal
  - Packaging specifications document for vendor
  - **Completion Notes**: _Pending_

- [ ] **7. Implement Stripe Checkout**
  - Stripe integration for payment
  - Order creation with serial number
  - Confirmation email with certificate preview
  - **Completion Notes**: _Pending_

- [ ] **8. Vendor Partnership Setup**
  - Research and contact artisan jewelers
  - Request samples
  - Negotiate pricing and MOQ
  - Establish quality standards
  - Test order with packaging
  - **Completion Notes**: _Pending_

- [ ] **9. Testing**
  - Test all 9 crystal variations display correctly
  - Test checkout flow end-to-end
  - Test certificate generation
  - Test on mobile and desktop
  - **Completion Notes**: _Pending_

- [ ] **10. Launch Preparation**
  - Product photography (real samples)
  - Website copy refinement
  - Email sequences (order confirmation, shipping, delivery)
  - Customer support documentation
  - **Completion Notes**: _Pending_

---

### Feature: Landing Page Refinement

**Branch**: `feature/wow-non-wow-split`
**Status**: Completed
**Updated**: 2025-12-29

#### Landing Page Design Philosophy

The landing page (`LoginPage.tsx`) has been refined to create a more immersive, distraction-free experience that lets the cosmic background and fortune teller guide take center stage.

#### Key Design Decisions

**1. Removed Card Container**
- The previous design had a glass-effect Card wrapper around the main CTA
- This was a remnant from the Discord login flow where it made sense to contain login UI
- For the simplified flow, the card created unnecessary visual separation
- Content now flows directly on the cosmic background for a more seamless, mystical feel

**2. Removed Info Button (HelpCircle)**
- Previously had a question mark button that linked to `/info`
- This was designed to explain WoW wallet connection requirements
- No longer needed since we removed the WoW-specific flow
- Users can discover features through the natural flow

**3. Simplified User Flow**
```
LoginPage → IndividualReadingPage → ShareableReadingPage
     ↓
  (No more path selection)
```

**4. Content Hierarchy**
The landing page now presents information in this order:
1. Logo and title ("The Infinity Compass")
2. Tagline with mystical positioning
3. Fortune teller image with random greeting
4. Three feature highlights (Personal Reading, Year Forecast, Shareable Card)
5. "Begin My Reading" CTA button
6. Privacy note (below button, subtle)

#### Current LoginPage Structure

```tsx
<div className="gradient-bg">
  {/* Language Toggle - top right */}
  <LanguageToggle />

  {/* Cosmic particles + Sacred geometry background */}

  {/* Hero: Logo + Title + Tagline */}

  {/* Fortune Teller with floating animation + random greeting */}

  {/* Content Section (motion.div) */}
  {isDiscordRequired ? (
    // Discord login flow (legacy, behind flag)
  ) : (
    // Simplified flow:
    // - Feature highlights (3 bullet points)
    // - "Begin My Reading" button
    // - Privacy note
  )}

  {/* Demo Modal + Cookie Consent */}
</div>
```

#### Internationalization (i18n)

The landing page now supports multiple languages via `LanguageContext`:
- All text content uses translation keys (`t.appTitle`, `t.btnBeginReading`, etc.)
- Greetings array is localized (`t.greetings`)
- Language toggle component in top-right corner
- Translations stored in `src/context/LanguageContext.tsx`

#### Feature Highlights

The three features presented on the landing page:
1. **Personal Reading** — Diamond chart based on name + birth date
2. **Year Forecast** — Cosmic periods for the year ahead
3. **Shareable Card** — Social media cards

Each highlight uses a colored star symbol (✦) for visual interest:
- Pink (#F8A1D1) for Personal Reading
- Purple (#9B8DE3) for Year Forecast
- Blue (#6BCFF6) for Shareable Card

#### Discord Login (Legacy)

The Discord login flow is preserved but hidden behind the `isDiscordRequired` flag in AuthContext:
- When `isDiscordRequired = true`: Shows Discord logo, login button, and demo button
- When `isDiscordRequired = false`: Shows simplified feature highlights flow
- Default is `false` for the current public experience

#### Animation Details

- Fortune teller image: Floating animation (y: 0 → -6 → 0, 3s loop)
- Content section: Fade in from bottom (opacity: 0→1, y: 20→0, 0.6s delay)
- Greeting text: Delayed fade in (1s delay)

#### Files Modified

- `src/pages/LoginPage.tsx` - Main landing page
- `src/App.tsx` - Simplified routing (removed path selection requirement)
- `src/context/LanguageContext.tsx` - Translation strings

---

### Feature: Year Series Forecast

**Branch**: `feature/wow-non-wow-split`
**Status**: Completed
**Updated**: 2025-12-29

#### Year Series Overview

The Year Series Forecast is a standalone numerology feature that divides the year into cosmic periods, each with unique energy signatures. Users can access it via `/forecast` without requiring authentication.

#### Core Calculation Logic

The year series calculations are based on three key numbers from the user's numerology profile:

1. **Top Diamond** — Birth day reduced to single digit (e.g., 29 → 11 → 2)
2. **Bottom Diamond** — Reduced value from diamond lower position
3. **Column Number** — Sum of all inner diamond values, reduced

These three numbers determine:
- The sequence of period numbers throughout the year
- Which years are "chart years" (special significance)
- How many periods appear in each year type

#### Year Types and Period Counts

| Year Type | Period Count | Description |
|-----------|--------------|-------------|
| Before Chart | 11 periods | Standard year before a chart year |
| Chart Year (with next) | 15 periods | Chart year followed by another chart year |
| Chart Year (solo) | 13 periods | Chart year not followed by another |
| After Chart | 11 periods | Standard year after a chart year |

#### Layered Presentation Approach

The YearForecastCard component uses a **layered visual hierarchy**:

```
┌─────────────────────────────────────────┐
│  Year Header (2025)                     │
│  "The Powerhouse Year"                  │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐       │
│  │  9  │ │  2  │ │11/2 │ │  1  │  ...  │  ← Period Numbers
│  │     │ │     │ │     │ │     │       │
│  │Jan  │ │Feb  │ │Mar  │ │Apr  │       │  ← Date Ranges
│  │1-31 │ │1-28 │ │1-31 │ │1-30 │       │
│  └─────┘ └─────┘ └─────┘ └─────┘       │
│                                         │
│  Current Period Highlight               │  ← Visual emphasis on active period
│                                         │
├─────────────────────────────────────────┤
│  Period Meaning Accordion               │  ← Expandable meanings for each number
│  └─ 9: "Completion & Release"           │
│  └─ 2: "Partnership & Balance"          │
│  └─ etc.                                │
└─────────────────────────────────────────┘
```

#### Key UI Components

**YearForecastCard** (`src/components/YearForecastCard.tsx`)
- Main display component for year forecast
- Horizontal scrollable period cards
- Current period highlighting
- Expandable period meanings

**YearForecastPage** (`src/pages/YearForecastPage.tsx`)
- Standalone entry page at `/forecast`
- Name and birth date form
- "Remember me" localStorage persistence
- Privacy-focused (data stays on device)

#### Period Number Display

Numbers are displayed with their compound form when applicable:
- Single digits: `1`, `2`, `3`, etc.
- Compound numbers: `11/2`, `16/7`, `19/1`, etc.

The compound form shows both the raw sum and the reduced value, which carries numerological significance.

#### Chart Year Calculation

Chart years are calculated from the birth year using a specific pattern:
```typescript
getChartYearsForBirthYear(birthYear: number): ChartYearEntry[]
```

Returns an array of years that have special numerological significance for the user, based on their column number.

#### localStorage Persistence

The YearForecastPage supports optional data persistence:
- **Key**: `infinity_compass_forecast_data`
- **Stored**: name, birthDateStr, topDiamond, bottomDiamond, columnNumber, savedAt
- **Privacy**: Data never leaves the device, explicit opt-in via "Remember me" checkbox
- **Clear option**: Users can clear stored data with confirmation modal

#### Service Functions

Located in `src/services/yearSeriesService.ts`:

| Function | Purpose |
|----------|---------|
| `calculateYearPeriods()` | Get all periods for a specific year |
| `determineYearType()` | Classify year as before/after/chart year |
| `getChartYearsForBirthYear()` | Get all chart years for a birth year |
| `calculateColumnNumber()` | Sum inner diamond values |
| `extractNumericValue()` | Handle compound number strings |
| `reduceNumber()` | Reduce to single digit (preserve master numbers) |
| `getYearTitle()` | Get archetype title for reduced year number |

#### Files

- `src/pages/YearForecastPage.tsx` - Entry page with form
- `src/components/YearForecastCard.tsx` - Forecast display component
- `src/services/yearSeriesService.ts` - Calculation logic
- `src/services/yearSeriesService.test.ts` - Test file with known values
