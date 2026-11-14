import { useCallback, useRef, useState } from "react";

type Options<TData> = {
  onSuccess?: (data: TData) => void | Promise<void>;
  onError?: (error: Error) => void;
};

export function useMutation<TArgs extends unknown[], TData = void>(
  mutationFn: (...args: TArgs) => Promise<TData>,
  options?: Options<TData>,
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Prevent double-taps from triggering concurrent mutations
  const inFlightRef = useRef(false);

  const mutate = useCallback(
    async (...args: TArgs): Promise<TData | undefined> => {
      if (inFlightRef.current) return undefined;

      inFlightRef.current = true;
      setIsPending(true);
      setError(null);

      try {
        const result = await mutationFn(...args);
        await options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const normalized = err instanceof Error ? err : new Error(String(err));
        setError(normalized);
        options?.onError?.(normalized);
        return undefined;
      } finally {
        inFlightRef.current = false;
        setIsPending(false);
      }
    },
    [mutationFn, options],
  );

  return {
    mutate,
    isPending,
    error,
    reset: () => setError(null),
  };
}
