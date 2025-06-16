import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { useAppStore } from './stores/useAppStore';
import { AuthForm } from './components/auth/AuthForm';
import { MainLayout } from './components/layout/MainLayout';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';

function App() {
  const { user, setUser, setLoading } = useAppStore();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setInitialLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser, setLoading]);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4 inline-block">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <p className="text-white text-lg">Loading MojoCode...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? <MainLayout /> : <AuthForm />}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #475569',
          },
        }}
      />
    </>
  );
}

export default App;