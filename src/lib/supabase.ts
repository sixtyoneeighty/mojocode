import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          files: any;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          files?: any;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          files?: any;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      chat_threads: {
        Row: {
          id: string;
          title: string;
          created_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          role: string;
          content: string;
          timestamp: string;
          thread_id: string;
          project_id: string | null;
        };
        Insert: {
          id?: string;
          role: string;
          content: string;
          timestamp?: string;
          thread_id: string;
          project_id?: string | null;
        };
        Update: {
          id?: string;
          role?: string;
          content?: string;
          timestamp?: string;
          thread_id?: string;
          project_id?: string | null;
        };
      };
    };
  };
};