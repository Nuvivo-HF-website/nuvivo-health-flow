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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_logs: {
        Row: {
          created_at: string
          id: string
          model: string
          response_snippet: string | null
          result_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          model: string
          response_snippet?: string | null
          result_id: string
        }
        Update: {
          created_at?: string
          id?: string
          model?: string
          response_snippet?: string | null
          result_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ai_logs_result_id"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "patient_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ai_logs_result_id"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "results"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_review_logs: {
        Row: {
          id: string
          result_id: string
          viewed_at: string
          viewed_by: string
        }
        Insert: {
          id?: string
          result_id: string
          viewed_at?: string
          viewed_by: string
        }
        Update: {
          id?: string
          result_id?: string
          viewed_at?: string
          viewed_by?: string
        }
        Relationships: []
      }
      appointment_history: {
        Row: {
          action: string
          appointment_id: string
          changed_by: string | null
          created_at: string
          id: string
          new_date: string | null
          old_date: string | null
          reason: string | null
        }
        Insert: {
          action: string
          appointment_id: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_date?: string | null
          old_date?: string | null
          reason?: string | null
        }
        Update: {
          action?: string
          appointment_id?: string
          changed_by?: string | null
          created_at?: string
          id?: string
          new_date?: string | null
          old_date?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_history_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          booking_source: string | null
          cancellation_reason: string | null
          consultation_type: string | null
          created_at: string
          doctor_id: string | null
          duration_minutes: number | null
          fee: number | null
          feedback: string | null
          follow_up_required: boolean | null
          id: string
          location: string | null
          meeting_link: string | null
          notes: string | null
          payment_status: string | null
          preparation_instructions: string | null
          rating: number | null
          reminder_sent: boolean | null
          reschedule_count: number | null
          specialist_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          booking_source?: string | null
          cancellation_reason?: string | null
          consultation_type?: string | null
          created_at?: string
          doctor_id?: string | null
          duration_minutes?: number | null
          fee?: number | null
          feedback?: string | null
          follow_up_required?: boolean | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          payment_status?: string | null
          preparation_instructions?: string | null
          rating?: number | null
          reminder_sent?: boolean | null
          reschedule_count?: number | null
          specialist_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          booking_source?: string | null
          cancellation_reason?: string | null
          consultation_type?: string | null
          created_at?: string
          doctor_id?: string | null
          duration_minutes?: number | null
          fee?: number | null
          feedback?: string | null
          follow_up_required?: boolean | null
          id?: string
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          payment_status?: string | null
          preparation_instructions?: string | null
          rating?: number | null
          reminder_sent?: boolean | null
          reschedule_count?: number | null
          specialist_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "specialists"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      billing_invoices: {
        Row: {
          amount: number
          appointment_id: string | null
          consultation_id: string | null
          created_at: string
          currency: string | null
          due_date: string
          id: string
          invoice_number: string
          issued_date: string
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          payment_reference: string | null
          service_description: string
          status: string
          stripe_payment_intent_id: string | null
          tax_amount: number | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          consultation_id?: string | null
          created_at?: string
          currency?: string | null
          due_date: string
          id?: string
          invoice_number: string
          issued_date: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          service_description: string
          status?: string
          stripe_payment_intent_id?: string | null
          tax_amount?: number | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          consultation_id?: string | null
          created_at?: string
          currency?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          issued_date?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          service_description?: string
          status?: string
          stripe_payment_intent_id?: string | null
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      care_team: {
        Row: {
          access_level: string | null
          added_date: string
          created_at: string
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          notes: string | null
          provider_id: string
          provider_type: string
          relationship_type: string
          removed_date: string | null
          user_id: string
        }
        Insert: {
          access_level?: string | null
          added_date?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          notes?: string | null
          provider_id: string
          provider_type: string
          relationship_type: string
          removed_date?: string | null
          user_id: string
        }
        Update: {
          access_level?: string | null
          added_date?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          notes?: string | null
          provider_id?: string
          provider_type?: string
          relationship_type?: string
          removed_date?: string | null
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
      doctor_profiles: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          available_days: string[] | null
          available_hours: Json | null
          bio: string | null
          city: string | null
          clinic_address: string | null
          clinic_name: string | null
          consultation_fee: number | null
          country: string | null
          created_at: string
          first_name: string | null
          id: string
          languages: string[] | null
          last_name: string | null
          license_number: string | null
          phone: string | null
          postcode: string | null
          qualification: string | null
          specialty: string | null
          updated_at: string
          user_id: string
          years_of_experience: number | null
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          available_days?: string[] | null
          available_hours?: Json | null
          bio?: string | null
          city?: string | null
          clinic_address?: string | null
          clinic_name?: string | null
          consultation_fee?: number | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          languages?: string[] | null
          last_name?: string | null
          license_number?: string | null
          phone?: string | null
          postcode?: string | null
          qualification?: string | null
          specialty?: string | null
          updated_at?: string
          user_id: string
          years_of_experience?: number | null
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          available_days?: string[] | null
          available_hours?: Json | null
          bio?: string | null
          city?: string | null
          clinic_address?: string | null
          clinic_name?: string | null
          consultation_fee?: number | null
          country?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          languages?: string[] | null
          last_name?: string | null
          license_number?: string | null
          phone?: string | null
          postcode?: string | null
          qualification?: string | null
          specialty?: string | null
          updated_at?: string
          user_id?: string
          years_of_experience?: number | null
        }
        Relationships: []
      }
      document_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_category_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_category_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_category_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      document_shares: {
        Row: {
          created_at: string
          document_id: string
          expires_at: string | null
          id: string
          permission_level: string | null
          shared_by: string
          shared_with: string
        }
        Insert: {
          created_at?: string
          document_id: string
          expires_at?: string | null
          id?: string
          permission_level?: string | null
          shared_by: string
          shared_with: string
        }
        Update: {
          created_at?: string
          document_id?: string
          expires_at?: string | null
          id?: string
          permission_level?: string | null
          shared_by?: string
          shared_with?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_shares_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "medical_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      gdpr_requests: {
        Row: {
          created_at: string
          details: Json | null
          id: string
          processed_at: string | null
          processed_by: string | null
          request_type: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: Json | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          request_type: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json | null
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          request_type?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      health_goals: {
        Row: {
          created_at: string
          created_by: string | null
          current_value: number | null
          description: string | null
          goal_type: string
          id: string
          progress_percentage: number | null
          reminder_frequency: string | null
          reminders_enabled: boolean | null
          status: string
          target_date: string | null
          target_unit: string | null
          target_value: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          goal_type: string
          id?: string
          progress_percentage?: number | null
          reminder_frequency?: string | null
          reminders_enabled?: boolean | null
          status?: string
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          goal_type?: string
          id?: string
          progress_percentage?: number | null
          reminder_frequency?: string | null
          reminders_enabled?: boolean | null
          status?: string
          target_date?: string | null
          target_unit?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_metrics: {
        Row: {
          created_at: string
          device_source: string | null
          id: string
          is_flagged: boolean | null
          measured_at: string
          metric_type: string
          notes: string | null
          unit: string
          user_id: string
          value: Json
        }
        Insert: {
          created_at?: string
          device_source?: string | null
          id?: string
          is_flagged?: boolean | null
          measured_at: string
          metric_type: string
          notes?: string | null
          unit: string
          user_id: string
          value: Json
        }
        Update: {
          created_at?: string
          device_source?: string | null
          id?: string
          is_flagged?: boolean | null
          measured_at?: string
          metric_type?: string
          notes?: string | null
          unit?: string
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
      medical_documents: {
        Row: {
          category_id: string | null
          consultation_id: string | null
          created_at: string
          description: string | null
          doctor_id: string | null
          document_name: string
          document_type: string
          download_count: number | null
          expiry_date: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          is_test_result: boolean | null
          last_accessed: string | null
          parent_document_id: string | null
          priority: string | null
          tags: string[] | null
          test_result_id: string | null
          updated_at: string
          uploaded_by_doctor: boolean | null
          user_id: string
          version_number: number | null
        }
        Insert: {
          category_id?: string | null
          consultation_id?: string | null
          created_at?: string
          description?: string | null
          doctor_id?: string | null
          document_name: string
          document_type: string
          download_count?: number | null
          expiry_date?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_test_result?: boolean | null
          last_accessed?: string | null
          parent_document_id?: string | null
          priority?: string | null
          tags?: string[] | null
          test_result_id?: string | null
          updated_at?: string
          uploaded_by_doctor?: boolean | null
          user_id: string
          version_number?: number | null
        }
        Update: {
          category_id?: string | null
          consultation_id?: string | null
          created_at?: string
          description?: string | null
          doctor_id?: string | null
          document_name?: string
          document_type?: string
          download_count?: number | null
          expiry_date?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_test_result?: boolean | null
          last_accessed?: string | null
          parent_document_id?: string | null
          priority?: string | null
          tags?: string[] | null
          test_result_id?: string | null
          updated_at?: string
          uploaded_by_doctor?: boolean | null
          user_id?: string
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_documents_consultation_id_fkey"
            columns: ["consultation_id"]
            isOneToOne: false
            referencedRelation: "consultations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "medical_documents"
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
      message_audit_logs: {
        Row: {
          action: string
          actor_id: string
          created_at: string
          id: string
          message_id: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string
          id?: string
          message_id: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string
          id?: string
          message_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          recipient_id: string
          related_result_id: string | null
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id: string
          related_result_id?: string | null
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          related_result_id?: string | null
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_messages_related_result"
            columns: ["related_result_id"]
            isOneToOne: false
            referencedRelation: "patient_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_messages_related_result"
            columns: ["related_result_id"]
            isOneToOne: false
            referencedRelation: "results"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          category: string | null
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          category?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      patient_profiles: {
        Row: {
          address: string | null
          address_line_1: string | null
          address_line_2: string | null
          allergies: string[] | null
          city: string | null
          consent_data_processing: boolean | null
          consent_marketing: boolean | null
          consent_research: boolean | null
          country: string | null
          created_at: string
          current_medications: string[] | null
          data_retention_period: number | null
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          family_medical_history: Json | null
          first_name: string | null
          gdpr_consent_date: string | null
          gender: string | null
          gender_identity: string | null
          id: string
          insurance_details: Json | null
          last_data_review: string | null
          last_name: string | null
          lifestyle_factors: Json | null
          marital_status: string | null
          medical_conditions: string[] | null
          nationality: string | null
          nhs_number: string | null
          occupation: string | null
          phone: string | null
          postcode: string | null
          preferred_language: string | null
          sex_at_birth: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          allergies?: string[] | null
          city?: string | null
          consent_data_processing?: boolean | null
          consent_marketing?: boolean | null
          consent_research?: boolean | null
          country?: string | null
          created_at?: string
          current_medications?: string[] | null
          data_retention_period?: number | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          family_medical_history?: Json | null
          first_name?: string | null
          gdpr_consent_date?: string | null
          gender?: string | null
          gender_identity?: string | null
          id?: string
          insurance_details?: Json | null
          last_data_review?: string | null
          last_name?: string | null
          lifestyle_factors?: Json | null
          marital_status?: string | null
          medical_conditions?: string[] | null
          nationality?: string | null
          nhs_number?: string | null
          occupation?: string | null
          phone?: string | null
          postcode?: string | null
          preferred_language?: string | null
          sex_at_birth?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          address_line_1?: string | null
          address_line_2?: string | null
          allergies?: string[] | null
          city?: string | null
          consent_data_processing?: boolean | null
          consent_marketing?: boolean | null
          consent_research?: boolean | null
          country?: string | null
          created_at?: string
          current_medications?: string[] | null
          data_retention_period?: number | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          family_medical_history?: Json | null
          first_name?: string | null
          gdpr_consent_date?: string | null
          gender?: string | null
          gender_identity?: string | null
          id?: string
          insurance_details?: Json | null
          last_data_review?: string | null
          last_name?: string | null
          lifestyle_factors?: Json | null
          marital_status?: string | null
          medical_conditions?: string[] | null
          nationality?: string | null
          nhs_number?: string | null
          occupation?: string | null
          phone?: string | null
          postcode?: string | null
          preferred_language?: string | null
          sex_at_birth?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          consultation_id: string | null
          contraindications: string | null
          created_at: string
          doctor_id: string | null
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          instructions: string | null
          medication_name: string
          pharmacy_name: string | null
          pharmacy_phone: string | null
          prescribed_date: string
          prescription_number: string | null
          quantity: number | null
          refills_remaining: number | null
          side_effects: string | null
          start_date: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          consultation_id?: string | null
          contraindications?: string | null
          created_at?: string
          doctor_id?: string | null
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          instructions?: string | null
          medication_name: string
          pharmacy_name?: string | null
          pharmacy_phone?: string | null
          prescribed_date: string
          prescription_number?: string | null
          quantity?: number | null
          refills_remaining?: number | null
          side_effects?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          consultation_id?: string | null
          contraindications?: string | null
          created_at?: string
          doctor_id?: string | null
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          instructions?: string | null
          medication_name?: string
          pharmacy_name?: string | null
          pharmacy_phone?: string | null
          prescribed_date?: string
          prescription_number?: string | null
          quantity?: number | null
          refills_remaining?: number | null
          side_effects?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_consent: boolean | null
          avatar_url: string | null
          consent_ip_address: unknown | null
          consent_timestamp: string | null
          consent_version: string | null
          created_at: string
          data_retention_consent: boolean | null
          email: string | null
          full_name: string | null
          id: string
          marketing_consent: boolean | null
          research_consent: boolean | null
          updated_at: string
          user_id: string
          user_type: string | null
        }
        Insert: {
          ai_consent?: boolean | null
          avatar_url?: string | null
          consent_ip_address?: unknown | null
          consent_timestamp?: string | null
          consent_version?: string | null
          created_at?: string
          data_retention_consent?: boolean | null
          email?: string | null
          full_name?: string | null
          id?: string
          marketing_consent?: boolean | null
          research_consent?: boolean | null
          updated_at?: string
          user_id: string
          user_type?: string | null
        }
        Update: {
          ai_consent?: boolean | null
          avatar_url?: string | null
          consent_ip_address?: unknown | null
          consent_timestamp?: string | null
          consent_version?: string | null
          created_at?: string
          data_retention_consent?: boolean | null
          email?: string | null
          full_name?: string | null
          id?: string
          marketing_consent?: boolean | null
          research_consent?: boolean | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
      results: {
        Row: {
          ai_flags: Json | null
          ai_generated_at: string | null
          ai_risk_score: number | null
          ai_summary: string | null
          created_at: string
          id: string
          parsed_data: Json
          updated_at: string
          uploaded_by: string | null
          user_id: string
        }
        Insert: {
          ai_flags?: Json | null
          ai_generated_at?: string | null
          ai_risk_score?: number | null
          ai_summary?: string | null
          created_at?: string
          id?: string
          parsed_data?: Json
          updated_at?: string
          uploaded_by?: string | null
          user_id: string
        }
        Update: {
          ai_flags?: Json | null
          ai_generated_at?: string | null
          ai_risk_score?: number | null
          ai_summary?: string | null
          created_at?: string
          id?: string
          parsed_data?: Json
          updated_at?: string
          uploaded_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number | null
          category: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          name: string
          preparation_instructions: string | null
          preparation_required: boolean | null
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          category: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          preparation_instructions?: string | null
          preparation_required?: boolean | null
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          preparation_instructions?: string | null
          preparation_required?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      specialist_availability: {
        Row: {
          created_at: string
          date: string
          end_time: string
          id: string
          is_available: boolean | null
          reason: string | null
          specialist_id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          date: string
          end_time: string
          id?: string
          is_available?: boolean | null
          reason?: string | null
          specialist_id: string
          start_time: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          is_available?: boolean | null
          reason?: string | null
          specialist_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "specialist_availability_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "specialists"
            referencedColumns: ["id"]
          },
        ]
      }
      specialist_services: {
        Row: {
          created_at: string
          custom_duration: number | null
          custom_price: number | null
          id: string
          is_available: boolean | null
          notes: string | null
          service_id: string
          specialist_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_duration?: number | null
          custom_price?: number | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          service_id: string
          specialist_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_duration?: number | null
          custom_price?: number | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          service_id?: string
          specialist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "specialist_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specialist_services_specialist_id_fkey"
            columns: ["specialist_id"]
            isOneToOne: false
            referencedRelation: "specialists"
            referencedColumns: ["id"]
          },
        ]
      }
      specialists: {
        Row: {
          available_days: string[] | null
          available_hours: Json | null
          bio: string | null
          booking_advance_days: number | null
          consultation_duration: number | null
          consultation_fee: number | null
          created_at: string
          experience_years: number | null
          id: string
          is_active: boolean | null
          qualifications: string[] | null
          specialty: string
          updated_at: string
          user_id: string
        }
        Insert: {
          available_days?: string[] | null
          available_hours?: Json | null
          bio?: string | null
          booking_advance_days?: number | null
          consultation_duration?: number | null
          consultation_fee?: number | null
          created_at?: string
          experience_years?: number | null
          id?: string
          is_active?: boolean | null
          qualifications?: string[] | null
          specialty: string
          updated_at?: string
          user_id: string
        }
        Update: {
          available_days?: string[] | null
          available_hours?: Json | null
          bio?: string | null
          booking_advance_days?: number | null
          consultation_duration?: number | null
          consultation_fee?: number | null
          created_at?: string
          experience_years?: number | null
          id?: string
          is_active?: boolean | null
          qualifications?: string[] | null
          specialty?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      telemedicine_sessions: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          appointment_id: string | null
          created_at: string
          doctor_id: string | null
          doctor_rating: number | null
          duration_minutes: number | null
          id: string
          patient_rating: number | null
          recording_url: string | null
          room_id: string | null
          scheduled_start: string
          session_notes: string | null
          session_type: string
          session_url: string | null
          status: string
          technical_issues: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          appointment_id?: string | null
          created_at?: string
          doctor_id?: string | null
          doctor_rating?: number | null
          duration_minutes?: number | null
          id?: string
          patient_rating?: number | null
          recording_url?: string | null
          room_id?: string | null
          scheduled_start: string
          session_notes?: string | null
          session_type?: string
          session_url?: string | null
          status?: string
          technical_issues?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          appointment_id?: string | null
          created_at?: string
          doctor_id?: string | null
          doctor_rating?: number | null
          duration_minutes?: number | null
          id?: string
          patient_rating?: number | null
          recording_url?: string | null
          room_id?: string | null
          scheduled_start?: string
          session_notes?: string | null
          session_type?: string
          session_url?: string | null
          status?: string
          technical_issues?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      test_results: {
        Row: {
          ai_interpretation: Json | null
          ai_summary: string | null
          clinic_name: string | null
          comparison_notes: string | null
          created_at: string
          doctor_name: string | null
          doctor_notes: string | null
          doctor_reviewed: boolean | null
          file_url: string | null
          flagged_values: Json | null
          id: string
          order_id: string | null
          reference_ranges: Json
          report_pdf_url: string | null
          result_status: string | null
          result_values: Json
          review_date: string | null
          status: string
          test_date: string
          test_name: string
          test_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_interpretation?: Json | null
          ai_summary?: string | null
          clinic_name?: string | null
          comparison_notes?: string | null
          created_at?: string
          doctor_name?: string | null
          doctor_notes?: string | null
          doctor_reviewed?: boolean | null
          file_url?: string | null
          flagged_values?: Json | null
          id?: string
          order_id?: string | null
          reference_ranges?: Json
          report_pdf_url?: string | null
          result_status?: string | null
          result_values?: Json
          review_date?: string | null
          status?: string
          test_date: string
          test_name: string
          test_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_interpretation?: Json | null
          ai_summary?: string | null
          clinic_name?: string | null
          comparison_notes?: string | null
          created_at?: string
          doctor_name?: string | null
          doctor_notes?: string | null
          doctor_reviewed?: boolean | null
          file_url?: string | null
          flagged_values?: Json | null
          id?: string
          order_id?: string | null
          reference_ranges?: Json
          report_pdf_url?: string | null
          result_status?: string | null
          result_values?: Json
          review_date?: string | null
          status?: string
          test_date?: string
          test_name?: string
          test_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_mfa: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          enabled: boolean | null
          id: string
          last_used: string | null
          secret: string
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          last_used?: string | null
          secret: string
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          last_used?: string | null
          secret?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      messages_decrypted: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          read_at: string | null
          recipient_id: string | null
          related_result_id: string | null
          sender_id: string | null
          updated_at: string | null
        }
        Insert: {
          content?: never
          created_at?: string | null
          id?: string | null
          read_at?: string | null
          recipient_id?: string | null
          related_result_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: never
          created_at?: string | null
          id?: string | null
          read_at?: string | null
          recipient_id?: string | null
          related_result_id?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_messages_related_result"
            columns: ["related_result_id"]
            isOneToOne: false
            referencedRelation: "patient_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_messages_related_result"
            columns: ["related_result_id"]
            isOneToOne: false
            referencedRelation: "results"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_results: {
        Row: {
          ai_generated_at: string | null
          ai_summary: string | null
          created_at: string | null
          id: string | null
          parsed_data: Json | null
          updated_at: string | null
          uploaded_by: string | null
          user_id: string | null
        }
        Insert: {
          ai_generated_at?: string | null
          ai_summary?: string | null
          created_at?: string | null
          id?: string | null
          parsed_data?: Json | null
          updated_at?: string | null
          uploaded_by?: string | null
          user_id?: string | null
        }
        Update: {
          ai_generated_at?: string | null
          ai_summary?: string | null
          created_at?: string | null
          id?: string | null
          parsed_data?: Json | null
          updated_at?: string | null
          uploaded_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_admin_role: {
        Args: { user_email: string }
        Returns: Json
      }
      create_notification: {
        Args: {
          _action_label?: string
          _action_url?: string
          _category?: string
          _data?: Json
          _message: string
          _title: string
          _type?: string
          _user_id: string
        }
        Returns: string
      }
      create_super_admin: {
        Args: {
          admin_email: string
          admin_name: string
          admin_password: string
        }
        Returns: Json
      }
      decode_message_content: {
        Args: { encoded_content: string }
        Returns: string
      }
      decrypt_message_content: {
        Args: { encrypted_content: string }
        Returns: string
      }
      encode_message_content: {
        Args: { content_text: string }
        Returns: string
      }
      encrypt_message_content: {
        Args: { content_text: string }
        Returns: string
      }
      export_user_data: {
        Args: { _user_id: string }
        Returns: Json
      }
      get_upcoming_appointments: {
        Args: { _user_id: string }
        Returns: {
          appointment_date: string
          appointment_type: string
          duration_minutes: number
          id: string
          specialist_name: string
          specialist_specialty: string
          status: string
        }[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: {
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_gdpr_action: {
        Args: {
          _action: string
          _data_category?: string
          _ip_address?: unknown
          _record_id?: string
          _table_name?: string
          _user_agent?: string
          _user_id: string
        }
        Returns: string
      }
      log_message_action: {
        Args: { _action: string; _actor_id: string; _message_id: string }
        Returns: undefined
      }
      process_gdpr_deletion: {
        Args: { _user_id: string }
        Returns: Json
      }
      update_health_goal_progress: {
        Args: { _current_value: number; _goal_id: string }
        Returns: undefined
      }
      withdraw_consent: {
        Args: { _consent_type: string; _user_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "patient" | "doctor" | "admin" | "clinic_staff"
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
      app_role: ["patient", "doctor", "admin", "clinic_staff"],
    },
  },
} as const
