import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { RefreshCw, ExternalLink, Monitor, Smartphone, Tablet, Eye } from 'lucide-react';

export const PreviewPanel: React.FC = () => {
  const { currentProject } = useAppStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 500);
  };

  const getViewportDimensions = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const generatePreviewHTML = () => {
    if (!currentProject) return '';

    const htmlFile = currentProject.files.find(f => f.name === 'index.html');
    const cssFile = currentProject.files.find(f => f.name === 'style.css');
    const jsFile = currentProject.files.find(f => f.name === 'script.js');

    if (!htmlFile) return '<p>No HTML file found</p>';

    let html = htmlFile.content;

    // Inline CSS
    if (cssFile) {
      html = html.replace(
        /<link[^>]*href=["']style\.css["'][^>]*>/i,
        `<style>${cssFile.content}</style>`
      );
    }

    // Inline JavaScript
    if (jsFile) {
      html = html.replace(
        /<script[^>]*src=["']script\.js["'][^>]*><\/script>/i,
        `<script>${jsFile.content}</script>`
      );
    }

    return html;
  };

  const previewHTML = generatePreviewHTML();
  const { width, height } = getViewportDimensions();

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-800 rounded-lg">
            <Eye className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Preview</h2>
            {currentProject && (
              <p className="text-sm text-gray-400">{currentProject.name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Viewport Toggle */}
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'desktop'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
              title="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'tablet'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
              title="Tablet view"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'mobile'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
              title="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className={`p-2.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 ${
              isLoading ? 'animate-spin' : ''
            }`}
            title="Refresh preview"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-6 overflow-auto bg-slate-850">
        {currentProject ? (
          <div className="h-full flex items-center justify-center">
            <div
              className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300"
              style={{
                width: width,
                height: height,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <iframe
                ref={iframeRef}
                key={refreshKey}
                srcDoc={previewHTML}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin"
                title="Preview"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center max-w-md">
              <div className="p-6 bg-slate-800 rounded-2xl inline-block mb-6">
                <Monitor className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">No project to preview</h3>
              <p className="text-gray-400">
                Create or select a project to see the live preview of your code
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};