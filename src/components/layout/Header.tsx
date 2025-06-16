import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { supabase } from '../../lib/supabase';
import { Sparkles, User, LogOut, Settings, Menu, Code2, Home } from 'lucide-react';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const { user, activePanel, setActivePanel, isMobile, currentProject, setCurrentProject, setActiveFile } = useAppStore();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleBackToLanding = () => {
    setCurrentProject(null);
    setActiveFile(null);
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MojoCode</h1>
              <p className="text-xs text-gray-400">AI-Powered App Development</p>
            </div>
          </div>

          {/* Back to Landing Button */}
          {currentProject && (
            <button
              onClick={handleBackToLanding}
              className="flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
              title="Back to app generation"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">New App</span>
            </button>
          )}
          
          {/* Mobile Navigation */}
          {isMobile && currentProject && (
            <div className="flex items-center space-x-1 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActivePanel('chat')}
                className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                  activePanel === 'chat'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActivePanel('editor')}
                className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                  activePanel === 'editor'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActivePanel('preview')}
                className={`px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                  activePanel === 'preview'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                Preview
              </button>
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-white">
              {user?.email?.split('@')[0]}
            </div>
            <div className="text-xs text-gray-400">
              Pro Plan
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              className="p-2.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleLogout}
              className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all duration-200"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};