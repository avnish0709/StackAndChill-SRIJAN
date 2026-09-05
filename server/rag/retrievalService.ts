import { LEGAL_KNOWLEDGE_BASE } from "./knowledgeBase.js";
import { IRAGService, LegalKnowledgeChunk, RAGSearchResult } from "./types.js";

export class LocalLegalRAGService implements IRAGService {
  private knowledgeBase: LegalKnowledgeChunk[];

  constructor(customKnowledgeBase?: LegalKnowledgeChunk[]) {
    this.knowledgeBase = customKnowledgeBase || LEGAL_KNOWLEDGE_BASE;
  }

  public async retrieve(query: string, jurisdiction?: string, topK: number = 3): Promise<RAGSearchResult[]> {
    if (!query || typeof query !== "string" || !query.trim()) {
      return [];
    }

    const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, "");
    const queryTokens = cleanQuery.split(/\s+/).filter((t) => t.length > 2);

    const scoredResults: RAGSearchResult[] = this.knowledgeBase.map((chunk) => {
      let score = 0;

      // 1. Keyword direct match (high weight)
      for (const keyword of chunk.keywords) {
        if (cleanQuery.includes(keyword.toLowerCase())) {
          score += 3.5;
        }
      }

      // 2. Title match
      const titleLower = chunk.title.toLowerCase();
      for (const token of queryTokens) {
        if (titleLower.includes(token)) {
          score += 2.0;
        }
      }

      // 3. Content match
      const contentLower = chunk.content.toLowerCase();
      for (const token of queryTokens) {
        if (contentLower.includes(token)) {
          score += 1.0;
        }
      }

      // 4. Category match
      const categoryLower = chunk.category.toLowerCase();
      for (const token of queryTokens) {
        if (categoryLower.includes(token)) {
          score += 1.5;
        }
      }

      // 5. Jurisdiction alignment
      if (jurisdiction && chunk.jurisdiction.toLowerCase().includes(jurisdiction.toLowerCase())) {
        score += 1.0;
      }

      return {
        chunk,
        relevanceScore: score,
      };
    });

    // Filter results with positive relevance score
    const matches = scoredResults
      .filter((res) => res.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // If no specific keyword match found, return top general chunks as contextual baseline
    if (matches.length === 0) {
      return this.knowledgeBase.slice(0, topK).map((chunk) => ({ chunk, relevanceScore: 0.5 }));
    }

    return matches.slice(0, topK);
  }
}

export const ragService = new LocalLegalRAGService();
