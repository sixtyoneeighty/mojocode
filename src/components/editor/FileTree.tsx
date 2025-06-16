import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { Project, ProjectFile } from '../../types';
import { File, FileText, Image, Code, Palette } from 'lucide-react';

interface FileTreeProps {
  project: Project;
}

export const FileTree: React.FC<FileTreeProps> = ({ project }) => {
  const { activeFile, setActiveFile } = useAppStore();

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
        return <Code className="w-4 h-4 text-yellow-400" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <Palette className="w-4 h-4 text-blue-400" />;
      case 'html':
        return <FileText className="w-4 h-4 text-orange-400" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className="w-4 h-4 text-green-400" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleFileClick = (file: ProjectFile) => {
    setActiveFile(file);
  };

  return (
    <div className="p-2">
      <div className="space-y-1">
        {project.files.map((file) => (
          <button
            key={file.id}
            onClick={() => handleFileClick(file)}
            className={`w-full flex items-center space-x-2 p-2 rounded-md text-left transition-colors ${
              activeFile?.id === file.id
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30'
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {getFileIcon(file.name)}
            <span className="text-sm truncate">{file.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};