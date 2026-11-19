import { useCallback, useEffect, useRef, useState } from 'react';
import type { SupportedLanguage } from '../data/lisaProfile';

export type SessionState = 'idle' | 'connecting' | 'listening' | 'speaking' | 'error';

export interface TranscriptItem {
  id: string;
  speaker: 'user' | 'assistant';
  text: string;
}

function downsampleBuffer(
  buffer: Float32Array,
  inputSampleRate: number,
  outputSampleRate: number
): Float32Array {
  if (inputSampleRate === outputSampleRate) {
    return buffer;
  }
  const ratio = inputSampleRate / outputSampleRate;
  const newLength = Math.round(buffer.length / ratio);
  const result = new Float32Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < result.length) {
    const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
      accum += buffer[i];
      count++;
    }
    result[offsetResult] = count > 0 ? accum / count : 0;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }
  return result;
}

function float32ToPcmBase64(float32: Float32Array): string {
  const pcm16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const clamped = Math.max(-1, Math.min(1, float32[i]));
    pcm16[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }
  const bytes = new Uint8Array(pcm16.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64PcmToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const pcm16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = pcm16[i] / 0x8000;
  }
  return float32;
}

export function useLiveAssistant() {
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const isMutedRef = useRef<boolean>(false);
  const isReadyRef = useRef<boolean>(false);
  const pendingPromptRef = useRef<string | null>(null);
  const lastLevelUpdateRef = useRef<number>(0);

  const appendTranscript = useCallback((speaker: 'user' | 'assistant', chunk: string) => {
    const trimmed = chunk;
    if (!trimmed) return;
    setTranscript((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.speaker === speaker) {
        return [
          ...prev.slice(0, -1),
          { ...last, text: `${last.text}${trimmed}` },
        ];
      }
      return [
        ...prev,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          speaker,
          text: trimmed,
        },
      ];
    });
  }, []);

  const stopPlaybackQueue = useCallback(() => {
    for (const src of activeSourcesRef.current) {
      try {
        src.stop();
      } catch {
        // already stopped
      }
    }
    activeSourcesRef.current.clear();
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    } else {
      nextStartTimeRef.current = 0;
    }
  }, []);

  const cleanupResources = useCallback(() => {
    isReadyRef.current = false;
    pendingPromptRef.current = null;
    stopPlaybackQueue();

    if (processorRef.current) {
      processorRef.current.onaudioprocess = null;
      try {
        processorRef.current.disconnect();
      } catch {
        // ignore
      }
      processorRef.current = null;
    }

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      sourceNodeRef.current = null;
    }

    if (mediaStreamRef.current) {
      for (const track of mediaStreamRef.current.getTracks()) {
        track.stop();
      }
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }

    setAudioLevel(0);
  }, [stopPlaybackQueue]);

  const stopSession = useCallback(() => {
    cleanupResources();
    setIsMuted(false);
    isMutedRef.current = false;
    setSessionState('idle');
  }, [cleanupResources]);

  const playAudioChunk = useCallback((base64Data: string) => {
    const ctx = outputAudioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const float32 = base64PcmToFloat32(base64Data);
    if (float32.length === 0) return;

    // Compute RMS for acoustic indicator
    let sumSq = 0;
    for (let i = 0; i < float32.length; i++) {
      sumSq += float32[i] * float32[i];
    }
    const rms = Math.min(1, Math.sqrt(sumSq / float32.length) * 3.5);
    setAudioLevel(rms);
    setSessionState('speaking');

    const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const startTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
    source.start(startTime);
    nextStartTimeRef.current = startTime + audioBuffer.duration;

    activeSourcesRef.current.add(source);
    source.onended = () => {
      activeSourcesRef.current.delete(source);
      if (activeSourcesRef.current.size === 0 && isReadyRef.current) {
        setSessionState('listening');
        setAudioLevel(0);
      }
    };
  }, []);

  const startSession = useCallback(
    async (language: SupportedLanguage, initialPrompt?: string) => {
      cleanupResources();
      setErrorMessage(null);
      setIsMuted(false);
      isMutedRef.current = false;
      setSessionState('connecting');
      pendingPromptRef.current = initialPrompt ?? null;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        mediaStreamRef.current = stream;

        const inputCtx = new AudioContext({ sampleRate: 16000 });
        const outputCtx = new AudioContext({ sampleRate: 24000 });
        if (inputCtx.state === 'suspended') await inputCtx.resume();
        if (outputCtx.state === 'suspended') await outputCtx.resume();

        inputAudioCtxRef.current = inputCtx;
        outputAudioCtxRef.current = outputCtx;
        nextStartTimeRef.current = outputCtx.currentTime;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(`${protocol}//${window.location.host}/live`);
        wsRef.current = ws;

        ws.onopen = () => {
          ws.send(JSON.stringify({ type: 'start', language }));
        };

        ws.onmessage = (event) => {
          let msg: {
            type?: string;
            data?: string;
            text?: string;
            message?: string;
          };
          try {
            msg = JSON.parse(event.data);
          } catch {
            return;
          }

          if (msg.type === 'ready') {
            isReadyRef.current = true;
            setSessionState('listening');

            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            // Connect processor through silent GainNode so browsers fire onaudioprocess without mic echo
            const silentGain = inputCtx.createGain();
            silentGain.gain.value = 0;

            source.connect(processor);
            processor.connect(silentGain);
            silentGain.connect(inputCtx.destination);

            sourceNodeRef.current = source;
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              if (
                !isReadyRef.current ||
                isMutedRef.current ||
                !wsRef.current ||
                wsRef.current.readyState !== WebSocket.OPEN
              ) {
                return;
              }
              const rawChannel = e.inputBuffer.getChannelData(0);
              const resampled = downsampleBuffer(rawChannel, inputCtx.sampleRate, 16000);

              if (activeSourcesRef.current.size === 0) {
                const now = performance.now();
                if (now - lastLevelUpdateRef.current > 60) {
                  lastLevelUpdateRef.current = now;
                  let sumSq = 0;
                  for (let i = 0; i < resampled.length; i += 4) {
                    sumSq += resampled[i] * resampled[i];
                  }
                  const rms = Math.min(1, Math.sqrt(sumSq / (resampled.length / 4)) * 4);
                  setAudioLevel(rms);
                }
              }

              const base64Audio = float32ToPcmBase64(resampled);
              wsRef.current.send(JSON.stringify({ type: 'audio', data: base64Audio }));
            };

            if (pendingPromptRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
              const textToSend = pendingPromptRef.current;
              pendingPromptRef.current = null;
              appendTranscript('user', textToSend);
              wsRef.current.send(JSON.stringify({ type: 'text', text: textToSend }));
            }
            return;
          }

          if (msg.type === 'audio' && msg.data) {
            playAudioChunk(msg.data);
            return;
          }

          if (msg.type === 'inputTranscript' && msg.text) {
            appendTranscript('user', msg.text);
            return;
          }

          if (msg.type === 'outputTranscript' && msg.text) {
            appendTranscript('assistant', msg.text);
            return;
          }

          if (msg.type === 'interrupted') {
            stopPlaybackQueue();
            if (isReadyRef.current) {
              setSessionState('listening');
              setAudioLevel(0);
            }
            return;
          }

          if (msg.type === 'error') {
            setErrorMessage(msg.message ?? 'Live voice session error.');
            cleanupResources();
            setSessionState('error');
            return;
          }

          if (msg.type === 'closed') {
            cleanupResources();
            setSessionState('idle');
          }
        };

        ws.onerror = () => {
          setErrorMessage('WebSocket connection error. Please try again.');
          cleanupResources();
          setSessionState('error');
        };

        ws.onclose = () => {
          if (isReadyRef.current) {
            cleanupResources();
            setSessionState('idle');
          }
        };
      } catch (err) {
        const message =
          err instanceof Error && err.name === 'NotAllowedError'
            ? 'Microphone access was denied. Please allow microphone access or use text messages.'
            : err instanceof Error
              ? err.message
              : 'Unable to initialize audio session.';
        setErrorMessage(message);
        cleanupResources();
        setSessionState('error');
      }
    },
    [appendTranscript, cleanupResources, playAudioChunk, stopPlaybackQueue]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      return next;
    });
  }, []);

  const sendTextMessage = useCallback(
    async (text: string, language: SupportedLanguage) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && isReadyRef.current) {
        appendTranscript('user', trimmed);
        wsRef.current.send(JSON.stringify({ type: 'text', text: trimmed }));
      } else {
        await startSession(language, trimmed);
      }
    },
    [appendTranscript, startSession]
  );

  const clearTranscript = useCallback(() => {
    setTranscript([]);
  }, []);

  useEffect(() => {
    return () => {
      cleanupResources();
    };
  }, [cleanupResources]);

  return {
    sessionState,
    isMuted,
    errorMessage,
    transcript,
    audioLevel,
    startSession,
    stopSession,
    toggleMute,
    sendTextMessage,
    clearTranscript,
  };
}
