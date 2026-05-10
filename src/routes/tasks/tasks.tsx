import { Button, Tabs } from '@chakra-ui/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import NewPhaseModal from './components/new-phase-modal/new-phase-modal';
import usePhases from '@/api/hooks/phases/use-phases';
import usePhasesCreate from '@/api/hooks/phases/use-phases-create';
import usePhasesAddTask from '@/api/hooks/phases/use-phases-add-task';
import PageLayout from '@/ui/page-layout/page-layout';
import PageHeader from '@/ui/page-header/page-header';
import RouteTabs from '@/ui/route-tabs/route-tabs';

export default function Tasks() {
  const { data: phases = [] } = usePhases();
  const createPhase = usePhasesCreate();
  const addTask = usePhasesAddTask();
  const navigate = useNavigate();
  const { phaseId } = useParams<{ phaseId: string }>();
  const activePhaseId = phaseId ?? phases[0]?.id;

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
        onValueChange={(value) => navigate(`/tasks/phase/${value}`)}
        action={<NewPhaseModal onAdd={(name) => createPhase.mutate({ name })} buttonLabel="Add Phase" />}
      >
        {phases.map((phase) => (
          <Tabs.Trigger key={phase.id} value={phase.id}>
            {phase.name}
          </Tabs.Trigger>
        ))}
      </RouteTabs>
      <Outlet />
    </PageLayout>
  );
}
