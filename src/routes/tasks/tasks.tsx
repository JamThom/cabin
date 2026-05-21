import { Badge, Tabs } from '@chakra-ui/react';
import UiButton from '@/ui/button/button';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import usePhases from '@/api/hooks/phases/use-phases';
import usePhasesCreate from '@/api/hooks/phases/use-phases-create';
import usePhasesUpdate from '@/api/hooks/phases/use-phases-update';
import usePhasesDelete from '@/api/hooks/phases/use-phases-delete';
import usePhasesAddTask from '@/api/hooks/phases/use-phases-add-task';
import PageLayout from '@/ui/page-layout/page-layout';
import PageHeader from '@/ui/page-header/page-header';
import RouteTabs from '@/ui/route-tabs/route-tabs';
import UiExtrasMenu from '@/ui/extras-menu/extras-menu';
import useUiToast from '@/ui/toast/use-ui-toast';
import { formatMoney } from '@/utils/format-money';

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
  const { showSuccessToast } = useUiToast();

  useEffect(() => {
    if (!phaseId && phases.length > 0) navigate(`/tasks/${phases[0].id}`, { replace: true });
  }, [phaseId, phases, navigate]);

  async function handleDeletePhase() {
    if (!activePhaseId) return;
    await deletePhase.mutateAsync({ phaseId: activePhaseId });
    showSuccessToast('Phase deleted');
    const remaining = phases.filter((p) => p.id !== activePhaseId);
    if (remaining.length > 0) navigate(`/tasks/${remaining[0].id}`);
    else navigate('/tasks');
  }

  return (
    <PageLayout>
      <PageHeader
        title={<>Tasks <Badge>Est cost: {phases.reduce((sum, phase) => sum + phase.tasks.reduce((s, task) => s + parseMoney(task.costEst), 0), 0).toLocaleString()}</Badge></>}
        action={
          <UiButton
            size="sm"
            icon="plus"
            onClick={async () => {
              if (!activePhaseId) return;
              const task = await addTask.mutateAsync({ phaseId: activePhaseId });
              showSuccessToast('Task created');
              navigate(`/tasks/${activePhaseId}/task/${task.id}`);
            }}
            disabled={!activePhaseId}
          >
            New Task
          </UiButton>
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
                prompt: {
                  title: 'Add Phase',
                  placeholder: 'Phase name',
                  confirmLabel: 'Add',
                  onConfirm: async (name) => { await createPhase.mutateAsync({ name }); showSuccessToast('Phase added'); }
                }
              },
              {
                label: 'Rename Phase',
                disabled: !activePhase,
                prompt: {
                  title: 'Rename Phase',
                  initialValue: activePhase?.name,
                  confirmLabel: 'Rename',
                  onConfirm: async (name) => { if (!activePhaseId) return; await updatePhase.mutateAsync({ phaseId: activePhaseId, name }); showSuccessToast('Phase renamed'); }
                }
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
              <Badge ml={2} size="xs" colorPalette="purple" variant="subtle">{formatMoney(total)}</Badge>
            </Tabs.Trigger>
          );
        })}
      </RouteTabs>
      <Outlet />
    </PageLayout>
  );
}
