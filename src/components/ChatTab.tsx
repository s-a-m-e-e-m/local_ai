import { useState, useRef, useEffect, useCallback } from 'react';
import { ModelCategory } from '@runanywhere/web';
import { TextGeneration } from '@runanywhere/web-llamacpp';
import { useModelLoader } from '../hooks/useModelLoader';
import mikeImg from '../assets/image.png';
import { ModelBanner } from './ModelBanner';

//---------------------------------------------------------------------------
import { extractPdfText } from "../utils/extractPdfText";
import { extractImageText } from "../utils/extractImageText";
import { extractDocxText } from "../utils/extractDocxText";
import { VoiceTab } from './VoiceTab';

export async function extractTextFromFile(file: File): Promise<string> {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return extractPdfText(file);
  }

  if (type.startsWith("image/")) {
    return extractImageText(file);
  }

  if (
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return extractDocxText(file);
  }

  throw new Error("Unsupported file type");
}
//---------------------------------------------------------------------------

interface Message {
  role: 'user' | 'assistant';
  text: string;
  stats?: { tokens: number; tokPerSec: number; latencyMs: number };
}

const MAX_CONTEXT_CHARS = 5000;
const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 200;
const TOP_CHUNKS = 4;

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function isSummaryQuery(query: string): boolean {
  return /summary|summarize|overview|tldr|tl;dr|brief/i.test(query);
}

function queryTerms(query: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'to', 'of', 'for', 'in', 'on', 'at', 'with', 'about']);
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2 && !stopWords.has(term));
}

