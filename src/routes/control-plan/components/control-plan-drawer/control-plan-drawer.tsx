import { useEffect, useState } from 'react';
import { Box, CloseButton, Drawer, Input, Portal, Stack, Tabs, Text, Textarea } from '@chakra-ui/react';
import UiButton from '@/ui/button/button';
import { ControlPlanItem } from '@/store/types';
import useControlPlanUpdate from '@/api/hooks/control-plan/use-control-plan-update';
import useUiToast from '@/ui/toast/use-ui-toast';

interface ControlPlanDrawerProps {
  item: ControlPlanItem | null;
  onClose: () => void;
}

const READ_ONLY_FIELDS: { key: keyof ControlPlanItem; label: string }[] = [
  { key: 'translated', label: 'Activity' },
  { key: 'activity', label: 'Original (Swedish)' },
  { key: 'category', label: 'Category' },
  { key: 'requirement', label: 'Requirement' },
  { key: 'performedBy', label: 'Performed By' },
  { key: 'reportedAction', label: 'Reported Action' },
  { key: 'toKA', label: 'To KA' },
  { key: 'toBN', label: 'To BN' },
  { key: 'signature', label: 'Signature' },
];

export default function ControlPlanDrawer({ item, onClose }: ControlPlanDrawerProps) {
  const update = useControlPlanUpdate();
  const { showSuccessToast } = useUiToast();
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!item) return;
    setDate(item.date ?? '');
    setNote(item.note ?? '');
  }, [item]);

  async function handleSave() {
    await update.mutateAsync({ id: item!.id, date, note });
    showSuccessToast('Item saved');
    onClose();
  }

  return (
    <Drawer.Root open={Boolean(item)} onOpenChange={(e) => !e.open && onClose()} placement="end" size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <Drawer.Title>{item?.translated || 'Item'}</Drawer.Title>
              <Drawer.CloseTrigger asChild><CloseButton size="sm" /></Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body pt={4} display="flex" flexDir="column">
              <Tabs.Root defaultValue="overview" variant="outline" colorPalette="teal" size="sm" display="flex" flexDir="column" flex="1">
                <Tabs.List mb={4}>
                  <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                  <Tabs.Trigger value="notes">Notes</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="overview" flex="1">
                  <Stack gap={4}>
                    {READ_ONLY_FIELDS.filter(({ key }) => item?.[key]).map(({ key, label }) => (
                      <Box key={key}>
                        <Text fontSize="xs" color="fg.muted" mb={0.5}>{label}</Text>
                        <Text fontSize="sm">{item?.[key]}</Text>
                      </Box>
                    ))}
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>Completed at</Text>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </Box>
                  </Stack>
                </Tabs.Content>
                <Tabs.Content value="notes" flex="1">
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={10}
                    placeholder="Add notes..."
                  />
                </Tabs.Content>
              </Tabs.Root>
            </Drawer.Body>
            <Drawer.Footer borderTopWidth="1px">
              <UiButton onClick={handleSave}>Save</UiButton>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
