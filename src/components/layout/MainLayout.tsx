import React, { useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Header } from './Header';
import { ProjectSidebar } from '../sidebar/ProjectSidebar';
import { ChatPanel } from '../chat/ChatPanel';
import { EditorPanel } from '../editor/EditorPanel';
import { PreviewPanel } from '../preview/PreviewPanel';

export const MainLayout: React.FC = () => {
  const { activePanel, isMobile, setIsMobile } = useAppStore();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Changed from 768 to 1024 for better tablet support
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Project Sidebar - Always visible on desktop */}
        {!isMobile && (
          <div className="w-72 flex-shrink-0">
            <ProjectSidebar />
          </div>
        )}
        
        {isMobile ? (
          // Mobile: Show one panel at a time with better styling
          <div className="flex-1 flex flex-col">
            {activePanel === 'chat' && <ChatPanel />}
            {activePanel === 'editor' && <EditorPanel />}
            {activePanel === 'preview' && <PreviewPanel />}
          </div>
        ) : (
          // Desktop: Show main content area with proper spacing
          <div className="flex-1 flex">
            {/* Chat Panel */}
            <div className="w-96 flex-shrink-0 border-r border-slate-700/50">
              <ChatPanel />
            </div>
            
            {/* Editor Panel */}
            <div className="flex-1 border-r border-slate-700/50">
              <EditorPanel />
            </div>
            
            {/* Preview Panel */}
            <div className="w-96 flex-shrink-0">
              <PreviewPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};