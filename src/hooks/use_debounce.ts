import { useCallback, useRef } from 'react';

export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const intervalRef = useRef<NodeJS.Timeout>();
  return useCallback(
    (...args: Parameters<T>) => {
      clearInterval(intervalRef.current);
      intervalRef.current = setTimeout(() => callback(...args), delay);
    },
    [delay, callback]
  );
};