function splitIntoChunks(text: string, chunkSize: number, overlap: number): string[] {
  if (!text) return [];

  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    if (end >= text.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}

function buildContextForQuery(documentText: string, query: string): string {
  const cleanText = normalizeWhitespace(documentText);
  if (!cleanText) return '';

  if (cleanText.length <= MAX_CONTEXT_CHARS) {
    return cleanText;
  }

  if (isSummaryQuery(query)) {
    return cleanText.slice(0, MAX_CONTEXT_CHARS);
  }

  const terms = queryTerms(query);
  if (!terms.length) {
    return cleanText.slice(0, MAX_CONTEXT_CHARS);
  }

  const chunks = splitIntoChunks(cleanText, CHUNK_SIZE, CHUNK_OVERLAP);
  const ranked = chunks
    .map((chunk, idx) => {
      const lower = chunk.toLowerCase();
      const score = terms.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0);
      return { idx, score, chunk };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const selected = (ranked.length ? ranked.slice(0, TOP_CHUNKS).map((entry) => entry) : chunks.slice(0, TOP_CHUNKS).map((chunk, idx) => ({ idx, score: 0, chunk })))
    .sort((a, b) => a.idx - b.idx)
    .map((entry) => entry.chunk)
    .join('\n\n');

  return selected.slice(0, MAX_CONTEXT_CHARS);
}

export function ChatTab() {

  const [openMic, setOpenMic] = useState(false);
  const severity = 'low';

  const loader = useModelLoader(ModelCategory.Language, false, {
    preferredModelId: 'lfm2-350m-q4_k_m',
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const cancelRef = useRef<(() => void) | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    setExtracting(true);
    setExtractError(null);
    setFileName(selected.name);
    setExtractedText('');

    try {
      const text = await extractTextFromFile(selected);
      const normalized = normalizeWhitespace(text);
      setExtractedText(normalized);
      if (!normalized) {
        setExtractError('No text was detected in this file. For scanned PDFs/images, OCR quality may vary.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setExtractError(msg);
      setFileName('');
      setExtractedText('');
    } finally {
      setExtracting(false);
      event.target.value = '';
    }
  }, []);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || generating) return;

    // Ensure model is loaded
    if (loader.state !== 'ready') {
      const ok = await loader.ensure();
      if (!ok) return;
    }

    const selectedContext = extractedText ? buildContextForQuery(extractedText, text) : '';
    const prompt = selectedContext
      ? `User message:\n${text}\n\nUse the document context below to answer. If important details are missing, say so.\n\nDocument: ${fileName || 'uploaded file'}\nContext excerpt:\n${selectedContext}`
      : text;

    const displayText = selectedContext
      ? `${text}\n\n[Using extracted context from ${fileName || 'uploaded file'} (${selectedContext.length}/${extractedText.length} chars)]`
      : text;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: displayText }]);
    setGenerating(true);

    // Add empty assistant message for streaming
    const assistantIdx = messages.length + 1;
    setMessages((prev) => [...prev, { role: 'assistant', text: '' }]);

    try {
      const { stream, result: resultPromise, cancel } = await TextGeneration.generateStream(prompt, {
        maxTokens: selectedContext ? 720 : 1012,
        temperature: 0.7,
      });
      cancelRef.current = cancel;

      let accumulated = '';
      for await (const token of stream) {
        accumulated += token;
        setMessages((prev) => {
          const updated = [...prev];
          updated[assistantIdx] = { role: 'assistant', text: accumulated };
          return updated;
        });
      }

      const result = await resultPromise;
      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantIdx] = {
          role: 'assistant',
          text: result.text || accumulated,
          stats: {
            tokens: result.tokensUsed,
            tokPerSec: result.tokensPerSecond,
            latencyMs: result.latencyMs,
          },
        };
        return updated;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantIdx] = { role: 'assistant', text: `Error: ${msg}` };
        return updated;
      });
    } finally {
      cancelRef.current = null;
      setGenerating(false);
    }
  }, [input, generating, messages.length, loader, extractedText, fileName]);

  const handleCancel = () => {
    cancelRef.current?.();
  };

  const clearExtractedContext = () => {
    setFileName('');
    setExtractedText('');
    setExtractError(null);
  };

  return (
    <div className="tab-panel chat-panel">
      <ModelBanner
        state={loader.state}
        progress={loader.progress}
        error={loader.error}
        onLoad={loader.ensure}
        label="LLM"
      />

      <div className="message-list" ref={listRef}>
        {messages.length === 0 && (
          <div className="empty-state">
            <h3>Start a conversation</h3>
            <p>Ask anything</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`message message-${msg.role}`}>
            <div className="message-bubble">
              <p>{msg.text || '...'}</p>
              {msg.stats && (
                <div className="message-stats">
                  {msg.stats.tokens} tokens · {msg.stats.tokPerSec.toFixed(1)} tok/s · {msg.stats.latencyMs.toFixed(0)}ms
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-file-upload">
        <input
          type="file"
          accept=".pdf,.docx,image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
          disabled={generating || extracting}
        />
        {extracting && <p>Extracting text from file...</p>}
        {!extracting && fileName && extractedText && (
          <p>
            Loaded context from <strong>{fileName}</strong> ({extractedText.length} chars)
          </p>
        )}
        {extractError && <p>Error: {extractError}</p>}
        {extractedText && (
          <button type="button" className="btn" onClick={clearExtractedContext} disabled={generating || extracting}>
            Clear file context
          </button>
        )}
      </div>

      <form
        className="chat-input"
        onSubmit={(e) => { e.preventDefault(); send(); }}
      >
        <input
          type="text"
          placeholder="Message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={generating}
        />
        <button
          type="button"
          className="btn chat-mic-btn"
          onClick={() => setOpenMic(true)}
          aria-label="Open voice support"
          disabled={generating}
        >
          <img
            src={mikeImg}
            alt="Voice Support"
            className="chat-mic-icon"
          />
        </button>
        {generating ? (
          <button type="button" className="btn" onClick={handleCancel}>Stop</button>
        ) : (
          <button type="submit" className="btn btn-primary" disabled={!input.trim()}>Send</button>
        )}
      </form>

      {openMic && (
        <div className="voice-modal-overlay" role="dialog" aria-modal="true" aria-label="Voice support dialog">
          <div id="voice-support-modal" className="voice-modal-card">
            <div className="voice-modal-header">
              <h3 className="text-lg font-semibold text-slate-100">Voice Support</h3>
              <button
                type="button"
                onClick={() => setOpenMic(false)}
                className="rounded-lg border border-slate-600 px-3 py-1 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/60 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                aria-label="Close voice support"
              >
                X
              </button>
            </div>
            <div className="voice-modal-body">
              <VoiceTab severity={severity} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
