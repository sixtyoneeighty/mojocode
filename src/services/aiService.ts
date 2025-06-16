import OpenAI from 'openai';
import { AIResponse } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
});

// MCP Server Tools Definition
const MCP_TOOLS = [
  // Context7 - Get up-to-date documentation
  {
    type: "function" as const,
    function: {
      name: "get_library_docs",
      description: "Fetch up-to-date documentation for a library using Context7. Use this when you need current documentation for frameworks, libraries, or APIs.",
      parameters: {
        type: "object",
        properties: {
          libraryName: {
            type: "string",
            description: "The name of the library to search for (e.g., 'React', 'Next.js', 'MongoDB')"
          },
          topic: {
            type: "string", 
            description: "Focus the docs on a specific topic (e.g., 'routing', 'hooks', 'authentication')"
          },
          tokens: {
            type: "number",
            description: "Maximum number of tokens to return (default: 10000)"
          }
        },
        required: ["libraryName"]
      }
    }
  },
  
  // Firecrawl - Web scraping and crawling
  {
    type: "function" as const,
    function: {
      name: "firecrawl_scrape",
      description: "Scrape content from a single URL. Use this to extract content from web pages for analysis or integration.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "The URL to scrape"
          },
          formats: {
            type: "array",
            items: { type: "string" },
            description: "Output formats (e.g., ['markdown', 'html'])"
          },
          onlyMainContent: {
            type: "boolean",
            description: "Extract only main content, excluding navigation and ads"
          }
        },
        required: ["url"]
      }
    }
  },
  
  {
    type: "function" as const,
    function: {
      name: "firecrawl_search",
      description: "Search the web and optionally extract content from results. Use this to find information across multiple websites.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query"
          },
          limit: {
            type: "number", 
            description: "Number of results to return (default: 5)"
          },
          lang: {
            type: "string",
            description: "Language for search results (default: 'en')"
          }
        },
        required: ["query"]
      }
    }
  },

  // Tavily - Advanced web research
  {
    type: "function" as const,
    function: {
      name: "tavily_search",
      description: "Perform advanced web search with AI-powered analysis. Use for research, finding recent information, or gathering comprehensive data on topics.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Research query or topic"
          },
          search_depth: {
            type: "string",
            enum: ["basic", "advanced"],
            description: "Depth of search analysis"
          },
          include_domains: {
            type: "array",
            items: { type: "string" },
            description: "Specific domains to focus on"
          },
          max_results: {
            type: "number",
            description: "Maximum number of results (default: 10)"
          }
        },
        required: ["query"]
      }
    }
  },

  {
    type: "function" as const,
    function: {
      name: "tavily_extract",
      description: "Extract and analyze content from specific URLs with AI processing. Use for detailed content analysis.",
      parameters: {
        type: "object",
        properties: {
          urls: {
            type: "array",
            items: { type: "string" },
            description: "URLs to extract content from"
          },
          extract_type: {
            type: "string",
            enum: ["content", "summary", "key_points"],
            description: "Type of extraction to perform"
          }
        },
        required: ["urls"]
      }
    }
  },

  // Supabase - Database operations
  {
    type: "function" as const,
    function: {
      name: "supabase_query",
      description: "Execute database queries or operations. Use this to help users with database design, queries, or data management.",
      parameters: {
        type: "object",
        properties: {
          operation: {
            type: "string",
            enum: ["query_suggestion", "schema_design", "optimization", "migration"],
            description: "Type of database operation"
          },
          context: {
            type: "string",
            description: "Context about the database need or current schema"
          },
          table_name: {
            type: "string",
            description: "Specific table name if relevant"
          }
        },
        required: ["operation", "context"]
      }
    }
  }
];

