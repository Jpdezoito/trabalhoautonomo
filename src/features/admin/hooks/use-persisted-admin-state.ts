"use client";

import { useEffect, useState } from "react";

export function usePersistedAdminState<T>(storageKey: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      let nextValue = initialValue;

      try {
        const raw = window.localStorage.getItem(storageKey);

        if (raw) {
          nextValue = JSON.parse(raw) as T;
        }
      } catch {
        nextValue = initialValue;
      } finally {
        setValue(nextValue);
        setReady(true);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
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
