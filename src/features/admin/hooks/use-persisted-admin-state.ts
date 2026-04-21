"use client";

import { useEffect, useState } from "react";

export function usePersistedAdminState<T>(storageKey: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);

      if (raw) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      setValue(initialValue);
    } finally {
      setReady(true);
    }
  }, [initialValue, storageKey]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(value));
  }, [ready, storageKey, value]);

  function reset() {
    setValue(initialValue);
    window.localStorage.removeItem(storageKey);
  }

  return { value, setValue, ready, reset };
}
