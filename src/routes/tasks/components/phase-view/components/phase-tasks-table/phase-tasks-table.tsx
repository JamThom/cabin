import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import StatusBadge from '@/ui/status-badge/status-badge';
import UiTable from '@/ui/table/table';
import { Task } from '@/store/types';
import { formatDate } from '@/utils/format-date';

interface PhaseTasksTableProps {
  tasks: Task[];
  onRowClick: (taskId: string) => void;
}

export default function PhaseTasksTable({ tasks, onRowClick }: PhaseTasksTableProps) {
  const data = useMemo<Task[]>(
    () => tasks.map((task) => ({ taskId: task.id, name: task.name, status: task.status, costEst: task.costEst, blockedBy: task.blockedBy, date: task.date })),
    [tasks]
  );

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      { accessorKey: 'name', header: 'Name' },
      { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} blockedBy={row.original.blockedBy} /> },
      { accessorKey: 'costEst', header: 'Cost Est.' },
      { accessorKey: 'date', header: 'Date', cell: ({ row }) => row.original.date ? formatDate(row.original.date) : null }
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
