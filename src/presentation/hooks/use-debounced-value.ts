import { useEffect, useState } from 'react';

/**
 * Devolve `value` apenas depois de ficar estável durante `delay` ms.
 * Útil para pesquisas que disparam pedidos à API a cada tecla.
 */
export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
