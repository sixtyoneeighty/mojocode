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
  toolCalls?: ToolCall[];
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
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  id: string;
  name: string;
  parameters: Record<string, any>;
  result?: any;
  status?: 'pending' | 'completed' | 'failed' | 'needs_confirmation';
  impact_level?: 'low' | 'medium' | 'high';
  reason?: string;
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

// MCP Tool Types
export interface MCPTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required: string[];
    };
  };
}

export interface Context7Request {
  libraryName: string;
  topic?: string;
  tokens?: number;
}

export interface FirecrawlRequest {
  url?: string;
  urls?: string[];
  query?: string;
  formats?: string[];
  onlyMainContent?: boolean;
  limit?: number;
}

export interface TavilyRequest {
  query: string;
  search_depth?: 'basic' | 'advanced';
  include_domains?: string[];
  max_results?: number;
  urls?: string[];
  extract_type?: 'content' | 'summary' | 'key_points';
}

export interface SupabaseRequest {
  operation: 'query_suggestion' | 'schema_design' | 'optimization' | 'migration';
  context: string;
  table_name?: string;
}

// Autonomous File Operation Types
export interface FileOperationRequest {
  path: string;
  content?: string;
  edits?: FileEdit[];
  reason: string;
  impact_level: 'low' | 'medium' | 'high';
}

export interface FileEdit {
  start_line: number;
  end_line: number;
  new_content: string;
}

export interface ProjectStructure {
  [key: string]: string | ProjectStructure;
}

export interface SafeCommandRequest {
  command: string;
  working_directory?: string;
  reason: string;
  risk_level: 'safe' | 'moderate' | 'risky';
}

export interface ConfirmationRequest {
  action: string;
  impact: string;
  alternatives?: string[];
}