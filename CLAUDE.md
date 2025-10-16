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