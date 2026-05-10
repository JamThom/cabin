import { Table } from '@chakra-ui/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import StatusBadge from '@/ui/status-badge/status-badge';

type RowStatus = 'to-do' | 'in-progress' | 'blocked' | 'completed';

interface PhaseTaskRow {
  id: string;
  name: string;
  status: RowStatus;
  costEst: string;
  level: 'task' | 'subtask';
}

export default function PhaseTasksTable() {
  const data = useMemo<PhaseTaskRow[]>(
    () => [
      { id: 'task-1', name: 'Clear land', status: 'completed', costEst: '$500', level: 'task' },
      { id: 'st-1', name: 'Remove trees', status: 'completed', costEst: '$300', level: 'subtask' },
      { id: 'task-2', name: 'Lay foundation', status: 'in-progress', costEst: '$4,000', level: 'task' },
      { id: 'st-2', name: 'Install anchor bolts', status: 'to-do', costEst: '$1,000', level: 'subtask' }
    ],
    []
  );

  const columns = useMemo<ColumnDef<PhaseTaskRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => row.original.level === 'subtask' ? `↳ ${row.original.name}` : row.original.name
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />
      },
      { accessorKey: 'costEst', header: 'Cost Est.', cell: ({ row }) => row.original.costEst }
    ],
    []
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <Table.Root size="sm">
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id} bg="gray.50" _dark={{ bg: 'gray.800' }}>
            {headerGroup.headers.map((header) => (
              <Table.ColumnHeader key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Cell key={cell.id} p={0}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}