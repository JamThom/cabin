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
      { accessorKey: 'activity', header: 'Activity' },
      { accessorKey: 'translated', header: 'Translated' },
      { accessorKey: 'category', header: 'Category' },
      { accessorKey: 'requirement', header: 'Requirement' },
      { accessorKey: 'performedBy', header: 'Performed By' },
      { accessorKey: 'reportedAction', header: 'Reported Action' },
      { accessorKey: 'toKA', header: 'To KA' },
      { accessorKey: 'toBN', header: 'To BN' },
      { accessorKey: 'date', header: 'Date', cell: ({ row }) => row.original.date ? formatDate(row.original.date) : null },
      { accessorKey: 'signature', header: 'Signature' },
      { accessorKey: 'note', header: 'Note' },
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
