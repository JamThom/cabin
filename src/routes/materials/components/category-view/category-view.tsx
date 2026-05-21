import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useMaterialCategories from '@/api/hooks/materials/use-material-categories';
import useMaterialCategoriesItemUpdate from '@/api/hooks/materials/use-material-categories-item-update';
import { MaterialItem } from '@/api/hooks/materials/use-material-categories';
import MaterialItemDrawer from './components/material-item-drawer/material-item-drawer';
import MaterialsTable from './components/materials-table/materials-table';
import useUiToast from '@/ui/toast/use-ui-toast';

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: categories = [] } = useMaterialCategories();
  const updateItem = useMaterialCategoriesItemUpdate();
  const { showSuccessToast } = useUiToast();
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null);
  const category = categories.find((entry) => entry.id === categoryId);

  if (!category) return <Box textAlign="center" color="gray.400" py={16}>Category not found. Select a category above.</Box>;

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="auto" maxH="calc(100vh - 260px)">
      <MaterialsTable categoryId={category.id} items={category.items} onRowClick={(item) => setSelectedItem(item)} />
      <MaterialItemDrawer
        categoryId={category.id}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSave={async (item) => {
          await updateItem.mutateAsync({
            categoryId: category.id,
            itemId: item.id,
            name: item.name,
            productName: item.productName,
            url: item.url,
            cost: item.cost,
            unit: item.unit,
            quantity: item.quantity,
            group: item.group ?? ''
          });
          showSuccessToast('Material saved');
          setSelectedItem(null);
        }}
      />
    </Box>
  );
}
