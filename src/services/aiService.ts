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
        model: 'o4-mini',
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
        model: 'o4-mini',
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
        model: 'o4-mini',
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
        model: 'o1-mini',
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