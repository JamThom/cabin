import { CloseButton, Drawer, Portal } from '@chakra-ui/react';
import UiButton from '@/ui/button/button';
import { useEffect, useState } from 'react';
import { MaterialItem } from '@/api/hooks/materials/use-material-categories';
import useMaterialCategoriesItemsBulkUpdate from '@/api/hooks/materials/use-material-categories-items-bulk-update';
import useMaterialCategoriesItemDelete from '@/api/hooks/materials/use-material-categories-item-delete';
import useUiToast from '@/ui/toast/use-ui-toast';
import { useConfirmPrompt } from '@/ui/confirm-prompt/confirm-prompt-provider';
import MaterialItemFormFields, { MaterialFormValues } from '../material-item-form-fields/material-item-form-fields';

interface BulkEditDrawerProps {
  categoryId: string;
  items: MaterialItem[];
  open: boolean;
  onClose: () => void;
}

function commonValue(items: MaterialItem[], key: keyof MaterialItem): string | null {
  if (items.length === 0) return '';
  const vals = items.map((item) => String(item[key]));
  return vals.every((v) => v === vals[0]) ? vals[0] : null;
}

function initValues(items: MaterialItem[]): MaterialFormValues {
  return {
    name: commonValue(items, 'name'),
    productName: commonValue(items, 'productName'),
    url: commonValue(items, 'url'),
    cost: commonValue(items, 'cost'),
    unit: commonValue(items, 'unit'),
    quantity: commonValue(items, 'quantity'),
  };
}

export default function BulkEditDrawer({ categoryId, items, open, onClose }: BulkEditDrawerProps) {
  const bulkUpdate = useMaterialCategoriesItemsBulkUpdate();
  const deleteItem = useMaterialCategoriesItemDelete();
  const { showSuccessToast } = useUiToast();
  const { showConfirmPrompt } = useConfirmPrompt();
  const [values, setValues] = useState<MaterialFormValues>(() => initValues(items));

  useEffect(() => {
    if (open) setValues(initValues(items));
  }, [open]);

  async function handleSave() {
    await bulkUpdate.mutateAsync({
      categoryId,
      items: items.map((item) => ({
        ...item,
        name: values.name !== null ? values.name : item.name,
        productName: values.productName !== null ? values.productName : item.productName,
        url: values.url !== null ? values.url : item.url,
        cost: values.cost !== null ? Number(values.cost) || 0 : item.cost,
        unit: values.unit !== null ? values.unit : item.unit,
        quantity: values.quantity !== null ? Number(values.quantity) || 0 : item.quantity,
      })),
    });
    showSuccessToast(`${items.length} items saved`);
    onClose();
  }

  async function handleDelete() {
    const ok = await showConfirmPrompt({ title: `Delete ${items.length} materials?`, description: 'This cannot be undone.' });
    if (!ok) return;
    await Promise.all(items.map((item) => deleteItem.mutateAsync({ categoryId, itemId: item.id })));
    showSuccessToast(`${items.length} items deleted`);
    onClose();
  }

  return (
    <Drawer.Root open={open} onOpenChange={(e) => !e.open && onClose()} placement="end" size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <Drawer.Title>Edit {items.length} items</Drawer.Title>
              <Drawer.CloseTrigger asChild><CloseButton size="sm" /></Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body pt={6}>
              <MaterialItemFormFields values={values} onChange={(f, v) => setValues((prev) => ({ ...prev, [f]: v }))} />
            </Drawer.Body>
            <Drawer.Footer borderTopWidth="1px" gap={2}>
              <UiButton colorPalette="red" variant="outline" onClick={handleDelete}>
                Delete {items.length} items
              </UiButton>
              <UiButton variant="ghost" onClick={onClose}>Cancel</UiButton>
              <UiButton onClick={handleSave}>
                Save {items.length} items
              </UiButton>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
