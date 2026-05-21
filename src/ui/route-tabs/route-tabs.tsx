import { Stack, Tabs, useBreakpointValue } from '@chakra-ui/react';
import { Children, cloneElement, isValidElement, ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import UiIconButton from '@/ui/icon-button/icon-button';

type Props = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  action?: ReactNode;
  children: ReactNode;
};

export default function RouteTabs({ value, onValueChange, action, children }: Props) {
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false;
  const tabItems = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement[],
    [children],
  );
  const [mobileStart, setMobileStart] = useState(0);
  const pageSize = 2;
  const stepSize = 1;
  const maxStart = Math.max(0, tabItems.length - pageSize);

  useEffect(() => {
    setMobileStart((current) => Math.min(current, maxStart));
  }, [maxStart]);

  useEffect(() => {
    const activeIndex = tabItems.findIndex((item) => String(item.props.value) === String(value));
    if (activeIndex < 0) return;
    const nextStart = Math.floor(activeIndex / pageSize) * pageSize;
    setMobileStart((current) => (current === nextStart ? current : Math.min(nextStart, maxStart)));
  }, [maxStart, tabItems, value]);

  const visibleMobileTabs = tabItems.slice(mobileStart, mobileStart + pageSize).map((item) => (
    cloneElement(item, {
      ...item.props,
      flex: 1,
      justifyContent: 'center',
    })
  ));

  return (
    <Stack direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'center' }} justify="space-between" mb={6} gap={3}>
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
            <UiIconButton
              icon="chevron-right"
              label="Previous tabs"
              variant="outline"
              colorPalette="teal"
              transform="rotate(180deg)"
              onClick={() => setMobileStart((current) => Math.max(0, current - stepSize))}
              disabled={mobileStart === 0}
            />
            <Tabs.List w="100%" display="flex" flex="1">
              {visibleMobileTabs}
            </Tabs.List>
            <UiIconButton
              icon="chevron-right"
              label="Next tabs"
              variant="outline"
              colorPalette="teal"
              onClick={() => setMobileStart((current) => Math.min(maxStart, current + stepSize))}
              disabled={mobileStart >= maxStart}
            />
          </Stack>
        ) : (
          <Tabs.List>{children}</Tabs.List>
        )}
      </Tabs.Root>
      {action}
    </Stack>
  );
}
