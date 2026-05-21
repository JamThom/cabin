import { useState } from 'react';
import { Button, ButtonProps, Spinner, Tooltip } from '@chakra-ui/react';
import Icon from '@/ui/icon/icon';

interface UiIconButtonProps extends Omit<ButtonProps, 'onClick'> {
  icon: string;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

export default function UiIconButton({ icon, label, colorPalette = 'purple', onClick, disabled, ...props }: UiIconButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!onClick) return;
    const result = onClick(e);
    if (result instanceof Promise) {
      setLoading(true);
      try {
        await result;
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <Tooltip.Root openDelay={300} closeDelay={0}>
      <Tooltip.Trigger asChild>
        <Button
          colorPalette={colorPalette}
          aspectRatio="1"
          p={0}
          minW="unset"
          w="10"
          h="10"
          onClick={onClick ? handleClick : undefined}
          disabled={loading || disabled}
          aria-label={label}
          {...props}
        >
          {loading ? <Spinner size="xs" /> : <Icon name={icon as any} />}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content>
          <Tooltip.Arrow>
            <Tooltip.ArrowTip />
          </Tooltip.Arrow>
          {label}
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  );
}
