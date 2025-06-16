import React from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { projectService } from '../../services/projectService';
import { 
  Save, 
  Download, 
  Folder, 
  FolderOpen, 
  RotateCcw, 
  Play,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

interface EditorToolbarProps {
  showFileTree: boolean;
  onToggleFileTree: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  showFileTree,
  onToggleFileTree
}) => {
  const { currentProject, activeFile } = useAppStore();

  const handleSave = async () => {
    if (!currentProject) return;
    
    try {
      await projectService.updateProject(currentProject);
      toast.success('Project saved successfully');
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleExport = () => {
    if (!currentProject) return;
    
    try {
      projectService.exportProject(currentProject);
      toast.success('Project exported successfully');
    } catch (error) {
      toast.error('Failed to export project');
    }
  };

  const handleFormat = () => {
    toast.info('Auto-formatting coming soon!');
  };

  return (
    <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800">
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleFileTree}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title={showFileTree ? 'Hide file tree' : 'Show file tree'}
        >
          {showFileTree ? (
            <FolderOpen className="w-5 h-5" />
          ) : (
            <Folder className="w-5 h-5" />
          )}
        </button>
        
        {activeFile && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-slate-700 rounded-md">
            <span className="text-sm text-gray-300">{activeFile.name}</span>
            <span className="text-xs text-gray-500 bg-slate-600 px-2 py-1 rounded">
              {activeFile.language}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleFormat}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Format code"
        >
          <Settings className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleSave}
          className="p-2 text-gray-400 hover:text-green-400 transition-colors"
          title="Save project"
          disabled={!currentProject}
        >
          <Save className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleExport}
          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
          title="Export project"
          disabled={!currentProject}
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};