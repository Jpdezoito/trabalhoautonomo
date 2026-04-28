import { useRef, useCallback } from "react";

/**
 * Hook para navegação por Enter entre campos de formulário.
 * Retorna uma função para ser usada em onKeyDown de cada input.
 *
 * @param fieldSelectors - Array de refs ou selectors dos campos na ordem desejada
 * @param options - { isTextarea?: boolean }
 */
export function useEnterToNextField(fieldSelectors: Array<React.RefObject<any>>, options?: { isTextarea?: boolean }) {
  return useCallback(
    (e: React.KeyboardEvent) => {
      if (options?.isTextarea) {
        // Em textarea, Enter normal não avança
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          // Ctrl+Enter avança
        } else {
          return;
        }
      } else {
        if (e.key === "Enter") {
          e.preventDefault();
          // Descobre o índice do campo atual
          const idx = fieldSelectors.findIndex(ref => ref.current === e.target);
          if (idx >= 0) {
            // Busca o próximo campo válido
            for (let i = idx + 1; i < fieldSelectors.length; i++) {
              const next = fieldSelectors[i]?.current;
              if (next && !next.disabled && next.offsetParent !== null) {
                next.focus();
                if (next.select) next.select();
                break;
              }
            }
          }
        }
      }
    },
    [fieldSelectors, options]
  );
}
