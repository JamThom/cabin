import { Badge, Button, Tabs } from '@chakra-ui/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useMaterialCategories from '@/api/hooks/materials/use-material-categories';
import useMaterialCategoriesAddItem from '@/api/hooks/materials/use-material-categories-add-item';
import useMaterialCategoriesCreate from '@/api/hooks/materials/use-material-categories-create';
import AddCategoryModal from './components/add-category-modal/add-category-modal';
import PageLayout from '@/ui/page-layout/page-layout';
import PageHeader from '@/ui/page-header/page-header';
import RouteTabs from '@/ui/route-tabs/route-tabs';

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function Materials() {
  const { data: categories = [] } = useMaterialCategories();
  const createCategory = useMaterialCategoriesCreate();
  const addItem = useMaterialCategoriesAddItem();
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const activeCategoryId = categoryId ?? categories[0]?.id;

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
        action={<AddCategoryModal onAdd={(name) => createCategory.mutate({ name })} />}
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
