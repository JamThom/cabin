import { useState } from 'react';
import { Button, Dialog, Input, Portal, Stack } from '@chakra-ui/react';

interface AddCategoryModalProps {
  onAdd: (name: string) => void;
}

export default function AddCategoryModal({ onAdd }: AddCategoryModalProps) {
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
        Add Category
      </Button>
      <Dialog.Root open={open} onOpenChange={(event) => setOpen(event.open)} placement="center">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6} maxW="sm">
              <Dialog.Title mb={4}>Add New Category</Dialog.Title>
              <Stack gap={4}>
                <Input
                  placeholder="Category name"
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
                    Add Category
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
