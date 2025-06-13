'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Send, 
  Upload, 
  Link, 
  FileText, 
  Check,
  AlertCircle,
  Wifi,
  WifiOff
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    filename?: string;
    url?: string;
    score: number;
    type: string;
  }>;
  model?: string;
}

interface ProcessedDocument {
  filename?: string;
  url?: string;
  chunksProcessed: number;
  uploadDate: string;
  type: 'file' | 'url';
}

interface HealthStatus {
  status: string;
  services: {
    ollama: {
      available: boolean;
      models: string[];
    };
    chromadb: boolean;
    openparse: boolean;
  };
}

export default function FreeRAGInterface() {
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check health status on load
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await fetch('/api/rag/health');
      const health = await response.json();
      setHealthStatus(health);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadStatus('idle');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/rag/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setDocuments(prev => [...prev, {
          filename: file.name,
          chunksProcessed: result.data.chunksProcessed,
          uploadDate: new Date().toISOString(),
          type: 'file'
        }]);
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('File upload error:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlProcess = async () => {
    if (!url.trim()) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/rag/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setDocuments(prev => [...prev, {
          url: url.trim(),
          chunksProcessed: result.data.chunksProcessed,
          uploadDate: new Date().toISOString(),
          type: 'url'
        }]);
        setUrl('');
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('URL processing error:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChat = async () => {
    if (!query.trim()) return;

    const newMessage: ChatMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, newMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          conversationHistory: messages.map(({ role, content }) => ({ role, content }))
        }),
      });

      const result = await response.json();

      if (result.success) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: result.response,
          sources: result.sources,
          model: result.model
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure Ollama is running locally (run "ollama serve" in terminal).'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const isOllamaReady = healthStatus?.services?.ollama?.available && 
                      healthStatus?.services?.ollama?.models?.length > 0;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Free AI Document Assistant</h1>
        <p className="text-muted-foreground">
          Powered by Open Parse + Ollama + ChromaDB - 100% Free & Local
        </p>
      </div>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOllamaReady ? (
              <><Wifi className="h-5 w-5 text-green-500" /> System Status</>
            ) : (
              <><WifiOff className="h-5 w-5 text-red-500" /> System Status</>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${healthStatus?.services?.ollama?.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>Ollama: {healthStatus?.services?.ollama?.available ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>ChromaDB: Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Open Parse: Ready</span>
            </div>
          </div>
          
          {!isOllamaReady && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ollama is not running. Please run <code className="bg-gray-100 px-1 rounded">ollama serve</code> in your terminal, 
                then install a model: <code className="bg-gray-100 px-1 rounded">ollama pull llama2:7b</code>
              </AlertDescription>
            </Alert>
          )}

          {healthStatus?.services?.ollama?.models && healthStatus.services.ollama.models.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Available Models:</p>
              <div className="flex flex-wrap gap-1">
                {healthStatus.services.ollama.models.map(model => (
                  <Badge key={model} variant="outline">{model}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="crawl">Crawl URLs</TabsTrigger>
          <TabsTrigger value="chat">Ask Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Documents (100% Free)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="mb-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isProcessing ? 'Processing...' : 'Choose File'}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Support for PDF, Word, and text files
                  </p>
                </div>
                
                {uploadStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-4 w-4" />
                    <span>Document processed successfully!</span>
                  </div>
                )}
                
                {uploadStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Error processing document. Please try again.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crawl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Crawl Web Page (100% Free)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter URL to crawl (e.g., https://example.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUrlProcess()}
                />
                <Button onClick={handleUrlProcess} disabled={isProcessing || !url.trim()}>
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Crawl'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ask Questions (Local AI Model)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Chat Messages */}
                <div className="min-h-[400px] max-h-[600px] overflow-y-auto space-y-4 p-4 border rounded-lg bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Upload documents or crawl web pages first, then ask questions!</p>
                      {!isOllamaReady && (
                        <p className="text-red-500 text-sm mt-2">
                          ⚠️ Please start Ollama first: run "ollama serve" in terminal
                        </p>
                      )}
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-white border'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.model && (
                            <div className="mt-2 pt-2 border-t">
                              <Badge variant="secondary" className="text-xs">
                                {message.model}
                              </Badge>
                            </div>
                          )}
                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-xs font-medium mb-2">Sources:</p>
                              <div className="space-y-1">
                                {message.sources.map((source, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs mr-1">
                                    {source.filename || source.url}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border p-3 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder={isOllamaReady ? "Ask a question about your uploaded content..." : "Please start Ollama first..."}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                    disabled={documents.length === 0 || !isOllamaReady}
                  />
                  <Button 
                    onClick={handleChat} 
                    disabled={isLoading || !query.trim() || documents.length === 0 || !isOllamaReady}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {documents.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Upload documents or crawl URLs first to enable chat
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Library */}
      {documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processed Content ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {doc.type === 'file' ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Link className="h-4 w-4" />
                    )}
                    <div>
                      <p className="font-medium">
                        {doc.filename || doc.url}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doc.chunksProcessed} chunks processed
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}