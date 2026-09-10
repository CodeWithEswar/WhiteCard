export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type DocumentSpace = 'government' | 'student'
export type DocumentStatus = 'active' | 'archived'
export type AppearanceMode = 'system' | 'light' | 'dark'
export type ActivityAction =
  | 'uploaded'
  | 'updated'
  | 'downloaded'
  | 'shared'
  | 'share_revoked'
  | 'deleted'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          space: DocumentSpace
          title: string
          original_name: string
          storage_bucket: string
          storage_path: string
          mime_type: string | null
          extension: string | null
          size_bytes: number
          category: string | null
          notes: string | null
          view_count: number
          click_count: number
          issued_on: string | null
          expires_on: string | null
          status: DocumentStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          space: DocumentSpace
          title: string
          original_name: string
          storage_bucket?: string
          storage_path: string
          mime_type?: string | null
          extension?: string | null
          size_bytes: number
          category?: string | null
          notes?: string | null
          view_count?: number
          click_count?: number
          issued_on?: string | null
          expires_on?: string | null
          status?: DocumentStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          space?: DocumentSpace
          title?: string
          original_name?: string
          storage_bucket?: string
          storage_path?: string
          mime_type?: string | null
          extension?: string | null
          size_bytes?: number
          category?: string | null
          notes?: string | null
          view_count?: number
          click_count?: number
          issued_on?: string | null
          expires_on?: string | null
          status?: DocumentStatus
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color_key: string
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color_key: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color_key?: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      document_tags: {
        Row: {
          document_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          document_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          document_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      share_links: {
        Row: {
          id: string
          document_id: string
          owner_id: string
          token_hash: string
          view_count: number
          click_count: number
          expires_at: string
          revoked_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          owner_id: string
          token_hash: string
          view_count?: number
          click_count?: number
          expires_at: string
          revoked_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          owner_id?: string
          token_hash?: string
          view_count?: number
          click_count?: number
          expires_at?: string
          revoked_at?: string | null
          created_at?: string
        }
      }
      activity_events: {
        Row: {
          id: string
          user_id: string
          document_id: string | null
          action: ActivityAction
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document_id?: string | null
          action: ActivityAction
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          document_id?: string | null
          action?: ActivityAction
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          theme_id: string
          appearance: AppearanceMode
          default_document_view: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme_id?: string
          appearance?: AppearanceMode
          default_document_view?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme_id?: string
          appearance?: AppearanceMode
          default_document_view?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      create_document_share: {
        Args: {
          p_document_id: string
          p_duration_days?: number
        }
        Returns: {
          share_id: string
          raw_token: string
          expires_at: string
        }[]
      }
      increment_document_view: {
        Args: {
          p_document_id: string
        }
        Returns: void
      }
      increment_document_click: {
        Args: {
          p_document_id: string
        }
        Returns: void
      }
    }
  }
}
