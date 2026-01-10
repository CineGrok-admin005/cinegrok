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
        PostgrestVersion: "13.0.5"
    }
    public: {
        Tables: {
            current_projects: {
                Row: {
                    actual_end_date: string | null
                    budget_spent: number | null
                    created_at: string | null
                    creator_id: string
                    creator_role: string | null
                    expected_end_date: string | null
                    id: string
                    is_team_project: boolean | null
                    project_name: string
                    project_type: string | null
                    start_date: string | null
                    status: string | null
                    team_can_log_contributions: boolean | null
                    total_budget: number | null
                    updated_at: string | null
                    visible_in_producer_view: boolean | null
                }
                Insert: {
                    actual_end_date?: string | null
                    budget_spent?: number | null
                    created_at?: string | null
                    creator_id: string
                    creator_role?: string | null
                    expected_end_date?: string | null
                    id?: string
                    is_team_project?: boolean | null
                    project_name: string
                    project_type?: string | null
                    start_date?: string | null
                    status?: string | null
                    team_can_log_contributions?: boolean | null
                    total_budget?: number | null
                    updated_at?: string | null
                    visible_in_producer_view?: boolean | null
                }
                Update: {
                    actual_end_date?: string | null
                    budget_spent?: number | null
                    created_at?: string | null
                    creator_id?: string
                    creator_role?: string | null
                    expected_end_date?: string | null
                    id?: string
                    is_team_project?: boolean | null
                    project_name?: string
                    project_type?: string | null
                    start_date?: string | null
                    status?: string | null
                    team_can_log_contributions?: boolean | null
                    total_budget?: number | null
                    updated_at?: string | null
                    visible_in_producer_view?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "current_projects_creator_id_fkey"
                        columns: ["creator_id"]
                        isOneToOne: false
                        referencedRelation: "filmmakers"
                        referencedColumns: ["id"]
                    },
                ]
            }
            filmmakers: {
                Row: {
                    ai_generated_bio: string | null
                    availability: string | null
                    belief_about_cinema: string | null
                    country: string | null
                    created_at: string | null
                    creative_influences: string | null
                    creative_philosophy: string | null
                    creative_signature: string | null
                    current_city: string | null
                    current_state: string | null
                    date_of_birth: string | null
                    draft_data: Json | null
                    email: string | null
                    id: string
                    languages: string | null
                    legal_name: string | null
                    message_intent: string | null
                    name: string
                    nationality: string | null
                    native_city: string | null
                    native_state: string | null
                    open_to_collaborations: string | null
                    payment_amount: number | null
                    payment_currency: string | null
                    payment_id: string | null
                    phone: string | null
                    preferred_contact: string | null
                    preferred_genres: string[] | null
                    preferred_work_location: string | null
                    primary_roles: string[] | null
                    profile_clicks: number | null
                    profile_url: string | null
                    profile_views: number | null
                    pronouns: string | null
                    published_at: string | null
                    raw_form_data: Json | null
                    secondary_roles: string[] | null
                    stage_name: string | null
                    status: string | null
                    style_vector: string | null
                    updated_at: string | null
                    user_id: string | null
                    visual_style: string | null
                    years_active: string | null
                }
                Insert: {
                    ai_generated_bio?: string | null
                    availability?: string | null
                    belief_about_cinema?: string | null
                    country?: string | null
                    created_at?: string | null
                    creative_influences?: string | null
                    creative_philosophy?: string | null
                    creative_signature?: string | null
                    current_city?: string | null
                    current_state?: string | null
                    date_of_birth?: string | null
                    draft_data?: Json | null
                    email?: string | null
                    id?: string
                    languages?: string | null
                    legal_name?: string | null
                    message_intent?: string | null
                    name: string
                    nationality?: string | null
                    native_city?: string | null
                    native_state?: string | null
                    open_to_collaborations?: string | null
                    payment_amount?: number | null
                    payment_currency?: string | null
                    payment_id?: string | null
                    phone?: string | null
                    preferred_contact?: string | null
                    preferred_genres?: string[] | null
                    preferred_work_location?: string | null
                    primary_roles?: string[] | null
                    profile_clicks?: number | null
                    profile_url?: string | null
                    profile_views?: number | null
                    pronouns?: string | null
                    published_at?: string | null
                    raw_form_data?: Json | null
                    secondary_roles?: string[] | null
                    stage_name?: string | null
                    status?: string | null
                    style_vector?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                    visual_style?: string | null
                    years_active?: string | null
                }
                Update: {
                    ai_generated_bio?: string | null
                    availability?: string | null
                    belief_about_cinema?: string | null
                    country?: string | null
                    created_at?: string | null
                    creative_influences?: string | null
                    creative_philosophy?: string | null
                    creative_signature?: string | null
                    current_city?: string | null
                    current_state?: string | null
                    date_of_birth?: string | null
                    draft_data?: Json | null
                    email?: string | null
                    id?: string
                    languages?: string | null
                    legal_name?: string | null
                    message_intent?: string | null
                    name?: string
                    nationality?: string | null
                    native_city?: string | null
                    native_state?: string | null
                    open_to_collaborations?: string | null
                    payment_amount?: number | null
                    payment_currency?: string | null
                    payment_id?: string | null
                    phone?: string | null
                    preferred_contact?: string | null
                    preferred_genres?: string[] | null
                    preferred_work_location?: string | null
                    primary_roles?: string[] | null
                    profile_clicks?: number | null
                    profile_url?: string | null
                    profile_views?: number | null
                    pronouns?: string | null
                    published_at?: string | null
                    raw_form_data?: Json | null
                    secondary_roles?: string[] | null
                    stage_name?: string | null
                    status?: string | null
                    style_vector?: string | null
                    updated_at?: string | null
                    user_id?: string | null
                    visual_style?: string | null
                    years_active?: string | null
                }
                Relationships: []
            }
            interested_profiles: {
                Row: {
                    created_at: string
                    id: string
                    inquirer_id: string
                    target_profile_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    inquirer_id: string
                    target_profile_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    inquirer_id?: string
                    target_profile_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "interested_profiles_target_profile_id_fkey"
                        columns: ["target_profile_id"]
                        isOneToOne: false
                        referencedRelation: "filmmakers"
                        referencedColumns: ["id"]
                    },
                ]
            }
            payments: {
                Row: {
                    amount: number
                    created_at: string | null
                    currency: string
                    filmmaker_id: string | null
                    id: string
                    payment_method: string | null
                    razorpay_order_id: string | null
                    razorpay_payment_id: string | null
                    razorpay_signature: string | null
                    status: string
                }
                Insert: {
                    amount: number
                    created_at?: string | null
                    currency?: string
                    filmmaker_id?: string | null
                    id?: string
                    payment_method?: string | null
                    razorpay_order_id?: string | null
                    razorpay_payment_id?: string | null
                    razorpay_signature?: string | null
                    status?: string
                }
                Update: {
                    amount?: number
                    created_at?: string | null
                    currency?: string
                    filmmaker_id?: string | null
                    id?: string
                    payment_method?: string | null
                    razorpay_order_id?: string | null
                    razorpay_payment_id?: string | null
                    razorpay_signature?: string | null
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "payments_filmmaker_id_fkey"
                        columns: ["filmmaker_id"]
                        isOneToOne: false
                        referencedRelation: "filmmakers"
                        referencedColumns: ["id"]
                    },
                ]
            }
            professional_profile: {
                Row: {
                    author_company: string | null
                    author_name: string | null
                    author_role: string | null
                    avg_budget_variance: number | null
                    avg_collaborator_rating: number | null
                    avg_response_time_hours: number | null
                    collaboration_style: string | null
                    created_at: string | null
                    filmmaker_id: string
                    id: string
                    last_calculated: string | null
                    on_time_delivery_rate: number | null
                    preferred_communication: string | null
                    project_completion_rate: number | null
                    reliability_score: number | null
                    total_ratings: number | null
                    typical_role: string | null
                    verified: boolean | null
                    years_experience: number | null
                }
                Insert: {
                    author_company?: string | null
                    author_name?: string | null
                    author_role?: string | null
                    avg_budget_variance?: number | null
                    avg_collaborator_rating?: number | null
                    avg_response_time_hours?: number | null
                    collaboration_style?: string | null
                    created_at?: string | null
                    filmmaker_id: string
                    id?: string
                    last_calculated?: string | null
                    on_time_delivery_rate?: number | null
                    preferred_communication?: string | null
                    project_completion_rate?: number | null
                    reliability_score?: number | null
                    total_ratings?: number | null
                    typical_role?: string | null
                    verified?: boolean | null
                    years_experience?: number | null
                }
                Update: {
                    author_company?: string | null
                    author_name?: string | null
                    author_role?: string | null
                    avg_budget_variance?: number | null
                    avg_collaborator_rating?: number | null
                    avg_response_time_hours?: number | null
                    collaboration_style?: string | null
                    created_at?: string | null
                    filmmaker_id?: string
                    id?: string
                    last_calculated?: string | null
                    on_time_delivery_rate?: number | null
                    preferred_communication?: string | null
                    project_completion_rate?: number | null
                    reliability_score?: number | null
                    total_ratings?: number | null
                    typical_role?: string | null
                    verified?: boolean | null
                    years_experience?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "professional_profile_filmmaker_id_fkey"
                        columns: ["filmmaker_id"]
                        isOneToOne: false
                        referencedRelation: "filmmakers"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profile_drafts: {
                Row: {
                    created_at: string | null
                    draft_data: Json
                    filmmaker_id: string | null
                    id: string
                    step: number
                    updated_at: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    draft_data: Json
                    filmmaker_id?: string | null
                    id?: string
                    step: number
                    updated_at?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    draft_data?: Json
                    filmmaker_id?: string | null
                    id?: string
                    step?: number
                    updated_at?: string | null
                    user_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profile_drafts_filmmaker_id_fkey"
                        columns: ["filmmaker_id"]
                        isOneToOne: false
                        referencedRelation: "filmmakers"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    email: string | null
                    filmmaker_id: string | null
                    full_name: string | null
                    id: string
                    last_login_at: string | null
                    onboarding_completed: boolean | null
                    sender_name: string | null
                    subscription_end_date: string | null
                    subscription_id: string | null
                    subscription_plan: string | null
                    subscription_start_date: string | null
                    subscription_status: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    filmmaker_id?: string | null
                    full_name?: string | null
                    id: string
                    last_login_at?: string | null
                    onboarding_completed?: boolean | null
                    sender_name?: string | null
                    subscription_end_date?: string | null
                    subscription_id?: string | null
                    subscription_plan?: string | null
                    subscription_start_date?: string | null
                    subscription_status?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string | null
                    filmmaker_id?: string | null
                    full_name?: string | null
                    id?: string
                    last_login_at?: string | null
                    onboarding_completed?: boolean | null
                    sender_name?: string | null
                    subscription_end_date?: string | null
                    subscription_id?: string | null
                    subscription_plan?: string | null
                    subscription_start_date?: string | null
                    subscription_status?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_filmmaker_id_fkey"
                        columns: ["filmmaker_id"]
                        isOneToOne: false
                        referencedRelation: "filmmakers"
                        referencedColumns: ["id"]
                    },
                ]
            }
            project_applications: {
                Row: {
                    application_date: string | null
                    cover_letter: string | null
                    filmmaker_id: string | null
                    id: string
                    project_id: string | null
                    role_id: string | null
                    status: string | null
                }
                Insert: {
                    application_date?: string | null
                    cover_letter?: string | null
                    filmmaker_id?: string | null
                    id?: string
                    project_id?: string | null
                    role_id?: string | null
                    status?: string | null
                }
                Update: {
                    application_date?: string | null
                    cover_letter?: string | null
                    filmmaker_id?: string | null
                    id?: string
                    project_id?: string | null
                    role_id?: string | null
                    status?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "project_applications_filmmaker_id_fkey"
                        columns: ["filmmaker_id"]
                        isOneToOne: false
                        referencedRelation: "filmmakers"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "project_applications_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "project_applications_role_id_fkey"
                        columns: ["role_id"]
                        isOneToOne: false
                        referencedRelation: "project_roles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            project_roles: {
                Row: {
                    compensation_details: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    is_filled: boolean | null
                    project_id: string | null
                    requirements: string[] | null
                    role_name: string
                    role_type: string | null
                }
                Insert: {
                    compensation_details?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_filled?: boolean | null
                    project_id?: string | null
                    requirements?: string[] | null
                    role_name: string
                    role_type?: string | null
                }
                Update: {
                    compensation_details?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    is_filled?: boolean | null
                    project_id?: string | null
                    requirements?: string[] | null
                    role_name?: string
                    role_type?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "project_roles_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            projects: {
                Row: {
                    budget_range: string | null
                    created_at: string | null
                    creator_id: string | null
                    description: string | null
                    end_date: string | null
                    id: string
                    location: string | null
                    start_date: string | null
                    status: string | null
                    title: string
                    updated_at: string | null
                }
                Insert: {
                    budget_range?: string | null
                    created_at?: string | null
                    creator_id?: string | null
                    description?: string | null
                    end_date?: string | null
                    id?: string
                    location?: string | null
                    start_date?: string | null
                    status?: string | null
                    title: string
                    updated_at?: string | null
                }
                Update: {
                    budget_range?: string | null
                    created_at?: string | null
                    creator_id?: string | null
                    description?: string | null
                    end_date?: string | null
                    id?: string
                    location?: string | null
                    start_date?: string | null
                    status?: string | null
                    title?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "projects_creator_id_fkey"
                        columns: ["creator_id"]
                        isOneToOne: false
                        referencedRelation: "filmmakers"
                        referencedColumns: ["id"]
                    },
                ]
            }
            reliability_metrics: {
                Row: {
                    avg_budget_variance: number | null
                    avg_collaborator_rating: number | null
                    avg_response_time_hours: number | null
                    filmmaker_id: string
                    id: string
                    last_calculated: string | null
                    on_time_delivery_rate: number | null
                    project_completion_rate: number | null
                    reliability_score: number | null
                    total_ratings: number | null
                }
                Insert: {
                    avg_budget_variance?: number | null
                    avg_collaborator_rating?: number | null
                    avg_response_time_hours?: number | null
                    filmmaker_id: string
                    id?: string
                    last_calculated?: string | null
                    on_time_delivery_rate?: number | null
                    project_completion_rate?: number | null
                    reliability_score?: number | null
                    total_ratings?: number | null
                }
                Update: {
                    avg_budget_variance?: number | null
                    avg_collaborator_rating?: number | null
                    avg_response_time_hours?: number | null
                    filmmaker_id?: string
                    id?: string
                    last_calculated?: string | null
                    on_time_delivery_rate?: number | null
                    project_completion_rate?: number | null
                    reliability_score?: number | null
                    total_ratings?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "reliability_metrics_filmmaker_id_fkey"
                        columns: ["filmmaker_id"]
                        isOneToOne: false
                        referencedRelation: "filmmakers"
                        referencedColumns: ["id"]
                    },
                ]
            }
            testimonials: {
                Row: {
                    author_company: string | null
                    author_name: string
                    author_role: string | null
                    created_at: string | null
                    filmmaker_id: string
                    id: string
                    project_id: string | null
                    testimonial_text: string
                    verified: boolean | null
                }
                Insert: {
                    author_company?: string | null
                    author_name: string
                    author_role?: string | null
                    created_at?: string | null
                    filmmaker_id: string
                    id?: string
                    project_id?: string | null
                    testimonial_text: string
                    verified?: boolean | null
                }
                Update: {
                    author_company?: string | null
                    author_name?: string
                    author_role?: string | null
                    created_at?: string | null
                    filmmaker_id?: string
                    id?: string
                    project_id?: string | null
                    testimonial_text?: string
                    verified?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "testimonials_filmmaker_id_fkey"
                        columns: ["filmmaker_id"]
                        isOneToOne: false
                        referencedRelation: "filmmakers"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "testimonials_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "current_projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<T = any, K = any> = any
export type TablesInsert<T = any, K = any> = any
export type TablesUpdate<T = any, K = any> = any
export type Enums<T = any, K = any> = any


