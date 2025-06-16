export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  files: ProjectFile[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  project_id?: string;
}

export interface ChatThread {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface AIResponse {
  content: string;
  code?: string;
  language?: string;
  suggestions?: string[];
}

export type PanelType = 'chat' | 'editor' | 'preview';

export interface AppState {
  user: User | null;
  currentProject: Project | null;
  currentThread: ChatThread | null;
  activeFile: ProjectFile | null;
  isLoading: boolean;
  error: string | null;
  activePanel: PanelType;
  isMobile: boolean;
}