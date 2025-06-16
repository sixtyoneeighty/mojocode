import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { aiService } from '../../services/aiService';
import { ChatMessage } from './ChatMessage';
import { Send, Bot, Loader, Sparkles, Search, Globe, Database, FileText, Wrench, AlertCircle } from 'lucide-react';
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
    toolCalls?: Array<{
      name: string;
      parameters: any;
      result?: any;
      status?: 'pending' | 'completed' | 'failed' | 'needs_confirmation';
    }>;
  }>>([
    {
      id: '1',
      role: 'assistant',
      content: `🚀 **Welcome to MojoCode AI - Enhanced with Autonomous Capabilities!** 

I'm your intelligent coding assistant with advanced autonomous powers:

**🔧 Core Capabilities:**
- Write and explain code in any language
- Generate complete applications and components
- Debug and optimize your code
- Provide architectural guidance

**🤖 NEW: Autonomous Operations**
- **File Management**: I can create, edit, and organize files directly
- **Smart Automation**: Handle routine tasks automatically
- **Transparent Communication**: I'll always explain what I'm doing and why
- **Impact Assessment**: I'll ask for confirmation on significant changes

**🌐 Enhanced Research Tools:**
- **Context7**: Get the latest documentation for any library/framework
- **Tavily**: Research topics with AI-powered web search
- **Firecrawl**: Extract and analyze content from websites
- **Supabase**: Database design and query assistance

**💡 What I Can Do Autonomously:**
- Create new files and project structures (✅ Auto)
- Install safe dependencies (✅ Auto)
- Make small code improvements (✅ Auto)
- Major refactoring or deletions (⚠️ Asks Permission)
- Risky terminal commands (⚠️ Asks Permission)

**💬 Communication Promise:**
I'll always tell you what I'm doing, why I'm doing it, and get your approval for anything that could significantly impact your project.

Ready to build something amazing together?`,
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
    },
    {
      icon: <Wrench className="w-4 h-4" />,
      label: "Auto-Fix Code",
      prompt: "Analyze my current code and automatically fix any issues you find"
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
        timestamp: new Date().toISOString(),
        toolCalls: response.toolCalls || []
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
              {isTyping ? 'Working autonomously...' : 'Enhanced with autonomous capabilities'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Autonomous Status Indicator */}
          <div className="flex items-center space-x-1 px-2 py-1 bg-slate-800 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Autonomous</span>
          </div>
          
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Quick Actions"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showQuickActions && (
        <div className="p-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center space-x-2 mb-3">
            <Wrench className="w-4 h-4 text-indigo-400" />
            <p className="text-sm text-gray-300">Quick Actions (Autonomous Capabilities):</p>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.prompt)}
                className="flex items-center space-x-2 p-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-left"
              >
                {action.icon}
                <span className="text-sm text-gray-300">{action.label}</span>
                {action.label.includes('Auto') && (
                  <span className="text-xs bg-green-600 text-white px-1 rounded">AUTO</span>
                )}
              </button>
            ))}
          </div>
          <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-300 text-xs">
              <AlertCircle className="w-3 h-3" />
              <span>I'll automatically handle safe operations and ask permission for risky changes</span>
            </div>
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
              <span className="text-gray-300">AI is working autonomously with enhanced tools...</span>
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
              placeholder="I can now create files, run commands, and work autonomously! What should we build?"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              disabled={isTyping}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Wrench className="w-3 h-3" />
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
              <span>o4-mini + o3</span>
            </span>
            <span>•</span>
            <span>Autonomous operations</span>
            <span>•</span>
            <span>MCP enhanced</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Wrench className="w-3 h-3" />
              <span>File operations enabled</span>
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};