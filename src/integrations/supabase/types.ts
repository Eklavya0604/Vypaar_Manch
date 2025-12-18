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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_views: {
        Row: {
          business_id: string
          created_at: string
          device_type: string | null
          id: string
          referrer: string | null
          visit_source: string | null
          visitor_id: string | null
        }
        Insert: {
          business_id: string
          created_at?: string
          device_type?: string | null
          id?: string
          referrer?: string | null
          visit_source?: string | null
          visitor_id?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string
          device_type?: string | null
          id?: string
          referrer?: string | null
          visit_source?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_views_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_views_visitor_id_fkey"
            columns: ["visitor_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          average_rating: number | null
          category: Database["public"]["Enums"]["business_category"]
          city: string
          contact_email: string | null
          contact_phone: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          is_verified: boolean | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          operating_hours: Json | null
          owner_id: string
          pincode: string | null
          qr_code_url: string | null
          slug: string | null
          state: string
          total_reviews: number | null
          total_views: number | null
          updated_at: string
          website_url: string | null
          whatsapp_link: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          average_rating?: number | null
          category: Database["public"]["Enums"]["business_category"]
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          operating_hours?: Json | null
          owner_id: string
          pincode?: string | null
          qr_code_url?: string | null
          slug?: string | null
          state: string
          total_reviews?: number | null
          total_views?: number | null
          updated_at?: string
          website_url?: string | null
          whatsapp_link?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          average_rating?: number | null
          category?: Database["public"]["Enums"]["business_category"]
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          operating_hours?: Json | null
          owner_id?: string
          pincode?: string | null
          qr_code_url?: string | null
          slug?: string | null
          state?: string
          total_reviews?: number | null
          total_views?: number | null
          updated_at?: string
          website_url?: string | null
          whatsapp_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_logs: {
        Row: {
          business_id: string
          consumer_id: string | null
          contact_type: Database["public"]["Enums"]["contact_type"]
          created_at: string
          id: string
          metadata: Json | null
        }
        Insert: {
          business_id: string
          consumer_id?: string | null
          contact_type: Database["public"]["Enums"]["contact_type"]
          created_at?: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          business_id?: string
          consumer_id?: string | null
          contact_type?: Database["public"]["Enums"]["contact_type"]
          created_at?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_logs_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          business_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          business_id: string
          consumer_id: string | null
          content: string | null
          created_at: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          owner_response: string | null
          owner_response_at: string | null
          rating: number
          service_request_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          consumer_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          owner_response?: string | null
          owner_response_at?: string | null
          rating: number
          service_request_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          consumer_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          owner_response?: string | null
          owner_response_at?: string | null
          rating?: number
          service_request_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_searches: {
        Row: {
          created_at: string
          id: string
          name: string
          query: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          query: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          query?: Json
          user_id?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          accepted_at: string | null
          business_id: string
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          consumer_email: string | null
          consumer_id: string | null
          consumer_phone: string | null
          contact_consent: boolean | null
          created_at: string
          description: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          location_notes: string | null
          owner_notes: string | null
          preferred_date: string | null
          preferred_time_slot: string | null
          service_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          business_id: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          consumer_email?: string | null
          consumer_id?: string | null
          consumer_phone?: string | null
          contact_consent?: boolean | null
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location_notes?: string | null
          owner_notes?: string | null
          preferred_date?: string | null
          preferred_time_slot?: string | null
          service_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          business_id?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          consumer_email?: string | null
          consumer_id?: string | null
          consumer_phone?: string | null
          contact_consent?: boolean | null
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location_notes?: string | null
          owner_notes?: string | null
          preferred_date?: string | null
          preferred_time_slot?: string | null
          service_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          business_id: string
          category: string | null
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          is_available: boolean | null
          name: string
          price_max: number | null
          price_min: number | null
          updated_at: string
        }
        Insert: {
          business_id: string
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          name: string
          price_max?: number | null
          price_min?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          category?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          is_available?: boolean | null
          name?: string
          price_max?: number | null
          price_min?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_assignments: {
        Row: {
          assigned_by: string
          business_id: string
          created_at: string
          id: string
          permissions: Json | null
          staff_user_id: string
        }
        Insert: {
          assigned_by: string
          business_id: string
          created_at?: string
          id?: string
          permissions?: Json | null
          staff_user_id: string
        }
        Update: {
          assigned_by?: string
          business_id?: string
          created_at?: string
          id?: string
          permissions?: Json | null
          staff_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_assignments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_profile_id_from_auth: { Args: never; Returns: string }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_business_owner: { Args: { _user_id: string }; Returns: boolean }
      owns_business: {
        Args: { _business_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "CONSUMER" | "BUSINESS_OWNER" | "STAFF" | "ADMIN"
      business_category:
        | "RESTAURANT"
        | "RETAIL"
        | "HEALTHCARE"
        | "BEAUTY"
        | "FITNESS"
        | "HOME_SERVICES"
        | "AUTOMOTIVE"
        | "PROFESSIONAL"
        | "EDUCATION"
        | "ENTERTAINMENT"
        | "TECHNOLOGY"
        | "REAL_ESTATE"
        | "FINANCIAL"
        | "OTHER"
      contact_type: "CALL" | "WHATSAPP" | "FORM" | "EMAIL"
      notification_type:
        | "NEW_REQUEST"
        | "REQUEST_UPDATE"
        | "REQUEST_ACCEPTED"
        | "REQUEST_COMPLETED"
        | "NEW_REVIEW"
        | "SYSTEM"
        | "REMINDER"
        | "PROMOTION"
      request_status:
        | "PENDING"
        | "ACCEPTED"
        | "IN_PROGRESS"
        | "COMPLETED"
        | "CANCELLED"
        | "EXPIRED"
      user_role: "CONSUMER" | "BUSINESS_OWNER" | "ADMIN"
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
      app_role: ["CONSUMER", "BUSINESS_OWNER", "STAFF", "ADMIN"],
      business_category: [
        "RESTAURANT",
        "RETAIL",
        "HEALTHCARE",
        "BEAUTY",
        "FITNESS",
        "HOME_SERVICES",
        "AUTOMOTIVE",
        "PROFESSIONAL",
        "EDUCATION",
        "ENTERTAINMENT",
        "TECHNOLOGY",
        "REAL_ESTATE",
        "FINANCIAL",
        "OTHER",
      ],
      contact_type: ["CALL", "WHATSAPP", "FORM", "EMAIL"],
      notification_type: [
        "NEW_REQUEST",
        "REQUEST_UPDATE",
        "REQUEST_ACCEPTED",
        "REQUEST_COMPLETED",
        "NEW_REVIEW",
        "SYSTEM",
        "REMINDER",
        "PROMOTION",
      ],
      request_status: [
        "PENDING",
        "ACCEPTED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
        "EXPIRED",
      ],
      user_role: ["CONSUMER", "BUSINESS_OWNER", "ADMIN"],
    },
  },
} as const
