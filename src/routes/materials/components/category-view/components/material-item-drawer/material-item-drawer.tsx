import { CloseButton, Drawer, Portal } from '@chakra-ui/react';
import UiButton from '@/ui/button/button';
import { useEffect, useState } from 'react';
import { MaterialItem } from '@/api/hooks/materials/use-material-categories';
import useMaterialCategoriesItemDelete from '@/api/hooks/materials/use-material-categories-item-delete';
import useUiToast from '@/ui/toast/use-ui-toast';
import { useConfirmPrompt } from '@/ui/confirm-prompt/confirm-prompt-provider';
import MaterialItemFormFields, { MaterialFormValues } from '../material-item-form-fields/material-item-form-fields';

interface MaterialItemDrawerProps {
  categoryId: string;
  item: MaterialItem | null;
  onClose: () => void;
  onSave: (item: MaterialItem) => Promise<void> | void;
}

export default function MaterialItemDrawer({ categoryId, item, onClose, onSave }: MaterialItemDrawerProps) {
  const deleteItem = useMaterialCategoriesItemDelete();
  const { showSuccessToast } = useUiToast();
  const { showConfirmPrompt } = useConfirmPrompt();
  const [values, setValues] = useState<MaterialFormValues>({
    name: '', productName: '', url: '', cost: '0', unit: '', quantity: '1', group: '',
  });

  useEffect(() => {
    if (!item) return;
    setValues({
      name: item.name,
      productName: item.productName,
      url: item.url,
      cost: String(item.cost),
      unit: item.unit,
      quantity: String(item.quantity),
      group: item.group ?? '',
    });
  }, [item]);

  if (!item) return null;

  return (
    <Drawer.Root open={Boolean(item)} onOpenChange={(event) => !event.open && onClose()} placement="end" size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <Drawer.Title>Edit Material</Drawer.Title>
              <Drawer.CloseTrigger asChild><CloseButton size="sm" /></Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body pt={6}>
              <MaterialItemFormFields values={values} onChange={(field, value) => setValues(prev => ({ ...prev, [field]: value }))} />
            </Drawer.Body>
            <Drawer.Footer borderTopWidth="1px" gap={2}>
              <UiButton
                colorPalette="red"
                variant="outline"
                onClick={async () => {
                  const ok = await showConfirmPrompt({ title: 'Delete material?', description: item.name });
                  if (!ok) return;
                  await deleteItem.mutateAsync({ categoryId, itemId: item.id });
                  showSuccessToast('Material deleted');
                  onClose();
                }}
              >
                Delete
              </UiButton>
              <UiButton variant="ghost" onClick={onClose}>Cancel</UiButton>
              <UiButton
                onClick={() => onSave({
                  ...item,
                  name: values.name ?? '',
                  productName: values.productName ?? '',
                  url: values.url ?? '',
                  cost: Number(values.cost) || 0,
                  unit: values.unit ?? '',
                  quantity: Number(values.quantity) || 0,
                  group: values.group ?? '',
                })}
              >
                Save
              </UiButton>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
