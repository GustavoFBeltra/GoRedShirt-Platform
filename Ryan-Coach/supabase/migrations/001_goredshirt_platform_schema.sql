-- GoRedShirt Platform Schema Migration
-- Version: 1.0.0
-- Description: Comprehensive schema for multi-sport performance and recruiting platform

-- =====================================================
-- 1. DROP EXISTING CONSTRAINTS AND TABLES (if needed)
-- =====================================================

-- Drop existing foreign key constraints that might conflict
ALTER TABLE IF EXISTS profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- =====================================================
-- 2. CREATE ENUMS
-- =====================================================

-- User roles enum (expanded from existing)
DO $$ BEGIN
    CREATE TYPE user_role_new AS ENUM ('athlete', 'coach', 'recruiter', 'parent', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update existing role column if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
        ALTER TABLE users ALTER COLUMN role TYPE user_role_new USING 
            CASE 
                WHEN role::text = 'client' THEN 'athlete'::user_role_new
                WHEN role::text = 'coach' THEN 'coach'::user_role_new
                WHEN role::text = 'admin' THEN 'admin'::user_role_new
                ELSE 'athlete'::user_role_new
            END;
        ALTER TABLE users ALTER COLUMN role SET DEFAULT 'athlete'::user_role_new;
    END IF;
END $$;

-- Drop old enum if exists
DROP TYPE IF EXISTS user_role CASCADE;
ALTER TYPE user_role_new RENAME TO user_role;

-- Profile visibility enum
CREATE TYPE IF NOT EXISTS visibility_type AS ENUM ('public', 'recruiters_only', 'private');

-- Session status enum (update existing)
CREATE TYPE IF NOT EXISTS session_status_type AS ENUM (
    'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'
);

-- Sport type enum
CREATE TYPE IF NOT EXISTS sport_type AS ENUM (
    'football', 'soccer', 'basketball', 'baseball', 'track', 'swimming', 'other'
);

-- Metric collection method enum
CREATE TYPE IF NOT EXISTS metric_collection_method AS ENUM (
    'timer', 'measurement', 'counter', 'percentage', 'manual'
);

-- Offering type enum
CREATE TYPE IF NOT EXISTS offering_type AS ENUM (
    '1on1', 'group', 'remote_analysis', 'clinic', 'camp'
);

-- =====================================================
-- 3. UPDATE PROFILES TABLE
-- =====================================================

-- Add new columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS is_minor BOOLEAN GENERATED ALWAYS AS (dob > (NOW() - INTERVAL '18 years')) STORED,
ADD COLUMN IF NOT EXISTS height_cm INTEGER,
ADD COLUMN IF NOT EXISTS weight_kg INTEGER,
ADD COLUMN IF NOT EXISTS location_city TEXT,
ADD COLUMN IF NOT EXISTS location_state TEXT,
ADD COLUMN IF NOT EXISTS location_country TEXT DEFAULT 'US',
ADD COLUMN IF NOT EXISTS school TEXT,
ADD COLUMN IF NOT EXISTS grad_year INTEGER,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS visibility visibility_type DEFAULT 'public',
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_badge TEXT,
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES auth.users(id);

-- Create index for minor athletes
CREATE INDEX IF NOT EXISTS idx_profiles_is_minor ON profiles(is_minor);
CREATE INDEX IF NOT EXISTS idx_profiles_parent_id ON profiles(parent_id);

-- =====================================================
-- 4. CREATE USER ROLES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    granted_by UUID REFERENCES auth.users(id),
    PRIMARY KEY (user_id, role)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- =====================================================
-- 5. CREATE SPORTS TABLES
-- =====================================================

-- Sports catalog table
CREATE TABLE IF NOT EXISTS sports (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category TEXT CHECK (category IN ('team', 'individual', 'combat')),
    icon_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial sports
INSERT INTO sports (name, category) VALUES
    ('Football', 'team'),
    ('Soccer', 'team'),
    ('Basketball', 'team'),
    ('Baseball', 'team'),
    ('Track & Field', 'individual'),
    ('Swimming', 'individual'),
    ('Wrestling', 'combat'),
    ('Tennis', 'individual'),
    ('Golf', 'individual'),
    ('Volleyball', 'team')
ON CONFLICT (name) DO NOTHING;

-- Athlete sports junction table
CREATE TABLE IF NOT EXISTS athlete_sports (
    athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    sport_id INTEGER REFERENCES sports(id) ON DELETE CASCADE,
    positions TEXT[],
    skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
    years_experience INTEGER,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (athlete_id, sport_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_athlete_sports_athlete ON athlete_sports(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_sports_sport ON athlete_sports(sport_id);

-- =====================================================
-- 6. CREATE METRICS SYSTEM
-- =====================================================

-- Metrics catalog table
CREATE TABLE IF NOT EXISTS metrics_catalog (
    id SERIAL PRIMARY KEY,
    sport_id INTEGER REFERENCES sports(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    unit TEXT,
    collection_method metric_collection_method,
    higher_is_better BOOLEAN DEFAULT TRUE,
    context_tags TEXT[],
    description TEXT,
    is_standard BOOLEAN DEFAULT TRUE,
    display_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sport_id, name)
);

-- Metric entries table
CREATE TABLE IF NOT EXISTS metric_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    metric_id INTEGER REFERENCES metrics_catalog(id) ON DELETE CASCADE,
    value DECIMAL NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    context TEXT CHECK (context IN ('combine', 'practice', 'game', 'training', 'competition')),
    notes TEXT,
    verified_by UUID REFERENCES profiles(id),
    is_personal_record BOOLEAN DEFAULT FALSE,
    location TEXT,
    weather_conditions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_metric_entries_athlete ON metric_entries(athlete_id);
CREATE INDEX IF NOT EXISTS idx_metric_entries_metric ON metric_entries(metric_id);
CREATE INDEX IF NOT EXISTS idx_metric_entries_recorded ON metric_entries(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_metric_entries_pr ON metric_entries(athlete_id, metric_id, is_personal_record);

-- =====================================================
-- 7. CREATE MEDIA TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('video', 'image')),
    file_size_mb DECIMAL,
    duration_seconds INTEGER,
    thumbnail_path TEXT,
    title TEXT,
    description TEXT,
    tags TEXT[],
    sport_id INTEGER REFERENCES sports(id),
    drill_type TEXT,
    game_context TEXT,
    visibility visibility_type DEFAULT 'public',
    processing_status TEXT DEFAULT 'pending' CHECK (
        processing_status IN ('pending', 'processing', 'complete', 'failed')
    ),
    view_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_athlete ON media(athlete_id);
CREATE INDEX IF NOT EXISTS idx_media_sport ON media(sport_id);
CREATE INDEX IF NOT EXISTS idx_media_created ON media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_featured ON media(featured, visibility);

-- =====================================================
-- 8. CREATE DISCOVERY & SEARCH TABLES
-- =====================================================

-- Saved searches table
CREATE TABLE IF NOT EXISTS saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    filters JSONB NOT NULL,
    notification_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Athlete lists table
CREATE TABLE IF NOT EXISTS athlete_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- List items junction table
CREATE TABLE IF NOT EXISTS list_athletes (
    list_id UUID REFERENCES athlete_lists(id) ON DELETE CASCADE,
    athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    added_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (list_id, athlete_id)
);

-- =====================================================
-- 9. UPDATE COACH PROFILES TABLE
-- =====================================================

ALTER TABLE coach_profiles
ADD COLUMN IF NOT EXISTS specializations INTEGER[],
ADD COLUMN IF NOT EXISTS bio_coaching TEXT,
ADD COLUMN IF NOT EXISTS rate_per_hour DECIMAL,
ADD COLUMN IF NOT EXISTS rating_average DECIMAL DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS availability_timezone TEXT DEFAULT 'America/New_York';

-- =====================================================
-- 10. CREATE OFFERINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS offerings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type offering_type NOT NULL,
    duration_minutes INTEGER NOT NULL,
    max_participants INTEGER DEFAULT 1,
    price_cents INTEGER NOT NULL,
    sports INTEGER[],
    skill_levels TEXT[],
    age_range_min INTEGER,
    age_range_max INTEGER,
    location_type TEXT CHECK (location_type IN ('in_person', 'virtual', 'hybrid')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_offerings_coach ON offerings(coach_id);
CREATE INDEX IF NOT EXISTS idx_offerings_active ON offerings(is_active);

-- =====================================================
-- 11. CREATE BOOKINGS TABLE (Update existing)
-- =====================================================

CREATE TABLE IF NOT EXISTS bookings_new (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offering_id UUID REFERENCES offerings(id) ON DELETE CASCADE,
    athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    status session_status_type DEFAULT 'pending',
    price_cents INTEGER NOT NULL,
    platform_fee_cents INTEGER NOT NULL,
    stripe_payment_intent_id TEXT,
    notes TEXT,
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES profiles(id),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_offering ON bookings_new(offering_id);
CREATE INDEX IF NOT EXISTS idx_bookings_athlete ON bookings_new(athlete_id);
CREATE INDEX IF NOT EXISTS idx_bookings_coach ON bookings_new(coach_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled ON bookings_new(scheduled_start);

-- =====================================================
-- 12. CREATE REVIEWS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings_new(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);

-- =====================================================
-- 13. CREATE MESSAGING TABLES (Update existing)
-- =====================================================

-- Update conversations table
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS conversation_type TEXT CHECK (
    conversation_type IN ('athlete_coach', 'athlete_recruiter', 'parent_coach', 'parent_recruiter', 'support')
),
ADD COLUMN IF NOT EXISTS rate_limit_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rate_limit_reset TIMESTAMPTZ;

-- Update messages table
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS flagged_reason TEXT,
ADD COLUMN IF NOT EXISTS moderated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS moderated_by UUID REFERENCES auth.users(id);

-- =====================================================
-- 14. CREATE CONSENT RECORDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    minor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    consent_type TEXT NOT NULL CHECK (
        consent_type IN ('registration', 'data_sharing', 'messaging', 'media_upload', 'payment')
    ),
    granted BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_consent_minor ON consent_records(minor_id);
CREATE INDEX IF NOT EXISTS idx_consent_parent ON consent_records(parent_id);
CREATE INDEX IF NOT EXISTS idx_consent_type ON consent_records(consent_type);

-- =====================================================
-- 15. CREATE AUDIT LOG TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON audit_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);

-- =====================================================
-- 16. INSERT INITIAL METRICS DATA
-- =====================================================

-- Football metrics
INSERT INTO metrics_catalog (sport_id, name, unit, collection_method, higher_is_better, context_tags) 
SELECT 
    (SELECT id FROM sports WHERE name = 'Football'),
    metric_name,
    unit,
    method::metric_collection_method,
    higher_better,
    tags
FROM (VALUES
    ('40-yard dash', 'seconds', 'timer', false, ARRAY['speed', 'combine']),
    ('10-yard split', 'seconds', 'timer', false, ARRAY['speed', 'acceleration']),
    ('Vertical jump', 'inches', 'measurement', true, ARRAY['power', 'explosiveness']),
    ('Broad jump', 'inches', 'measurement', true, ARRAY['power', 'explosiveness']),
    ('5-10-5 shuttle', 'seconds', 'timer', false, ARRAY['agility', 'change_of_direction']),
    ('3-cone drill', 'seconds', 'timer', false, ARRAY['agility', 'change_of_direction']),
    ('Bench press (225 lbs)', 'reps', 'counter', true, ARRAY['strength', 'endurance'])
) AS t(metric_name, unit, method, higher_better, tags)
ON CONFLICT (sport_id, name) DO NOTHING;

-- Soccer metrics
INSERT INTO metrics_catalog (sport_id, name, unit, collection_method, higher_is_better, context_tags)
SELECT 
    (SELECT id FROM sports WHERE name = 'Soccer'),
    metric_name,
    unit,
    method::metric_collection_method,
    higher_better,
    tags
FROM (VALUES
    ('30m sprint', 'seconds', 'timer', false, ARRAY['speed']),
    ('Yo-Yo IR1', 'level', 'measurement', true, ARRAY['endurance', 'fitness']),
    ('Beep test', 'level', 'measurement', true, ARRAY['endurance', 'fitness']),
    ('Juggling', 'touches', 'counter', true, ARRAY['skill', 'ball_control']),
    ('Passing accuracy', '%', 'percentage', true, ARRAY['skill', 'accuracy']),
    ('Shot accuracy', '%', 'percentage', true, ARRAY['skill', 'accuracy'])
) AS t(metric_name, unit, method, higher_better, tags)
ON CONFLICT (sport_id, name) DO NOTHING;

-- Basketball metrics
INSERT INTO metrics_catalog (sport_id, name, unit, collection_method, higher_is_better, context_tags)
SELECT 
    (SELECT id FROM sports WHERE name = 'Basketball'),
    metric_name,
    unit,
    method::metric_collection_method,
    higher_better,
    tags
FROM (VALUES
    ('Lane agility', 'seconds', 'timer', false, ARRAY['agility', 'speed']),
    ('3/4 court sprint', 'seconds', 'timer', false, ARRAY['speed', 'conditioning']),
    ('Standing reach', 'inches', 'measurement', true, ARRAY['size', 'length']),
    ('Max vertical', 'inches', 'measurement', true, ARRAY['power', 'explosiveness']),
    ('Free throw %', '%', 'percentage', true, ARRAY['skill', 'shooting']),
    ('3-point %', '%', 'percentage', true, ARRAY['skill', 'shooting'])
) AS t(metric_name, unit, method, higher_better, tags)
ON CONFLICT (sport_id, name) DO NOTHING;

-- =====================================================
-- 17. CREATE RLS POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE metric_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone based on visibility" ON profiles
    FOR SELECT USING (
        visibility = 'public' OR
        auth.uid() = user_id::uuid OR
        (visibility = 'recruiters_only' AND EXISTS (
            SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'recruiter'
        )) OR
        EXISTS (
            SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id::uuid);

CREATE POLICY "Parents can update minor profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = profiles.id 
            AND p.parent_id = auth.uid() 
            AND p.is_minor = true
        )
    );

-- User roles policies
CREATE POLICY "User roles viewable by user and admins" ON user_roles
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

CREATE POLICY "Only admins can manage user roles" ON user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Athlete sports policies
CREATE POLICY "Athlete sports viewable based on profile visibility" ON athlete_sports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = athlete_sports.athlete_id 
            AND (
                p.visibility = 'public' OR
                p.user_id::uuid = auth.uid() OR
                (p.visibility = 'recruiters_only' AND EXISTS (
                    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'recruiter'
                ))
            )
        )
    );

CREATE POLICY "Athletes can manage own sports" ON athlete_sports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = athlete_sports.athlete_id 
            AND p.user_id::uuid = auth.uid()
        )
    );

-- Metrics catalog policies (read-only for all)
CREATE POLICY "Metrics catalog viewable by all" ON metrics_catalog
    FOR SELECT USING (true);

-- Metric entries policies
CREATE POLICY "Metric entries viewable based on athlete profile" ON metric_entries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = metric_entries.athlete_id 
            AND (
                p.visibility = 'public' OR
                p.user_id::uuid = auth.uid() OR
                (p.visibility = 'recruiters_only' AND EXISTS (
                    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'recruiter'
                ))
            )
        )
    );

