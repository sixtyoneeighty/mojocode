import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { aiService } from '../../services/aiService';
import { ChatMessage } from './ChatMessage';
import { Send, Bot, Loader, Sparkles, Search, Globe, Database, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const ChatPanel: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>>([
    {
      id: '1',
      role: 'assistant',
      content: `🚀 **Welcome to MojoCode AI!** 

I'm your intelligent coding assistant with superpowers:

**🔧 Core Capabilities:**
- Write and explain code in any language
- Generate complete applications and components
- Debug and optimize your code
- Provide architectural guidance

**🌐 Enhanced Tools:**
- **Context7**: Get the latest documentation for any library/framework
- **Tavily**: Research topics with AI-powered web search
- **Firecrawl**: Extract and analyze content from websites
- **Supabase**: Database design and query assistance

**💡 Quick Actions:** Try these commands:
- "Research the latest React 18 features"
- "Analyze this website: [URL]"
- "Get documentation for Next.js routing"
- "Help me design a user authentication database"

What would you like to build today?`,
      timestamp: new Date().toISOString()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentProject, activeFile } = useAppStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    {
      icon: <Search className="w-4 h-4" />,
      label: "Research Topic",
      prompt: "Research the latest trends in "
    },
    {
      icon: <Globe className="w-4 h-4" />,
      label: "Analyze Website", 
      prompt: "Analyze this website: "
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Get Docs",
      prompt: "Get documentation for "
    },
    {
      icon: <Database className="w-4 h-4" />,
      label: "Database Help",
      prompt: "Help me design a database for "
    }
  ];

  const handleQuickAction = (prompt: string) => {
    setMessage(prompt);
    setShowQuickActions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const context = activeFile 
        ? `Current file: ${activeFile.name} (${activeFile.language})\n${activeFile.content}`
        : currentProject
        ? `Current project: ${currentProject.name}\nFiles: ${currentProject.files.map(f => f.name).join(', ')}`
        : '';

      const response = await aiService.generateCode(message, context);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response.content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">MojoCode AI</h2>
            <p className="text-sm text-gray-400">
              {isTyping ? 'Processing with AI tools...' : 'Enhanced with MCP servers'}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Quick Actions"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      {showQuickActions && (
        <div className="p-4 border-b border-slate-700 bg-slate-800">
          <p className="text-sm text-gray-300 mb-3">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.prompt)}
                className="flex items-center space-x-2 p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-left"
              >
                {action.icon}
                <span className="text-sm text-gray-300">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-3 p-4 bg-slate-800 rounded-lg">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <Loader className="w-4 h-4 animate-spin text-indigo-400" />
              <span className="text-gray-300">AI is analyzing with enhanced tools...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything... I have access to real-time docs, web search, and more!"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isTyping}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Search className="w-3 h-3" />
                <Globe className="w-3 h-3" />
                <FileText className="w-3 h-3" />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isTyping}
            className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center justify-center mt-2">
          <div className="text-xs text-gray-500 flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>o4-mini</span>
            </span>
            <span>•</span>
            <span>High reasoning</span>
            <span>•</span>
            <span>MCP enhanced</span>
          </div>
        </div>
      </form>
    </div>
  );
};