export class AIService {
  // Enhanced prompt generation using o3 model for strategic thinking
  async enhancePrompt(prompt: string, authNeeds: string, databaseNeeds: string): Promise<string> {
    try {
      const enhancementPrompt = `As a senior product manager and UX expert, enhance this app idea by adding missing technical details, user experience considerations, and implementation requirements.

ORIGINAL IDEA: "${prompt}"

REQUIREMENTS TO CONSIDER:
- Authentication needs: ${authNeeds}
- Database integration: ${databaseNeeds}

Please enhance this prompt to include:
1. **Core Functionality**: Detailed feature descriptions and user flows
2. **User Interface**: Specific UI/UX requirements, layout preferences, and visual design direction
3. **Technical Specifications**: Architecture considerations, data requirements, and integration needs
4. **User Experience**: Navigation patterns, interaction design, and accessibility requirements
5. **Visual Design**: Color schemes, typography preferences, and design system requirements
6. **Performance & Quality**: Loading states, error handling, and optimization considerations

Focus on creating a comprehensive, actionable prompt that includes all necessary details for successful development.

Return ONLY the enhanced prompt as a complete, detailed description - no additional commentary or formatting.`;

      const response = await openai.responses.create({
        model: 'o3', // Using o3 for strategic planning and enhancement
        input: enhancementPrompt,
        instructions: 'You are a senior product strategist with expertise in app development, UX design, and technical architecture. Provide comprehensive, actionable enhancements that bridge business requirements with technical implementation.',
        temperature: 0.3,
        reasoning: {
          effort: 'high'
        },
        tools: MCP_TOOLS,
        tool_choice: 'auto',
        max_output_tokens: 3000
      });

      return this.extractContentFromResponse(response);
    } catch (error) {
      console.error('Prompt Enhancement Error:', error);
      throw new Error('Failed to enhance prompt');
    }
  }

  // Project planning using o3 model for comprehensive analysis
  async createProjectPlan(prompt: string, authNeeds: string, databaseNeeds: string): Promise<string> {
    try {
      const planningPrompt = `As a technical lead and software architect, analyze this app concept and create a comprehensive project plan.

APP CONCEPT: "${prompt}"

REQUIREMENTS:
- Authentication: ${authNeeds}
- Database: ${databaseNeeds}

Create a detailed project analysis with the following structure:

PROJECT NAME: [Suggest a memorable, brandable name that reflects the app's purpose]

DESCRIPTION: [Write a compelling 2-3 sentence summary that captures the app's value proposition and target audience]

CORE FEATURES:
- [List 5-7 essential features that deliver the primary user value]
- [Include user authentication and data management features if needed]
- [Focus on MVP features that can be implemented in the initial version]

TECH STACK:
- [Specify frontend technologies (HTML5, CSS3, JavaScript, frameworks)]
- [Include any necessary APIs, libraries, or third-party integrations]
- [Consider authentication and database technologies if required]
- [Mention responsive design and accessibility tools]

FILE STRUCTURE:
- [List main files that will be created (HTML, CSS, JS)]
- [Include any configuration files or additional assets needed]
- [Consider modular organization for maintainability]

CLARIFICATIONS NEEDED:
- [Identify any ambiguous requirements that need user input]
- [List assumptions that should be validated]
- [Highlight any complex features that might need simplification]

COMPLEXITY: [Rate as Simple/Medium/Complex based on:]
- Simple: Basic UI, minimal interactivity, no external APIs
- Medium: Multiple features, some state management, possible API integration
- Complex: Advanced functionality, real-time features, complex data relationships

Provide actionable, specific information that enables immediate development start.`;

      const response = await openai.responses.create({
        model: 'o3', // Using o3 for strategic planning and analysis
        input: planningPrompt,
        instructions: 'You are a senior software architect and project lead. Use advanced reasoning to create comprehensive, actionable project plans. Research current best practices and technologies using available tools when needed.',
        temperature: 0.3,
        reasoning: {
          effort: 'high'
        },
        tools: MCP_TOOLS,
        tool_choice: 'auto',
        max_output_tokens: 4000
      });

      return this.extractContentFromResponse(response);
    } catch (error) {
      console.error('Project Planning Error:', error);
      throw new Error('Failed to create project plan');
    }
  }

