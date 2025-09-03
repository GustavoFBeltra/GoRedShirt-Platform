# GoRedShirt Platform Specification
**Version**: 2.0 | **Last Updated**: 2025-01-30

A comprehensive multi-sport, pre-collegiate performance and recruiting platform with integrated coaching marketplace and companion mobile application.

---

## Executive Summary

**Mission**: Create the definitive platform for athlete development, recruiter discovery, and coaching expertise monetization in the pre-collegiate sports ecosystem.

**Value Proposition**: 
- Athletes showcase measurable progress and gain visibility
- Recruiters discover talent through advanced filtering and verified metrics  
- Coaches monetize expertise through structured marketplace offerings
- Parents maintain control over minor athlete data and interactions

**Target Market**: Pre-collegiate athletes (13-23), coaches, recruiters, and guardians across football, soccer, and basketball initially.

---

## 1. Product Architecture

### 1.1 Core Platform Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Platform  │    │  Mobile App     │    │  Admin Portal   │
│   (Next.js 14) │◄──►│  (Expo/RN)      │    │  (Management)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────┐
         │             Backend Services                    │
         │  ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
         │  │  Supabase   │ │   Stripe    │ │  PostHog  │ │
         │  │ (Auth/DB/   │ │  (Payments/ │ │ (Analytics│ │
         │  │  Storage)   │ │  Connect)   │ │  Events)  │ │
         │  └─────────────┘ └─────────────┘ └───────────┘ │
         └─────────────────────────────────────────────────┘
