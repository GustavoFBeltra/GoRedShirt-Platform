# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**GoRedShirt Platform** is a comprehensive multi-sport performance and recruiting platform built with Next.js 14, TypeScript, and Tailwind CSS. The platform serves athletes (13-23), coaches, recruiters, and parents/guardians with integrated performance analytics, media management, athlete discovery, and coaching marketplace features.

## Development Commands

```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build production application
npm run start        # Start production server
npm run lint         # Run ESLint for code quality

# shadcn/ui component management
npx shadcn add [component]     # Add specific shadcn/ui component
npx shadcn add button card     # Add multiple components
npx shadcn diff [component]    # Check for component updates

# Database type generation (after schema changes)
npx supabase gen types typescript --project-id ozrdyxfvlltbgugukpma > lib/database.types.ts
```

## Key Architecture & Structure

### Platform Architecture
- **Business Model**: Multi-sport recruiting platform with coaching marketplace and 10-15% platform fee
- **User Roles**: Five-tier system (Athletes, Coaches, Recruiters, Parents, Admin)
- **Payment Flow**: Multi-business Stripe Organizations setup with separate accounts
- **Database Design**: PostgreSQL with comprehensive RLS policies for multi-role data access

### Technology Stack
- **Framework**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Database**: Supabase (PostgreSQL) with comprehensive schema and Row Level Security
- **Payments**: Stripe Organizations with Express accounts for coaches
- **Authentication**: Supabase Auth with enhanced multi-role context
- **Media**: React Dropzone with file upload and organization system
- **Charts**: Recharts for performance analytics and data visualization
- **Deployment**: Vercel (Project ID: prj_4GJOgzdZniTXLCWAMy4060sC3vxk)

### Project Structure
- `Ryan-Coach/` - Main application directory
  - `app/` - Next.js App Router pages and layouts
    - `dashboard/` - Role-specific dashboards
    - `athlete/profile/` - Athlete profile management
    - `discovery/` - Athlete search and discovery
  - `components/` - Reusable React components
    - `ui/` - shadcn/ui auto-generated components
    - `athlete/` - Athlete-specific components (profiles, metrics)
    - `media/` - Media upload and gallery components
    - `discovery/` - Search and filtering components
    - `dashboard/` - Role-specific dashboard components
  - `lib/` - Core utilities and configurations
    - `supabase/` - Supabase client instances
    - `stripe/` - Stripe configuration
    - `auth/` - Authentication context and utilities
    - `metrics/` - Performance metrics catalog and utilities
  - `supabase/migrations/` - Database schema migrations

### MCP Server Configuration
Located in `.mcp.json` in parent directory. Key servers:
- **Supabase**: Database operations (project-ref: ozrdyxfvlltbgugukpma)
- **Stripe (Beltra Industries)**: acct_1S0rYYD6cJ90FHkd
- **Stripe (GoRedShirt)**: acct_1S1j13CaZpeFxkdn
- **Vercel**: Deployment management for ryan-coach project
- **Playwright**: E2E testing with output to `playwright-output/`
- **Semgrep**: Security scanning for project vulnerabilities

## Development Phases & Current Status

**Current Status**: Week 11-12 Completed - Platform ready for public launch

### Completed Features
- ✅ **Core Infrastructure**: Next.js 14, Supabase, Stripe Organizations setup
- ✅ **Authentication System**: Multi-role auth with enhanced context (athlete, coach, recruiter, parent, admin)
- ✅ **Registration System**: Multi-step registration with role-specific flows and sport selection
- ✅ **Database Schema**: Comprehensive multi-sport recruiting platform schema with RLS policies
- ✅ **Athlete Profile System**: Complete profile management with recruiting focus
- ✅ **Performance Metrics**: Advanced system with 25+ predefined metrics and elite benchmarks
- ✅ **Media Management**: Drag-and-drop upload system with organization and gallery
- ✅ **Discovery System**: Comprehensive athlete search with advanced filtering
- ✅ **Communication & Marketplace**: Complete messaging system and coach booking platform
- ✅ **UI/Design System**: shadcn/ui with GoRedShirt branding and advanced animations

### Phase Timeline
1. **Week 1-2**: Foundation & Setup ✅ COMPLETED
2. **Week 3-4**: Core Features (Profiles & Metrics) ✅ COMPLETED  
3. **Week 5-6**: Media Management & Discovery ✅ COMPLETED
4. **Week 7-8**: Communication & Marketplace ✅ COMPLETED
5. **Week 9-10**: Beta Launch ✅ COMPLETED
6. **Week 11-12**: Public Launch ✅ COMPLETED

## Database Schema

### Core Tables
- `users` - Base authentication with role field (athlete, coach, recruiter, parent, admin)
- `profiles` - Extended user information with location, school, graduation year
- `user_roles` - Junction table for multi-role support
- `sports` - Sports catalog with positions and categories
- `athlete_sports` - Athlete-sport relationships with positions and experience
- `metrics_catalog` - Comprehensive metrics definitions with elite benchmarks
- `metric_entries` - Individual performance metric records
- `media` - File storage with categories, tags, and metadata
- `coach_profiles` - Coach-specific data including Stripe account information
- `client_coach_relationships` - Coach-athlete relationships
- `coaching_sessions` - Session scheduling and tracking
- `payments` - Payment records with platform fee tracking
- `consent_records` - Parental consent for minor athletes

### Key Enums
- `user_role`: 'athlete' | 'coach' | 'recruiter' | 'parent' | 'admin'
- `visibility_type`: 'public' | 'recruiters_only' | 'private'
- `session_status_type`: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
- `payment_status_type`: 'pending' | 'succeeded' | 'failed' | 'canceled'

