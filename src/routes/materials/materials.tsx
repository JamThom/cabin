import { Badge, Tabs } from '@chakra-ui/react';
import UiButton from '@/ui/button/button';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import useMaterialCategories from '@/api/hooks/materials/use-material-categories';
import useMaterialCategoriesCreate from '@/api/hooks/materials/use-material-categories-create';
import useMaterialCategoriesUpdate from '@/api/hooks/materials/use-material-categories-update';
import useMaterialCategoriesDelete from '@/api/hooks/materials/use-material-categories-delete';
import useMaterialCategoriesAddItem from '@/api/hooks/materials/use-material-categories-add-item';
import PageLayout from '@/ui/page-layout/page-layout';
import PageHeader from '@/ui/page-header/page-header';
import RouteTabs from '@/ui/route-tabs/route-tabs';
import UiExtrasMenu from '@/ui/extras-menu/extras-menu';
import useUiToast from '@/ui/toast/use-ui-toast';
import { formatMoney } from '@/utils/format-money';

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
  const { showSuccessToast } = useUiToast();

  useEffect(() => {
    if (!categoryId && categories.length > 0) navigate(`/materials/category/${categories[0].id}`, { replace: true });
  }, [categoryId, categories, navigate]);

  async function handleDeleteCategory() {
    if (!activeCategoryId) return;
    await deleteCategory.mutateAsync({ categoryId: activeCategoryId });
    showSuccessToast('Category deleted');
    const remaining = categories.filter((c) => c.id !== activeCategoryId);
    if (remaining.length > 0) navigate(`/materials/category/${remaining[0].id}`);
    else navigate('/materials');
  }

  return (
    <PageLayout>
      <PageHeader
        title={<>Materials <Badge>Est cost: {formatMoney(categories.reduce((sum, cat) => sum + cat.items.reduce((s, item) => s + item.cost * item.quantity, 0), 0))}</Badge></>}
        action={
          <UiButton
            size="sm"
            onClick={async () => {
              if (!activeCategoryId) return;
              await addItem.mutateAsync({ categoryId: activeCategoryId });
              showSuccessToast('Material created');
            }}
            disabled={!activeCategoryId}
          >
            New Material
          </UiButton>
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
                prompt: {
                  title: 'Add Category',
                  placeholder: 'Category name',
                  confirmLabel: 'Add',
                  onConfirm: async (name) => { await createCategory.mutateAsync({ name }); showSuccessToast('Category added'); }
                }
              },
              {
                label: 'Rename Category',
                disabled: !activeCategory,
                prompt: {
                  title: 'Rename Category',
                  initialValue: activeCategory?.name,
                  confirmLabel: 'Rename',
                  onConfirm: async (name) => { if (!activeCategoryId) return; await updateCategory.mutateAsync({ categoryId: activeCategoryId, name }); showSuccessToast('Category renamed'); }
                }
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
              <Badge ml={2} size="xs" colorPalette="purple" variant="subtle">{formatMoney(total)}</Badge>
            </Tabs.Trigger>
          );
        })}
      </RouteTabs>
      <Outlet />
    </PageLayout>
  );
}
