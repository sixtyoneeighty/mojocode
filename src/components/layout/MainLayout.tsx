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
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  return (
    <div className="h-screen flex flex-col bg-slate-900">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <ProjectSidebar />
        
        {isMobile ? (
          // Mobile: Show one panel at a time
          <div className="flex-1">
            {activePanel === 'chat' && <ChatPanel />}
            {activePanel === 'editor' && <EditorPanel />}
            {activePanel === 'preview' && <PreviewPanel />}
          </div>
        ) : (
          // Desktop: Show all three panels
          <div className="flex-1 grid grid-cols-3 gap-0">
            <div className="border-r border-slate-700">
              <ChatPanel />
            </div>
            <div className="border-r border-slate-700">
              <EditorPanel />
            </div>
            <div>
              <PreviewPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};