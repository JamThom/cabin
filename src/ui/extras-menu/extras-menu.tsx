import { IconButton, Menu, Portal } from '@chakra-ui/react';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface MenuOption {
  label: string;
  disabled?: boolean;
  color?: string;
  onClick?: () => void;
}

interface UiExtrasMenuProps {
  options: MenuOption[];
  variant?: 'default' | 'inline';
}

export default function UiExtrasMenu({ options, variant = 'default' }: UiExtrasMenuProps) {
  const inline = variant === 'inline';

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          aria-label="More options"
          size="sm"
          variant={inline ? ('inline' as any) : 'ghost'}
          bg={inline ? 'transparent' : 'white'}
          borderWidth={inline ? '0' : '1px'}
          borderColor={inline ? 'transparent' : 'gray.200'}
          p={inline ? 0 : undefined}
        >
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
                onClick={() => option.onClick?.()}
              >
                {option.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
