import { Flex, Tabs } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  action?: ReactNode;
  children: ReactNode;
};

export default function RouteTabs({ value, onValueChange, action, children }: Props) {
  return (
    <Flex align="center" justify="space-between" mb={6} gap={3}>
      <Tabs.Root
        w="100%"
        flex="1"
        value={value}
        onValueChange={(event) => onValueChange(event.value)}
        variant="outline"
        colorPalette="teal"
        size="sm"
      >
        <Tabs.List overflowX="auto">{children}</Tabs.List>
      </Tabs.Root>
      {action}
    </Flex>
  );
}
