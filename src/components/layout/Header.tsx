import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { supabase } from '../../lib/supabase';
import { Sparkles, User, LogOut, Settings, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const { user, activePanel, setActivePanel, isMobile } = useAppStore();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">MojoCode</h1>
          </div>
          
          {isMobile && (
            <div className="flex space-x-1">
              <button
                onClick={() => setActivePanel('chat')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activePanel === 'chat'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActivePanel('editor')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activePanel === 'editor'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActivePanel('preview')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activePanel === 'preview'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Preview
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-300">
            {user?.email}
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
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