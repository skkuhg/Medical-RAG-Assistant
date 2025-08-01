/**
 * Tavily Search integration utilities
 */

import { TavilyResult } from '@/types/medical';

/**
 * Search for medical information using Tavily API
 */
export async function searchMedicalInfo(query: string): Promise<TavilyResult> {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY is not configured');
  }

  const searchQuery = `latest clinical guidelines for ${query}, differential diagnosis, treatment options`;

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: searchQuery,
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: false,
        max_results: 7,
        include_domains: [
          'pubmed.ncbi.nlm.nih.gov',
          'mayoclinic.org',
          'uptodate.com',
          'bmj.com',
          'nejm.org',
          'who.int',
          'cdc.gov'
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Tavily API error: ${response.status} ${response.statusText}`);
    }

    const result: TavilyResult = await response.json();
    
    if (!result.results || result.results.length === 0) {
      throw new Error('Unable to locate sufficient evidence from medical sources');
    }

    return result;
  } catch (error) {
    console.error('Tavily search error:', error);
    throw new Error('Failed to search medical information');
  }
}

/**
 * Format Tavily results for medical context
 */
export function formatMedicalContext(tavilyResult: TavilyResult): string {
  const { answer, results } = tavilyResult;
  
  let context = `Medical Research Summary:\n${answer}\n\nSources:\n`;
  
  results.forEach((result, index) => {
    context += `${index + 1}. ${result.title}\n`;
    context += `   URL: ${result.url}\n`;
    context += `   Content: ${result.content.substring(0, 200)}...\n\n`;
  });
  
  return context;
}

/**
 * Extract source URLs from Tavily results
 */
export function extractSources(tavilyResult: TavilyResult): string[] {
  return tavilyResult.results.map(result => result.url);
}