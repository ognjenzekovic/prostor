import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ScriptContext, type Script } from './ScriptContext';

const STORAGE_KEY = 'script';

/**
 * Script choice is a display preference, not a credential — localStorage is
 * fine here (the ban in the project rules covers auth tokens only).
 * TODO: for signed-in users, sync with User.script from the API.
 */
function readStoredScript(): Script {
  return localStorage.getItem(STORAGE_KEY) === 'cyrillic' ? 'cyrillic' : 'latin';
}

export function ScriptProvider({ children }: { children: ReactNode }) {
  const [script, setScriptState] = useState<Script>(readStoredScript);
  const { i18n } = useTranslation();
  const language = i18n.language;

  const setScript = useCallback((next: Script) => {
    setScriptState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  // Both axes land on <html>: screen readers and search engines read
  // sr-Cyrl / sr-Latn, CSS can hook onto data-script.
  useEffect(() => {
    const serbian = language.startsWith('sr');

    document.documentElement.lang = serbian
      ? `sr-${script === 'cyrillic' ? 'Cyrl' : 'Latn'}`
      : language;
    document.documentElement.dataset.script = script;
  }, [language, script]);

  const value = useMemo(() => ({ script, setScript }), [script, setScript]);

  return <ScriptContext value={value}>{children}</ScriptContext>;
}
