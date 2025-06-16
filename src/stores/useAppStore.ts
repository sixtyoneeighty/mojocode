import { create } from 'zustand';
import { User, Project, ChatThread, ProjectFile, AppState, PanelType } from '../types';

interface AppStore extends AppState {
  // Actions
  setUser: (user: User | null) => void;
  setCurrentProject: (project: Project | null) => void;
  setCurrentThread: (thread: ChatThread | null) => void;
  setActiveFile: (file: ProjectFile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActivePanel: (panel: PanelType) => void;
  setIsMobile: (isMobile: boolean) => void;
  updateFileContent: (fileId: string, content: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  user: null,
  currentProject: null,
  currentThread: null,
  activeFile: null,
  isLoading: false,
  error: null,
  activePanel: 'chat',
  isMobile: false,

  // Actions
  setUser: (user) => set({ user }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentThread: (thread) => set({ currentThread: thread }),
  setActiveFile: (file) => set({ activeFile: file }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setActivePanel: (activePanel) => set({ activePanel }),
  setIsMobile: (isMobile) => set({ isMobile }),
  
  updateFileContent: (fileId, content) => {
    const { currentProject } = get();
    if (!currentProject) return;
    
    const updatedFiles = currentProject.files.map(file =>
      file.id === fileId ? { ...file, content } : file
    );
    
    set({
      currentProject: { ...currentProject, files: updatedFiles },
      activeFile: updatedFiles.find(f => f.id === fileId) || null
    });
  },
}));