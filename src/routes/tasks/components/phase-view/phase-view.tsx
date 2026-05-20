import { Box } from '@chakra-ui/react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import usePhases from '@/api/hooks/phases/use-phases';
import PhaseTasksTable from './components/phase-tasks-table/phase-tasks-table';

export default function Phase() {
  const { phaseId } = useParams<{ phaseId: string }>();
  const { data: phases = [] } = usePhases();
  const navigate = useNavigate();
  const phase = phases.find((p) => p.id === phaseId);

  if (!phase) return <Box textAlign="center" color="gray.400" py={16}>Phase not found. Select a phase above.</Box>;

  return (
    <>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <PhaseTasksTable
          tasks={phase.tasks}
          onRowClick={(taskId) => navigate(`/tasks/${phaseId}/task/${taskId}`)}
        />
      </Box>
      <Outlet />
    </>
  );
}
