import { Flex, Tabs } from '@chakra-ui/react';
import { Children, cloneElement, isValidElement, ReactElement, ReactNode } from 'react';

type Props = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  action?: ReactNode;
  children: ReactNode;
};

export default function RouteTabs({ value, onValueChange, action, children }: Props) {
  const tabs = Children.toArray(children)
    .filter((child): child is ReactElement => isValidElement(child))
    .map((child) => cloneElement(child, { ...child.props, minWidth: 'fit-content' }));

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
        <Tabs.List overflowX="auto">{tabs}</Tabs.List>
      </Tabs.Root>
      {action}
    </Flex>
  );
}
