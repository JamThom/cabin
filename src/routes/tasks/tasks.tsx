import { Badge, Button, Tabs } from '@chakra-ui/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import usePhases from '@/api/hooks/phases/use-phases';
import usePhasesCreate from '@/api/hooks/phases/use-phases-create';
import usePhasesUpdate from '@/api/hooks/phases/use-phases-update';
import usePhasesDelete from '@/api/hooks/phases/use-phases-delete';
import usePhasesAddTask from '@/api/hooks/phases/use-phases-add-task';
import PageLayout from '@/ui/page-layout/page-layout';
import PageHeader from '@/ui/page-header/page-header';
import RouteTabs from '@/ui/route-tabs/route-tabs';
import UiExtrasMenu from '@/ui/extras-menu/extras-menu';

function formatMoney(value: number) {
  return `$${value.toLocaleString()}`;
}

function parseMoney(value: string): number {
  return parseFloat(value.replace(/[$,]/g, '')) || 0;
}

export default function Tasks() {
  const { data: phases = [] } = usePhases();
  const createPhase = usePhasesCreate();
  const updatePhase = usePhasesUpdate();
  const deletePhase = usePhasesDelete();
  const addTask = usePhasesAddTask();
  const navigate = useNavigate();
  const { phaseId } = useParams<{ phaseId: string }>();
  const activePhaseId = phaseId ?? phases[0]?.id;
  const activePhase = phases.find((p) => p.id === activePhaseId);

  function handleDeletePhase() {
    if (!activePhaseId) return;
    deletePhase.mutate({ phaseId: activePhaseId }, {
      onSuccess: () => {
        const remaining = phases.filter((p) => p.id !== activePhaseId);
        if (remaining.length > 0) navigate(`/tasks/${remaining[0].id}`);
        else navigate('/tasks');
      }
    });
  }

  return (
    <PageLayout>
      <PageHeader
        title="Cabin Build Organiser"
        action={
          <Button
            colorPalette="teal"
            size="sm"
            onClick={() => activePhaseId && addTask.mutate({ phaseId: activePhaseId })}
            disabled={!activePhaseId}
          >
            New Task
          </Button>
        }
      />
      <RouteTabs
        value={activePhaseId}
        onValueChange={(value) => navigate(`/tasks/${value}`)}
        action={
          <UiExtrasMenu
            options={[
              {
                label: 'Add Phase',
                prompt: { title: 'Add Phase', placeholder: 'Phase name', confirmLabel: 'Add', onConfirm: (name) => createPhase.mutate({ name }) }
              },
              {
                label: 'Rename Phase',
                disabled: !activePhase,
                prompt: { title: 'Rename Phase', initialValue: activePhase?.name, confirmLabel: 'Rename', onConfirm: (name) => activePhaseId && updatePhase.mutate({ phaseId: activePhaseId, name }) }
              },
              {
                label: 'Delete Phase',
                disabled: !activePhase,
                color: 'red.500',
                onClick: handleDeletePhase
              }
            ]}
          />
        }
      >
        {phases.map((phase) => {
          const total = phase.tasks.reduce((sum, task) => sum + parseMoney(task.costEst), 0);
          return (
            <Tabs.Trigger key={phase.id} value={phase.id}>
              {phase.name}
              <Badge ml={2} colorPalette="teal" variant="subtle">{formatMoney(total)}</Badge>
            </Tabs.Trigger>
          );
        })}
      </RouteTabs>
      <Outlet />
    </PageLayout>
  );
}
