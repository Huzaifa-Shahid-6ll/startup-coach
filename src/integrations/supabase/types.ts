export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_models: {
        Row: {
          created_at: string | null
          id: string
          idea_id: string | null
          monetization_paths: Json | null
          pricing_tiers: Json | null
          user_id: string
          weekend_mvp: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          idea_id?: string | null
          monetization_paths?: Json | null
          pricing_tiers?: Json | null
          user_id: string
          weekend_mvp?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          idea_id?: string | null
          monetization_paths?: Json | null
          pricing_tiers?: Json | null
          user_id?: string
          weekend_mvp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_models_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      clarity_sessions: {
        Row: {
          blocking_factors: string | null
          created_at: string | null
          goal: string | null
          id: string
          mindset_advice: string | null
          pep_talk: string | null
          productivity_tip: string | null
          skills_assets: string | null
          user_id: string
          weekly_plan: Json | null
        }
        Insert: {
          blocking_factors?: string | null
          created_at?: string | null
          goal?: string | null
          id?: string
          mindset_advice?: string | null
          pep_talk?: string | null
          productivity_tip?: string | null
          skills_assets?: string | null
          user_id: string
          weekly_plan?: Json | null
        }
        Update: {
          blocking_factors?: string | null
          created_at?: string | null
          goal?: string | null
          id?: string
          mindset_advice?: string | null
          pep_talk?: string | null
          productivity_tip?: string | null
          skills_assets?: string | null
          user_id?: string
          weekly_plan?: Json | null
        }
        Relationships: []
      }
      ideas: {
        Row: {
          created_at: string | null
          description: string
          digital_products: Json | null
          id: string
          monetization_paths: Json | null
          mvp_recommendation: string | null
          niches: Json | null
          rating: number | null
          swot_analysis: Json | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          digital_products?: Json | null
          id?: string
          monetization_paths?: Json | null
          mvp_recommendation?: string | null
          niches?: Json | null
          rating?: number | null
          swot_analysis?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          digital_products?: Json | null
          id?: string
          monetization_paths?: Json | null
          mvp_recommendation?: string | null
          niches?: Json | null
          rating?: number | null
          swot_analysis?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      niche_validations: {
        Row: {
          created_at: string | null
          id: string
          idea_id: string | null
          micro_products: Json | null
          profitable_niches: Json | null
          selling_platforms: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          idea_id?: string | null
          micro_products?: Json | null
          profitable_niches?: Json | null
          selling_platforms?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          idea_id?: string | null
          micro_products?: Json | null
          profitable_niches?: Json | null
          selling_platforms?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "niche_validations_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
