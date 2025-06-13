import { ChromaApi, OpenAIEmbeddingFunction } from 'chromadb';
import { pipeline } from '@xenova/transformers';

export class FreeVectorStore {
  private client: ChromaApi;
  private collection: any;
  private embedder: any;

  constructor() {
    this.client = new ChromaApi({
      path: process.env.CHROMA_DB_PATH || './data/chroma_db'
    });
    this.initializeEmbedder();
  }

  private async initializeEmbedder() {
    // Use free HuggingFace embedding model
    this.embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
      { revision: 'main' }
    );
  }

  async initialize() {
    try {
      // Create or get collection
      this.collection = await this.client.getOrCreateCollection({
        name: 'documents',
        embeddingFunction: new OpenAIEmbeddingFunction({
          openai_api_key: 'not-needed',
          openai_model: 'text-embedding-ada-002'
        })
      });
    } catch (error) {
      console.error('Failed to initialize vector store:', error);
    }
  }

  async addDocuments(documents: Array<{
    content: string;
    metadata: {
      filename?: string;
      url?: string;
      type: 'text' | 'image';
      timestamp: number;
    };
  }>) {
    try {
      const ids = documents.map((_, index) => `doc_${Date.now()}_${index}`);
      const contents = documents.map(doc => doc.content);
      const metadatas = documents.map(doc => doc.metadata);

      // Generate embeddings using local model
      const embeddings = await Promise.all(
        contents.map(async (content) => {
          const output = await this.embedder(content, {
            pooling: 'mean',
            normalize: true
          });
          return Array.from(output.data);
        })
      );

      await this.collection.add({
        ids,
        documents: contents,
        metadatas,
        embeddings
      });

      return { success: true, count: documents.length };
    } catch (error) {
      console.error('Failed to add documents:', error);
      throw error;
    }
  }

  async search(query: string, topK: number = 5) {
    try {
      // Generate query embedding
      const queryEmbedding = await this.embedder(query, {
        pooling: 'mean',
        normalize: true
      });

      const results = await this.collection.query({
        queryEmbeddings: [Array.from(queryEmbedding.data)],
        nResults: topK,
        include: ['documents', 'metadatas', 'distances']
      });

      return results.ids[0].map((id: string, index: number) => ({
        id,
        content: results.documents[0][index],
        metadata: results.metadatas[0][index],
        score: 1 - results.distances[0][index] // Convert distance to similarity
      }));
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }
}