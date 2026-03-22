import { useState, useRef, useCallback, useEffect } from 'react';
import { VoicePipeline, ModelCategory, ModelManager, AudioCapture, AudioPlayback, SpeechActivity } from '@runanywhere/web';
import { VAD } from '@runanywhere/web-onnx';
import { useModelLoader } from '../hooks/useModelLoader';
import { ModelBanner } from './ModelBanner';

type VoiceState = 'idle' | 'loading-models' | 'listening' | 'processing' | 'speaking';
const VOICE_MAX_TOKENS = 640;

export function VoiceTab({ severity = 'medium' }: { severity?: string }) {
  // const severity = useParams() || 'medium';
  const llmLoader = useModelLoader(ModelCategory.Language, true);
  const sttLoader = useModelLoader(ModelCategory.SpeechRecognition, true);
  const ttsLoader = useModelLoader(ModelCategory.SpeechSynthesis, true);
  const vadLoader = useModelLoader(ModelCategory.Audio, true);

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const micRef = useRef<AudioCapture | null>(null);
  const pipelineRef = useRef<VoicePipeline | null>(null);
  const vadUnsub = useRef<(() => void) | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      micRef.current?.stop();
      vadUnsub.current?.();
    };
  }, []);

  // Ensure all 4 models are loaded
  const ensureModels = useCallback(async (): Promise<boolean> => {
    setVoiceState('loading-models');
    setError(null);

    const results = await Promise.all([
      vadLoader.ensure(),
      sttLoader.ensure(),
      llmLoader.ensure(),
      ttsLoader.ensure(),
    ]);

    if (results.every(Boolean)) {
      setVoiceState('idle');
      return true;
    }

    setError('Failed to load one or more voice models');
    setVoiceState('idle');
    return false;
  }, [vadLoader, sttLoader, llmLoader, ttsLoader]);

  // Start listening
  const startListening = useCallback(async () => {
    setTranscript('');
    setResponse('');
    setError(null);

    // Load models if needed
    const anyMissing = !ModelManager.getLoadedModel(ModelCategory.Audio)
      || !ModelManager.getLoadedModel(ModelCategory.SpeechRecognition)
      || !ModelManager.getLoadedModel(ModelCategory.Language)
      || !ModelManager.getLoadedModel(ModelCategory.SpeechSynthesis);

    if (anyMissing) {
      const ok = await ensureModels();
      if (!ok) return;
    }

    setVoiceState('listening');

    const mic = new AudioCapture({ sampleRate: 16000 });
    micRef.current = mic;

    if (!pipelineRef.current) {
      pipelineRef.current = new VoicePipeline();
    }

    // Start VAD + mic
    VAD.reset();

    vadUnsub.current = VAD.onSpeechActivity((activity) => {
      if (activity === SpeechActivity.Ended) {
        const segment = VAD.popSpeechSegment();
        if (segment && segment.samples.length > 1600) {
          processSpeech(segment.samples);
        }
      }
    });

    await mic.start(
      (chunk) => { VAD.processSamples(chunk); },
      (level) => { setAudioLevel(level); },
    );
  }, [ensureModels]);

  // Process a speech segment through the full pipeline
  const processSpeech = useCallback(async (audioData: Float32Array) => {
    const pipeline = pipelineRef.current;
    if (!pipeline) return;

    // Stop mic during processing
    micRef.current?.stop();
    vadUnsub.current?.();
    setVoiceState('processing');

    try {
      const result = await pipeline.processTurn(audioData, {
        maxTokens: VOICE_MAX_TOKENS,
        temperature: 0.7,
        systemPrompt: `You are a helpful voice assistant. The user is speaking with ${severity} severity urgency. Respond accordingly. If the user seems to be in an severe emergency situation, advise them to call emergency services immediately, if severity is medium then provide additional guidance and if severity is low then provide basic assistance. Keep responses concise and actionable.`,
      }, {
        onTranscription: (text) => {
          setTranscript(text);
        },
        onResponseToken: (_token, accumulated) => {
          setResponse(accumulated);
        },
        onResponseComplete: (text) => {
          setResponse(text);
        },
        onSynthesisComplete: async (audio, sampleRate) => {
          setVoiceState('speaking');
          const player = new AudioPlayback({ sampleRate });
          await player.play(audio, sampleRate);
          player.dispose();
        },
        onStateChange: (s) => {
          if (s === 'processingSTT') setVoiceState('processing');
          if (s === 'generatingResponse') setVoiceState('processing');
          if (s === 'playingTTS') setVoiceState('speaking');
        },
      });

      if (result) {
        setTranscript(result.transcription);
        setResponse(result.response);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }

    setVoiceState('idle');
    setAudioLevel(0);
  }, []);

  const stopListening = useCallback(() => {
    micRef.current?.stop();
    vadUnsub.current?.();
    setVoiceState('idle');
    setAudioLevel(0);
  }, []);

  // Which loaders are still loading?
  const pendingLoaders = [
    { label: 'VAD', loader: vadLoader },
    { label: 'STT', loader: sttLoader },
    { label: 'LLM', loader: llmLoader },
    { label: 'TTS', loader: ttsLoader },
  ].filter((l) => l.loader.state !== 'ready');

  const orbGlow = voiceState === 'listening'
    ? 'shadow-[0_0_40px_rgba(255,85,0,0.3)]'
    : voiceState === 'processing' || voiceState === 'speaking'
      ? 'shadow-[0_0_40px_rgba(34,197,94,0.3)]'
      : '';

  return (
    <div className="tab-panel voice-tab-panel flex flex-col gap-4 rounded-2xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-lg backdrop-blur-sm">
      {pendingLoaders.length > 0 && voiceState === 'idle' && (
        <ModelBanner
          state={pendingLoaders[0].loader.state}
          progress={pendingLoaders[0].loader.progress}
          error={pendingLoaders[0].loader.error}
          onLoad={ensureModels}
          label={`Voice (${pendingLoaders.map((l) => l.label).join(', ')})`}
        />
      )}

      {error && (
        <div className="model-banner rounded-xl border border-red-500/30 bg-red-500/10">
          <span className="error-text">{error}</span>
        </div>
      )}

      <div className="flex flex-col items-center gap-4 py-6 sm:py-8">
        <div
          className={`h-32 w-32 scale-[calc(1+var(--level,0)*0.3)] rounded-full bg-slate-800 transition-all duration-200 ${orbGlow}`}
          data-state={voiceState}
          style={{ '--level': audioLevel } as React.CSSProperties}
          role="status"
          aria-live="polite"
          aria-label={`Voice state ${voiceState}`}
        >
          <div className={`m-auto h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 opacity-90 ${voiceState === 'listening' ? 'animate-pulse' : ''}`} />
        </div>

        <p className="text-sm font-medium text-slate-400" aria-live="polite" aria-atomic="true">
          {voiceState === 'idle' && 'Tap to start listening'}
          {voiceState === 'loading-models' && 'Loading models...'}
          {voiceState === 'listening' && 'Listening... speak now'}
          {voiceState === 'processing' && 'Processing...'}
          {voiceState === 'speaking' && 'Speaking...'}
        </p>

        {voiceState === 'idle' || voiceState === 'loading-models' ? (
          <button
            className="inline-flex min-w-44 items-center justify-center rounded-xl bg-orange-500 px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={startListening}
            disabled={voiceState === 'loading-models'}
            aria-busy={voiceState === 'loading-models'}
            aria-label="Start listening for voice input"
          >
            Start Listening
          </button>
        ) : voiceState === 'listening' ? (
          <button
            className="inline-flex min-w-44 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 px-8 py-3 text-base font-semibold text-slate-100 transition-all duration-200 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80"
            onClick={stopListening}
            aria-label="Stop listening"
          >
            Stop
          </button>
        ) : null}
      </div>

      {transcript && (
        <div className="voice-card rounded-xl border border-slate-700/70 bg-slate-800/60 p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">You said:</h4>
          <p className="text-sm leading-relaxed text-slate-100">{transcript}</p>
        </div>
      )}

      {response && (
        <div className="voice-card rounded-xl border border-slate-700/70 bg-slate-800/60 p-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">AI response:</h4>
          <p className="text-sm leading-relaxed text-slate-100">{response}</p>
        </div>
      )}
    </div>
  );
}