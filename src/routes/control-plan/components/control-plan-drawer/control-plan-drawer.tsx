import { useEffect, useState } from 'react';
import { Box, CloseButton, Drawer, Input, Portal, Stack, Text, Textarea } from '@chakra-ui/react';
import UiButton from '@/ui/button/button';
import { ControlPlanItem } from '@/store/types';
import useControlPlanUpdate from '@/api/hooks/control-plan/use-control-plan-update';
import useUiToast from '@/ui/toast/use-ui-toast';

interface ControlPlanDrawerProps {
  item: ControlPlanItem | null;
  onClose: () => void;
}

const FIELDS: { key: keyof Omit<ControlPlanItem, 'id'>; label: string; type?: string; multiline?: boolean }[] = [
  { key: 'activity', label: 'Activity' },
  { key: 'translated', label: 'Translated' },
  { key: 'category', label: 'Category' },
  { key: 'requirement', label: 'Requirement' },
  { key: 'performedBy', label: 'Performed By' },
  { key: 'reportedAction', label: 'Reported Action' },
  { key: 'toKA', label: 'To KA' },
  { key: 'toBN', label: 'To BN' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'signature', label: 'Signature' },
  { key: 'note', label: 'Note', multiline: true },
];

type FormValues = Omit<ControlPlanItem, 'id'>;

const empty: FormValues = {
  activity: '', translated: '', category: '', requirement: '', performedBy: '',
  reportedAction: '', toKA: '', toBN: '', date: '', signature: '', note: '',
};

export default function ControlPlanDrawer({ item, onClose }: ControlPlanDrawerProps) {
  const update = useControlPlanUpdate();
  const { showSuccessToast } = useUiToast();
  const [values, setValues] = useState<FormValues>(empty);

  useEffect(() => {
    if (!item) return;
    const { id: _id, ...rest } = item;
    setValues(rest);
  }, [item]);

  async function handleSave() {
    await update.mutateAsync({ id: item!.id, ...values });
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
              <Drawer.Title>Edit Item</Drawer.Title>
              <Drawer.CloseTrigger asChild><CloseButton size="sm" /></Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body pt={6}>
              <Stack gap={5}>
                {FIELDS.map(({ key, label, type, multiline }) => (
                  <Box key={key}>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>{label}</Text>
                    {multiline ? (
                      <Textarea
                        value={values[key]}
                        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                        rows={3}
                      />
                    ) : (
                      <Input
                        type={type ?? 'text'}
                        value={values[key]}
                        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
            </Drawer.Body>
            <Drawer.Footer borderTopWidth="1px" gap={2}>
              <UiButton onClick={handleSave}>Save</UiButton>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
