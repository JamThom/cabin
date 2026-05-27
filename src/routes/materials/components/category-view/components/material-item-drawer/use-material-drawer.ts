import { useState } from 'react';
import { MaterialItem } from '@/api/hooks/materials/use-material-categories';
import useMaterialCategoriesItemUpdate from '@/api/hooks/materials/use-material-categories-item-update';
import useMaterialCategoriesItemsBulkUpdate from '@/api/hooks/materials/use-material-categories-items-bulk-update';
import useMaterialCategoriesItemDelete from '@/api/hooks/materials/use-material-categories-item-delete';
import { MaterialFormValues } from '../material-item-form-fields/material-item-form-fields';

function commonValue(items: MaterialItem[], key: keyof MaterialItem): string | null {
  if (items.length === 0) return '';
  const vals = items.map((i) => String(i[key]));
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

export default function useMaterialDrawer(categoryId: string, items: MaterialItem[]) {
  const isBulk = items.length > 1;
  const singleItem = items[0] ?? null;

  const updateItem = useMaterialCategoriesItemUpdate();
  const bulkUpdate = useMaterialCategoriesItemsBulkUpdate();
  const deleteItem = useMaterialCategoriesItemDelete();

  const [values, setValues] = useState<MaterialFormValues>(initValues(items));
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);

  function reset() {
    setValues(initValues(items));
    setSelectedCategoryId(categoryId);
  }

  async function save() {
    if (isBulk) {
      const merged = items.map((i) => ({
        ...i,
        name: values.name !== null ? values.name! : i.name,
        productName: values.productName !== null ? values.productName! : i.productName,
        url: values.url !== null ? values.url! : i.url,
        cost: values.cost !== null ? Number(values.cost) || 0 : i.cost,
        unit: values.unit !== null ? values.unit! : i.unit,
        quantity: values.quantity !== null ? Number(values.quantity) || 0 : i.quantity,
      }));
      if (selectedCategoryId !== categoryId) {
        await Promise.all(merged.map((i) => updateItem.mutateAsync({
          categoryId, itemId: i.id, name: i.name, productName: i.productName,
          url: i.url, cost: i.cost, unit: i.unit, quantity: i.quantity,
          targetCategoryId: selectedCategoryId,
        })));
      } else {
        await bulkUpdate.mutateAsync({ categoryId, items: merged });
      }
    } else {
      await updateItem.mutateAsync({
        categoryId,
        itemId: singleItem!.id,
        name: values.name ?? '',
        productName: values.productName ?? '',
        url: values.url ?? '',
        cost: Number(values.cost) || 0,
        unit: values.unit ?? '',
        quantity: Number(values.quantity) || 0,
        targetCategoryId: selectedCategoryId !== categoryId ? selectedCategoryId : undefined,
      });
    }
  }

  async function remove() {
    await Promise.all(items.map((i) => deleteItem.mutateAsync({ categoryId, itemId: i.id })));
  }

  return { isBulk, singleItem, values, setValues, selectedCategoryId, setSelectedCategoryId, save, remove, reset };
}
