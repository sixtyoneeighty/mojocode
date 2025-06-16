import React, { useState } from 'react';
import { useAppStore } from '../../stores/useAppStore';
import { aiService } from '../../services/aiService';
import { projectService } from '../../services/projectService';
import { 
  Sparkles, 
  Wand2, 
  ArrowRight, 
  Camera, 
  Upload, 
  Globe, 
  User, 
  ShoppingCart,
  Calendar,
  MessageSquare,
  BarChart3,
  Gamepad2,
  Heart,
  Briefcase,
  GraduationCap,
  Music,
  Coffee,
  Send,
  Loader,
  Check,
  X,
  AlertCircle,
  Database,
  Shield,
  FileText,
  Edit3,
  Brain
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AppGenerationLandingProps {
  onProjectCreated: () => void;
}

interface ProjectPlan {
  projectName: string;
  description: string;
  features: string[];
  techStack: string[];
  fileStructure: string[];
  clarifications: string[];
  estimatedComplexity: 'Simple' | 'Medium' | 'Complex';
}

export const AppGenerationLanding: React.FC<AppGenerationLandingProps> = ({ onProjectCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [needsAuth, setNeedsAuth] = useState<'yes' | 'no' | 'not-sure'>('not-sure');
  const [needsDatabase, setNeedsDatabase] = useState<'yes' | 'no' | 'not-sure'>('not-sure');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const { setCurrentProject, setActiveFile } = useAppStore();

  const quickStarters = [
    { icon: <Camera className="w-5 h-5" />, text: "Photo sharing app", category: "Social" },
    { icon: <Upload className="w-5 h-5" />, text: "File upload dashboard", category: "Utility" },
    { icon: <Globe className="w-5 h-5" />, text: "Landing page", category: "Marketing" },
    { icon: <User className="w-5 h-5" />, text: "Sign up form", category: "Auth" },
    { icon: <ShoppingCart className="w-5 h-5" />, text: "E-commerce store", category: "Business" },
    { icon: <Calendar className="w-5 h-5" />, text: "Event booking app", category: "Productivity" },
    { icon: <MessageSquare className="w-5 h-5" />, text: "Chat application", category: "Social" },
    { icon: <BarChart3 className="w-5 h-5" />, text: "Analytics dashboard", category: "Business" }
  ];

  const templates = [
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      name: "Interactive Game",
      description: "Browser-based games with HTML5 Canvas",
      prompt: "Create an interactive web game with HTML5 canvas, score tracking, and responsive controls"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      name: "Health Tracker",
      description: "Personal wellness and fitness app",
      prompt: "Build a health tracking app with daily logs, progress charts, and goal setting features"
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      name: "Portfolio Site",
      description: "Professional portfolio showcase",
      prompt: "Design a modern portfolio website with project gallery, skills section, and contact form"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      name: "Learning Platform",
      description: "Educational content and quizzes",
      prompt: "Create an e-learning platform with course modules, progress tracking, and interactive quizzes"
    },
    {
      icon: <Music className="w-6 h-6" />,
      name: "Music Player",
      description: "Audio streaming interface",
      prompt: "Build a music player app with playlist management, audio controls, and visualizations"
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      name: "Local Business",
      description: "Restaurant or cafe website",
      prompt: "Design a local business website with menu display, online ordering, and location info"
    }
  ];

  const enhancePrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsEnhancing(true);
    try {
      // Using the new enhancePrompt method that uses o3 model
      const enhancedPrompt = await aiService.enhancePrompt(prompt, needsAuth, needsDatabase);
      
      setPrompt(enhancedPrompt);
      toast.success('✨ Prompt enhanced with AI insights!');
    } catch (error) {
      toast.error('Failed to enhance prompt');
    } finally {
      setIsEnhancing(false);
    }
  };

  const createProjectPlan = async () => {
    if (!prompt.trim()) return;
    
    setIsPlanning(true);
    setShowReview(true);
    
    try {
      // Using the new createProjectPlan method that uses o3 model
      const planContent = await aiService.createProjectPlan(prompt, needsAuth, needsDatabase);
      
      // Parse the response to extract structured plan
      const plan = parseProjectPlan(planContent);
      setProjectPlan(plan);
      
    } catch (error) {
      console.error('Planning error:', error);
      toast.error('Failed to create project plan');
      setShowReview(false);
    } finally {
      setIsPlanning(false);
    }
  };

  const parseProjectPlan = (content: string): ProjectPlan => {
    console.log('Parsing project plan content:', content); // Debug logging
    
    let projectName = 'My App';
    let description = 'Generated application';
    let features: string[] = [];
    let techStack: string[] = [];
    let fileStructure: string[] = [];
    let clarifications: string[] = [];
    let complexity: 'Simple' | 'Medium' | 'Complex' = 'Medium';
    
    // Split content into lines and clean them
    const lines = content.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    console.log('Cleaned lines:', lines); // Debug logging
    
    let currentSection = '';
    
    for (const line of lines) {
      // Check for section headers (more flexible matching)
      if (line.toLowerCase().includes('project name') && line.includes(':')) {
        projectName = line.split(':')[1]?.trim() || projectName;
        continue;
      }
      
      if (line.toLowerCase().includes('description') && line.includes(':')) {
        description = line.split(':')[1]?.trim() || description;
        continue;
      }
      
      if (line.toLowerCase().includes('core features') || line.toLowerCase().includes('features:')) {
        currentSection = 'features';
        continue;
      }
      
      if (line.toLowerCase().includes('tech stack') || line.toLowerCase().includes('technology stack')) {
        currentSection = 'tech';
        continue;
      }
      
      if (line.toLowerCase().includes('file structure') || line.toLowerCase().includes('files:')) {
        currentSection = 'files';
        continue;
      }
      
      if (line.toLowerCase().includes('clarifications') || line.toLowerCase().includes('questions')) {
        currentSection = 'clarifications';
        continue;
      }
      
      if (line.toLowerCase().includes('complexity') && line.includes(':')) {
        const comp = line.split(':')[1]?.trim().toLowerCase() || '';
        if (comp.includes('simple')) complexity = 'Simple';
        else if (comp.includes('complex')) complexity = 'Complex';
        else complexity = 'Medium';
        continue;
      }
      
      // Parse list items (multiple bullet point types)
      if (line.match(/^[-•*+]\s+/) || line.match(/^\d+\.\s+/)) {
        const item = line.replace(/^[-•*+]\s+/, '').replace(/^\d+\.\s+/, '').trim();
        
        if (item && currentSection) {
          switch (currentSection) {
            case 'features':
              features.push(item);
              break;
            case 'tech':
              techStack.push(item);
              break;
            case 'files':
              fileStructure.push(item);
              break;
            case 'clarifications':
              clarifications.push(item);
              break;
          }
        }
      }
    }
    
    // Fallback to default content if nothing was parsed
    if (features.length === 0) {
      features = [
        'Modern responsive design',
        'User-friendly interface',
        'Interactive functionality',
        'Cross-browser compatibility',
        'Accessibility features'
      ];
    }
    
    if (techStack.length === 0) {
      techStack = [
        'HTML5',
        'CSS3 with modern features',
        'Vanilla JavaScript (ES6+)',
        'Responsive Grid & Flexbox',
        'CSS Custom Properties'
      ];
    }
    
    if (fileStructure.length === 0) {
      fileStructure = [
        'index.html - Main page structure',
        'style.css - Styling and layout',
        'script.js - Interactive functionality'
      ];
    }
    
    console.log('Parsed project plan:', {
      projectName,
      description,
      features,
      techStack,
      fileStructure,
      clarifications,
      complexity
    }); // Debug logging
    
    return {
      projectName,
      description,
      features,
      techStack,
      fileStructure,
      clarifications,
      estimatedComplexity: complexity
    };
  };

  const generateApp = async () => {
    if (!projectPlan) return;
    
    setIsGenerating(true);
    try {
      const generationPrompt = `Create a complete, functional web application based on this project plan:

      PROJECT: ${projectPlan.projectName}
      DESCRIPTION: ${projectPlan.description}
      
      FEATURES TO IMPLEMENT:
      ${projectPlan.features.map(f => `- ${f}`).join('\n')}
      
      REQUIREMENTS:
      - Authentication: ${needsAuth}
      - Database: ${needsDatabase}
      - Technology Stack: ${projectPlan.techStack.join(', ')}
      
      ORIGINAL PROMPT: "${prompt}"

      Generate clean, modern, production-ready code with:
      1. Semantic HTML5 structure
      2. Responsive CSS with modern design
      3. Interactive JavaScript functionality
      4. Proper code organization and comments
      5. Beautiful UI with cohesive color scheme
      6. Accessibility features
      
      Create a polished prototype that demonstrates all core features.`;

      const response = await aiService.generateApp(generationPrompt);
      
      // Create project with generated code
      const project = await projectService.createProjectWithCode(
        projectPlan.projectName,
        projectPlan.description,
        response.html,
        response.css,
        response.javascript
      );
      
      setCurrentProject(project);
      setActiveFile(project.files[0]);
      onProjectCreated();
      
      toast.success('🚀 App generated successfully!');
    } catch (error) {
      toast.error('Failed to generate app');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetFlow = () => {
    setShowReview(false);
    setProjectPlan(null);
    setPrompt('');
    setNeedsAuth('not-sure');
    setNeedsDatabase('not-sure');
  };

  // Show review/planning phase
  if (showReview && projectPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
        <div className="max-w-4xl mx-auto px-6 py-12 w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">Powered by o3 Advanced Reasoning</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Project Review</h1>
            <p className="text-xl text-gray-300">
              Review the comprehensive plan before we start building your app
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl mb-8">
            {/* Project Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-indigo-400" />
                  <h2 className="text-2xl font-bold text-white">{projectPlan.projectName}</h2>
                </div>
                <p className="text-gray-300 text-lg mb-6">{projectPlan.description}</p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Core Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {projectPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-300">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-gray-300">Complexity</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        projectPlan.estimatedComplexity === 'Simple' ? 'bg-green-100 text-green-800' :
                        projectPlan.estimatedComplexity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {projectPlan.estimatedComplexity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-gray-300">Authentication</span>
                      <span className="text-white">{needsAuth === 'yes' ? 'Required' : needsAuth === 'no' ? 'Not needed' : 'To be determined'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-gray-300">Database</span>
                      <span className="text-white">{needsDatabase === 'yes' ? 'Required' : needsDatabase === 'no' ? 'Not needed' : 'To be determined'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {projectPlan.techStack.map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* File Structure */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">File Structure</h3>
              <div className="bg-slate-800/30 rounded-lg p-4">
                {projectPlan.fileStructure.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 text-gray-300 text-sm py-1">
                    <span className="text-gray-500">📄</span>
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clarifications */}
            {projectPlan.clarifications.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Clarifications Needed</h3>
                </div>
                <div className="space-y-2">
                  {projectPlan.clarifications.map((clarification, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-amber-200 text-sm">{clarification}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={generateApp}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating with o4-mini...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Looks Good, Generate App!</span>
                  </>
                )}
              </button>
              
              <button
                onClick={resetFlow}
                className="flex items-center justify-center space-x-2 py-4 px-6 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                <Edit3 className="w-5 h-5" />
                <span>Modify Prompt</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="text-center pt-20 pb-12">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-indigo-300">AI-Powered App Development</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
          What can I help you{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            build?
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
          Describe your app idea and watch it come to life. From concept to working prototype in seconds.
        </p>
      </div>

      {/* Main Input Section */}
      <div className="max-w-4xl mx-auto px-6 w-full">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your app idea in detail... e.g., 'A social media app for pet owners with photo sharing, vet appointment booking, and local pet services discovery'"
                className="w-full h-32 px-6 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-lg"
                disabled={isPlanning || isGenerating}
              />
              
              {prompt.trim() && (
                <button
                  onClick={enhancePrompt}
                  disabled={isEnhancing || isPlanning || isGenerating}
                  className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-all disabled:opacity-50 text-sm"
                  title="Enhance prompt with o3 AI"
                >
                  {isEnhancing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Enhancing...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      <span>Enhance with o3</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Integration Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Authentication */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-white font-medium">Authentication</h3>
                </div>
                <div className="flex space-x-3">
                  {(['yes', 'no', 'not-sure'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => setNeedsAuth(option)}
                      className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-all ${
                        needsAuth === option
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800/50 border-slate-600 text-gray-400 hover:border-slate-500'
                      }`}
                      disabled={isPlanning || isGenerating}
                    >
                      {option === 'yes' ? 'Yes' : option === 'no' ? 'No' : 'Not Sure'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Database */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-white font-medium">Database Integration</h3>
                </div>
                <div className="flex space-x-3">
                  {(['yes', 'no', 'not-sure'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => setNeedsDatabase(option)}
                      className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-all ${
                        needsDatabase === option
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800/50 border-slate-600 text-gray-400 hover:border-slate-500'
                      }`}
                      disabled={isPlanning || isGenerating}
                    >
                      {option === 'yes' ? 'Yes' : option === 'no' ? 'No' : 'Not Sure'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Review & Generate Button */}
            <button
              onClick={createProjectPlan}
              disabled={!prompt.trim() || isPlanning || isGenerating}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlanning ? (
                <>
                  <Brain className="w-6 h-6 animate-pulse" />
                  <span>Creating plan with o3...</span>
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6" />
                  <span>Review & Generate App</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Model Information */}
        <div className="mt-6 flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2 text-purple-300">
            <Brain className="w-4 h-4" />
            <span>o3 Planning</span>
          </div>
          <div className="text-gray-500">•</div>
          <div className="flex items-center space-x-2 text-indigo-300">
            <Sparkles className="w-4 h-4" />
            <span>o4-mini Generation</span>
          </div>
          <div className="text-gray-500">•</div>
          <div className="flex items-center space-x-2 text-gray-400">
            <span>High reasoning effort</span>
          </div>
        </div>

        {/* Quick Starters */}
        <div className="mt-8">
          <p className="text-gray-400 text-sm mb-4">Quick starters:</p>
          <div className="flex flex-wrap gap-3">
            {quickStarters.map((starter, index) => (
              <button
                key={index}
                onClick={() => setPrompt(starter.text)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-gray-300 hover:text-white hover:border-slate-600 transition-all duration-200"
                disabled={isPlanning || isGenerating}
              >
                {starter.icon}
                <span className="text-sm">{starter.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Starter Templates</h2>
          <p className="text-gray-400">Get started instantly with a pre-built template</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <div
              key={index}
              onClick={() => setPrompt(template.prompt)}
              className="group bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-slate-800 rounded-lg text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  {template.icon}
                </div>
                <h3 className="text-white font-semibold">{template.name}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};