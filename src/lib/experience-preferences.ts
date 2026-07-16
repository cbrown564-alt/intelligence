import { createContext, useContext } from 'react';

export type MotionMode = 'full' | 'reduced';
export type QualityMode = 'full' | 'lite';

export interface ExperiencePreferencesValue {
  motion: MotionMode;
  quality: QualityMode;
  setMotion: (mode: MotionMode) => void;
  setQuality: (mode: QualityMode) => void;
}

export const ExperiencePreferencesContext =
  createContext<ExperiencePreferencesValue | null>(null);

export function useExperiencePreferences() {
  const value = useContext(ExperiencePreferencesContext);
  if (!value) {
    throw new Error(
      'useExperiencePreferences must be used inside ExperiencePreferencesProvider'
    );
  }
  return value;
}

