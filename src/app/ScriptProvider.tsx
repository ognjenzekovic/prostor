import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
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

  const setScript = useCallback((next: Script) => {
    setScriptState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.script = script;
  }, [script]);

  const value = useMemo(() => ({ script, setScript }), [script, setScript]);

  return <ScriptContext value={value}>{children}</ScriptContext>;
}
