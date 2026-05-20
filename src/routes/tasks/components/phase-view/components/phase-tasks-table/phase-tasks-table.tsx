import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import StatusBadge from '@/ui/status-badge/status-badge';
import UiTable from '@/ui/table/table';
import { Task } from '@/store/types';

interface PhaseTasksTableProps {
  tasks: Task[];
  onRowClick: (taskId: string) => void;
}

export default function PhaseTasksTable({ tasks, onRowClick }: PhaseTasksTableProps) {
  const data = useMemo<Task[]>(
    () => tasks.map((task) => ({ taskId: task.id, name: task.name, status: task.status, costEst: task.costEst, blockedBy: task.blockedBy })),
    [tasks]
  );

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} blockedBy={row.original.blockedBy} /> },
      { accessorKey: 'costEst', header: 'Cost Est.' }
    ],
    []
  );

  return (
    <UiTable
      data={data}
      columns={columns}
      onRowClick={(row) => onRowClick(row.original.taskId)}
      getRowProps={() => ({ cursor: 'pointer' })}
    />
  );
}
