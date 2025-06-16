import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { User, Bot, Copy, Check, AlertTriangle, CheckCircle, Info, FileText, Terminal, Settings } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  message: {
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
  };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedTools, setExpandedTools] = useState<Set<number>>(new Set());

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleToolExpansion = (index: number) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTools(newExpanded);
  };

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'write_file':
      case 'edit_file':
      case 'create_project_structure':
        return <FileText className="w-4 h-4" />;
      case 'run_safe_command':
        return <Terminal className="w-4 h-4" />;
      case 'request_user_confirmation':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'needs_confirmation':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'pending':
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500/30 bg-green-500/10';
      case 'failed':
        return 'border-red-500/30 bg-red-500/10';
      case 'needs_confirmation':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'pending':
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <div className={`flex space-x-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {message.role === 'assistant' && (
        <div className="flex-shrink-0">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
      
      <div className={`max-w-3xl ${message.role === 'user' ? 'order-first' : ''}`}>
        <div className={`p-4 rounded-lg ${
          message.role === 'user' 
            ? 'bg-indigo-600 text-white ml-auto' 
            : 'bg-slate-800 text-gray-100'
        }`}>
          {message.role === 'user' ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeString = String(children).replace(/\n$/, '');
                  
                  return !inline && match ? (
                    <div className="relative group">
                      <button
                        onClick={() => copyToClipboard(codeString)}
                        className="absolute top-2 right-2 p-2 bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Copy code"
                      >
                        {copiedCode === codeString ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-md"
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-slate-700 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Tool Operations Display */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.toolCalls.map((tool, index) => (
              <div
                key={index}
                className={`border rounded-lg p-3 ${getStatusColor(tool.status)}`}
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleToolExpansion(index)}
                >
                  <div className="flex items-center space-x-2">
                    {getToolIcon(tool.name)}
                    <span className="text-sm font-medium text-gray-200">
                      {tool.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    {getStatusIcon(tool.status)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {expandedTools.has(index) ? 'Hide Details' : 'Show Details'}
                  </div>
                </div>

                {expandedTools.has(index) && (
                  <div className="mt-3 space-y-2">
                    {/* Parameters */}
                    <div>
                      <div className="text-xs font-medium text-gray-300 mb-1">Parameters:</div>
                      <div className="bg-slate-900/50 rounded p-2 text-xs">
                        <pre className="text-gray-300 whitespace-pre-wrap">
                          {JSON.stringify(tool.parameters, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Result */}
                    {tool.result && (
                      <div>
                        <div className="text-xs font-medium text-gray-300 mb-1">Result:</div>
                        <div className="bg-slate-900/50 rounded p-2 text-xs">
                          <pre className="text-gray-300 whitespace-pre-wrap">
                            {typeof tool.result === 'string' ? tool.result : JSON.stringify(tool.result, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Status-specific content */}
                    {tool.status === 'needs_confirmation' && (
                      <div className="flex space-x-2 mt-2">
                        <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors">
                          Deny
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className={`text-xs text-gray-500 mt-1 ${
          message.role === 'user' ? 'text-right' : 'text-left'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>

      {message.role === 'user' && (
        <div className="flex-shrink-0">
          <div className="p-2 bg-slate-700 rounded-lg">
            <User className="w-5 h-5 text-gray-300" />
          </div>
        </div>
      )}
    </div>
  );
};