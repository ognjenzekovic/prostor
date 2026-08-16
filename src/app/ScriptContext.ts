import { createContext, useContext } from 'react';

/** Serbian is written in both scripts; the choice is independent of language (spec 4.7). */
export type Script = 'latin' | 'cyrillic';

export type ScriptContextValue = {
  script: Script;
  setScript: (script: Script) => void;
};

export const ScriptContext = createContext<ScriptContextValue | null>(null);

/** Current script and setter. Must be used inside <ScriptProvider>. */
export function useScript(): ScriptContextValue {
  const value = useContext(ScriptContext);

  if (!value) {
    throw new Error('useScript must be used inside <ScriptProvider>');
  }

  return value;
}
