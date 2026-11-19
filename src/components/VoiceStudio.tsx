import { FormEvent, useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send, Trash2 } from 'lucide-react';
import type { SupportedLanguage, UiCopy } from '../data/lisaProfile';
import type { SessionState, TranscriptItem } from '../hooks/useLiveAssistant';

interface VoiceStudioProps {
  language: SupportedLanguage;
  copy: UiCopy['studio'];
  sessionState: SessionState;
  isMuted: boolean;
  errorMessage: string | null;
  transcript: TranscriptItem[];
  audioLevel: number;
  onToggleMute: () => void;
  onSendText: (text: string) => void;
  onClearTranscript: () => void;
}

const BAR_WEIGHTS = [0.28, 0.52, 0.78, 0.96, 0.65, 0.88, 1.0, 0.72, 0.9, 0.58, 0.82, 0.44];

export function VoiceStudio({
  copy,
  sessionState,
  isMuted,
  errorMessage,
  transcript,
  audioLevel,
  onToggleMute,
  onSendText,
  onClearTranscript,
}: VoiceStudioProps) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  const isLive = sessionState === 'listening' || sessionState === 'speaking';

  const statusText = (() => {
    if (sessionState === 'connecting') return copy.connecting;
    if (sessionState === 'speaking') return copy.speaking;
    if (sessionState === 'listening') return isMuted ? copy.muted : copy.listening;
    return copy.ready;
  })();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSendText(draft);
    setDraft('');
  };

  return (
    <section
      aria-label={copy.title}
      className="flex flex-col h-full min-h-[460px] lg:min-h-[540px] bg-[#2D211B] border border-[#F4ECE4]/12 rounded-2xl p-6 sm:p-7"
    >
      {/* Top Studio Header */}
      <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#F4ECE4]/10">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.06em] text-[#CBBBAE]">{copy.title}</p>
          <div className="flex items-center gap-2.5 mt-1">
            {isLive && (
              <span
                aria-hidden="true"
                className={`inline-block w-2 h-2 rounded-full ${
                  sessionState === 'speaking' ? 'bg-[#D8B892]' : 'bg-[#C49E71]'
                }`}
              />
            )}
            <p className="text-sm font-medium text-[#F4ECE4] truncate">{statusText}</p>
          </div>
        </div>

        {/* Acoustic Cadence Bars & Clear Action */}
        <div className="flex items-center gap-4 shrink-0">
          <div
            aria-hidden="true"
            className="flex items-center gap-1 h-7 px-2"
            title={statusText}
          >
            {BAR_WEIGHTS.map((weight, idx) => {
              const activeScale = isLive
                ? Math.max(0.18, Math.min(1, 0.2 + audioLevel * weight * 1.15))
                : 0.16;
              return (
                <span
                  key={idx}
                  className="w-[2px] h-6 rounded-full bg-[#D8B892] transition-transform duration-100 origin-center"
                  style={{
                    transform: `scaleY(${activeScale})`,
                    opacity: isLive ? 0.45 + activeScale * 0.55 : 0.25,
                  }}
                />
              );
            })}
          </div>

          {transcript.length > 0 && (
            <button
              type="button"
              onClick={onClearTranscript}
              aria-label="Clear transcript"
              className="p-2 text-[#CBBBAE] hover:text-[#F4ECE4] rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8B892]"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mt-4 px-4 py-3 rounded-xl bg-[#3B261E] border border-[#E5987E]/30 text-sm text-[#F7D7CC]"
        >
          {errorMessage}
        </div>
      )}

      {/* Conversation Feed or Suggested Starters */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto py-5 space-y-5 pr-1 max-h-[340px]"
      >
        {transcript.length === 0 ? (
          <div className="flex flex-col justify-between h-full gap-6">
            <div className="space-y-2 pt-2">
              <h2 className="font-display text-2xl text-[#F4ECE4] font-medium leading-snug">
                {copy.emptyTitle}
              </h2>
              <p className="text-sm text-[#CBBBAE] leading-relaxed max-w-md">
                {copy.emptyBody}
              </p>
            </div>

            <div className="space-y-2.5">
              {copy.prompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSendText(prompt)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-[#231914]/70 hover:bg-[#382A22] border border-[#F4ECE4]/10 hover:border-[#D8B892]/40 text-sm text-[#EAE0D5] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8B892]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          transcript.map((item) => (
            <div key={item.id} className="space-y-1.5">
              <p className="text-xs font-medium text-[#D8B892]">
                {item.speaker === 'user' ? copy.userLabel : copy.assistantLabel}
              </p>
              <p className="text-[15px] leading-relaxed text-[#F4ECE4] whitespace-pre-wrap">
                {item.text}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Bottom Interaction Bar */}
      <form
        onSubmit={handleSubmit}
        className="pt-4 border-t border-[#F4ECE4]/10 flex items-center gap-2.5"
      >
        {isLive && (
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={`min-h-[42px] min-w-[42px] flex items-center justify-center rounded-xl border transition-colors duration-150 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8B892] ${
              isMuted
                ? 'bg-[#3B261E] border-[#E5987E]/40 text-[#F7D7CC]'
                : 'bg-[#231914] border-[#F4ECE4]/15 text-[#F4ECE4] hover:border-[#D8B892]/45'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={copy.inputPlaceholder}
          className="flex-1 min-w-0 min-h-[42px] px-4 py-2 rounded-xl bg-[#231914] border border-[#F4ECE4]/12 text-sm text-[#F4ECE4] placeholder:text-[#9F8E80] focus:outline-none focus:border-[#D8B892]/60"
        />

        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label={copy.sendLabel}
          className="min-h-[42px] px-4 py-2 rounded-xl bg-[#D8B892] text-[#231914] text-sm font-medium hover:bg-[#E4C9A8] disabled:opacity-40 disabled:pointer-events-none transition-colors duration-150 flex items-center gap-2 shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8B892]"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">{copy.sendLabel}</span>
        </button>
      </form>
    </section>
  );
}
