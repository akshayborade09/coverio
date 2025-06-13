export class ChromaApi {
  heartbeat() {
    return Promise.resolve({});
  }
}

export class OpenAIEmbeddingFunction {
  embed(texts: string[]) {
    // return dummy zero vectors of length 768
    return texts.map(() => Array(768).fill(0));
  }
} 