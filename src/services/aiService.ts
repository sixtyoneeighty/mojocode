import OpenAI from 'openai';
import { AIResponse } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
});

export class AIService {
  async generateCode(prompt: string, context?: string): Promise<AIResponse> {
    try {
      const systemPrompt = `You are an expert software developer and coding assistant. 
      You help users write clean, efficient, and well-documented code.
      When providing code, always include the language and explain your approach.
      ${context ? `Current context: ${context}` : ''}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content || '';
      
      // Extract code blocks if present
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
      const matches = Array.from(content.matchAll(codeBlockRegex));
      
      let code = '';
      let language = '';
      
      if (matches.length > 0) {
        language = matches[0][1] || 'javascript';
        code = matches[0][2];
      }

      return {
        content,
        code: code || undefined,
        language: language || undefined,
        suggestions: this.extractSuggestions(content),
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  private extractSuggestions(content: string): string[] {
    // Simple suggestion extraction - look for bullet points or numbered lists
    const suggestionRegex = /(?:^|\n)[\s]*(?:\d+\.|[-*+])\s+(.+)/g;
    const matches = Array.from(content.matchAll(suggestionRegex));
    return matches.map(match => match[1].trim()).slice(0, 3);
  }

  async explainCode(code: string, language: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a code explanation expert. Explain the given code in simple terms, highlighting key concepts and functionality.'
          },
          {
            role: 'user',
            content: `Please explain this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      return completion.choices[0]?.message?.content || 'Unable to explain the code.';
    } catch (error) {
      console.error('Code explanation error:', error);
      throw new Error('Failed to explain code');
    }
  }
}

export const aiService = new AIService();