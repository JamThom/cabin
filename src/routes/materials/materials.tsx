import { Badge, Button, Tabs } from '@chakra-ui/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useMaterialCategories from '@/api/hooks/materials/use-material-categories';
import useMaterialCategoriesCreate from '@/api/hooks/materials/use-material-categories-create';
import useMaterialCategoriesUpdate from '@/api/hooks/materials/use-material-categories-update';
import useMaterialCategoriesDelete from '@/api/hooks/materials/use-material-categories-delete';
import useMaterialCategoriesAddItem from '@/api/hooks/materials/use-material-categories-add-item';
import PageLayout from '@/ui/page-layout/page-layout';
import PageHeader from '@/ui/page-header/page-header';
import RouteTabs from '@/ui/route-tabs/route-tabs';
import UiExtrasMenu from '@/ui/extras-menu/extras-menu';

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function Materials() {
  const { data: categories = [] } = useMaterialCategories();
  const createCategory = useMaterialCategoriesCreate();
  const updateCategory = useMaterialCategoriesUpdate();
  const deleteCategory = useMaterialCategoriesDelete();
  const addItem = useMaterialCategoriesAddItem();
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const activeCategoryId = categoryId ?? categories[0]?.id;
  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  function handleDeleteCategory() {
    if (!activeCategoryId) return;
    deleteCategory.mutate({ categoryId: activeCategoryId }, {
      onSuccess: () => {
        const remaining = categories.filter((c) => c.id !== activeCategoryId);
        if (remaining.length > 0) navigate(`/materials/category/${remaining[0].id}`);
        else navigate('/materials');
      }
    });
  }

  return (
    <PageLayout>
      <PageHeader
        title="Materials"
        action={
          <Button
            colorPalette="teal"
            size="sm"
            onClick={() => activeCategoryId && addItem.mutate({ categoryId: activeCategoryId })}
            disabled={!activeCategoryId}
          >
            New Material
          </Button>
        }
      />
      <RouteTabs
        value={activeCategoryId}
        onValueChange={(value) => navigate(`/materials/category/${value}`)}
        action={
          <UiExtrasMenu
            options={[
              {
                label: 'Add Category',
                prompt: { title: 'Add Category', placeholder: 'Category name', confirmLabel: 'Add', onConfirm: (name) => createCategory.mutate({ name }) }
              },
              {
                label: 'Rename Category',
                disabled: !activeCategory,
                prompt: { title: 'Rename Category', initialValue: activeCategory?.name, confirmLabel: 'Rename', onConfirm: (name) => activeCategoryId && updateCategory.mutate({ categoryId: activeCategoryId, name }) }
              },
              {
                label: 'Delete Category',
                disabled: !activeCategory,
                color: 'red.500',
                onClick: handleDeleteCategory
              }
            ]}
          />
        }
      >
        {categories.map((category) => {
          const total = category.items.reduce((sum, item) => sum + item.cost * item.quantity, 0);
          return (
            <Tabs.Trigger key={category.id} value={category.id}>
              {category.name}
              <Badge ml={2} colorPalette="teal" variant="subtle">{formatMoney(total)}</Badge>
            </Tabs.Trigger>
          );
        })}
      </RouteTabs>
      <Outlet />
    </PageLayout>
  );
}
