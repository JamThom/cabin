import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import Icon from '@/ui/icon/icon';
import StatusBadge from '@/ui/status-badge/status-badge';
import UiTable from '@/ui/table/table';
import { Task } from '@/store/types';

type RowStatus = 'to-do' | 'in-progress' | 'blocked' | 'completed';

interface PhaseTaskRow {
  key: string;
  itemId: string;
  taskId: string;
  isTask: boolean;
  hasSubtasks: boolean;
  name: string;
  status: RowStatus;
  costEst: string;
}

interface PhaseTasksTableProps {
  tasks: Task[];
}

export default function PhaseTasksTable({ tasks }: PhaseTasksTableProps) {
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set());

  const data = useMemo<PhaseTaskRow[]>(() => {
    const rows: PhaseTaskRow[] = [];
    tasks.forEach((task) => {
      rows.push({
        key: `task-${task.id}`,
        itemId: task.id,
        taskId: task.id,
        isTask: true,
        hasSubtasks: task.subtasks.length > 0,
        name: task.name,
        status: task.status,
        costEst: task.costEst
      });

      if (expandedTaskIds.has(task.id)) {
        task.subtasks.forEach((subtask) => {
          rows.push({
            key: `subtask-${subtask.id}`,
            itemId: subtask.id,
            taskId: task.id,
            isTask: false,
            hasSubtasks: false,
            name: subtask.name,
            status: subtask.status,
            costEst: subtask.costEst
          });
        });
      }
    });
    return rows;
  }, [expandedTaskIds, tasks]);

  const columns = useMemo<ColumnDef<PhaseTaskRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          if (!row.original.isTask) return `↳ ${row.original.name}`;
          if (!row.original.hasSubtasks) return row.original.name;
          return (
            <>
              <Icon name={expandedTaskIds.has(row.original.taskId) ? 'chevron-down' : 'chevron-right'} /> {row.original.name}
            </>
          );
        }
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />
      },
      { accessorKey: 'costEst', header: 'Cost Est.', cell: ({ row }) => row.original.costEst }
    ],
    [expandedTaskIds]
  );

  return (
    <UiTable
      data={data}
      columns={columns}
      onRowClick={(row) => {
        if (!row.original.isTask || !row.original.hasSubtasks) return;
        setExpandedTaskIds((previous) => {
          const next = new Set(previous);
          if (next.has(row.original.taskId)) next.delete(row.original.taskId);
          else next.add(row.original.taskId);
          return next;
        });
      }}
      getRowProps={(row) => ({
        key: row.original.key,
        cursor: row.original.isTask && row.original.hasSubtasks ? 'pointer' : 'default',
        bg: row.original.isTask ? undefined : 'gray.50',
        _dark: row.original.isTask ? undefined : { bg: 'gray.900' }
      })}
      getCellProps={(cell) => ({
        pl: cell.column.id === 'name' && !cell.row.original.isTask ? 8 : undefined
      })}
    />
  );
}