import { CloseButton, Drawer, Input, Portal, Stack, Text } from '@chakra-ui/react';
import UiButton from '@/ui/button/button';
import { useEffect, useState } from 'react';
import { MaterialItem } from '@/api/hooks/materials/use-material-categories';
import useMaterialCategoriesItemDelete from '@/api/hooks/materials/use-material-categories-item-delete';
import useUiToast from '@/ui/toast/use-ui-toast';

interface MaterialItemDrawerProps {
  categoryId: string;
  item: MaterialItem | null;
  onClose: () => void;
  onSave: (item: MaterialItem) => Promise<void> | void;
}

export default function MaterialItemDrawer({ categoryId, item, onClose, onSave }: MaterialItemDrawerProps) {
  const deleteItem = useMaterialCategoriesItemDelete();
  const { showSuccessToast } = useUiToast();
  const [name, setName] = useState('');
  const [productName, setProductName] = useState('');
  const [url, setUrl] = useState('');
  const [cost, setCost] = useState('0');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [group, setGroup] = useState('');

  useEffect(() => {
    if (!item) return;
    setName(item.name);
    setProductName(item.productName);
    setUrl(item.url);
    setCost(String(item.cost));
    setUnit(item.unit);
    setQuantity(String(item.quantity));
    setGroup(item.group ?? '');
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
              <Stack gap={4}>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">Name</Text><Input value={name} onChange={(e) => setName(e.target.value)} /></Stack>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">Product Name</Text><Input value={productName} onChange={(e) => setProductName(e.target.value)} /></Stack>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">URL</Text><Input value={url} onChange={(e) => setUrl(e.target.value)} /></Stack>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">Cost</Text><Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} /></Stack>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">Unit</Text><Input value={unit} onChange={(e) => setUnit(e.target.value)} /></Stack>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">Quantity</Text><Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></Stack>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">Group</Text><Input placeholder="e.g. Roof" value={group} onChange={(e) => setGroup(e.target.value)} /></Stack>
              </Stack>
            </Drawer.Body>
            <Drawer.Footer borderTopWidth="1px" gap={2}>
              <UiButton
                colorPalette="red"
                variant="outline"
                onClick={async () => {
                  await deleteItem.mutateAsync({ categoryId, itemId: item.id });
                  showSuccessToast('Material deleted');
                  onClose();
                }}
              >
                Delete
              </UiButton>
              <UiButton variant="ghost" onClick={onClose}>Cancel</UiButton>
              <UiButton
                onClick={() => onSave({ ...item, name, productName, url, cost: Number(cost) || 0, unit, quantity: Number(quantity) || 0, group })}
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