## Advanced Systems

### Performance Metrics System
- **Metrics Catalog**: 25+ predefined metrics across sports (`lib/metrics/metrics-catalog.ts`)
- **Categories**: Speed, Strength, Agility, Endurance, Skill, Body Composition
- **Elite Benchmarks**: Male/female specific benchmarks for performance rating
- **Sport Support**: Football, Soccer, Basketball, Universal combine metrics
- **Data Types**: Time, Number, Percentage, Count with appropriate validation
- **Performance Rating**: Automated excellent/good/average/below_average ratings

### Media Management System
- **Upload Interface**: React Dropzone with drag-and-drop support
- **File Types**: Video (MP4, MOV), Images (JPG, PNG), Documents (PDF)
- **Organization**: Categories (highlight, training, game, combine, academic)
- **Tagging**: Advanced tagging system with popular suggestions
- **Gallery**: Professional media display with filtering and statistics
- **Storage**: Supabase Storage integration with CDN optimization

### Discovery & Search System
- **Advanced Filtering**: Multi-factor search with real-time results
- **Physical Attributes**: Height/weight range sliders
- **Academic Filtering**: GPA range with graduation year
- **Performance Scoring**: Comprehensive athlete performance scores
- **Recruiting Status**: Available, interested, committed filtering
- **Save/Bookmark**: Recruiter prospect management
- **Professional Display**: Card-based results with detailed previews

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://ozrdyxfvlltbgugukpma.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[configured]
SUPABASE_SERVICE_ROLE_KEY=[configured]
STRIPE_SECRET_KEY=[configured]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[configured]
STRIPE_WEBHOOK_SECRET=[configured]
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Stripe Organizations Implementation

### Account Structure
- **Organization**: Beltra Industries (parent organization)
- **Beltra Industries Account**: acct_1S0rYYD6cJ90FHkd (main business)
- **GoRedShirt Account**: acct_1S1j13CaZpeFxkdn (recruiting platform)
- **Coach Accounts**: Individual Express accounts for marketplace

### Key Implementation Points
- Multi-business separation with organization-level management
- Express accounts for coach onboarding and payments
- Automatic fee splitting with configurable platform fees (10-15%)
- Webhook handlers for account status and payment updates
- Store `stripe_account_id` in `coach_profiles` table

## Authentication & Authorization

### Enhanced Auth Flow
1. Multi-role registration with sport selection (athletes)
2. Profile creation with extended fields and privacy settings
3. RLS policies enforce role-based data access
4. Multi-role support through junction table
5. Enhanced auth context with profile integration

### Role-Based Access
- **Athletes**: Profile management, performance tracking, media upload, recruiter visibility
- **Coaches**: Client management, marketplace participation, analytics, payments
- **Recruiters**: Athlete discovery, search filtering, prospect management, communication
- **Parents**: Minor athlete management, consent tracking, limited profile access
- **Admin**: Full platform access, user management, analytics, system administration

## GoRedShirt Design System

### Brand Guidelines
- **Primary Colors**: Strategic red accents (#dc2626, #b91c1c, #991b1b)
- **Logo**: "GR" in red gradient with professional styling
- **Typography**: Clean, readable fonts with minimal gradient usage
- **Backgrounds**: Advanced multi-layer animation system with subtle effects

### UI Principles
- **Professional Balance**: Enterprise-ready design with sophisticated color relationships
- **Strategic Red Usage**: Red for primary actions, key metrics, brand elements
- **Neutral Foundation**: Slate/gray tones for content and secondary elements  
- **Glassmorphism**: Subtle transparency effects in navigation and overlays
- **Performance**: Optimized animations with proper cleanup and minimal impact

### Component Architecture
- **Floating Navigation**: Professional pill-style navigation with glassmorphism
- **Interactive Elements**: Hover effects, micro-animations, smooth transitions
- **Theme Support**: Comprehensive light/dark mode with CSS variables
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Animation System**: Canvas-based particle effects and background animations

## Core Implementation Patterns

### Multi-Role Dashboard Architecture
- `app/dashboard/page.tsx` routes to role-specific dashboards
- `components/dashboard/client-dashboard.tsx` - Athlete-focused interface with performance metrics
- `components/dashboard/coach-dashboard.tsx` - Coach management and marketplace tools
- `components/dashboard/admin-dashboard.tsx` - Platform administration interface
- Role detection through enhanced auth context with fallback handling

### Component Organization
- **UI Components**: shadcn/ui base components in `components/ui/`
- **Feature Components**: Organized by domain (athlete/, media/, discovery/, etc.)
- **Layout Components**: Reusable layouts with consistent navigation
- **Form Components**: React Hook Form with Zod validation throughout

### Data Flow Patterns
- **Auth Context**: Global state management with role and profile integration
- **API Routes**: Next.js API routes for server-side operations
- **Client Components**: React hooks for data fetching and state management
- **Server Components**: Default for pages with client components where needed

### Theme System Usage
The comprehensive GoRedShirt theme system is documented in `THEME-SYSTEM.md` and provides:
- **ThemeCard, ThemeButton, ThemeIcon**: Consistent component library with hover effects
- **Glassmorphism**: Professional transparency effects across the platform
- **Animation System**: Entrance animations, staggered delays, micro-interactions
- **UltimateBackground**: Canvas-based particle system for immersive backgrounds
- **Responsive Design**: Mobile-first with progressive enhancement

### Performance & Security
- **Monitoring**: Comprehensive performance tracking with Core Web Vitals
- **Security**: Semgrep integration for vulnerability scanning
- **Optimizations**: Image optimization, lazy loading, code splitting
- **Alerting**: Multi-channel alert system (Slack, Discord, Email)