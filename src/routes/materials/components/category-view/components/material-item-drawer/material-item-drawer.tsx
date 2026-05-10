import { Button, CloseButton, Drawer, Input, Portal, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MaterialItem } from '@/api/hooks/materials/use-material-categories';

interface MaterialItemDrawerProps {
  item: MaterialItem | null;
  onClose: () => void;
  onSave: (item: MaterialItem) => void;
}

export default function MaterialItemDrawer({ item, onClose, onSave }: MaterialItemDrawerProps) {
  const [name, setName] = useState('');
  const [productName, setProductName] = useState('');
  const [url, setUrl] = useState('');
  const [cost, setCost] = useState('0');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    if (!item) return;
    setName(item.name);
    setProductName(item.productName);
    setUrl(item.url);
    setCost(String(item.cost));
    setUnit(item.unit);
    setQuantity(String(item.quantity));
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
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">Name</Text><Input value={name} onChange={(event) => setName(event.target.value)} /></Stack>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">Product Name</Text><Input value={productName} onChange={(event) => setProductName(event.target.value)} /></Stack>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">URL</Text><Input value={url} onChange={(event) => setUrl(event.target.value)} /></Stack>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">Cost</Text><Input type="number" value={cost} onChange={(event) => setCost(event.target.value)} /></Stack>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">Unit</Text><Input value={unit} onChange={(event) => setUnit(event.target.value)} /></Stack>
                <Stack gap={1}><Text fontSize="sm" fontWeight="medium">Quantity</Text><Input type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></Stack>
              </Stack>
            </Drawer.Body>
            <Drawer.Footer borderTopWidth="1px" gap={2}>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button
                colorPalette="teal"
                onClick={() => onSave({
                  ...item,
                  name,
                  productName,
                  url,
                  cost: Number(cost) || 0,
                  unit,
                  quantity: Number(quantity) || 0
                })}
              >
                Save
              </Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
