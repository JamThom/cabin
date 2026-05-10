import { useState } from 'react';
import { Button, Dialog, Input, Portal, Stack } from '@chakra-ui/react';

interface NewPhaseModalProps {
  onAdd: (name: string) => void;
  buttonLabel?: string;
}

export default function NewPhaseModal({ onAdd, buttonLabel = 'Add Phase' }: NewPhaseModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  function handleAdd() {
    if (!name.trim()) return;
    onAdd(name.trim());
    setName('');
    setOpen(false);
  }

  return (
    <>
      <Button colorPalette="neutral" size="sm" onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>
      <Dialog.Root open={open} onOpenChange={(event) => setOpen(event.open)} placement="center">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6} maxW="sm">
              <Dialog.Title mb={4}>Add New Phase</Dialog.Title>
              <Stack gap={4}>
                <Input
                  placeholder="Phase name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && handleAdd()}
                  autoFocus
                />
                <Stack direction="row" justify="flex-end" gap={2}>
                  <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button colorPalette="teal" onClick={handleAdd}>
                    Add Phase
                  </Button>
                </Stack>
              </Stack>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
