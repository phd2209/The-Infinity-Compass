# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite development server with HMR
- **Build**: `npm run build` - TypeScript compile followed by Vite production build
- **Lint**: `npm run lint` - Run ESLint on TypeScript/TSX files
- **Preview**: `npm run preview` - Preview production build locally

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

- [ ] **9. Generate Avatar After Reading Calculation**
  - Trigger avatar generation in ShareableReadingPage for non-WoW users
  - Generate avatar based on calculated numerology data
  - Show loading state during generation
  - Cache generated avatar in context and localStorage
  - **Completion Notes**: _Pending_

- [ ] **10. Update ShareableReadingPage for Both Avatar Types**
  - Detect if user has WoW NFT or generated avatar
  - Render appropriate image in card layout
  - Ensure layout works for both image types
  - Add "Generated Cosmic Avatar" badge/label for AI avatars
  - **Completion Notes**: _Pending_

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

Add modular lucky talisman/pendant product offering with AI-generated component images.

#### Talisman System Tasks

- Tasks to be defined once WoW/Non-WoW split is complete
