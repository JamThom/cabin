import { useState } from 'react';
import { Button, Dialog, IconButton, Input, Menu, Portal, Stack } from '@chakra-ui/react';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface MenuOptionPrompt {
  title: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
  onConfirm: (value: string) => void;
}

export interface MenuOption {
  label: string;
  disabled?: boolean;
  color?: string;
  onClick?: () => void;
  prompt?: MenuOptionPrompt;
}

interface UiExtrasMenuProps {
  options: MenuOption[];
}

export default function UiExtrasMenu({ options }: UiExtrasMenuProps) {
  const [activePrompt, setActivePrompt] = useState<{ config: MenuOptionPrompt; value: string } | null>(null);

  function handleItemClick(option: MenuOption) {
    if (option.prompt) {
      setActivePrompt({ config: option.prompt, value: option.prompt.initialValue ?? '' });
    } else {
      option.onClick?.();
    }
  }

  function handleConfirm() {
    if (!activePrompt?.value.trim()) return;
    activePrompt.config.onConfirm(activePrompt.value.trim());
    setActivePrompt(null);
  }

  return (
    <>
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton aria-label="More options" size="sm" variant="ghost">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {options.map((option) => (
                <Menu.Item
                  key={option.label}
                  value={option.label}
                  disabled={option.disabled}
                  color={option.color}
                  onClick={() => handleItemClick(option)}
                >
                  {option.label}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>

      {activePrompt && (
        <Dialog.Root open onOpenChange={(e) => !e.open && setActivePrompt(null)} placement="center">
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content p={6} maxW="sm">
                <Dialog.Title mb={4}>{activePrompt.config.title}</Dialog.Title>
                <Stack gap={4}>
                  <Input
                    placeholder={activePrompt.config.placeholder}
                    value={activePrompt.value}
                    onChange={(e) => setActivePrompt({ ...activePrompt, value: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                    autoFocus
                  />
                  <Stack direction="row" justify="flex-end" gap={2}>
                    <Button variant="ghost" onClick={() => setActivePrompt(null)}>Cancel</Button>
                    <Button colorPalette="teal" onClick={handleConfirm}>
                      {activePrompt.config.confirmLabel ?? 'Confirm'}
                    </Button>
                  </Stack>
                </Stack>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      )}
    </>
  );
}
