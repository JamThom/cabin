import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import UiTable from '@/ui/table/table';
import { ControlPlanItem } from '@/store/types';
import { formatDate } from '@/utils/format-date';

interface ControlPlanTableProps {
  items: ControlPlanItem[];
  onRowClick: (id: string) => void;
}

export default function ControlPlanTable({ items, onRowClick }: ControlPlanTableProps) {
  const columns = useMemo<ColumnDef<ControlPlanItem>[]>(
    () => [
      { accessorKey: 'translated', header: 'Activity' },
      { accessorKey: 'requirement', header: 'Requirement' },
      { accessorKey: 'date', header: 'Completed at', cell: ({ row }) => row.original.date ? formatDate(row.original.date) : null },
    ],
    []
  );

  return (
    <UiTable
      data={items}
      columns={columns}
      onRowClick={(row) => onRowClick(row.original.id)}
      getRowProps={() => ({ cursor: 'pointer' })}
    />
  );
}
