export type LegalCategory = 
  | "Tenancy & Lease"
  | "Employment & Labor"
  | "Healthcare & Medical Legal Rights"
  | "Commercial & NDAs"
  | "Consumer & Contract Law"
  | "General Legal Principles";

export interface LegalKnowledgeChunk {
  id: string;
  title: string;
  category: LegalCategory;
  jurisdiction: string;
  content: string;
  source: string;
  keywords: string[];
}

export interface RAGSearchResult {
  chunk: LegalKnowledgeChunk;
  relevanceScore: number;
}

export interface IRAGService {
  retrieve(query: string, jurisdiction?: string, topK?: number): Promise<RAGSearchResult[]>;
}
