import { Button, ButtonProps } from '@chakra-ui/react';
import Icon from '@/ui/icon/icon';

interface UiButtonProps extends ButtonProps {
  icon?: string;
}

export default function UiButton({ icon, children, colorPalette = 'teal', ...props }: UiButtonProps) {
  return (
    <Button colorPalette={colorPalette} gap={icon ? 2 : undefined} {...props}>
      {icon && <Icon name={icon as any} />}
      {children}
    </Button>
  );
}
