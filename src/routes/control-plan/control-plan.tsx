import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import PageLayout from '@/ui/page-layout/page-layout';
import PageHeader from '@/ui/page-header/page-header';
import useControlPlan from '@/api/hooks/control-plan/use-control-plan';
import { ControlPlanItem } from '@/store/types';
import ControlPlanTable from './components/control-plan-table/control-plan-table';
import ControlPlanDrawer from './components/control-plan-drawer/control-plan-drawer';

export default function ControlPlan() {
  const { data: items = [] } = useControlPlan();
  const [selectedItem, setSelectedItem] = useState<ControlPlanItem | null>(null);

  return (
    <PageLayout>
      <PageHeader title="Control Plan" />
      <Box borderWidth="1px" borderRadius="lg"
        flex="1"
        overflow="hidden"
        padding="10px"
        border="0"
        margin="-10px">
        <ControlPlanTable
          items={items}
          onRowClick={(id) => setSelectedItem(items.find((i) => i.id === id) ?? null)}
        />
      </Box>
      <ControlPlanDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
    </PageLayout>
  );
}