CREATE POLICY "Athletes can manage own metrics" ON metric_entries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = metric_entries.athlete_id 
            AND p.user_id::uuid = auth.uid()
        )
    );

CREATE POLICY "Coaches can add metrics for their athletes" ON metric_entries
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'coach'
        ) AND
        verified_by = (SELECT id FROM profiles WHERE user_id::uuid = auth.uid())
    );

-- Media policies
CREATE POLICY "Media viewable based on visibility and athlete profile" ON media
    FOR SELECT USING (
        visibility = 'public' OR
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = media.athlete_id 
            AND p.user_id::uuid = auth.uid()
        ) OR
        (visibility = 'recruiters_only' AND EXISTS (
            SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'recruiter'
        ))
    );

CREATE POLICY "Athletes can manage own media" ON media
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = media.athlete_id 
            AND p.user_id::uuid = auth.uid()
        )
    );

-- Offerings policies
CREATE POLICY "Offerings viewable by all" ON offerings
    FOR SELECT USING (is_active = true);

CREATE POLICY "Coaches can manage own offerings" ON offerings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.id = offerings.coach_id 
            AND p.user_id::uuid = auth.uid()
        ) AND
        EXISTS (
            SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'coach'
        )
    );

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings_new
    FOR SELECT USING (
        athlete_id = (SELECT id FROM profiles WHERE user_id::uuid = auth.uid()) OR
        coach_id = (SELECT id FROM profiles WHERE user_id::uuid = auth.uid())
    );

