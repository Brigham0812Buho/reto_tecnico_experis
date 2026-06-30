import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAsync } from '../useAsync';

describe('useAsync', () => {
  it('debe retornar data y loading false tras una ejecución exitosa', async () => {
    const mockFn = jest.fn().mockResolvedValue({
      id: 1,
      title: 'Tarea de prueba',
    });

    const { result } =await  renderHook(() => useAsync(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({
      id: 1,
      title: 'Tarea de prueba',
    });

    expect(result.current.error).toBeNull();
  });

  it('debe poner loading en true mientras se ejecuta la promesa', async () => {
    let resolvePromise!: (value: { id: number }) => void;

    const pendingPromise = new Promise<{ id: number }>((resolve) => {
      resolvePromise = resolve;
    });

    const mockFn = jest.fn(() => pendingPromise);

    const { result } = await renderHook(() => useAsync(mockFn));

    // Iniciar la ejecución SIN esperar a que termine
    let executePromise: Promise<void>;

    await act(async () => {
    executePromise = result.current.execute();
    });

    // Esperar al siguiente render
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    resolvePromise({ id: 1 });

    await act(async () => {
      await executePromise;
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ id: 1 });
  });

  it('debe retornar error y data null si la promesa es rechazada', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('Network error'));

    const { result } = await renderHook(() => useAsync(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Ocurrió un error.');
  });

  it('debe resetear data y error al iniciar una nueva ejecución', async () => {
    let rejectPromise!: (reason?: unknown) => void;

    const mockFn = jest
      .fn()
      .mockResolvedValueOnce({ id: 1 })
      .mockImplementationOnce(
        () =>
          new Promise((_, reject) => {
            rejectPromise = reject;
          }),
      );

    const { result } = await renderHook(() => useAsync(mockFn));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual({ id: 1 });
    let secondExecutePromise: Promise<void>;

    await act(async () => {
    secondExecutePromise = result.current.execute();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    rejectPromise(new Error('fail'));

    await act(async () => {
      await secondExecutePromise;
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Ocurrió un error.');
  });
});