import { Button, CloseButton, Dialog, Input, Portal, Stack, Text } from '@chakra-ui/react';
import { createContext, useCallback, useContext, useRef, useState } from 'react';

// ── Confirm prompt ────────────────────────────────────────────────────────────

interface ConfirmState {
  title: string;
  description?: string;
}

// ── Input prompt ──────────────────────────────────────────────────────────────

interface InputPromptOptions {
  title: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
  onConfirm: (value: string) => Promise<void> | void;
}

// ── Context ───────────────────────────────────────────────────────────────────

interface PromptContextValue {
  showConfirmPrompt: (opts: ConfirmState) => Promise<boolean>;
  showInputPrompt: (opts: InputPromptOptions) => void;
}

const PromptContext = createContext<PromptContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function ConfirmPromptProvider({ children }: { children: React.ReactNode }) {
  // Confirm
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const confirmResolveRef = useRef<((value: boolean) => void) | null>(null);

  const showConfirmPrompt = useCallback((opts: ConfirmState): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      confirmResolveRef.current = resolve;
      setConfirmState(opts);
    });
  }, []);

  function resolveConfirm(value: boolean) {
    confirmResolveRef.current?.(value);
    confirmResolveRef.current = null;
    setConfirmState(null);
  }

  // Input
  const [inputState, setInputState] = useState<{ opts: InputPromptOptions; value: string } | null>(null);

  const showInputPrompt = useCallback((opts: InputPromptOptions) => {
    setInputState({ opts, value: opts.initialValue ?? '' });
  }, []);

  async function handleInputConfirm() {
    if (!inputState?.value.trim()) return;
    await inputState.opts.onConfirm(inputState.value.trim());
    setInputState(null);
  }

  return (
    <PromptContext.Provider value={{ showConfirmPrompt, showInputPrompt }}>
      {children}

      {/* Confirm dialog */}
      <Dialog.Root open={Boolean(confirmState)} onOpenChange={(e) => { if (!e.open) resolveConfirm(false); }} placement="center">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="sm">
              <Dialog.Header borderBottomWidth="1px">
                <Dialog.Title>{confirmState?.title}</Dialog.Title>
                <Dialog.CloseTrigger asChild><CloseButton size="sm" /></Dialog.CloseTrigger>
              </Dialog.Header>
              {confirmState?.description && (
                <Dialog.Body pt={4}>
                  <Text>{confirmState.description}</Text>
                </Dialog.Body>
              )}
              <Dialog.Footer borderTopWidth="1px" gap={2}>
                <Button variant="ghost" onClick={() => resolveConfirm(false)}>No</Button>
                <Button colorPalette="red" onClick={() => resolveConfirm(true)}>Yes</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      {/* Input dialog */}
      <Dialog.Root open={Boolean(inputState)} onOpenChange={(e) => { if (!e.open) setInputState(null); }} placement="center">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="sm">
              <Dialog.Header borderBottomWidth="1px">
                <Dialog.Title>{inputState?.opts.title}</Dialog.Title>
                <Dialog.CloseTrigger asChild><CloseButton size="sm" /></Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body pt={4}>
                <Stack gap={4}>
                  <Input
                    placeholder={inputState?.opts.placeholder}
                    value={inputState?.value ?? ''}
                    onChange={(e) => setInputState((prev) => prev ? { ...prev, value: e.target.value } : null)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInputConfirm()}
                    autoFocus
                  />
                </Stack>
              </Dialog.Body>
              <Dialog.Footer borderTopWidth="1px" gap={2}>
                <Button variant="ghost" onClick={() => setInputState(null)}>Cancel</Button>
                <Button onClick={handleInputConfirm}>{inputState?.opts.confirmLabel ?? 'Confirm'}</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </PromptContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useConfirmPrompt() {
  const ctx = useContext(PromptContext);
  if (!ctx) throw new Error('useConfirmPrompt must be used within ConfirmPromptProvider');
  return ctx;
}
