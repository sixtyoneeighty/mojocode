/*
  # Create chat tables

  1. New Tables
    - `chat_threads`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key to profiles)
    - `chat_messages`
      - `id` (uuid, primary key)
      - `role` (text, enum: user, assistant, system)
      - `content` (text, required)
      - `timestamp` (timestamp)
      - `thread_id` (uuid, foreign key to chat_threads)
      - `project_id` (uuid, optional foreign key to projects)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own threads/messages
*/

-- Chat threads table
CREATE TABLE IF NOT EXISTS chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chat threads"
  ON chat_threads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat threads"
  ON chat_threads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat threads"
  ON chat_threads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat threads"
  ON chat_threads
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  thread_id uuid NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read messages from own threads"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads ct 
      WHERE ct.id = chat_messages.thread_id 
      AND ct.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in own threads"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_threads ct 
      WHERE ct.id = chat_messages.thread_id 
      AND ct.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages in own threads"
  ON chat_messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads ct 
      WHERE ct.id = chat_messages.thread_id 
      AND ct.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from own threads"
  ON chat_messages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_threads ct 
      WHERE ct.id = chat_messages.thread_id 
      AND ct.user_id = auth.uid()
    )
  );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS chat_threads_user_id_idx ON chat_threads(user_id);
CREATE INDEX IF NOT EXISTS chat_threads_updated_at_idx ON chat_threads(updated_at DESC);
CREATE INDEX IF NOT EXISTS chat_messages_thread_id_idx ON chat_messages(thread_id);
CREATE INDEX IF NOT EXISTS chat_messages_timestamp_idx ON chat_messages(timestamp DESC);