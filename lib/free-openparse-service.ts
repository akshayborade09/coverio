import openparse from 'openparse';
import { FreeVectorStore } from './free-vector-store';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export class FreeOpenParseService {
  private vectorStore: FreeVectorStore;

  constructor() {
    this.vectorStore = new FreeVectorStore();
  }

  async initialize() {
    await this.vectorStore.initialize();
  }

  async processDocument(fileBuffer: Buffer, filename: string, mimeType: string) {
    try {
      // Basic parsing without paid features
      const parser = new openparse.DocumentParser({
        // Use free table parsing algorithm
        table_args: {
          parsing_algorithm: "pymupdf", // Free alternative to unitable
          min_table_confidence: 0.8
        }
      });

      const parsed = await parser.parse(fileBuffer);
      
      // Extract content from parsed nodes
      const documents = parsed.nodes.map((node: any, index: number) => ({
        content: node.text || node.content || '',
        metadata: {
          filename,
          mimeType,
          nodeIndex: index,
          nodeType: node.variant || 'text',
          timestamp: Date.now(),
          source: 'file_upload'
        }
      })).filter(doc => doc.content.trim().length > 0);

      // Store in vector database
      await this.vectorStore.addDocuments(documents);

      return {
        success: true,
        chunksProcessed: documents.length,
        filename,
        metadata: parsed.metadata || {}
      };

    } catch (error) {
      console.error('Document processing error:', error);
      throw new Error(`Failed to process document: ${error}`);
    }
  }

  async processURL(url: string) {
    try {
      // Free web crawling
      const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      
      await page.setUserAgent('Mozilla/5.0 (compatible; FreeRAG-Bot/1.0)');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      const content = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script, style, nav, footer');
        scripts.forEach(el => el.remove());
        
        const mainContent = document.querySelector('main') || 
                           document.querySelector('[role="main"]') || 
                           document.body;
        
        return {
          title: document.title,
          text: mainContent?.textContent?.trim() || ''
        };
      });

      await browser.close();

      // Clean and chunk content
      const cleanText = content.text.replace(/\s+/g, ' ').trim();
      const chunks = this.chunkText(cleanText, 1000, 200);
      
      const documents = chunks.map((chunk, index) => ({
        content: chunk,
        metadata: {
          url,
          title: content.title,
          chunkIndex: index,
          timestamp: Date.now(),
          source: 'web_crawl'
        }
      }));

      await this.vectorStore.addDocuments(documents);

      return {
        success: true,
        chunksProcessed: documents.length,
        title: content.title,
        url
      };

    } catch (error) {
      console.error('URL processing error:', error);
      throw new Error(`Failed to process URL: ${error}`);
    }
  }

  private chunkText(text: string, chunkSize: number, overlap: number): string[] {
    const chunks: string[] = [];
    let start = 0;
    
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      chunks.push(text.substring(start, end));
      start += chunkSize - overlap;
    }
    
    return chunks;
  }

  async search(query: string, topK: number = 5) {
    return await this.vectorStore.search(query, topK);
  }
}