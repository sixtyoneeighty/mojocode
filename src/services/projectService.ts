import { supabase } from '../lib/supabase';
import { Project, ProjectFile } from '../types';

export class ProjectService {
  async createProject(name: string, description?: string): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const defaultFiles: ProjectFile[] = [
      {
        id: 'html-' + Date.now(),
        name: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to ${name}</h1>
        <p>Start coding your amazing project!</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        language: 'html',
        path: '/index.html'
      },
      {
        id: 'css-' + Date.now(),
        name: 'style.css',
        content: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
}`,
        language: 'css',
        path: '/style.css'
      },
      {
        id: 'js-' + Date.now(),
        name: 'script.js',
        content: `console.log('Welcome to ${name}!');

// Add your JavaScript code here
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    
    // Add a simple animation
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        container.style.transition = 'all 0.6s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
});`,
        language: 'javascript',
        path: '/script.js'
      }
    ];

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        files: defaultFiles,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createProjectWithCode(name: string, description: string, html: string, css: string, javascript: string): Promise<Project> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const files: ProjectFile[] = [
      {
        id: 'html-' + Date.now(),
        name: 'index.html',
        content: html,
        language: 'html',
        path: '/index.html'
      },
      {
        id: 'css-' + Date.now() + 1,
        name: 'style.css',
        content: css,
        language: 'css',
        path: '/style.css'
      },
      {
        id: 'js-' + Date.now() + 2,
        name: 'script.js',
        content: javascript,
        language: 'javascript',
        path: '/script.js'
      }
    ];

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        files,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProjects(): Promise<Project[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateProject(project: Project): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({
        name: project.name,
        description: project.description,
        files: project.files,
        updated_at: new Date().toISOString()
      })
      .eq('id', project.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) throw error;
  }

  exportProject(project: Project): void {
    const zip = new Map();
    
    project.files.forEach(file => {
      zip.set(file.path, file.content);
    });

    // Add README
    const readme = `# ${project.name}

${project.description || 'A project created with MojoCode'}

## Files Structure
${project.files.map(f => `- ${f.path}`).join('\n')}

## Getting Started
1. Open index.html in your browser
2. Start editing the files to customize your project
3. Have fun coding!

Generated by MojoCode - ${new Date().toLocaleDateString()}
`;

    zip.set('/README.md', readme);

    // Create download (simplified - in production, use a proper ZIP library)
    this.downloadAsText(project.name, Array.from(zip.entries()));
  }

  private downloadAsText(projectName: string, files: [string, string][]): void {
    const content = files.map(([path, content]) => 
      `\n\n=== ${path} ===\n${content}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const projectService = new ProjectService();