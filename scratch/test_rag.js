import { ragService } from "../server/rag/retrievalService.js";

async function testRAG() {
  console.log("=== Testing RAG Retrieval Service ===");

  const testQueries = [
    "what to do if my hospital overcharges me or refuses emergency care",
    "my landlord hasn't returned my security deposit after 30 days",
    "is my employment non-compete clause enforceable",
  ];

  for (const query of testQueries) {
    console.log(`\nQuery: "${query}"`);
    const results = await ragService.retrieve(query, "General Legal", 2);
    console.log(`Retrieved ${results.length} chunks:`);
    results.forEach((r, i) => {
      console.log(`  [${i + 1}] Title: ${r.chunk.title} (Score: ${r.relevanceScore})`);
      console.log(`      Category: ${r.chunk.category} | Source: ${r.chunk.source}`);
    });
  }
}

testRAG().catch(console.error);
