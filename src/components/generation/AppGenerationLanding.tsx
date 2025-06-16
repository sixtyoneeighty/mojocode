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
  Loader
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AppGenerationLandingProps {
  onProjectCreated: () => void;
}

export const AppGenerationLanding: React.FC<AppGenerationLandingProps> = ({ onProjectCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEnhanceOptions, setShowEnhanceOptions] = useState(false);
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
    
    setIsGenerating(true);
    try {
      const enhancedResponse = await aiService.generateCode(
        `Enhance this app idea by adding missing details, technical specifications, and user experience considerations: "${prompt}". Provide a comprehensive prompt that includes:
        - Core functionality and features
        - User interface requirements
        - Technical stack suggestions
        - User experience flow
        - Visual design preferences
        
        Return only the enhanced prompt, nothing else.`,
        'You are a product manager and UX expert helping to enhance app ideas.'
      );
      
      setPrompt(enhancedResponse.content);
      setShowEnhanceOptions(false);
      toast.success('Prompt enhanced with additional details!');
    } catch (error) {
      toast.error('Failed to enhance prompt');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateApp = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Create a comprehensive generation prompt
      const generationPrompt = `Create a complete, functional web application based on this description: "${prompt}"

      Requirements:
      - Generate clean, modern HTML, CSS, and JavaScript
      - Use semantic HTML5 and responsive CSS
      - Include interactive JavaScript functionality
      - Follow modern web development best practices
      - Use a cohesive color scheme and typography
      - Ensure accessibility standards
      - Make it production-ready and polished
      
      Please provide:
      1. Complete HTML structure
      2. Comprehensive CSS styling with responsive design
      3. JavaScript functionality for interactivity
      4. Any additional files if needed
      
      Focus on creating a beautiful, functional prototype that demonstrates the core concept.`;

      const response = await aiService.generateCode(generationPrompt);
      
      // Extract project name from prompt
      const projectName = prompt.split(' ').slice(0, 3).join(' ') + ' App';
      
      // Create new project with generated code
      const project = await projectService.createProject(
        projectName,
        `Generated from: ${prompt.substring(0, 100)}...`
      );
      
      // Update project files with AI-generated content
      // This would need more sophisticated parsing of the AI response
      // For now, we'll update the default files with basic content
      const updatedProject = {
        ...project,
        files: project.files.map(file => {
          if (file.name === 'index.html') {
            return { ...file, content: response.content.includes('<html') ? response.content : file.content };
          }
          return file;
        })
      };
      
      await projectService.updateProject(updatedProject);
      
      setCurrentProject(updatedProject);
      setActiveFile(updatedProject.files[0]);
      onProjectCreated();
      
      toast.success('App prototype generated successfully!');
    } catch (error) {
      toast.error('Failed to generate app');
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

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
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your app idea in detail... e.g., 'A social media app for pet owners with photo sharing, vet appointment booking, and local pet services discovery'"
                className="w-full h-32 px-6 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-lg"
                disabled={isGenerating}
              />
              
              {prompt.trim() && (
                <button
                  onClick={() => setShowEnhanceOptions(!showEnhanceOptions)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-indigo-400 transition-colors"
                  title="Enhance prompt"
                  disabled={isGenerating}
                >
                  <Wand2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Enhance Options */}
            {showEnhanceOptions && (
              <div className="bg-slate-800/30 border border-slate-600 rounded-xl p-4">
                <h3 className="text-white font-medium mb-3">Enhance Your Prompt</h3>
                <p className="text-gray-400 text-sm mb-4">
                  AI can add missing details like user flows, technical requirements, and design preferences to make your prompt more comprehensive.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={enhancePrompt}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    <span>Enhance Prompt</span>
                  </button>
                  <button
                    onClick={() => setShowEnhanceOptions(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateApp}
              disabled={!prompt.trim() || isGenerating}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-6 h-6 animate-spin" />
                  <span>Generating your app...</span>
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  <span>Generate App</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
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
                disabled={isGenerating}
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