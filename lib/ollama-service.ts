import { Ollama } from 'ollama';

export class OllamaService {
  private ollama: Ollama;
  private model: string;

  constructor(model: string = 'llama2:7b') {
    this.ollama = new Ollama({
      host: process.env.OLLAMA_HOST || 'http://localhost:11434'
    });
    this.model = model;
  }

  async chat(messages: Array<{ role: string; content: string }>) {
    try {
      const response = await this.ollama.chat({
        model: this.model,
        messages,
        stream: false
      });

      return response.message.content;
    } catch (error) {
      console.error('Ollama chat error:', error);
      throw new Error(`Chat failed: ${error}`);
    }
  }

  async listModels() {
    try {
      const models = await this.ollama.list();
      return models.models.map(m => m.name);
    } catch (error) {
      console.error('Failed to list models:', error);
      return [];
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.ollama.list();
      return true;
    } catch {
      return false;
    }
  }
}