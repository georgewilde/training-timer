import { useState, useCallback, useRef } from 'react';

export interface UseSpeechReturn {
  isMuted: boolean;
  isSupported: boolean;
  toggleMute: () => void;
  announce: (text: string) => void;
  warmUp: () => void;
}

export function useSpeech(): UseSpeechReturn {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [isMuted, setIsMuted] = useState(false);
  const warmedUpRef = useRef(false);

  const warmUp = useCallback(() => {
    if (!isSupported || warmedUpRef.current) return;
    // iOS Safari requires speech to be triggered from a user gesture
    const utterance = new SpeechSynthesisUtterance('');
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
    warmedUpRef.current = true;
  }, [isSupported]);

  const announce = useCallback((text: string) => {
    if (!isSupported || isMuted) return;

    // Cancel any in-progress speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
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
