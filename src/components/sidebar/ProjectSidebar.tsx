import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { projectService } from '../../services/projectService';
import { Project } from '../../types';
import { 
  Plus, 
  Folder, 
  Calendar, 
  Search, 
  MoreVertical,
  Trash2,
  Edit3,
  FolderOpen,
  Code2,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ProjectSidebar: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const { currentProject, setCurrentProject, setActiveFile, setLoading } = useAppStore();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectList = await projectService.getProjects();
      setProjects(projectList);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      setLoading(true);
      const project = await projectService.createProject(
        newProjectName.trim(),
        newProjectDescription.trim() || undefined
      );
      
      setProjects(prev => [project, ...prev]);
      setCurrentProject(project);
      setActiveFile(project.files[0] || null);
      setShowNewProjectForm(false);
      setNewProjectName('');
      setNewProjectDescription('');
      toast.success('Project created successfully!');
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    setActiveFile(project.files[0] || null);
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
        setActiveFile(null);
      }
      
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="h-full bg-slate-900 border-r border-slate-700/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Projects</h2>
          </div>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            title="Create new project"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* New Project Form */}
        {showNewProjectForm && (
          <div className="mb-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
            <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <Code2 className="w-4 h-4" />
              <span>New Project</span>
            </h3>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <textarea
                placeholder="Description (optional)"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewProjectForm(false);
                    setNewProjectName('');
                    setNewProjectDescription('');
                  }}
                  className="flex-1 bg-slate-600 text-white py-2.5 px-4 rounded-lg hover:bg-slate-500 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects List */}
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleSelectProject(project)}
              className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                currentProject?.id === project.id
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30 shadow-lg'
                  : 'bg-slate-800 hover:bg-slate-750 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      currentProject?.id === project.id 
                        ? 'bg-indigo-500/20' 
                        : 'bg-slate-700'
                    }`}>
                      <Folder className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(project.updated_at)}</span>
                        </div>
                        <span>•</span>
                        <span>{project.files.length} files</span>
                      </div>
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-400 text-xs mb-2 line-clamp-2 pl-11">
                      {project.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => handleDeleteProject(project.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-400 hover:bg-slate-700 rounded-md transition-all duration-200"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="p-4 bg-slate-800 rounded-2xl inline-block mb-4">
              <Folder className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-white font-medium mb-2">No projects found</h3>
            <p className="text-sm mb-4">
              {searchTerm ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowNewProjectForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};