CREATE POLICY "Athletes can create bookings" ON bookings_new
    FOR INSERT WITH CHECK (
        athlete_id = (SELECT id FROM profiles WHERE user_id::uuid = auth.uid())
    );

CREATE POLICY "Participants can update bookings" ON bookings_new
    FOR UPDATE USING (
        athlete_id = (SELECT id FROM profiles WHERE user_id::uuid = auth.uid()) OR
        coach_id = (SELECT id FROM profiles WHERE user_id::uuid = auth.uid())
    );

-- Consent records policies
CREATE POLICY "Consent records viewable by participants" ON consent_records
    FOR SELECT USING (
        minor_id = (SELECT id FROM profiles WHERE user_id::uuid = auth.uid()) OR
        parent_id = (SELECT id FROM profiles WHERE user_id::uuid = auth.uid()) OR
        EXISTS (
            SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Parents can manage consent for minors" ON consent_records
    FOR ALL USING (
        parent_id = (SELECT id FROM profiles WHERE user_id::uuid = auth.uid())
    );

-- Audit log policies (admin only)
CREATE POLICY "Audit log viewable by admins only" ON audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- 18. CREATE FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offerings_updated_at BEFORE UPDATE ON offerings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_searches_updated_at BEFORE UPDATE ON saved_searches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_athlete_lists_updated_at BEFORE UPDATE ON athlete_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check for personal records
CREATE OR REPLACE FUNCTION check_personal_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this is a personal record
    IF NOT EXISTS (
        SELECT 1 FROM metric_entries
        WHERE athlete_id = NEW.athlete_id
        AND metric_id = NEW.metric_id
        AND id != NEW.id
        AND value > NEW.value
        AND (SELECT higher_is_better FROM metrics_catalog WHERE id = NEW.metric_id)
    ) OR NOT EXISTS (
        SELECT 1 FROM metric_entries
        WHERE athlete_id = NEW.athlete_id
        AND metric_id = NEW.metric_id
        AND id != NEW.id
        AND value < NEW.value
        AND NOT (SELECT higher_is_better FROM metrics_catalog WHERE id = NEW.metric_id)
    ) THEN
        NEW.is_personal_record := true;
        -- Update previous PRs to false
        UPDATE metric_entries
        SET is_personal_record = false
        WHERE athlete_id = NEW.athlete_id
        AND metric_id = NEW.metric_id
        AND id != NEW.id
        AND is_personal_record = true;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_pr_trigger BEFORE INSERT OR UPDATE ON metric_entries
    FOR EACH ROW EXECUTE FUNCTION check_personal_record();

-- Function to update coach ratings
CREATE OR REPLACE FUNCTION update_coach_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE coach_profiles
    SET 
        rating_average = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM reviews
            WHERE reviewee_id = NEW.reviewee_id
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE reviewee_id = NEW.reviewee_id
        )
    WHERE user_id::uuid = (
        SELECT user_id::uuid FROM profiles WHERE id = NEW.reviewee_id
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coach_rating_trigger AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_coach_rating();

-- =====================================================
-- 19. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Grant appropriate permissions on tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- 20. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_visibility ON profiles(visibility);
CREATE INDEX IF NOT EXISTS idx_profiles_grad_year ON profiles(grad_year);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location_state, location_city);
CREATE INDEX IF NOT EXISTS idx_media_tags ON media USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_metric_entries_value ON metric_entries(metric_id, value);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings_new(status);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(reviewee_id, rating);

-- =====================================================
-- 21. MIGRATION COMPLETE
-- =====================================================

-- Add migration record
INSERT INTO schema_migrations (version, applied_at, applied_by)
VALUES ('001_goredshirt_platform_schema', NOW(), 'GoRedShirt Platform Migration')
ON CONFLICT (version) DO NOTHING;