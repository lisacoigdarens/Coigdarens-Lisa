import { useState } from 'react';
import { Mic, MicOff, PhoneOff } from 'lucide-react';
import {
  CONTACT_INFO,
  EDUCATIONS,
  EXPERIENCES,
  LANGUAGE_OPTIONS,
  PROFILE_LISTS,
  SupportedLanguage,
  UI_COPY,
} from './data/lisaProfile';
import { useLiveAssistant } from './hooks/useLiveAssistant';
import { VoiceStudio } from './components/VoiceStudio';
import { CvModal } from './components/CvModal';

export default function App() {
  const [language, setLanguage] = useState<SupportedLanguage>('fr');
  const [isCvOpen, setIsCvOpen] = useState(false);

  const {
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
  } = useLiveAssistant();

  const copy = UI_COPY[language];
  const isLive =
    sessionState === 'connecting' ||
    sessionState === 'listening' ||
    sessionState === 'speaking';

  const handleLanguageChange = (nextLang: SupportedLanguage) => {
    setLanguage(nextLang);
    if (sessionState === 'listening' || sessionState === 'speaking') {
      const switchPhrase: Record<SupportedLanguage, string> = {
        fr: 'Merci de poursuivre notre conversation en français.',
        en: 'Please continue our conversation in English.',
        es: 'Por favor, continuemos nuestra conversación en español.',
        it: 'Per favore, continuiamo la nostra conversazione in italiano.',
      };
      sendTextMessage(switchPhrase[nextLang], nextLang);
    }
  };

  const handlePrimaryVoiceClick = () => {
    if (isLive) {
      stopSession();
    } else {
      startSession(language);
    }
  };

  return (
    <div className="min-h-screen bg-[#231914] text-[#F4ECE4] flex flex-col">
      {/* Top Navigation — Strict 3-Zone Contract */}
      <header className="w-full border-b border-[#F4ECE4]/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between gap-8">
          <a
            href="#assistant"
            className="font-display text-2xl font-medium tracking-tight text-[#F4ECE4] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D8B892]"
          >
            Lisa Coigdarens
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-8 text-sm text-[#CBBBAE]"
          >
            <a
              href="#assistant"
              className="hover:text-[#F4ECE4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {copy.nav.assistant}
            </a>
            <a
              href="#experience"
              className="hover:text-[#F4ECE4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {copy.nav.experience}
            </a>
            <a
              href="#education"
              className="hover:text-[#F4ECE4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {copy.nav.education}
            </a>
            <a
              href="#profile"
              className="hover:text-[#F4ECE4] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {copy.nav.profile}
            </a>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsCvOpen(true)}
              className="px-4 py-2 rounded-lg border border-[#D8B892]/40 text-xs font-medium text-[#F4ECE4] hover:bg-[#D8B892] hover:text-[#231914] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8B892]"
            >
              {copy.nav.viewCv}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Split Section */}
        <section id="assistant" className="max-w-6xl mx-auto px-6 sm:px-10 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Editorial Column */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-8 py-2">
              <div className="space-y-6">
                <p className="text-xs tracking-[0.06em] text-[#D8B892]">
                  {copy.hero.kicker}
                </p>

                <h1
                  className="font-display text-4xl sm:text-5xl lg:text-[54px] font-normal leading-[1.08] tracking-tight text-[#F4ECE4]"
                  style={{ textWrap: 'balance' }}
                >
                  {copy.hero.headline}
                </h1>

                <p className="text-[15px] sm:text-base leading-relaxed text-[#CBBBAE] max-w-xl">
                  {copy.hero.subtitle}
                </p>
              </div>

              <div className="space-y-6">
                {/* Language Segmented Selector */}
                <div className="space-y-2.5">
                  <p className="text-xs text-[#CBBBAE]">{copy.hero.languageLabel}</p>
                  <div
                    role="group"
                    aria-label={copy.hero.languageLabel}
                    className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#2D211B] border border-[#F4ECE4]/10"
                  >
                    {LANGUAGE_OPTIONS.map((opt) => {
                      const active = language === opt.code;
                      return (
                        <button
                          key={opt.code}
                          type="button"
                          onClick={() => handleLanguageChange(opt.code)}
                          className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8B892] ${
                            active
                              ? 'bg-[#D8B892] text-[#231914]'
                              : 'text-[#CBBBAE] hover:text-[#F4ECE4]'
                          }`}
                        >
                          {opt.nativeName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Voice Action */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrimaryVoiceClick}
                    className={`inline-flex items-center justify-center gap-2.5 min-h-[46px] px-6 py-3 rounded-xl text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8B892] ${
                      isLive
                        ? 'bg-[#3B261E] text-[#F4ECE4] border border-[#E5987E]/40 hover:bg-[#492F25]'
                        : 'bg-[#D8B892] text-[#231914] hover:bg-[#E4C9A8]'
                    }`}
                  >
                    {sessionState === 'connecting' ? (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>{copy.hero.connecting}</span>
                      </>
                    ) : isLive ? (
                      <>
                        <PhoneOff className="w-4 h-4" />
                        <span>{copy.hero.endVoice}</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>{copy.hero.startVoice}</span>
                      </>
                    )}
                  </button>

                  {isLive && sessionState !== 'connecting' && (
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="inline-flex items-center gap-2 min-h-[46px] px-4 py-3 rounded-xl border border-[#F4ECE4]/15 text-sm text-[#F4ECE4] hover:border-[#D8B892]/50 transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8B892]"
                    >
                      {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      <span>{isMuted ? copy.hero.unmuteMic : copy.hero.muteMic}</span>
                    </button>
                  )}
                </div>

                {/* Quiet Unboxed Contact Metadata */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#CBBBAE] pt-1">
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="hover:text-[#F4ECE4] transition-colors"
                  >
                    {CONTACT_INFO.email}
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href="tel:+33624177127"
                    className="tabular-nums hover:text-[#F4ECE4] transition-colors"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                  <span aria-hidden="true">·</span>
                  <span>{CONTACT_INFO.city}</span>
                </div>
              </div>
            </div>

            {/* Right Live Voice Studio Column */}
            <div className="lg:col-span-6">
              <VoiceStudio
                language={language}
                copy={copy.studio}
                sessionState={sessionState}
                isMuted={isMuted}
                errorMessage={errorMessage}
                transcript={transcript}
                audioLevel={audioLevel}
                onToggleMute={toggleMute}
                onSendText={(text) => sendTextMessage(text, language)}
                onClearTranscript={clearTranscript}
              />
            </div>
          </div>
        </section>

        {/* Full-Width Key Credentials Strip */}
        <section
          aria-label="Key credentials"
          className="border-y border-[#F4ECE4]/10 bg-[#281D18]"
        >
          <div className="max-w-6xl mx-auto px-6 sm:px-10 py-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {copy.highlights.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-xs text-[#CBBBAE]">{item.label}</p>
                <p className="font-display text-xl text-[#F4ECE4] font-medium">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 01. Experience Section */}
        <section id="experience" className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
          <div className="max-w-2xl space-y-2 mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#F4ECE4]">
              {copy.sections.experienceTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#CBBBAE]">
              {copy.sections.experienceLead}
            </p>
          </div>

          <div className="divide-y divide-[#F4ECE4]/10 border-t border-b border-[#F4ECE4]/10">
            {EXPERIENCES.map((exp) => (
              <article
                key={exp.id}
                className="py-9 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10"
              >
                <div className="lg:col-span-4 space-y-1.5">
                  <p className="text-xs tabular-nums text-[#D8B892]">{exp.period}</p>
                  <h3 className="font-display text-2xl text-[#F4ECE4] font-medium">
                    {exp.company}
                  </h3>
                  <p className="text-xs text-[#CBBBAE]">
                    <span>{exp.location}</span>
                    <span aria-hidden="true" className="mx-2">·</span>
                    <span>{exp.contractType[language]}</span>
                  </p>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <h4 className="text-base font-medium text-[#F4ECE4]">
                    {exp.role[language]}
                  </h4>
                  <ul className="space-y-2 text-[15px] leading-relaxed text-[#CBBBAE]">
                    {exp.highlights[language].map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 w-1.5 h-[1px] bg-[#D8B892] shrink-0"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 02. Education Section */}
        <section id="education" className="max-w-6xl mx-auto px-6 sm:px-10 pb-20">
          <div className="max-w-2xl space-y-2 mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#F4ECE4]">
              {copy.sections.educationTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#CBBBAE]">
              {copy.sections.educationLead}
            </p>
          </div>

          <div className="divide-y divide-[#F4ECE4]/10 border-t border-b border-[#F4ECE4]/10">
            {EDUCATIONS.map((edu) => (
              <article
                key={edu.id}
                className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10"
              >
                <div className="lg:col-span-4 space-y-1.5">
                  <p className="text-xs tabular-nums text-[#D8B892]">{edu.period}</p>
                  <h3 className="font-display text-2xl text-[#F4ECE4] font-medium">
                    {edu.institution}
                  </h3>
                  <p className="text-xs text-[#CBBBAE]">{edu.location}</p>
                </div>

                <div className="lg:col-span-8 space-y-2.5">
                  <h4 className="text-base font-medium text-[#F4ECE4]">
                    {edu.degree[language]}
                  </h4>
                  <p className="text-[15px] leading-relaxed text-[#CBBBAE] max-w-2xl">
                    {edu.details[language]}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 03. Profile, Languages, Tools & Interests */}
        <section id="profile" className="max-w-6xl mx-auto px-6 sm:px-10 pb-24">
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#F4ECE4] mb-10">
            {copy.sections.profileTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-[#F4ECE4]/10 pt-10">
            <div className="space-y-4">
              <h3 className="font-display text-2xl text-[#F4ECE4] font-medium">
                {copy.sections.languagesHeading}
              </h3>
              <ul className="space-y-3 text-sm">
                {PROFILE_LISTS.languages.map((lang) => (
                  <li
                    key={lang.name}
                    className="flex items-baseline justify-between gap-4 pb-2 border-b border-[#F4ECE4]/8"
                  >
                    <span className="text-[#F4ECE4]">{lang.name}</span>
                    <span className="text-xs text-[#CBBBAE]">{lang.level}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-2xl text-[#F4ECE4] font-medium">
                {copy.sections.toolsHeading}
              </h3>
              <ul className="space-y-2.5 text-sm text-[#CBBBAE]">
                {PROFILE_LISTS.tools.map((tool) => (
                  <li key={tool} className="pb-2 border-b border-[#F4ECE4]/8">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="font-display text-2xl text-[#F4ECE4] font-medium">
                  {copy.sections.strengthsHeading}
                </h3>
                <p className="text-sm leading-relaxed text-[#CBBBAE]">
                  {PROFILE_LISTS.strengths[language].join(' · ')}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-2xl text-[#F4ECE4] font-medium">
                  {copy.sections.interestsHeading}
                </h3>
                <ul className="space-y-2 text-sm text-[#CBBBAE]">
                  {PROFILE_LISTS.interests[language].map((interest) => (
                    <li key={interest}>{interest}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-[#F4ECE4]/10 bg-[#1E1511]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-xs text-[#CBBBAE]">{copy.footer.note}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#F4ECE4]">
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="hover:text-[#D8B892] transition-colors"
            >
              {CONTACT_INFO.email}
            </a>
            <span aria-hidden="true" className="text-[#CBBBAE]">·</span>
            <a
              href="tel:+33624177127"
              className="tabular-nums hover:text-[#D8B892] transition-colors"
            >
              {CONTACT_INFO.phone}
            </a>
            <span aria-hidden="true" className="text-[#CBBBAE]">·</span>
            <button
              type="button"
              onClick={() => setIsCvOpen(true)}
              className="hover:text-[#D8B892] underline underline-offset-4 transition-colors"
            >
              {copy.nav.viewCv}
            </button>
          </div>
        </div>
      </footer>

      <CvModal
        isOpen={isCvOpen}
        copy={copy.modal}
        onClose={() => setIsCvOpen(false)}
      />
    </div>
  );
}
