import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useMaterialCategories from '@/api/hooks/materials/use-material-categories';
import { MaterialItem } from '@/api/hooks/materials/use-material-categories';
import MaterialItemDrawer from './components/material-item-drawer/material-item-drawer';
import MaterialsTable from './components/materials-table/materials-table';

export default function Category() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { data: categories = [] } = useMaterialCategories();
  const [selectedItem, setSelectedItem] = useState<MaterialItem | null>(null);
  const category = categories.find((entry) => entry.id === categoryId);

  if (!category) return <Box textAlign="center" color="gray.400" py={16}>Category not found. Select a category above.</Box>;

  return (
    <>
      <MaterialsTable categoryId={category.id} categories={categories} items={category.items} onRowClick={(item) => setSelectedItem(item)} />
      <MaterialItemDrawer
        categoryId={category.id}
        categories={categories}
        items={selectedItem ? [selectedItem] : []}
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
