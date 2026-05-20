import { useEffect, useMemo, useState } from 'react';
import { Box, CloseButton, Drawer, For, Input, NativeSelect, Portal, Stack, Text } from '@chakra-ui/react';
import UiButton from '@/ui/button/button';
import { useNavigate, useParams } from 'react-router-dom';
import { STATUSES } from '@/store/constants';
import { Status } from '@/store/types';
import usePhases from '@/api/hooks/phases/use-phases';
import usePhasesTaskUpdate from '@/api/hooks/phases/use-phases-task-update';
import usePhasesTaskDelete from '@/api/hooks/phases/use-phases-task-delete';
import useUiToast from '@/ui/toast/use-ui-toast';

export default function TaskDrawer() {
  const { phaseId, taskId } = useParams<{ phaseId: string; taskId: string }>();
  const navigate = useNavigate();
  const { data: phases = [] } = usePhases();
  const taskUpdate = usePhasesTaskUpdate();
  const taskDelete = usePhasesTaskDelete();
  const { showSuccessToast } = useUiToast();

  const task = useMemo(
    () => phases.find((p) => p.id === phaseId)?.tasks.find((t) => t.id === taskId) ?? null,
    [phaseId, taskId, phases]
  );

  const [name, setName] = useState('');
  const [status, setStatus] = useState<Status>('to-do');
  const [costEst, setCostEst] = useState('');
  const [blockedBy, setBlockedBy] = useState('');

  useEffect(() => {
    if (!task) return;
    setName(task.name);
    setStatus(task.status);
    setCostEst(task.costEst);
    setBlockedBy(task.blockedBy ?? '');
  }, [task]);

  function close() {
    navigate(`/tasks/${phaseId}`);
  }

  return (
    <Drawer.Root open={Boolean(task)} onOpenChange={(e) => !e.open && close()} placement="end" size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <Drawer.Title>Edit Task</Drawer.Title>
              <Drawer.CloseTrigger asChild><CloseButton size="sm" /></Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body pt={6}>
              <Stack gap={5}>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Name</Text>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Status</Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                      <For each={STATUSES}>{(s) => <option key={s} value={s}>{s}</option>}</For>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>
                {status === 'blocked' && (
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={1}>Blocked By</Text>
                    <Input placeholder="e.g. foundation work" value={blockedBy} onChange={(e) => setBlockedBy(e.target.value)} />
                  </Box>
                )}
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Cost Estimate</Text>
                  <Input placeholder="e.g. $1,000" value={costEst} onChange={(e) => setCostEst(e.target.value)} />
                </Box>
              </Stack>
            </Drawer.Body>
            <Drawer.Footer borderTopWidth="1px" gap={2}>
              <UiButton colorPalette="red" variant="outline" onClick={async () => { await taskDelete.mutateAsync({ phaseId: phaseId!, taskId: taskId! }); showSuccessToast('Task deleted'); close(); }}>Delete</UiButton>
              <UiButton onClick={async () => { await taskUpdate.mutateAsync({ phaseId: phaseId!, taskId: taskId!, name, status, costEst, blockedBy }); showSuccessToast('Task saved'); close(); }}>Save</UiButton>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
