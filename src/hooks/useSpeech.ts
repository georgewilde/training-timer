import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseSpeechReturn {
  isMuted: boolean;
  isSupported: boolean;
  toggleMute: () => void;
  announce: (text: string) => void;
  warmUp: () => void;
}

function pickFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const english = voices.filter(v => v.lang.startsWith('en'));
  // Prefer voices whose name suggests female
  const female = english.find(v =>
    /female|samantha|victoria|karen|moira|fiona|tessa|zira/i.test(v.name)
  );
  return female ?? english[0] ?? null;
}

export function useSpeech(): UseSpeechReturn {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [isMuted, setIsMuted] = useState(false);
  const warmedUpRef = useRef(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Voices load asynchronously on some browsers
  useEffect(() => {
    if (!isSupported) return;
    const loadVoice = () => { voiceRef.current = pickFemaleVoice(); };
    loadVoice();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoice);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoice);
  }, [isSupported]);

  const warmUp = useCallback(() => {
    if (!isSupported || warmedUpRef.current) return;
    // iOS Safari requires speech to be triggered from a user gesture
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    if (voiceRef.current) utterance.voice = voiceRef.current;
    window.speechSynthesis.speak(utterance);
    warmedUpRef.current = true;
  }, [isSupported]);

  const announce = useCallback((text: string) => {
    if (!isSupported || isMuted) return;

    // Cancel any in-progress speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (voiceRef.current) utterance.voice = voiceRef.current;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev) {
        // Muting — cancel any current speech
        window.speechSynthesis?.cancel();
      }
      return !prev;
    });
  }, []);

  return { isMuted, isSupported, toggleMute, announce, warmUp };
}
