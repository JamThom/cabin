import { Flex, Stack, Tabs, useBreakpointValue } from '@chakra-ui/react';
import { Children, cloneElement, isValidElement, ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import Icon from '@/ui/icon/icon';

type TabItemProps = {
  value: string;
  flex?: number;
  justifyContent?: string;
};

type Props = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  action?: ReactNode;
  children: ReactNode;
};

export default function RouteTabs({ value, onValueChange, action, children }: Props) {
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
  const tabItems = useMemo(
    () => Children.toArray(children).filter((child): child is ReactElement<TabItemProps> => isValidElement<TabItemProps>(child)),
    [children],
  );
  const [mobileStart, setMobileStart] = useState(0);
  const pageSize = 2;
  const stepSize = 1;
  const maxStart = Math.max(0, tabItems.length - pageSize);
  const activeIndex = tabItems.findIndex((item) => String(item.props.value) === String(value));
  const prevIndex = activeIndex > 0 ? activeIndex - stepSize : -1;
  const nextIndex = activeIndex >= 0 && activeIndex < tabItems.length - 1 ? activeIndex + stepSize : -1;
  const prevValue = prevIndex >= 0 ? String(tabItems[prevIndex].props.value) : '';
  const nextValue = nextIndex >= 0 ? String(tabItems[nextIndex].props.value) : '';

  useEffect(() => {
    setMobileStart((current) => Math.min(current, maxStart));
  }, [maxStart]);

  useEffect(() => {
    if (activeIndex < 0) return;
    if (activeIndex < mobileStart) {
      setMobileStart(activeIndex);
      return;
    }
    if (activeIndex > mobileStart + pageSize - 1) {
      setMobileStart(Math.min(activeIndex - (pageSize - 1), maxStart));
    }
  }, [activeIndex, maxStart, mobileStart]);

  const visibleMobileTabs = tabItems.slice(mobileStart, mobileStart + pageSize).map((item) => (
    cloneElement(item, {
      ...item.props,
      flex: 1,
      justifyContent: 'center',
    })
  ));

  return (
    <Flex align={{ base: 'stretch', md: 'center' }} justify="space-between" mb={6} gap={3}>
      <Tabs.Root
        w="100%"
        flex="1"
        value={value}
        onValueChange={(event) => onValueChange(event.value)}
        variant="outline"
        colorPalette="teal"
        size="sm"
      >
        
        {isMobile ? (
          <Stack direction="row" align="center" gap={2} w="100%">
            <Tabs.List w="100%" display="flex" flex="1" gap={2}>
              {prevIndex >= 0 && (
                <Tabs.Trigger
                  value={prevValue}
                  transform="rotate(180deg)"
                  onClick={() => setMobileStart((current) => Math.max(0, current - stepSize))}
                >
                  <Icon name="chevron-right" />
                </Tabs.Trigger>
              )}
              {visibleMobileTabs}
              {nextIndex >= 0 && (
                <Tabs.Trigger
                  value={nextValue}
                  onClick={() => setMobileStart((current) => Math.min(maxStart, current + stepSize))}
                >
                  <Icon name="chevron-right" />
                </Tabs.Trigger>
              )}
            </Tabs.List>
          </Stack>
        ) : (
          <Tabs.List>{children}</Tabs.List>
        )}
      </Tabs.Root>
      {action}
    </Flex>
  );
}
