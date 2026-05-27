import { CloseButton, Drawer, Portal } from '@chakra-ui/react';
import { useEffect } from 'react';
import { MaterialCategory, MaterialItem } from '@/api/hooks/materials/use-material-categories';
import UiButton from '@/ui/button/button';
import useUiToast from '@/ui/toast/use-ui-toast';
import { useConfirmPrompt } from '@/ui/confirm-prompt/confirm-prompt-provider';
import MaterialItemFormFields from '../material-item-form-fields/material-item-form-fields';
import CategorySelect from './category-select';
import useMaterialDrawer from './use-material-drawer';

interface MaterialItemDrawerProps {
  categoryId: string;
  categories: MaterialCategory[];
  items: MaterialItem[];
  open: boolean;
  onClose: () => void;
}

export default function MaterialItemDrawer({ categoryId, categories, items, open, onClose }: MaterialItemDrawerProps) {
  const { isBulk, singleItem, values, setValues, selectedCategoryId, setSelectedCategoryId, save, remove, reset } = useMaterialDrawer(categoryId, items);
  const { showSuccessToast } = useUiToast();
  const { showConfirmPrompt } = useConfirmPrompt();

  useEffect(() => { if (open) reset(); }, [open]);

  if (items.length === 0) return null;

  async function handleSave() {
    await save();
    showSuccessToast(isBulk ? `${items.length} items saved` : 'Material saved');
    onClose();
  }

  async function handleDelete() {
    const ok = await showConfirmPrompt({
      title: isBulk ? `Delete ${items.length} materials?` : 'Delete material?',
      description: isBulk ? 'This cannot be undone.' : singleItem?.name,
    });
    if (!ok) return;
    await remove();
    showSuccessToast(isBulk ? `${items.length} items deleted` : 'Material deleted');
    onClose();
  }

  return (
    <Drawer.Root open={open} onOpenChange={(e) => !e.open && onClose()} placement="end" size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <Drawer.Title>{isBulk ? `Edit ${items.length} items` : 'Edit Material'}</Drawer.Title>
              <Drawer.CloseTrigger asChild><CloseButton size="sm" /></Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body pt={6}>
              <CategorySelect categories={categories} value={selectedCategoryId} onChange={setSelectedCategoryId} />
              <MaterialItemFormFields values={values} onChange={(f, v) => setValues((prev) => ({ ...prev, [f]: v }))} />
            </Drawer.Body>
            <Drawer.Footer borderTopWidth="1px" gap={2}>
              <UiButton colorPalette="red" variant="outline" onClick={handleDelete}>
                {isBulk ? `Delete ${items.length} items` : 'Delete'}
              </UiButton>
              {!isBulk && <UiButton variant="ghost" onClick={onClose}>Cancel</UiButton>}
              <UiButton onClick={handleSave}>
                {isBulk ? `Save ${items.length} items` : 'Save'}
              </UiButton>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
