import React, { useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { useAppStore } from '../../stores/useAppStore';
import { FileTree } from './FileTree';
import { EditorToolbar } from './EditorToolbar';
import { File, FolderOpen } from 'lucide-react';

export const EditorPanel: React.FC = () => {
  const { currentProject, activeFile, updateFileContent } = useAppStore();
  const [editorValue, setEditorValue] = useState('');
  const [showFileTree, setShowFileTree] = useState(true);

  useEffect(() => {
    if (activeFile) {
      setEditorValue(activeFile.content);
    }
  }, [activeFile]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && activeFile) {
      setEditorValue(value);
      updateFileContent(activeFile.id, value);
    }
  };

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'jsx': return 'javascript';
      case 'tsx': return 'typescript';
      case 'css': return 'css';
      case 'html': return 'html';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'cpp': case 'c': return 'cpp';
      default: return 'plaintext';
    }
  };

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-900 text-gray-400">
        <div className="text-center">
          <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No project selected</p>
          <p className="text-sm mt-2">Create or select a project to start coding</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-slate-900">
      {showFileTree && (
        <div className="w-64 border-r border-slate-700 bg-slate-800">
          <div className="p-3 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-indigo-400" />
              <span className="text-white font-medium">{currentProject.name}</span>
            </div>
          </div>
          <FileTree project={currentProject} />
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <EditorToolbar 
          showFileTree={showFileTree}
          onToggleFileTree={() => setShowFileTree(!showFileTree)}
        />
        
        <div className="flex-1">
          {activeFile ? (
            <Editor
              height="100%"
              language={getLanguageFromFileName(activeFile.name)}
              value={editorValue}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                lineNumbers: 'on',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                bracketPairColorization: { enabled: true },
                guides: {
                  indentation: true,
                  bracketPairs: true
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a file to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};