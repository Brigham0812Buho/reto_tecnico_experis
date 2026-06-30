import { useCallback, useState } from 'react';

interface AsyncStateI<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useAsync = <T>(asyncFn: () => Promise<T>) => {
  const [state, setState] = useState<AsyncStateI<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await asyncFn();
      setState({ data, loading: false, error: null });
    } catch (e) {
      setState({ data: null, loading: false, error: 'Ocurrió un error.' });
    }
  }, [asyncFn]);

  return { ...state, execute };
};