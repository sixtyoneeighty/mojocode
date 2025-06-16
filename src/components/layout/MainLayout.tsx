import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Header } from './Header';
import { ProjectSidebar } from '../sidebar/ProjectSidebar';
import { ChatPanel } from '../chat/ChatPanel';
import { EditorPanel } from '../editor/EditorPanel';
import { PreviewPanel } from '../preview/PreviewPanel';
import { AppGenerationLanding } from '../generation/AppGenerationLanding';

export const MainLayout: React.FC = () => {
  const { activePanel, isMobile, setIsMobile, currentProject } = useAppStore();
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  // Show landing page if no project is selected
  useEffect(() => {
    setShowLanding(!currentProject);
  }, [currentProject]);

  const handleProjectCreated = () => {
    setShowLanding(false);
  };

  // Show landing page for app generation
  if (showLanding) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <div className="flex-1">
          <AppGenerationLanding onProjectCreated={handleProjectCreated} />
        </div>
      </div>
    );
  }

  // Main IDE layout when project is selected
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
          // Mobile: Show one panel at a time
          <div className="flex-1 flex flex-col">
            {activePanel === 'chat' && <ChatPanel />}
            {activePanel === 'editor' && <EditorPanel />}
            {activePanel === 'preview' && <PreviewPanel />}
          </div>
        ) : (
          // Desktop: Show main content area
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