  // Regular chat and code assistance using o4-mini
  async generateCode(prompt: string, context?: string): Promise<AIResponse> {
    try {
      const systemPrompt = `You are MojoCode AI, an expert software developer and coding assistant specialized in full-stack development.

CAPABILITIES:
- Write clean, efficient, production-ready code
- Provide architectural guidance and best practices
- Access real-time documentation via Context7
- Perform web research using Tavily and Firecrawl
- Help with database design and queries
- Generate complete applications and components

TOOLS AVAILABLE:
- get_library_docs: Get up-to-date documentation for any library/framework
- firecrawl_scrape/search: Extract content from web pages and search
- tavily_search/extract: Advanced web research and content analysis  
- supabase_query: Database design and query assistance

GUIDELINES:
- Always use the latest documentation when suggesting code
- Provide complete, working examples
- Include error handling and best practices
- Use modern patterns and techniques
- Explain your code choices and architecture decisions

${context ? `CURRENT CONTEXT: ${context}` : ''}

When you need current documentation or want to research best practices, use the available tools. Always provide practical, implementable solutions.`;

      const response = await openai.responses.create({
        model: 'o4-mini', // Using o4-mini for code generation and assistance
        input: prompt,
        instructions: systemPrompt,
        temperature: 0.3,
        reasoning: {
          effort: 'high'
        },
        tools: MCP_TOOLS,
        tool_choice: 'auto',
        max_output_tokens: 4000
      });

      // Handle the response - extract content and any tool calls
      const content = this.extractContentFromResponse(response);
      const codeBlocks = this.extractCodeBlocks(content);
      
      return {
        content,
        code: codeBlocks.code,
        language: codeBlocks.language,
        suggestions: this.extractSuggestions(content),
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  // App generation using o4-mini for code implementation
  async generateApp(prompt: string): Promise<{
    html: string;
    css: string;
    javascript: string;
    projectName: string;
    description: string;
  }> {
    try {
      const generationPrompt = `Create a complete, functional, and beautiful web application based on this detailed specification:

${prompt}

DEVELOPMENT REQUIREMENTS:
- Generate clean, semantic HTML5 with proper structure and accessibility
- Create modern, responsive CSS with beautiful design and animations
- Include interactive JavaScript functionality with error handling
- Use a cohesive, professional color scheme and typography
- Follow accessibility standards (ARIA labels, semantic tags, keyboard navigation)
- Make it production-ready and polished with attention to detail
- Use modern CSS features (Grid, Flexbox, custom properties, animations)
- Ensure mobile-first responsive design with smooth transitions
- Include proper form validation and user feedback
- Add loading states and micro-interactions for better UX

TECHNICAL IMPLEMENTATION:
- Use vanilla HTML, CSS, and JavaScript (no frameworks)
- Implement modern ES6+ JavaScript features
- Create reusable CSS classes and modular code structure
- Include proper error handling and user feedback
- Optimize for performance and accessibility
- Use semantic HTML5 elements for better SEO and accessibility

DESIGN GUIDELINES:
- Use a modern, professional design system approach
- Include hover effects, focus states, and smooth transitions
- Add subtle animations for enhanced user experience
- Ensure proper spacing, typography hierarchy, and visual balance
- Make it visually impressive and user-friendly
- Use modern color palettes and contemporary design trends
- Ensure excellent contrast ratios and readability

Create a polished, production-worthy application that demonstrates modern web development capabilities and best practices.`;

      const response = await openai.responses.create({
        model: 'o4-mini', // Using o4-mini for actual code generation
        input: generationPrompt,
        instructions: 'You are an expert full-stack developer creating production-ready web applications. Use the latest web standards, research current best practices using available tools, and focus on creating beautiful, functional, and accessible applications.',
        temperature: 0.3,
        reasoning: {
          effort: 'high'
        },
        tools: MCP_TOOLS,
        tool_choice: 'auto',
        max_output_tokens: 8000
      });

      const content = this.extractContentFromResponse(response);
      
      // Parse the response to extract HTML, CSS, and JavaScript
      const { html, css, javascript } = this.parseGeneratedCode(content);
      
      // Generate project name and description from the content
      const projectName = this.generateProjectName(content, prompt);
      const description = this.generateProjectDescription(prompt);

      return {
        html,
        css,
        javascript,
        projectName,
        description
      };
    } catch (error) {
      console.error('App Generation Error:', error);
      throw new Error('Failed to generate app');
    }
  }

  private parseGeneratedCode(content: string): { html: string; css: string; javascript: string } {
    // Try to extract code blocks with language identifiers
    const htmlMatch = content.match(/```(?:html|HTML)\s*\n([\s\S]*?)\n```/i);
    const cssMatch = content.match(/```(?:css|CSS)\s*\n([\s\S]*?)\n```/i);
    const jsMatch = content.match(/```(?:javascript|js|JavaScript|JS)\s*\n([\s\S]*?)\n```/i);

    let html = htmlMatch?.[1]?.trim() || '';
    let css = cssMatch?.[1]?.trim() || '';
    let javascript = jsMatch?.[1]?.trim() || '';

    // If no labeled code blocks found, try to extract any code blocks
    if (!html && !css && !javascript) {
      const allCodeBlocks = Array.from(content.matchAll(/```[a-zA-Z]*\s*\n([\s\S]*?)\n```/g));
      
      // Try to identify code by content patterns
      for (const [, block] of allCodeBlocks) {
        const trimmedBlock = block.trim();
        
        if (trimmedBlock.includes('<!DOCTYPE html') || trimmedBlock.includes('<html')) {
          html = trimmedBlock;
        } else if (trimmedBlock.includes('body {') || trimmedBlock.includes('.container') || trimmedBlock.includes('@media')) {
          css = trimmedBlock;
        } else if (trimmedBlock.includes('function') || trimmedBlock.includes('document.') || trimmedBlock.includes('addEventListener')) {
          javascript = trimmedBlock;
        }
      }
    }

    // Fallback to defaults if still empty
    if (!html) html = this.generateDefaultHTML();
    if (!css) css = this.generateDefaultCSS();
    if (!javascript) javascript = this.generateDefaultJS();

    return { html, css, javascript };
  }

  private generateProjectName(content: string, prompt: string): string {
    // Try to extract title from HTML content
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1] && !titleMatch[1].includes('My App')) {
      return titleMatch[1].trim();
    }

    // Try to extract h1 content
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match && h1Match[1]) {
      const h1Text = h1Match[1].replace(/<[^>]*>/g, '').trim();
      if (h1Text && !h1Text.toLowerCase().includes('welcome')) {
        return h1Text;
      }
    }

    // Fall back to generating from prompt
    const words = prompt.split(' ').filter(word => word.length > 2);
    const significantWords = words.slice(0, 3);
    return significantWords.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ') + ' App';
  }

