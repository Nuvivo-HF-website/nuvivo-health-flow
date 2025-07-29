export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          created_at: string
          doctor_id: string | null
          duration_minutes: number | null
          fee: number | null
          id: string
          location: string | null
          meeting_link: string | null
          notes: string | null
          payment_status: string | null
          reminder_sent: boolean | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          created_at?: string
          doctor_id?: string | null
          duration_minutes?: number | null
          fee?: number | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          payment_status?: string | null
          reminder_sent?: boolean | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          created_at?: string
          doctor_id?: string | null
          duration_minutes?: number | null
          fee?: number | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          payment_status?: string | null
          reminder_sent?: boolean | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      consultations: {
        Row: {
          appointment_date: string
          consultation_type: string
          created_at: string
          diagnosis: string | null
          doctor_id: string | null
          doctor_notes: string | null
          duration_minutes: number | null
          fee: number | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          meeting_link: string | null
          notes: string | null
          payment_status: string | null
          prescription: string | null
          status: string
          symptoms: string | null
          treatment_plan: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          consultation_type: string
          created_at?: string
          diagnosis?: string | null
          doctor_id?: string | null
          doctor_notes?: string | null
          duration_minutes?: number | null
          fee?: number | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          payment_status?: string | null
          prescription?: string | null
          status?: string
          symptoms?: string | null
          treatment_plan?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          consultation_type?: string
          created_at?: string
          diagnosis?: string | null
          doctor_id?: string | null
          doctor_notes?: string | null
          duration_minutes?: number | null
          fee?: number | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          payment_status?: string | null
          prescription?: string | null
          status?: string
          symptoms?: string | null
          treatment_plan?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      medical_documents: {
        Row: {
          consultation_id: string | null
          created_at: string
          description: string | null
          doctor_id: string | null
          document_name: string
          document_type: string
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_test_result: boolean | null
          tags: string[] | null
          test_result_id: string | null
          updated_at: string
          uploaded_by_doctor: boolean | null
          user_id: string
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string
          description?: string | null
          doctor_id?: string | null
          document_name: string
          document_type: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_test_result?: boolean | null
          tags?: string[] | null
          test_result_id?: string | null
          updated_at?: string
          uploaded_by_doctor?: boolean | null
          user_id: string
        }
        Update: {
          consultation_id?: string | null
          created_at?: string
          description?: string | null
          doctor_id?: string | null
          document_name?: string
          document_type?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_test_result?: boolean | null
          tags?: string[] | null
          test_result_id?: string | null
          updated_at?: string
          uploaded_by_doctor?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_documents_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_documents_test_result_id_fkey"
            columns: ["test_result_id"]
            isOneToOne: false
            referencedRelation: "test_results"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          consultation_id: string | null
          created_at: string
          dosage: string | null
          end_date: string | null
          frequency: string | null
          id: string
          medication_name: string
          notes: string | null
          prescribed_by: string | null
          prescription_date: string | null
          side_effects: string | null
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultation_id?: string | null
          created_at?: string
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          medication_name: string
          notes?: string | null
          prescribed_by?: string | null
          prescription_date?: string | null
          side_effects?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultation_id?: string | null
          created_at?: string
          dosage?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          medication_name?: string
          notes?: string | null
          prescribed_by?: string | null
          prescription_date?: string | null
          side_effects?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_profiles: {
        Row: {
          address: string | null
          address_line_1: string | null
          address_line_2: string | null
          allergies: string[] | null
          city: string | null
          country: string | null
          created_at: string
          current_medications: string[] | null
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          medical_conditions: string[] | null
          phone: string | null
          postcode: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          allergies?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_medications?: string[] | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          medical_conditions?: string[] | null
          phone?: string | null
          postcode?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          allergies?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_medications?: string[] | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          medical_conditions?: string[] | null
          phone?: string | null
          postcode?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
      test_results: {
        Row: {
          ai_summary: string | null
          clinic_name: string | null
          created_at: string
          doctor_name: string | null
          doctor_notes: string | null
          file_url: string | null
          id: string
          order_id: string | null
          reference_ranges: Json
          result_status: string | null
          result_values: Json
          status: string
          test_date: string
          test_name: string
          test_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_summary?: string | null
          clinic_name?: string | null
          created_at?: string
          doctor_name?: string | null
          doctor_notes?: string | null
          file_url?: string | null
          id?: string
          order_id?: string | null
          reference_ranges?: Json
          result_status?: string | null
          result_values?: Json
          status?: string
          test_date: string
          test_name: string
          test_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_summary?: string | null
          clinic_name?: string | null
          created_at?: string
          doctor_name?: string | null
          doctor_notes?: string | null
          file_url?: string | null
          id?: string
          order_id?: string | null
          reference_ranges?: Json
          result_status?: string | null
          result_values?: Json
          status?: string
          test_date?: string
          test_name?: string
          test_type?: string
          updated_at?: string
          user_id?: string
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
    Enums: {},
  },
} as const
