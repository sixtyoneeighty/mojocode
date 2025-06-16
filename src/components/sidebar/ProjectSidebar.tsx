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
  Edit3
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
    <div className="w-80 bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Projects</h2>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            title="Create new project"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {showNewProjectForm && (
          <form onSubmit={handleCreateProject} className="mb-4 p-4 bg-slate-700 rounded-lg">
            <h3 className="text-white font-medium mb-3">New Project</h3>
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="w-full mb-3 px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
              className="w-full mb-3 px-3 py-2 bg-slate-600 border border-slate-500 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
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
                className="flex-1 bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleSelectProject(project)}
              className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                currentProject?.id === project.id
                  ? 'bg-indigo-600/30 border border-indigo-500/30'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Folder className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <h3 className="text-white font-medium truncate">
                      {project.name}
                    </h3>
                  </div>
                  
                  {project.description && (
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(project.updated_at)}</span>
                    </div>
                    <span>{project.files.length} files</span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteProject(project.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all duration-200"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No projects found</p>
            <p className="text-sm mt-2">
              {searchTerm ? 'Try a different search term' : 'Create your first project to get started'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};