  private generateProjectDescription(prompt: string): string {
    return prompt.length > 150 
      ? prompt.substring(0, 147) + '...'
      : prompt;
  }

  private generateDefaultHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Welcome to My App</h1>
            <p>Your application is ready to be customized</p>
        </header>
        <main class="main">
            <section class="hero">
                <h2>Get Started</h2>
                <p>This is a template app generated by MojoCode AI. Customize it to match your vision!</p>
                <button class="cta-button" onclick="handleCTAClick()">Get Started</button>
            </section>
        </main>
        <footer class="footer">
            <p>&copy; 2024 My App. Built with MojoCode.</p>
        </footer>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  }

  private generateDefaultCSS(): string {
    return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --secondary-color: #f8fafc;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text-primary);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    text-align: center;
    margin-bottom: 3rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    font-weight: 700;
}

.header p {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
}

.main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero {
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    padding: 3rem;
    border-radius: 20px;
    box-shadow: var(--shadow);
    max-width: 600px;
    transform: translateY(0);
    transition: var(--transition);
}

.hero:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.hero h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
    font-weight: 600;
}

.hero p {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
}

.cta-button {
    background: var(--primary-color);
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: var(--transition);
    box-shadow: var(--shadow);
}

.cta-button:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.cta-button:active {
    transform: translateY(0);
}

.footer {
    text-align: center;
    margin-top: 3rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }
    
    .header h1 {
        font-size: 2rem;
    }
    
    .hero {
        padding: 2rem;
    }
    
    .hero h2 {
        font-size: 2rem;
    }
}

