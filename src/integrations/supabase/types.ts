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
      analytics_logs: {
        Row: {
          error_message: string | null
          id: string
          query_params: Json | null
          query_type: string
          response_time: number | null
          status: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          error_message?: string | null
          id?: string
          query_params?: Json | null
          query_type: string
          response_time?: number | null
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          error_message?: string | null
          id?: string
          query_params?: Json | null
          query_type?: string
          response_time?: number | null
          status?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auth_logs: {
        Row: {
          auth_method: string | null
          created_at: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          auth_method?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          auth_method?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      case_assignments: {
        Row: {
          assigned_by: string | null
          case_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_by?: string | null
          case_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_by?: string | null
          case_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_assignments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_comments: {
        Row: {
          case_id: string | null
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          case_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          case_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_comments_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_folders: {
        Row: {
          created_at: string | null
          id: string
          name: string
          parent_folder_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          parent_folder_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          parent_folder_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_folders_parent_folder_id_fkey"
            columns: ["parent_folder_id"]
            isOneToOne: false
            referencedRelation: "case_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      case_milestones: {
        Row: {
          case_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          case_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          case_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_milestones_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_outcomes: {
        Row: {
          case_id: string | null
          created_at: string | null
          id: string
          outcome_type: string
          resolution_date: string | null
          resolution_details: string | null
          updated_at: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          outcome_type: string
          resolution_date?: string | null
          resolution_details?: string | null
          updated_at?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          outcome_type?: string
          resolution_date?: string | null
          resolution_details?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_outcomes_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_permissions: {
        Row: {
          case_id: string | null
          created_at: string | null
          granted_by: string | null
          id: string
          permission: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_permissions_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          client_id: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          folder_id: string | null
          id: string
          involved_parties: Json | null
          is_task: boolean | null
          metadata: Json | null
          priority_level: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          folder_id?: string | null
          id?: string
          involved_parties?: Json | null
          is_task?: boolean | null
          metadata?: Json | null
          priority_level?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          folder_id?: string | null
          id?: string
          involved_parties?: Json | null
          is_task?: boolean | null
          metadata?: Json | null
          priority_level?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "case_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_client"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_referrals: {
        Row: {
          id: string
          notes: string | null
          referral_date: string | null
          referred_client_id: string | null
          referring_client_id: string | null
          status: string | null
        }
        Insert: {
          id?: string
          notes?: string | null
          referral_date?: string | null
          referred_client_id?: string | null
          referring_client_id?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          notes?: string | null
          referral_date?: string | null
          referred_client_id?: string | null
          referring_client_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_referrals_referred_client_id_fkey"
            columns: ["referred_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_referrals_referring_client_id_fkey"
            columns: ["referring_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      document_audit_logs: {
        Row: {
          action_type: string
          created_at: string | null
          document_id: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_audit_logs_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      document_folders: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      document_permissions: {
        Row: {
          created_at: string | null
          document_id: string | null
          granted_by: string | null
          id: string
          permission: Database["public"]["Enums"]["document_permission"]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          granted_by?: string | null
          id?: string
          permission: Database["public"]["Enums"]["document_permission"]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          granted_by?: string | null
          id?: string
          permission?: Database["public"]["Enums"]["document_permission"]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_permissions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          description: string | null
          file_path: string
          file_size: number
          file_type: string
          folder_id: string | null
          id: string
          title: string
          updated_at: string | null
          uploader_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_path: string
          file_size: number
          file_type: string
          folder_id?: string | null
          id?: string
          title: string
          updated_at?: string | null
          uploader_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_path?: string
          file_size?: number
          file_type?: string
          folder_id?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          uploader_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "document_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      extended_profiles: {
        Row: {
          avatar_url: string | null
          bar_number: string | null
          created_at: string | null
          email_notifications: boolean | null
          emergency_contact: Json | null
          firm_details: Json | null
          full_name: string | null
          id: string
          jurisdictions: string[] | null
          language: string | null
          phone_number: string | null
          sms_notifications: boolean | null
          specializations: string[] | null
          timezone: string | null
          two_factor_enabled: boolean | null
          two_factor_method: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bar_number?: string | null
          created_at?: string | null
          email_notifications?: boolean | null
          emergency_contact?: Json | null
          firm_details?: Json | null
          full_name?: string | null
          id: string
          jurisdictions?: string[] | null
          language?: string | null
          phone_number?: string | null
          sms_notifications?: boolean | null
          specializations?: string[] | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bar_number?: string | null
          created_at?: string | null
          email_notifications?: boolean | null
          emergency_contact?: Json | null
          firm_details?: Json | null
          full_name?: string | null
          id?: string
          jurisdictions?: string[] | null
          language?: string | null
          phone_number?: string | null
          sms_notifications?: boolean | null
          specializations?: string[] | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          two_factor_method?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_templates: {
        Row: {
          created_at: string | null
          id: string
          name: string
          template: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          template: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          template?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          due_date: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          stripe_invoice_id: string | null
          template_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          stripe_invoice_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          stripe_invoice_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "invoice_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      message_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          message_id: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          message_id?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          message_id?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_requests: {
        Row: {
          created_at: string | null
          id: string
          recipient_id: string | null
          requester_id: string | null
          status: Database["public"]["Enums"]["message_request_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipient_id?: string | null
          requester_id?: string | null
          status?: Database["public"]["Enums"]["message_request_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipient_id?: string | null
          requester_id?: string | null
          status?: Database["public"]["Enums"]["message_request_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          receiver_id: string | null
          recipient_email: string | null
          sender_id: string | null
          status: Database["public"]["Enums"]["message_status"] | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          receiver_id?: string | null
          recipient_email?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          receiver_id?: string | null
          recipient_email?: string | null
          sender_id?: string | null
          status?: Database["public"]["Enums"]["message_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      role_change_requests: {
        Row: {
          created_at: string | null
          id: string
          requested_role: Database["public"]["Enums"]["user_role"]
          review_notes: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          requested_role: Database["public"]["Enums"]["user_role"]
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          requested_role?: Database["public"]["Enums"]["user_role"]
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      task_history: {
        Row: {
          case_id: string | null
          change_type: string
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          user_id: string | null
        }
        Insert: {
          case_id?: string | null
          change_type: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Update: {
          case_id?: string | null
          change_type?: string
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_history_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          billable: boolean | null
          billed: boolean | null
          billing_status: string | null
          case_id: string | null
          client_id: string | null
          clockify_id: string | null
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          end_time: string | null
          hourly_rate: number | null
          id: string
          start_time: string
          status: Database["public"]["Enums"]["time_entry_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billable?: boolean | null
          billed?: boolean | null
          billing_status?: string | null
          case_id?: string | null
          client_id?: string | null
          clockify_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          start_time: string
          status?: Database["public"]["Enums"]["time_entry_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billable?: boolean | null
          billed?: boolean | null
          billing_status?: string | null
          case_id?: string | null
          client_id?: string | null
          clockify_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["time_entry_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entry_billing: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string | null
          time_entry_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          time_entry_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          time_entry_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entry_billing_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entry_billing_time_entry_id_fkey"
            columns: ["time_entry_id"]
            isOneToOne: false
            referencedRelation: "time_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entry_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          id: string
          time_entry_id: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          time_entry_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          time_entry_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_entry_logs_time_entry_id_fkey"
            columns: ["time_entry_id"]
            isOneToOne: false
            referencedRelation: "time_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
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
      document_permission: "read" | "write"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      message_request_status: "pending" | "accepted" | "rejected"
      message_status: "sent" | "delivered" | "read"
      time_entry_status: "running" | "completed" | "paused"
      user_role: "client" | "lawyer" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