```

### 1.2 Technology Stack
**Frontend**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- React Query (data fetching)
- Zod (validation)
- React Hook Form (forms)

**Backend & Services**
- Supabase (Auth, PostgreSQL, Storage, Edge Functions)
- Stripe Connect (payments + marketplace)
- PostHog (analytics + feature flags)
- Vercel (deployment + edge functions)

**Mobile**
- Expo SDK 50+ with React Native
- Expo Router (file-based routing)
- React Native Reanimated (animations)
- Expo Camera/MediaLibrary (media capture)

**Development & Operations**
- Playwright (E2E testing)
- Semgrep (security scanning)
- Sentry (error tracking)
- GitHub Actions (CI/CD)

---

## 2. User Roles & Permissions

### 2.1 Role Definitions

| Role | Primary Functions | Key Permissions |
|------|-------------------|-----------------|
| **Athlete** | Profile management, metric logging, media upload, coach booking | CRUD own data, message coaches/recruiters (if allowed), book sessions |
| **Coach** | Marketplace listings, session management, athlete coaching | All Athlete permissions + create offerings, manage bookings, process payments |
| **Recruiter** | Talent discovery, athlete evaluation, contact management | Advanced search, save lists, message athletes, view recruiter-only data |
| **Parent/Guardian** | Minor account oversight, privacy controls, consent management | Co-manage minor profiles, approve connections, control visibility |
| **Admin** | Platform moderation, user verification, system management | Full platform access, user management, content moderation, analytics |

### 2.2 Permission Matrix
```sql
-- Implementation via user_roles junction table
CREATE TABLE user_roles (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT CHECK (role IN ('athlete','coach','recruiter','parent','admin')),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users,
  PRIMARY KEY (user_id, role)
);
```

---

## 3. Data Architecture

### 3.1 Core Schema Design

**User Management**
```sql
-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  dob DATE,
  is_minor BOOLEAN GENERATED ALWAYS AS (dob > (NOW() - INTERVAL '18 years')) STORED,
  height_cm INTEGER,
  weight_kg INTEGER,
  bio TEXT,
  location_city TEXT,
  location_state TEXT,
  location_country TEXT DEFAULT 'US',
  school TEXT,
  grad_year INTEGER,
  profile_image_url TEXT,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'recruiters_only', 'private')),
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badge TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sports & Specializations
CREATE TABLE sports (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT, -- team, individual, combat
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE athlete_sports (
  athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sport_id INTEGER REFERENCES sports(id) ON DELETE CASCADE,
  positions TEXT[], -- ['QB', 'WR'] for football
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
  years_experience INTEGER,
  PRIMARY KEY (athlete_id, sport_id)
);
```

**Metrics System**
```sql
-- Composable metrics catalog
CREATE TABLE metrics_catalog (
  id SERIAL PRIMARY KEY,
  sport_id INTEGER REFERENCES sports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  unit TEXT, -- 's', 'mph', '%', 'count'
  collection_method TEXT, -- 'timer', 'measurement', 'counter', 'percentage'
  higher_is_better BOOLEAN DEFAULT TRUE,
  context_tags TEXT[], -- ['speed', 'agility', 'strength']
  description TEXT,
  is_standard BOOLEAN DEFAULT TRUE -- vs custom athlete metrics
);

-- Individual metric entries
CREATE TABLE metric_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  metric_id INTEGER REFERENCES metrics_catalog(id) ON DELETE CASCADE,
  value DECIMAL NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  context TEXT, -- 'combine', 'practice', 'game'
  notes TEXT,
  verified_by UUID REFERENCES profiles(id), -- coach/facility verification
  is_personal_record BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Media Management**
```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_type TEXT NOT NULL, -- 'video', 'image'
  file_size_mb DECIMAL,
  duration_seconds INTEGER, -- for videos
  thumbnail_path TEXT,
  title TEXT,
  description TEXT,
  tags TEXT[],
  sport_id INTEGER REFERENCES sports(id),
  drill_type TEXT,
  game_context TEXT,
  visibility TEXT DEFAULT 'public',
  processing_status TEXT DEFAULT 'pending', -- 'pending', 'complete', 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 Advanced Features Schema

**Coaching Marketplace**
```sql
CREATE TABLE coach_profiles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specializations INTEGER[] REFERENCES sports(id),
  certifications TEXT[],
  years_coaching INTEGER,
  rate_per_hour DECIMAL,
  bio_coaching TEXT,
  stripe_account_id TEXT, -- Stripe Connect account
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
  availability_timezone TEXT,
  rating_average DECIMAL DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coach_profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('1on1', 'group', 'remote_analysis', 'clinic')),
  duration_minutes INTEGER,
  max_participants INTEGER DEFAULT 1,
  price_cents INTEGER NOT NULL,
  sports INTEGER[] REFERENCES sports(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offering_id UUID REFERENCES offerings(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES coach_profiles(user_id) ON DELETE CASCADE,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  price_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL,
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Feature Specifications

### 4.1 MVP Feature Set (Weeks 1-8)

#### Authentication & User Management
- **Multi-role registration** with email/password and OAuth (Google, Apple)
- **Parental consent flow** for users under 18
- **Profile completion wizard** with role-specific onboarding
- **Email verification** and password reset functionality

#### Athlete Profiles & Metrics
- **Comprehensive profile builder** with media gallery
- **Sport-specific metric templates** for football, soccer, basketball
- **Custom metric creation** for specialized training
- **Progress visualization** with charts and PR badges
- **Privacy granularity** (public, recruiters-only, private)

#### Media Management
- **Video/image upload** with automatic thumbnail generation
- **Tagging system** by drill type, game situation, skill focus
- **Bulk upload capability** for coaches/teams
- **Compression and optimization** for mobile performance

#### Discovery & Search
- **Advanced filtering** by location, age, metrics, sport, position
- **Saved searches and athlete lists** for recruiters
- **Geographic radius search** with map integration
- **Export capabilities** for recruiting workflows

#### Messaging System
- **Role-based messaging** (recruiter↔athlete, coach↔athlete)
- **Rate limiting** to prevent spam
- **Report and block functionality**
- **Message templates** for common recruiting outreach

#### Coaching Marketplace
- **Coach profile creation** with specializations and rates
- **Service offering management** (1:1, group, remote analysis)
- **Calendar integration** with availability management
- **Booking and payment processing** via Stripe
- **Review and rating system**

### 4.2 Phase 2 Features (Weeks 9-16)

#### Team & Organization Management
- **Team/club profile pages** with roster management
- **Bulk athlete data import** from CSV/Excel
- **Team metrics dashboards** and comparisons
- **Coach-team assignment workflows**

#### Advanced Analytics
- **Performance trend analysis** with ML insights
- **Peer comparisons** within age/skill groups
- **Recruiting pipeline analytics** for coaches
- **Platform usage analytics** for business intelligence

#### Enhanced Media Features
- **Video telestration tools** for coach feedback
- **AI-powered highlight detection** and auto-clipping
- **Live streaming integration** for remote coaching
- **360-degree video support** for detailed analysis

---

## 5. Sports-Specific Metrics

### 5.1 Football Metrics
**Speed & Agility**
- 40-yard dash (seconds) ⚡
- 10-yard split (seconds) ⚡  
- 20-yard shuttle (seconds) 🔄
- 3-cone drill (seconds) 🔄
- Broad jump (inches) 🦘
- Vertical jump (inches) 🦘

**Position-Specific**
- QB: Throwing velocity (mph), Accuracy % (10/15/20 yards)
- RB: Vision cone drill (seconds), Burst through bags
- WR/DB: Route running precision, Reaction time
- OL/DL: Bench press reps (225 lbs), 5-yard explosion
- K/P: Field goal accuracy %, Hang time (seconds)

### 5.2 Soccer Metrics  
**Endurance & Speed**
- 30m sprint (seconds) ⚡
- Yo-Yo Intermittent Recovery Level 1 🔄
- Beep test final level 🔄
- 5-4-3-2-1 agility (seconds) 🔄

**Technical Skills**
- Juggling consecutive touches (count) ⚽
- Passing accuracy % (short/long) ⚽
- Shot accuracy % (on target) ⚽
- Dribbling slalom time (seconds) ⚽
- Free kick accuracy (5 attempts) ⚽

### 5.3 Basketball Metrics
**Athletic Testing**
- Lane agility drill (seconds) 🔄
- 3/4 court sprint (seconds) ⚡
- Standing reach (inches) 📏
- Max vertical jump (inches) 🦘
- Lateral quickness (seconds) ↔️

**Skill Development**  
- Free throw % (50 attempts) 🎯
- 3-point shooting % (25 attempts) 🎯
- Defensive slide test (seconds) 🛡️
- Ball handling figure-8 (seconds) ⚽
- Rebounding reaction drill (score) 📊

---

## 6. Mobile Application Strategy

### 6.1 Core Mobile Features
**Quick Data Entry**
- One-tap metric logging with preset values
- Voice-to-text for rapid notes entry
- Timer widgets for speed/agility drills
- Counter widgets for repetition-based metrics

**Media Capture & Upload**
- High-quality video recording with stabilization
- Batch upload with background sync
- Auto-tagging based on location/time
- Offline storage with sync queue

**Social & Booking**
- Push notifications for messages and bookings
- Calendar integration for session scheduling
- Payment processing for mobile bookings
- Quick coach discovery and booking

### 6.2 Offline Capability
- **Local SQLite database** for offline data storage
- **Background sync** when connectivity returns
- **Conflict resolution** for concurrent edits
- **Offline media preview** with upload queue

---

## 7. Privacy & Compliance Framework

### 7.1 Minor Protection (COPPA Compliance)
**Consent Management**
- Parental consent required for users under 13
- Guardian co-management for users 13-17  
- Granular privacy controls with default restrictions
- Data export/deletion upon request

**Data Handling**
- Minimal data collection for minors
- No behavioral advertising to users under 13
- Encrypted storage for all sensitive information
- Regular data audits and cleanup procedures

### 7.2 FERPA Considerations
- **Educational data protection** for school-related information
- **Opt-in disclosure** for academic information
- **Secure data transmission** to educational partners
- **Student data use restrictions** per FERPA guidelines

### 7.3 Content Moderation
**Automated Systems**
- Image/video content scanning for inappropriate material
- Text analysis for harassment/bullying detection
- Spam detection and rate limiting
- Automated flagging for human review

**Human Moderation**
- 24-hour review queue for flagged content
- Escalation procedures for serious violations
- User appeal process for content decisions
- Regular moderator training updates

---

## 8. Business Model & Monetization

### 8.1 Revenue Streams

**Primary (80% of revenue)**
- **Marketplace Commission**: 10-15% fee on all coaching transactions
- **Premium Subscriptions**: 
  - Recruiter Pro ($99/month): Advanced search, unlimited lists, analytics
  - Athlete Plus ($19/month): Priority placement, advanced metrics, video analysis

**Secondary (20% of revenue)**
- **Verification Services**: $25 fee for profile verification badge
- **Featured Listings**: $50/month for coaches to boost marketplace visibility
- **Data Exports**: Custom recruiting reports for college programs
- **API Access**: Third-party integrations for training facilities

### 8.2 Financial Projections (Year 1)

| Metric | Q1 | Q2 | Q3 | Q4 |
|--------|----|----|----|----|
| **Athletes** | 500 | 2,000 | 5,000 | 10,000 |
| **Coaches** | 50 | 200 | 500 | 1,000 |
| **Recruiters** | 25 | 100 | 250 | 500 |
| **Monthly GMV** | $5K | $25K | $75K | $200K |
| **Platform Revenue** | $750 | $3,750 | $11,250 | $30,000 |

---

## 9. Technical Implementation Plan

### 9.1 Development Phases

**Phase 1: Foundation (Weeks 1-2)**
- [ ] Project setup and monorepo structure
- [ ] Supabase project configuration and schema
- [ ] Authentication system implementation
- [ ] Basic UI components and design system
- [ ] Stripe Connect integration setup

**Phase 2: Core Features (Weeks 3-4)**  
- [ ] User profiles and role management
- [ ] Metrics system and data entry
- [ ] Media upload and management
- [ ] Search and discovery functionality
- [ ] Basic messaging system

**Phase 3: Marketplace (Weeks 5-6)**
- [ ] Coach profiles and offerings
- [ ] Booking and calendar system
- [ ] Payment processing and payouts
- [ ] Review and rating system
- [ ] Mobile app foundation

**Phase 4: Polish & Launch (Weeks 7-8)**
- [ ] Mobile app feature completion
- [ ] Comprehensive testing (E2E, security)
- [ ] Performance optimization
- [ ] Analytics implementation
- [ ] Production deployment

### 9.2 Database Migration Strategy
```sql
-- Migration versioning
CREATE TABLE schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  applied_by TEXT
);

-- RLS policies for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_policy ON profiles 
FOR SELECT USING (
  id = auth.uid() OR 
  visibility = 'public' OR 
  (visibility = 'recruiters_only' AND EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'recruiter'
  ))
);
```

### 9.3 API Design Principles
**RESTful Endpoints**
```
GET    /api/athletes              # Search athletes
GET    /api/athletes/:id          # Get athlete profile
POST   /api/athletes/:id/metrics  # Add metric entry
GET    /api/metrics/:id/trends    # Get metric history
POST   /api/media/upload          # Upload media file
POST   /api/bookings              # Create booking
PATCH  /api/bookings/:id/status   # Update booking status
```

**GraphQL Considerations**
- Real-time subscriptions for messaging
- Efficient nested data fetching
- Type-safe client generation
- Caching optimization

---

## 10. Quality Assurance & Testing

### 10.1 Testing Strategy

**Unit Tests (90%+ coverage)**
- Utility functions and business logic
- Zod validation schemas
- Database query functions
- Authentication/authorization helpers

**Integration Tests** 
- API endpoint functionality
- Database operations and migrations
- Stripe webhook processing
- Email notification workflows

**End-to-End Tests (Playwright)**
- Complete user registration flows
- Athlete profile creation and metric entry
- Coach marketplace interactions
- Payment processing workflows
- Cross-browser compatibility

**Security Testing (Semgrep)**
- SQL injection prevention
- XSS vulnerability scanning
- Authentication bypass attempts
- Data exposure risk assessment

### 10.2 Performance Benchmarks

| Metric | Target | Current |
|--------|--------|---------|
| **Page Load Time** | < 2s | TBD |
| **API Response Time** | < 200ms | TBD |  
| **Mobile App Launch** | < 3s | TBD |
| **Video Upload Speed** | < 30s for 100MB | TBD |
| **Search Results** | < 500ms | TBD |

---

## 11. Analytics & Success Metrics

### 11.1 User Engagement KPIs

**Activation Metrics**
- Athletes: ≥3 metrics + 1 video within 7 days
- Coaches: Complete profile + 1 offering within 14 days  
- Recruiters: First search + saved list within 7 days

**Retention Metrics**
- Weekly active users (WAU)
- Monthly metric entries per athlete
- Coach booking rate and repeat bookings
- Recruiter search frequency

**Marketplace Health**
- Gross Merchandise Value (GMV) growth
- Average booking value
- Coach earnings distribution
- Platform fee collection rate

### 11.2 PostHog Event Tracking
```typescript
// Key events to track
posthog.capture('athlete_metric_logged', {
  sport: 'football',
  metric_type: '40_yard_dash',
  value: 4.8,
  is_personal_record: true
});

posthog.capture('coach_booking_created', {
  offering_type: '1on1',
  price_tier: 'premium',
  advance_days: 7
});

posthog.capture('recruiter_search_performed', {
  filters_applied: ['location', 'grad_year', 'position'],
  results_count: 23
});
```

---

## 12. Risk Analysis & Mitigation

### 12.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Supabase downtime** | High | Low | Multi-region backup, status monitoring |
| **Stripe payment failures** | High | Medium | Fallback processors, retry logic |
| **Video upload scalability** | Medium | High | CDN optimization, compression |
| **Mobile app store rejection** | Medium | Medium | Early review, compliance checks |

### 12.2 Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Low coach adoption** | High | Medium | Incentive programs, referral bonuses |
| **Regulatory changes (COPPA)** | High | Low | Legal monitoring, compliance updates |
| **Competitor market entry** | Medium | High | Feature differentiation, user loyalty |
| **Economic downturn impact** | Medium | Medium | Freemium model, cost reduction |

### 12.3 Security Considerations

**Data Protection**
- End-to-end encryption for sensitive data
- Regular security audits and penetration testing  
- GDPR compliance for international users
- Breach notification procedures

**Platform Abuse Prevention**
- Rate limiting on API endpoints
- Content moderation workflows
- User verification systems
- Automated fraud detection

---

## 13. Go-to-Market Strategy

### 13.1 Launch Phases

**Closed Beta (Weeks 9-10)**
- 50 athletes, 10 coaches, 5 recruiters
- Core functionality validation
- User feedback integration
- Performance optimization

**Open Beta (Weeks 11-12)**  
- 500 athletes, 50 coaches, 25 recruiters
- Marketing campaigns launch
- Partnership discussions
- Scalability testing

**Public Launch (Week 13+)**
- Full feature set available
- PR and media outreach
- Conference presentations
- Growth marketing activation

### 13.2 User Acquisition Strategy

**Athletes**
- High school coach partnerships
- Youth sports organization outreach  
- Social media influencer campaigns
- Parent/guardian referral programs

**Coaches**
- Former collegiate athlete networks
- Coaching certification partnerships
- Sports training facility alliances
- Revenue-sharing incentives

**Recruiters**
- College coaching staff demos
- Recruiting service integrations
- Conference and combine partnerships
- Free trial programs

---

## 14. Post-Launch Roadmap

### 14.1 Year 1 Enhancements (Quarters 2-4)

**Q2: Advanced Features**
- Team/club management portal
- Bulk data import tools
- Advanced video analysis
- API for third-party integrations

**Q3: Platform Expansion**  
- Additional sports (track, wrestling, swimming)
- International market entry (Canada, UK)
- Advanced analytics dashboard
- Machine learning recommendations

**Q4: Enterprise Features**
- White-label solutions for organizations
- Custom branding options
- Advanced reporting and analytics
- Dedicated account management

### 14.2 Year 2+ Vision

**Platform Evolution**
- AI-powered performance predictions
- Wearable device integrations (Garmin, Fitbit)
- Virtual reality training modules
- Blockchain-verified achievements

**Market Expansion**
- Professional sports scouting
- International recruiting network
- Olympic sport development pathways
- Adult recreational leagues

---

## 15. Success Criteria & Exit Strategy

### 15.1 MVP Success Metrics (Month 3)
- [ ] 1,000 registered athletes with complete profiles
- [ ] 100 active coaches with published offerings  
- [ ] 50 recruiters performing regular searches
- [ ] $10,000 monthly GMV through marketplace
- [ ] 85% user satisfaction score (NPS > 50)

### 15.2 Long-term Success Indicators (Year 2)
- [ ] 50,000+ registered athletes across all sports
- [ ] $500,000+ monthly GMV with 15% take rate
- [ ] 95%+ platform uptime with sub-200ms response times
- [ ] Recognition as top 3 recruiting platform by industry publications
- [ ] Successful Series A funding or acquisition interest

### 15.3 Potential Exit Strategies
**Strategic Acquisition Targets**
- ESPN (sports media integration)  
- Nike/Adidas (athlete development ecosystem)
- Hudl (sports technology platform)
- TeamSnap (youth sports management)

**IPO Considerations**
- $50M+ annual recurring revenue
- Multi-sport international presence
- Defensible technology moats
- Strong unit economics and growth metrics

---

*This specification serves as the foundational blueprint for GoRedShirt platform development, with regular updates reflecting market feedback and technical discoveries.*