/* Loading animation */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.hero {
    animation: fadeInUp 0.8s ease-out;
}`;
  }

  private generateDefaultJS(): string {
    return `console.log('MojoCode App loaded successfully!');

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded');
    initializeApp();
});

// App initialization
function initializeApp() {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add loading animation
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            hero.style.transition = 'all 0.8s ease-out';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Initialize interactive elements
    initializeInteractiveElements();
}

// Handle CTA button click
function handleCTAClick() {
    console.log('CTA button clicked!');
    
    // Add visual feedback
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
    
    // Show success message
    showNotification('Welcome to your new app!', 'success');
}

// Initialize interactive elements
function initializeInteractiveElements() {
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('button, [onclick]');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: \${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease-out;
    \`;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Handle Enter key on focusable elements
    if (e.key === 'Enter' && e.target.hasAttribute('onclick')) {
        e.target.click();
    }
});`;
  }

  private extractContentFromResponse(response: any): string {
    // Handle the response format from OpenAI Responses API
    if (response.output && Array.isArray(response.output)) {
      return response.output
        .map((item: any) => item.content || item.text || '')
        .join('\n');
    }
    
    if (response.content) {
      return response.content;
    }
    
    return 'No content received from AI';
  }

  private extractCodeBlocks(content: string): { code?: string; language?: string } {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
    const matches = Array.from(content.matchAll(codeBlockRegex));
    
    if (matches.length > 0) {
      return {
        language: matches[0][1] || 'javascript',
        code: matches[0][2]
      };
    }
    
    return {};
  }

  private extractSuggestions(content: string): string[] {
    const suggestionRegex = /(?:^|\n)[\s]*(?:\d+\.|[-*+])\s+(.+)/g;
    const matches = Array.from(content.matchAll(suggestionRegex));
    return matches.map(match => match[1].trim()).slice(0, 3);
  }

  async explainCode(code: string, language: string): Promise<string> {
    try {
      const response = await openai.responses.create({
        model: 'o4-mini', // Using o4-mini for code explanation
        input: `Please explain this ${language} code in detail:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        instructions: 'You are a code explanation expert. Explain the given code in simple terms, highlighting key concepts, functionality, and best practices. Use the get_library_docs tool if you need current documentation about any libraries or frameworks used.',
        temperature: 0.3,
        reasoning: {
          effort: 'medium'
        },
        tools: MCP_TOOLS,
        tool_choice: 'auto',
        max_output_tokens: 2000
      });

      return this.extractContentFromResponse(response);
    } catch (error) {
      console.error('Code explanation error:', error);
      throw new Error('Failed to explain code');
    }
  }

  async researchTopic(topic: string): Promise<string> {
    try {
      const response = await openai.responses.create({
        model: 'o4-mini', // Using o4-mini for research tasks
        input: `Research the following topic and provide comprehensive, up-to-date information: ${topic}`,
        instructions: 'You are a research assistant. Use tavily_search and get_library_docs to gather current information. Provide well-structured, factual content with sources when possible.',
        temperature: 0.3,
        reasoning: {
          effort: 'high'
        },
        tools: MCP_TOOLS,
        tool_choice: 'auto',
        max_output_tokens: 3000
      });

      return this.extractContentFromResponse(response);
    } catch (error) {
      console.error('Research error:', error);
      throw new Error('Failed to research topic');
    }
  }

  async analyzeWebsite(url: string): Promise<string> {
    try {
      const response = await openai.responses.create({
        model: 'o4-mini', // Using o4-mini for analysis tasks
        input: `Analyze the website at ${url}. Extract key information, technologies used, and provide insights about its structure and content.`,
        instructions: 'You are a web analysis expert. Use firecrawl_scrape to extract content and analyze the website structure, technologies, and content quality.',
        temperature: 0.3,
        reasoning: {
          effort: 'medium'
        },
        tools: MCP_TOOLS,
        tool_choice: 'auto',
        max_output_tokens: 2500
      });

      return this.extractContentFromResponse(response);
    } catch (error) {
      console.error('Website analysis error:', error);
      throw new Error('Failed to analyze website');
    }
  }
}

export const aiService = new AIService();