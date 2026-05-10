import { useEffect, useMemo, useState } from 'react';
import { Box, Button, CloseButton, Drawer, For, Input, NativeSelect, Portal, Stack, Text } from '@chakra-ui/react';
import { STATUSES } from '../../../../../../store/constants';
import { usePhases } from '../../../../../../store/use-phases';
import { DrawerItem, Status } from '../../../../../../store/types';
import StatusBadge from '@/ui/status-badge/status-badge';

interface TaskDrawerProps {
  item: DrawerItem | null;
  onClose: () => void;
}

export default function TaskDrawer({ item, onClose }: TaskDrawerProps) {
  const { phases, addSubtask, deleteItem, saveItem } = usePhases();
  const source = useMemo(() => {
    if (!item) return null;
    const phase = phases.find((currentPhase) => currentPhase.id === item.phaseId);
    const task = phase?.tasks.find((currentTask) => currentTask.id === item.taskId);
    return item.type === 'subtask' ? task?.subtasks.find((subtask) => subtask.id === item.subtaskId) ?? null : task ?? null;
  }, [item, phases]);
  const task = item?.type === 'task' ? phases.find((phase) => phase.id === item.phaseId)?.tasks.find((currentTask) => currentTask.id === item.taskId) : null;
  const [name, setName] = useState('');
  const [status, setStatus] = useState<Status>('to-do');
  const [costEst, setCostEst] = useState('');

  useEffect(() => {
    if (!source) return;
    setName(source.name);
    setStatus(source.status);
    setCostEst(source.costEst);
  }, [source]);

  if (!item || !source) return null;

  return (
    <Drawer.Root open={Boolean(item)} onOpenChange={(event) => !event.open && onClose()} placement="end" size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <Drawer.Title>{item.type === 'task' ? 'Edit Task' : 'Edit Sub-task'}</Drawer.Title>
              <Drawer.CloseTrigger asChild><CloseButton size="sm" /></Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body pt={6}>
              <Stack gap={5}>
                <Box><Text fontSize="sm" fontWeight="medium" mb={1}>Name</Text><Input value={name} onChange={(event) => setName(event.target.value)} /></Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Status</Text>
                  <NativeSelect.Root>
                    <NativeSelect.Field value={status} onChange={(event) => setStatus(event.target.value as Status)}>
                      <For each={STATUSES}>{(nextStatus) => <option key={nextStatus} value={nextStatus}>{nextStatus}</option>}</For>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Box>
                <Box><Text fontSize="sm" fontWeight="medium" mb={1}>Cost Estimate</Text><Input placeholder="e.g. $1,000" value={costEst} onChange={(event) => setCostEst(event.target.value)} /></Box>
                {item.type === 'task' && task && (
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>Sub-tasks</Text>
                    <Stack gap={2}>
                      {task.subtasks.map((subtask) => (
                        <Box key={subtask.id} p={3} borderWidth="1px" borderRadius="md" display="flex" justifyContent="space-between" alignItems="center">
                          <Stack gap={0}><Text fontSize="sm" fontWeight="medium">{subtask.name}</Text><Text fontSize="xs" color="gray.500">{subtask.costEst}</Text></Stack>
                          <StatusBadge status={subtask.status} />
                        </Box>
                      ))}
                      <Button size="sm" variant="outline" onClick={() => addSubtask(item.phaseId, item.taskId)}>+ Add Sub-task</Button>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Drawer.Body>
            <Drawer.Footer borderTopWidth="1px" gap={2}>
              <Button colorPalette="red" variant="outline" onClick={() => { deleteItem(item); onClose(); }}>Delete</Button>
              <Button colorPalette="teal" onClick={() => { saveItem(item, name, status, costEst); onClose(); }}>Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
