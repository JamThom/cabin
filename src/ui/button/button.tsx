import { useState } from 'react';
import { Button, ButtonProps, Spinner } from '@chakra-ui/react';
import Icon from '@/ui/icon/icon';

interface UiButtonProps extends Omit<ButtonProps, 'onClick'> {
  icon?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

export default function UiButton({ icon, children, colorPalette = 'purple', onClick, disabled, ...props }: UiButtonProps) {
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
    <Button
      colorPalette={colorPalette}
      gap={icon && !loading ? 2 : undefined}
      onClick={onClick ? handleClick : undefined}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Spinner size="xs" /> : icon ? <Icon name={icon as any} /> : null}
      {!loading && children}
    </Button>
  );
}
