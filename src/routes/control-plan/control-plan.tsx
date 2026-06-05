import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import PageLayout from '@/ui/page-layout/page-layout';
import PageHeader from '@/ui/page-header/page-header';
import UiButton from '@/ui/button/button';
import useControlPlan from '@/api/hooks/control-plan/use-control-plan';
import useControlPlanCreate from '@/api/hooks/control-plan/use-control-plan-create';
import useUiToast from '@/ui/toast/use-ui-toast';
import { ControlPlanItem } from '@/store/types';
import ControlPlanTable from './components/control-plan-table/control-plan-table';
import ControlPlanDrawer from './components/control-plan-drawer/control-plan-drawer';

export default function ControlPlan() {
  const { data: items = [] } = useControlPlan();
  const create = useControlPlanCreate();
  const { showSuccessToast } = useUiToast();
  const [selectedItem, setSelectedItem] = useState<ControlPlanItem | null>(null);

  async function handleCreate() {
    const item = await create.mutateAsync();
    showSuccessToast('Item created');
    setSelectedItem(item);
  }

  return (
    <PageLayout>
      <PageHeader
        title="Control Plan"
        action={
          <UiButton size="sm" icon="plus" onClick={handleCreate}>
            New Item
          </UiButton>
        }
      />
      <Box borderWidth="1px" borderRadius="lg">
        <ControlPlanTable
          items={items}
          onRowClick={(id) => setSelectedItem(items.find((i) => i.id === id) ?? null)}
        />
      </Box>
      <ControlPlanDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
    </PageLayout>
  );
}
