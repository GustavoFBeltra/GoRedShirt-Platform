export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      Account: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          providerAccountId: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          userId: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider: string
          providerAccountId: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          userId: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          providerAccountId?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_summary: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          metrics: Json
          period_end: string
          period_start: string
          period_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          metrics: Json
          period_end: string
          period_start: string
          period_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          metrics?: Json
          period_end?: string
          period_start?: string
          period_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      athlete_sports: {
        Row: {
          athlete_id: string
          created_at: string | null
          is_primary: boolean | null
          positions: string[] | null
          skill_level: string | null
          sport_id: number
          years_experience: number | null
        }
        Insert: {
          athlete_id: string
          created_at?: string | null
          is_primary?: boolean | null
          positions?: string[] | null
          skill_level?: string | null
          sport_id: number
          years_experience?: number | null
        }
        Update: {
          athlete_id?: string
          created_at?: string | null
          is_primary?: boolean | null
          positions?: string[] | null
          skill_level?: string | null
          sport_id?: number
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "athlete_sports_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "athlete_sports_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      Attempt: {
        Row: {
          distanceYds: number
          id: string
          made: boolean
          seasonId: string | null
          sessionAt: string
          studentId: string
          videoUrl: string | null
        }
        Insert: {
          distanceYds: number
          id?: string
          made: boolean
          seasonId?: string | null
          sessionAt: string
          studentId: string
          videoUrl?: string | null
        }
        Update: {
          distanceYds?: number
          id?: string
          made?: boolean
          seasonId?: string | null
          sessionAt?: string
          studentId?: string
          videoUrl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Attempt_seasonId_fkey"
            columns: ["seasonId"]
            isOneToOne: false
            referencedRelation: "Season"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Attempt_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Availability: {
        Row: {
          coachId: string
          dayOfWeek: number
          endTime: string
          id: string
          startTime: string
          timezone: string
        }
        Insert: {
          coachId: string
          dayOfWeek: number
          endTime: string
          id?: string
          startTime: string
          timezone?: string
        }
        Update: {
          coachId?: string
          dayOfWeek?: number
          endTime?: string
          id?: string
          startTime?: string
          timezone?: string
        }
        Relationships: [
          {
            foreignKeyName: "Availability_coachId_fkey"
            columns: ["coachId"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Booking: {
        Row: {
          createdAt: string
          id: string
          notes: string | null
          slotId: string
          status: string
          studentId: string
        }
        Insert: {
          createdAt?: string
          id?: string
          notes?: string | null
          slotId: string
          status?: string
          studentId: string
        }
        Update: {
          createdAt?: string
          id?: string
          notes?: string | null
          slotId?: string
          status?: string
          studentId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Booking_slotId_fkey"
            columns: ["slotId"]
            isOneToOne: false
            referencedRelation: "TimeSlot"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Booking_studentId_fkey"
            columns: ["studentId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_coach_relationships: {
        Row: {
          client_id: string
          coach_id: string
          created_at: string | null
          end_date: string | null
          id: string
          notes: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          coach_id: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          coach_id?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_coach_relationships_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_coach_relationships_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_goals: {
        Row: {
          client_id: string
          created_at: string | null
          current_value: number | null
          description: string | null
          goal_type: string
          id: string
          is_active: boolean | null
          priority: number | null
          target_date: string | null
          target_unit: string | null
          target_value: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          goal_type: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          goal_type?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_goals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_progress_entries: {
        Row: {
          body_fat_percentage: number | null
          client_id: string
          coach_id: string | null
          created_at: string | null
          energy_level: number | null
          entry_date: string
          id: string
          measurements: Json | null
          mood_score: number | null
          muscle_mass: number | null
          photos: string[] | null
          progress_notes: string | null
          session_id: string | null
          tags: string[] | null
          updated_at: string | null
          weight: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          client_id: string
          coach_id?: string | null
          created_at?: string | null
          energy_level?: number | null
          entry_date: string
          id?: string
          measurements?: Json | null
          mood_score?: number | null
          muscle_mass?: number | null
          photos?: string[] | null
          progress_notes?: string | null
          session_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          weight?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          client_id?: string
          coach_id?: string | null
          created_at?: string | null
          energy_level?: number | null
          entry_date?: string
          id?: string
          measurements?: Json | null
          mood_score?: number | null
          muscle_mass?: number | null
          photos?: string[] | null
          progress_notes?: string | null
          session_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "client_progress_entries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_progress_entries_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_progress_entries_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "coaching_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_availability: {
        Row: {
          coach_id: string
          created_at: string | null
          day_of_week: number
          effective_date: string | null
          end_date: string | null
          end_time: string
          id: string
          is_active: boolean | null
          start_time: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          coach_id: string
          created_at?: string | null
          day_of_week: number
          effective_date?: string | null
          end_date?: string | null
          end_time: string
          id?: string
          is_active?: boolean | null
          start_time: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string | null
          day_of_week?: number
          effective_date?: string | null
          end_date?: string | null
          end_time?: string
          id?: string
          is_active?: boolean | null
          start_time?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_availability_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_packages: {
        Row: {
          coach_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          package_type: string | null
          price: number
          session_count: number | null
          updated_at: string | null
        }
        Insert: {
          coach_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean | null
          name: string
          package_type?: string | null
          price: number
          session_count?: number | null
          updated_at?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          package_type?: string | null
          price?: number
          session_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_packages_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_profiles: {
        Row: {
          bio: string | null
          certifications: string[] | null
          created_at: string | null
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          location: string | null
          platform_fee_percentage: number | null
          publicBooking: boolean
          specializations: string[] | null
          stripe_account_id: string | null
          stripe_onboarding_complete: boolean | null
          updated_at: string | null
          user_id: string
          years_experience: number | null
        }
        Insert: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          platform_fee_percentage?: number | null
          publicBooking?: boolean
          specializations?: string[] | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean | null
          updated_at?: string | null
          user_id: string
          years_experience?: number | null
        }
        Update: {
          bio?: string | null
          certifications?: string[] | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          platform_fee_percentage?: number | null
          publicBooking?: boolean
          specializations?: string[] | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean | null
          updated_at?: string | null
          user_id?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "CoachProfile_userId_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      coach_time_slots: {
        Row: {
          coach_id: string
          created_at: string | null
          end_time: string
          id: string
          is_available: boolean | null
          is_recurring: boolean | null
          session_id: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          coach_id: string
          created_at?: string | null
          end_time: string
          id?: string
          is_available?: boolean | null
          is_recurring?: boolean | null
          session_id?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          coach_id?: string
          created_at?: string | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          is_recurring?: boolean | null
          session_id?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coach_time_slots_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coach_time_slots_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "coaching_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      coaching_sessions: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          client_id: string
          client_notes: string | null
          coach_id: string
          coach_notes: string | null
          created_at: string | null
          duration_minutes: number
          id: string
          location_address: string | null
          location_type: string | null
          meeting_url: string | null
          package_id: string | null
          payment_id: string | null
          price_paid: number | null
          scheduled_end: string
          scheduled_start: string
          session_notes: string | null
          status: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_id: string
          client_notes?: string | null
          coach_id: string
          coach_notes?: string | null
          created_at?: string | null
          duration_minutes: number
          id?: string
          location_address?: string | null
          location_type?: string | null
          meeting_url?: string | null
          package_id?: string | null
          payment_id?: string | null
          price_paid?: number | null
          scheduled_end: string
          scheduled_start: string
          session_notes?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_id?: string
          client_notes?: string | null
          coach_id?: string
          coach_notes?: string | null
          created_at?: string | null
          duration_minutes?: number
          id?: string
          location_address?: string | null
          location_type?: string | null
          meeting_url?: string | null
          package_id?: string | null
          payment_id?: string | null
          price_paid?: number | null
          scheduled_end?: string
          scheduled_start?: string
          session_notes?: string | null
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coaching_sessions_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_sessions_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_sessions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "coach_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coaching_sessions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      combine_metrics: {
        Row: {
          beep_test_level: number | null
          bench_press_max: number | null
          bench_press_reps: number | null
          body_fat_percentage: number | null
          broad_jump: number | null
          client_id: string
          coach_id: string | null
          created_at: string | null
          deadlift_max: number | null
          forty_yard_dash: number | null
          height_inches: number | null
          id: string
          mile_time: unknown | null
          notes: string | null
          power_clean_max: number | null
          sport: Database["public"]["Enums"]["sport_type"]
          sport_specific_metrics: Json | null
          squat_max: number | null
          test_date: string
          three_cone_drill: number | null
          twenty_yard_shuttle: number | null
          updated_at: string | null
          vertical_jump: number | null
          vo2_max: number | null
          weight_lbs: number | null
          wingspan_inches: number | null
        }
        Insert: {
          beep_test_level?: number | null
          bench_press_max?: number | null
          bench_press_reps?: number | null
          body_fat_percentage?: number | null
          broad_jump?: number | null
          client_id: string
          coach_id?: string | null
          created_at?: string | null
          deadlift_max?: number | null
          forty_yard_dash?: number | null
          height_inches?: number | null
          id?: string
          mile_time?: unknown | null
          notes?: string | null
          power_clean_max?: number | null
          sport: Database["public"]["Enums"]["sport_type"]
          sport_specific_metrics?: Json | null
          squat_max?: number | null
          test_date?: string
          three_cone_drill?: number | null
          twenty_yard_shuttle?: number | null
          updated_at?: string | null
          vertical_jump?: number | null
          vo2_max?: number | null
          weight_lbs?: number | null
          wingspan_inches?: number | null
        }
        Update: {
          beep_test_level?: number | null
          bench_press_max?: number | null
          bench_press_reps?: number | null
          body_fat_percentage?: number | null
          broad_jump?: number | null
          client_id?: string
          coach_id?: string | null
          created_at?: string | null
          deadlift_max?: number | null
          forty_yard_dash?: number | null
          height_inches?: number | null
          id?: string
          mile_time?: unknown | null
          notes?: string | null
          power_clean_max?: number | null
          sport?: Database["public"]["Enums"]["sport_type"]
          sport_specific_metrics?: Json | null
          squat_max?: number | null
          test_date?: string
          three_cone_drill?: number | null
          twenty_yard_shuttle?: number | null
          updated_at?: string | null
          vertical_jump?: number | null
          vo2_max?: number | null
          weight_lbs?: number | null
          wingspan_inches?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "combine_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combine_metrics_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_records: {
        Row: {
          consent_type: string
          expires_at: string | null
          granted: boolean
          granted_at: string | null
          id: string
          ip_address: unknown | null
          minor_id: string | null
          parent_id: string | null
          revoked_at: string | null
          user_agent: string | null
        }
        Insert: {
          consent_type: string
          expires_at?: string | null
          granted: boolean
          granted_at?: string | null
          id?: string
          ip_address?: unknown | null
          minor_id?: string | null
          parent_id?: string | null
          revoked_at?: string | null
          user_agent?: string | null
        }
        Update: {
          consent_type?: string
          expires_at?: string | null
          granted?: boolean
          granted_at?: string | null
          id?: string
          ip_address?: unknown | null
          minor_id?: string | null
          parent_id?: string | null
          revoked_at?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consent_records_minor_id_fkey"
            columns: ["minor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consent_records_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_archived: boolean | null
          last_message_at: string | null
          name: string | null
          participants: string[]
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          name?: string | null
          participants: string[]
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          name?: string | null
          participants?: string[]
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      file_attachments: {
        Row: {
          attached_to_id: string | null
          attached_to_type: string | null
          created_at: string | null
          expires_at: string | null
          file_size: number
          file_url: string
          id: string
          is_public: boolean | null
          mime_type: string
          original_name: string
          storage_path: string
          uploader_id: string
        }
        Insert: {
          attached_to_id?: string | null
          attached_to_type?: string | null
          created_at?: string | null
          expires_at?: string | null
          file_size: number
          file_url: string
          id?: string
          is_public?: boolean | null
          mime_type: string
          original_name: string
          storage_path: string
          uploader_id: string
        }
        Update: {
          attached_to_id?: string | null
          attached_to_type?: string | null
          created_at?: string | null
          expires_at?: string | null
          file_size?: number
          file_url?: string
          id?: string
          is_public?: boolean | null
          mime_type?: string
          original_name?: string
          storage_path?: string
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_attachments_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_progress: {
        Row: {
          achieved: boolean | null
          client_id: string
          created_at: string | null
          current_value: number | null
          goal_id: string
          id: string
          notes: string | null
          progress_date: string
          target_value: number | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          achieved?: boolean | null
          client_id: string
          created_at?: string | null
          current_value?: number | null
          goal_id: string
          id?: string
          notes?: string | null
          progress_date: string
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          achieved?: boolean | null
          client_id?: string
          created_at?: string | null
          current_value?: number | null
          goal_id?: string
          id?: string
          notes?: string | null
          progress_date?: string
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goal_progress_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goal_progress_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "client_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      media: {
        Row: {
          athlete_id: string | null
          created_at: string | null
          description: string | null
          drill_type: string | null
          duration_seconds: number | null
          featured: boolean | null
          file_path: string
          file_size_mb: number | null
          file_type: string
          game_context: string | null
          id: string
          processing_status: string | null
          sport_id: number | null
          tags: string[] | null
          thumbnail_path: string | null
          title: string | null
          view_count: number | null
          visibility: Database["public"]["Enums"]["visibility_type"] | null
        }
        Insert: {
          athlete_id?: string | null
          created_at?: string | null
          description?: string | null
          drill_type?: string | null
          duration_seconds?: number | null
          featured?: boolean | null
          file_path: string
          file_size_mb?: number | null
          file_type: string
          game_context?: string | null
          id?: string
          processing_status?: string | null
          sport_id?: number | null
          tags?: string[] | null
          thumbnail_path?: string | null
          title?: string | null
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Update: {
          athlete_id?: string | null
          created_at?: string | null
          description?: string | null
          drill_type?: string | null
          duration_seconds?: number | null
          featured?: boolean | null
          file_path?: string
          file_size_mb?: number | null
          file_type?: string
          game_context?: string | null
          id?: string
          processing_status?: string | null
          sport_id?: number | null
          tags?: string[] | null
          thumbnail_path?: string | null
          title?: string | null
          view_count?: number | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "media_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string | null
          id: string
          message_id: string
          reaction: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_id: string
          reaction: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message_id?: string
          reaction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          edited: boolean | null
          edited_at: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          message_type: string | null
          read_by: Json | null
          reply_to: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          edited?: boolean | null
          edited_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          read_by?: Json | null
          reply_to?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          edited?: boolean | null
          edited_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          message_type?: string | null
          read_by?: Json | null
          reply_to?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_fkey"
            columns: ["reply_to"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      metric_entries: {
        Row: {
          athlete_id: string | null
          context: string | null
          created_at: string | null
          id: string
          is_personal_record: boolean | null
          location: string | null
          metric_id: number | null
          notes: string | null
          recorded_at: string | null
          value: number
          verified_by: string | null
          weather_conditions: string | null
        }
        Insert: {
          athlete_id?: string | null
          context?: string | null
          created_at?: string | null
          id?: string
          is_personal_record?: boolean | null
          location?: string | null
          metric_id?: number | null
          notes?: string | null
          recorded_at?: string | null
          value: number
          verified_by?: string | null
          weather_conditions?: string | null
        }
        Update: {
          athlete_id?: string | null
          context?: string | null
          created_at?: string | null
          id?: string
          is_personal_record?: boolean | null
          location?: string | null
          metric_id?: number | null
          notes?: string | null
          recorded_at?: string | null
          value?: number
          verified_by?: string | null
          weather_conditions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metric_entries_athlete_id_fkey"
            columns: ["athlete_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_entries_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "metrics_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_entries_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics_catalog: {
        Row: {
          collection_method:
            | Database["public"]["Enums"]["metric_collection_method"]
            | null
          context_tags: string[] | null
          created_at: string | null
          description: string | null
          display_order: number | null
          higher_is_better: boolean | null
          id: number
          is_standard: boolean | null
          name: string
          sport_id: number | null
          unit: string | null
        }
        Insert: {
          collection_method?:
            | Database["public"]["Enums"]["metric_collection_method"]
            | null
          context_tags?: string[] | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          higher_is_better?: boolean | null
          id?: number
          is_standard?: boolean | null
          name: string
          sport_id?: number | null
          unit?: string | null
        }
        Update: {
          collection_method?:
            | Database["public"]["Enums"]["metric_collection_method"]
            | null
          context_tags?: string[] | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          higher_is_better?: boolean | null
          id?: number
          is_standard?: boolean | null
          name?: string
          sport_id?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metrics_catalog_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          client_id: string
          coach_id: string
          coach_payout: number | null
          created_at: string | null
          currency: string | null
          failure_reason: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          platform_fee: number | null
          refunded_amount: number | null
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_id: string
          coach_id: string
          coach_payout?: number | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          platform_fee?: number | null
          refunded_amount?: number | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string
          coach_id?: string
          coach_payout?: number | null
          created_at?: string | null
          currency?: string | null
          failure_reason?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          platform_fee?: number | null
          refunded_amount?: number | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_goals: {
        Row: {
          achieved: boolean | null
          achieved_date: string | null
          client_id: string
          coach_id: string | null
          created_at: string | null
          current_value: number | null
          goal_type: string
          id: string
          metric_name: string
          notes: string | null
          sport: Database["public"]["Enums"]["sport_type"]
          target_date: string | null
          target_value: number
          updated_at: string | null
        }
        Insert: {
          achieved?: boolean | null
          achieved_date?: string | null
          client_id: string
          coach_id?: string | null
          created_at?: string | null
          current_value?: number | null
          goal_type: string
          id?: string
          metric_name: string
          notes?: string | null
          sport: Database["public"]["Enums"]["sport_type"]
          target_date?: string | null
          target_value: number
          updated_at?: string | null
        }
        Update: {
          achieved?: boolean | null
          achieved_date?: string | null
          client_id?: string
          coach_id?: string | null
          created_at?: string | null
          current_value?: number | null
          goal_type?: string
          id?: string
          metric_name?: string
          notes?: string | null
          sport?: Database["public"]["Enums"]["sport_type"]
          target_date?: string | null
          target_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_goals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_goals_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          client_id: string
          coach_id: string
          created_at: string | null
          id: string
          metric_type: string
          metric_value: Json
          notes: string | null
          recorded_at: string | null
        }
        Insert: {
          client_id: string
          coach_id: string
          created_at?: string | null
          id?: string
          metric_type: string
          metric_value: Json
          notes?: string | null
          recorded_at?: string | null
        }
        Update: {
          client_id?: string
          coach_id?: string
          created_at?: string | null
          id?: string
          metric_type?: string
          metric_value?: Json
          notes?: string | null
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_metrics_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          client_preferences: Json | null
          created_at: string | null
          display_name: string | null
          dob: string | null
          first_name: string | null
          grad_year: number | null
          height_cm: number | null
          id: string
          is_minor: boolean | null
          is_verified: boolean | null
          last_name: string | null
          location: string | null
          location_city: string | null
          location_country: string | null
          location_state: string | null
          notification_preferences: Json | null
          preferred_language: string | null
          profile_image_url: string | null
          school: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
          verification_badge: string | null
          visibility: Database["public"]["Enums"]["visibility_type"] | null
          weight_kg: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          client_preferences?: Json | null
          created_at?: string | null
          display_name?: string | null
          dob?: string | null
          first_name?: string | null
          grad_year?: number | null
          height_cm?: number | null
          id?: string
          is_minor?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          notification_preferences?: Json | null
          preferred_language?: string | null
          profile_image_url?: string | null
          school?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
          verification_badge?: string | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
          weight_kg?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          client_preferences?: Json | null
          created_at?: string | null
          display_name?: string | null
          dob?: string | null
          first_name?: string | null
          grad_year?: number | null
          height_cm?: number | null
          id?: string
          is_minor?: boolean | null
          is_verified?: boolean | null
          last_name?: string | null
          location?: string | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          notification_preferences?: Json | null
          preferred_language?: string | null
          profile_image_url?: string | null
          school?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
          verification_badge?: string | null
          visibility?: Database["public"]["Enums"]["visibility_type"] | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Season: {
        Row: {
          endDate: string
          id: string
          name: string
          startDate: string
        }
        Insert: {
          endDate: string
          id?: string
          name: string
          startDate: string
        }
        Update: {
          endDate?: string
          id?: string
          name?: string
          startDate?: string
        }
        Relationships: []
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id?: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      session_feedback: {
        Row: {
          client_feedback: string | null
          client_id: string
          client_rating: number | null
          coach_feedback: string | null
          coach_id: string
          coach_rating: number | null
          created_at: string | null
          goal_progress_rating: number | null
          id: string
          session_id: string
          session_intensity: number | null
          updated_at: string | null
        }
        Insert: {
          client_feedback?: string | null
          client_id: string
          client_rating?: number | null
          coach_feedback?: string | null
          coach_id: string
          coach_rating?: number | null
          created_at?: string | null
          goal_progress_rating?: number | null
          id?: string
          session_id: string
          session_intensity?: number | null
          updated_at?: string | null
        }
        Update: {
          client_feedback?: string | null
          client_id?: string
          client_rating?: number | null
          coach_feedback?: string | null
          coach_id?: string
          coach_rating?: number | null
          created_at?: string | null
          goal_progress_rating?: number | null
          id?: string
          session_id?: string
          session_intensity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_feedback_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_feedback_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "coaching_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_notes: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          is_shared: boolean | null
          note_type: string | null
          session_id: string | null
          shared_with: string[] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          note_type?: string | null
          session_id?: string | null
          shared_with?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          note_type?: string | null
          session_id?: string | null
          shared_with?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_notes_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "coaching_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sport_performance: {
        Row: {
          assists: number | null
          assists_basketball: number | null
          blocks: number | null
          client_id: string
          coach_feedback: string | null
          coach_id: string | null
          created_at: string | null
          distance_covered_km: number | null
          field_goals_attempted: number | null
          field_goals_made: number | null
          free_throws_attempted: number | null
          free_throws_made: number | null
          goals_scored: number | null
          id: string
          interceptions: number | null
          passes_attempted: number | null
          passes_completed: number | null
          passing_attempts: number | null
          passing_completions: number | null
          passing_touchdowns: number | null
          passing_yards: number | null
          performance_rating: number | null
          points_scored: number | null
          rebounds_defensive: number | null
          rebounds_offensive: number | null
          receiving_yards: number | null
          receptions: number | null
          rushing_attempts: number | null
          rushing_yards: number | null
          sacks: number | null
          session_date: string
          shots_on_target: number | null
          shots_total: number | null
          sport: Database["public"]["Enums"]["sport_type"]
          sprint_distance_m: number | null
          steals: number | null
          tackles: number | null
          three_pointers_attempted: number | null
          three_pointers_made: number | null
          turnovers: number | null
          updated_at: string | null
        }
        Insert: {
          assists?: number | null
          assists_basketball?: number | null
          blocks?: number | null
          client_id: string
          coach_feedback?: string | null
          coach_id?: string | null
          created_at?: string | null
          distance_covered_km?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          goals_scored?: number | null
          id?: string
          interceptions?: number | null
          passes_attempted?: number | null
          passes_completed?: number | null
          passing_attempts?: number | null
          passing_completions?: number | null
          passing_touchdowns?: number | null
          passing_yards?: number | null
          performance_rating?: number | null
          points_scored?: number | null
          rebounds_defensive?: number | null
          rebounds_offensive?: number | null
          receiving_yards?: number | null
          receptions?: number | null
          rushing_attempts?: number | null
          rushing_yards?: number | null
          sacks?: number | null
          session_date?: string
          shots_on_target?: number | null
          shots_total?: number | null
          sport: Database["public"]["Enums"]["sport_type"]
          sprint_distance_m?: number | null
          steals?: number | null
          tackles?: number | null
          three_pointers_attempted?: number | null
          three_pointers_made?: number | null
          turnovers?: number | null
          updated_at?: string | null
        }
        Update: {
          assists?: number | null
          assists_basketball?: number | null
          blocks?: number | null
          client_id?: string
          coach_feedback?: string | null
          coach_id?: string | null
          created_at?: string | null
          distance_covered_km?: number | null
          field_goals_attempted?: number | null
          field_goals_made?: number | null
          free_throws_attempted?: number | null
          free_throws_made?: number | null
          goals_scored?: number | null
          id?: string
          interceptions?: number | null
          passes_attempted?: number | null
          passes_completed?: number | null
          passing_attempts?: number | null
          passing_completions?: number | null
          passing_touchdowns?: number | null
          passing_yards?: number | null
          performance_rating?: number | null
          points_scored?: number | null
          rebounds_defensive?: number | null
          rebounds_offensive?: number | null
          receiving_yards?: number | null
          receptions?: number | null
          rushing_attempts?: number | null
          rushing_yards?: number | null
          sacks?: number | null
          session_date?: string
          shots_on_target?: number | null
          shots_total?: number | null
          sport?: Database["public"]["Enums"]["sport_type"]
          sprint_distance_m?: number | null
          steals?: number | null
          tackles?: number | null
          three_pointers_attempted?: number | null
          three_pointers_made?: number | null
          turnovers?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sport_performance_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sport_performance_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sports: {
        Row: {
          category: string | null
          created_at: string | null
          icon_url: string | null
          id: number
          is_active: boolean | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          icon_url?: string | null
          id?: number
          is_active?: boolean | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          icon_url?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_period: string | null
          cancel_at: string | null
          canceled_at: string | null
          client_id: string
          coach_id: string
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          description: string | null
          id: string
          name: string
          price: number
          sessions_included: number | null
          sessions_used: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          billing_period?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          client_id: string
          coach_id: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          sessions_included?: number | null
          sessions_used?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_period?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          client_id?: string
          coach_id?: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          sessions_included?: number | null
          sessions_used?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_coach_id_fkey"
            columns: ["coach_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      TimeSlot: {
        Row: {
          capacity: number
          coachId: string
          end: string
          id: string
          isOpen: boolean
          start: string
        }
        Insert: {
          capacity?: number
          coachId: string
          end: string
          id?: string
          isOpen?: boolean
          start: string
        }
        Update: {
          capacity?: number
          coachId?: string
          end?: string
          id?: string
          isOpen?: boolean
          start?: string
        }
        Relationships: [
          {
            foreignKeyName: "TimeSlot_coachId_fkey"
            columns: ["coachId"]
            isOneToOne: false
            referencedRelation: "coach_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          role: string
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          role: string
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          createdAt: string
          date_of_birth: string | null
          email: string
          emailVerified: string | null
          hashedPassword: string | null
          id: string
          image: string | null
          name: string | null
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          createdAt?: string
          date_of_birth?: string | null
          email: string
          emailVerified?: string | null
          hashedPassword?: string | null
          id?: string
          image?: string | null
          name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          createdAt?: string
          date_of_birth?: string | null
          email?: string
          emailVerified?: string | null
          hashedPassword?: string | null
          id?: string
          image?: string | null
          name?: string | null
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      VerificationToken: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_profile: {
        Args: { profile_uuid: string; viewer_uuid: string }
        Returns: boolean
      }
      get_coach_client_progress_stats: {
        Args: { coach_id: string; end_date: string; start_date: string }
        Returns: {
          avg_energy_improvement: number
          avg_mood_improvement: number
          clients_with_progress: number
          total_progress_entries: number
        }[]
      }
      get_coach_client_stats: {
        Args: { coach_id: string; end_date: string; start_date: string }
        Returns: {
          active: number
          new_this_month: number
          total: number
        }[]
      }
      get_coach_revenue_stats: {
        Args: { coach_id: string; end_date: string; start_date: string }
        Returns: {
          average_session_value: number
          platform_fees_paid: number
          total_all_time: number
          total_this_month: number
        }[]
      }
      get_coach_session_stats: {
        Args: { coach_id: string; end_date: string; start_date: string }
        Returns: {
          completed_this_month: number
          completion_rate: number
          total_this_month: number
          upcoming_count: number
        }[]
      }
      get_coach_top_performers: {
        Args: { coach_id: string; limit_count: number }
        Returns: {
          client_id: string
          client_name: string
          progress_score: number
          sessions_completed: number
        }[]
      }
      get_platform_engagement_stats: {
        Args: { end_date: string; start_date: string }
        Returns: {
          active_coach_percentage: number
          avg_sessions_per_client: number
          completed_sessions: number
          session_completion_rate: number
          total_sessions: number
        }[]
      }
      get_platform_health_stats: {
        Args: { end_date: string; start_date: string }
        Returns: {
          active_tracking_clients: number
          avg_client_satisfaction: number
          platform_health_score: number
          total_progress_entries: number
        }[]
      }
      get_platform_overview_stats: {
        Args: { end_date: string; start_date: string }
        Returns: {
          active_users_30d: number
          new_users_this_month: number
          total_admins: number
          total_clients: number
          total_coaches: number
          total_users: number
        }[]
      }
      get_platform_revenue_stats: {
        Args: { end_date: string; start_date: string }
        Returns: {
          average_transaction: number
          platform_fees_collected: number
          revenue_growth: number
          total_revenue: number
        }[]
      }
      get_platform_top_coaches: {
        Args: { end_date: string; limit_count: number; start_date: string }
        Returns: {
          client_count: number
          coach_id: string
          coach_name: string
          revenue: number
        }[]
      }
      get_user_profile_id: {
        Args: { user_uuid: string }
        Returns: string
      }
      user_has_role: {
        Args: { role_name: string; user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "no_show"
      metric_collection_method:
        | "timer"
        | "measurement"
        | "counter"
        | "percentage"
        | "manual"
      payment_status:
        | "pending"
        | "succeeded"
        | "failed"
        | "canceled"
        | "refunded"
      session_status: "scheduled" | "completed" | "cancelled" | "no_show"
      sport_type:
        | "football"
        | "soccer"
        | "basketball"
        | "baseball"
        | "track"
        | "other"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "trialing"
        | "incomplete"
      user_role: "admin" | "coach" | "client"
      visibility_type: "public" | "recruiters_only" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "no_show",
      ],
      metric_collection_method: [
        "timer",
        "measurement",
        "counter",
        "percentage",
        "manual",
      ],
      payment_status: [
        "pending",
        "succeeded",
        "failed",
        "canceled",
        "refunded",
      ],
      session_status: ["scheduled", "completed", "cancelled", "no_show"],
      sport_type: [
        "football",
        "soccer",
        "basketball",
        "baseball",
        "track",
        "other",
      ],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "trialing",
        "incomplete",
      ],
      user_role: ["admin", "coach", "client"],
      visibility_type: ["public", "recruiters_only", "private"],
    },
  },
} as const

// Additional types for GoRedShirt platform
export type UserRole = Database['public']['Enums']['user_role']
export type VisibilityType = Database['public']['Enums']['visibility_type'] 
export type SportType = Database['public']['Enums']['sport_type']
export type MetricCollectionMethod = Database['public']['Enums']['metric_collection_method']

// Enhanced user types for multi-role support
export interface AuthUser {
  id: string
  email?: string
  role?: UserRole
  roles?: UserRole[]
  name?: string
  image?: string
}

// Athlete profile types
export interface AthleteProfile extends Tables<'profiles'> {
  sports?: Array<Tables<'athlete_sports'> & { sport: Tables<'sports'> }>
  metrics?: Tables<'metric_entries'>[]
  media?: Tables<'media'>[]
}

// Coach profile types
export interface CoachProfile extends Tables<'coach_profiles'> {
  user: Tables<'users'>
  profile?: Tables<'profiles'>
}

// Sport with metrics
export interface SportWithMetrics extends Tables<'sports'> {
  metrics: Tables<'metrics_catalog'>[]
}