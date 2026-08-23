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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      advisories: {
        Row: {
          body: string
          category: string
          created_at: string
          crop_name: string | null
          district: string | null
          id: string
          is_demo: boolean
          language: string
          state: string | null
          title: string
          updated_at: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          body: string
          category: string
          created_at?: string
          crop_name?: string | null
          district?: string | null
          id?: string
          is_demo?: boolean
          language?: string
          state?: string | null
          title: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          crop_name?: string | null
          district?: string | null
          id?: string
          is_demo?: boolean
          language?: string
          state?: string | null
          title?: string
          updated_at?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: []
      }
      crops: {
        Row: {
          area: number | null
          created_at: string
          expected_harvest_date: string | null
          farm_id: string
          growth_stage: string
          health_status: string
          id: string
          name: string
          owner_id: string
          sowing_date: string | null
          updated_at: string
          variety: string | null
        }
        Insert: {
          area?: number | null
          created_at?: string
          expected_harvest_date?: string | null
          farm_id: string
          growth_stage?: string
          health_status?: string
          id?: string
          name: string
          owner_id: string
          sowing_date?: string | null
          updated_at?: string
          variety?: string | null
        }
        Update: {
          area?: number | null
          created_at?: string
          expected_harvest_date?: string | null
          farm_id?: string
          growth_stage?: string
          health_status?: string
          id?: string
          name?: string
          owner_id?: string
          sowing_date?: string | null
          updated_at?: string
          variety?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crops_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      disease_scans: {
        Row: {
          confidence: number | null
          created_at: string
          crop_id: string | null
          crop_name: string
          detected_disease: string | null
          farm_id: string | null
          id: string
          image_url: string | null
          is_demo: boolean
          model_version: string | null
          owner_id: string
          raw_predictions: Json | null
          recommendation: string | null
          scanned_at: string
          severity: string | null
          status: string
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          crop_id?: string | null
          crop_name: string
          detected_disease?: string | null
          farm_id?: string | null
          id?: string
          image_url?: string | null
          is_demo?: boolean
          model_version?: string | null
          owner_id: string
          raw_predictions?: Json | null
          recommendation?: string | null
          scanned_at?: string
          severity?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          crop_id?: string | null
          crop_name?: string
          detected_disease?: string | null
          farm_id?: string | null
          id?: string
          image_url?: string | null
          is_demo?: boolean
          model_version?: string | null
          owner_id?: string
          raw_predictions?: Json | null
          recommendation?: string | null
          scanned_at?: string
          severity?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disease_scans_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disease_scans_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          category: string
          created_at: string
          description: string | null
          district: string | null
          hourly_price: number
          id: string
          image_url: string | null
          image_urls: string[]
          is_available: boolean
          latitude: number | null
          longitude: number | null
          owner_id: string
          rating: number
          rating_count: number
          state: string | null
          title: string
          updated_at: string
          village: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          district?: string | null
          hourly_price?: number
          id?: string
          image_url?: string | null
          image_urls?: string[]
          is_available?: boolean
          latitude?: number | null
          longitude?: number | null
          owner_id: string
          rating?: number
          rating_count?: number
          state?: string | null
          title: string
          updated_at?: string
          village?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          district?: string | null
          hourly_price?: number
          id?: string
          image_url?: string | null
          image_urls?: string[]
          is_available?: boolean
          latitude?: number | null
          longitude?: number | null
          owner_id?: string
          rating?: number
          rating_count?: number
          state?: string | null
          title?: string
          updated_at?: string
          village?: string | null
        }
        Relationships: []
      }
      equipment_bookings: {
        Row: {
          created_at: string
          end_date: string | null
          end_time: string | null
          equipment_id: string
          hours: number | null
          id: string
          payment_reference: string | null
          payment_status: string
          renter_id: string
          start_date: string
          start_time: string | null
          status: string
          total_amount: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          end_time?: string | null
          equipment_id: string
          hours?: number | null
          id?: string
          payment_reference?: string | null
          payment_status?: string
          renter_id: string
          start_date: string
          start_time?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          end_time?: string | null
          equipment_id?: string
          hours?: number | null
          id?: string
          payment_reference?: string | null
          payment_status?: string
          renter_id?: string
          start_date?: string
          start_time?: string | null
          status?: string
          total_amount?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_bookings_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      farms: {
        Row: {
          created_at: string
          district: string | null
          id: string
          irrigation_type: string | null
          land_area: number | null
          land_unit: string
          latitude: number | null
          longitude: number | null
          name: string
          owner_id: string
          soil_type: string | null
          state: string | null
          updated_at: string
          village: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          id?: string
          irrigation_type?: string | null
          land_area?: number | null
          land_unit?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          owner_id: string
          soil_type?: string | null
          state?: string | null
          updated_at?: string
          village?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          id?: string
          irrigation_type?: string | null
          land_area?: number | null
          land_unit?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          owner_id?: string
          soil_type?: string | null
          state?: string | null
          updated_at?: string
          village?: string | null
        }
        Relationships: []
      }
      loan_assessments: {
        Row: {
          annual_income_band: string | null
          created_at: string
          farm_id: string | null
          farming_experience_years: number | null
          has_existing_loan: boolean
          id: string
          indicative_amount: number | null
          land_area: number | null
          land_unit: string
          primary_crop: string | null
          readiness_score: number | null
          result_summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_income_band?: string | null
          created_at?: string
          farm_id?: string | null
          farming_experience_years?: number | null
          has_existing_loan?: boolean
          id?: string
          indicative_amount?: number | null
          land_area?: number | null
          land_unit?: string
          primary_crop?: string | null
          readiness_score?: number | null
          result_summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_income_band?: string | null
          created_at?: string
          farm_id?: string | null
          farming_experience_years?: number | null
          has_existing_loan?: boolean
          id?: string
          indicative_amount?: number | null
          land_area?: number | null
          land_unit?: string
          primary_crop?: string | null
          readiness_score?: number | null
          result_summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loan_assessments_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      market_data: {
        Row: {
          created_at: string
          crop_name: string
          district: string | null
          id: string
          market_name: string | null
          max_price: number | null
          min_price: number | null
          modal_price: number | null
          price_date: string
          source: string
          state: string
        }
        Insert: {
          created_at?: string
          crop_name: string
          district?: string | null
          id?: string
          market_name?: string | null
          max_price?: number | null
          min_price?: number | null
          modal_price?: number | null
          price_date: string
          source?: string
          state: string
        }
        Update: {
          created_at?: string
          crop_name?: string
          district?: string | null
          id?: string
          market_name?: string | null
          max_price?: number | null
          min_price?: number | null
          modal_price?: number | null
          price_date?: string
          source?: string
          state?: string
        }
        Relationships: []
      }
      market_predictions: {
        Row: {
          confidence: number | null
          created_at: string
          crop_name: string
          district: string | null
          id: string
          is_demo: boolean
          lower_bound: number | null
          market_name: string | null
          model_version: string
          predicted_price: number
          state: string
          target_date: string
          updated_at: string
          upper_bound: number | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          crop_name: string
          district?: string | null
          id?: string
          is_demo?: boolean
          lower_bound?: number | null
          market_name?: string | null
          model_version?: string
          predicted_price: number
          state: string
          target_date: string
          updated_at?: string
          upper_bound?: number | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          crop_name?: string
          district?: string | null
          id?: string
          is_demo?: boolean
          lower_bound?: number | null
          market_name?: string | null
          model_version?: string
          predicted_price?: number
          state?: string
          target_date?: string
          updated_at?: string
          upper_bound?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          district: string | null
          email: string | null
          farming_experience_years: number | null
          full_name: string
          id: string
          mobile_number: string | null
          preferred_language: string
          state: string | null
          updated_at: string
          village: string | null
        }
        Insert: {
          created_at?: string
          district?: string | null
          email?: string | null
          farming_experience_years?: number | null
          full_name?: string
          id: string
          mobile_number?: string | null
          preferred_language?: string
          state?: string | null
          updated_at?: string
          village?: string | null
        }
        Update: {
          created_at?: string
          district?: string | null
          email?: string | null
          farming_experience_years?: number | null
          full_name?: string
          id?: string
          mobile_number?: string | null
          preferred_language?: string
          state?: string | null
          updated_at?: string
          village?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weather_data: {
        Row: {
          condition: string | null
          created_at: string
          district: string | null
          farm_id: string | null
          forecast_time: string | null
          humidity_percent: number | null
          id: string
          latitude: number | null
          location_name: string
          longitude: number | null
          rain_probability_percent: number | null
          rainfall_mm: number | null
          recorded_for: string
          retrieved_at: string
          source: string
          state: string | null
          temperature_c: number | null
          wind_speed_kmph: number | null
        }
        Insert: {
          condition?: string | null
          created_at?: string
          district?: string | null
          farm_id?: string | null
          forecast_time?: string | null
          humidity_percent?: number | null
          id?: string
          latitude?: number | null
          location_name: string
          longitude?: number | null
          rain_probability_percent?: number | null
          rainfall_mm?: number | null
          recorded_for: string
          retrieved_at?: string
          source?: string
          state?: string | null
          temperature_c?: number | null
          wind_speed_kmph?: number | null
        }
        Update: {
          condition?: string | null
          created_at?: string
          district?: string | null
          farm_id?: string | null
          forecast_time?: string | null
          humidity_percent?: number | null
          id?: string
          latitude?: number | null
          location_name?: string
          longitude?: number | null
          rain_probability_percent?: number | null
          rainfall_mm?: number | null
          recorded_for?: string
          retrieved_at?: string
          source?: string
          state?: string | null
          temperature_c?: number | null
          wind_speed_kmph?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weather_data_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "farmer" | "officer" | "fpo" | "admin"
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
      app_role: ["farmer", "officer", "fpo", "admin"],
    },
  },
} as const
