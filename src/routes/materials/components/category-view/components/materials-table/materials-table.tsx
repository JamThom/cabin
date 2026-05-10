import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { MaterialItem } from '@/api/hooks/materials/use-material-categories';
import UiTable from '@/ui/table/table';

interface MaterialsTableProps {
  items: MaterialItem[];
  onRowClick: (item: MaterialItem) => void;
}

function formatMoney(value: number) {
  return `$${value.toFixed(2)}`;
}

export default function MaterialsTable({ items, onRowClick }: MaterialsTableProps) {
  const data = useMemo(() => items, [items]);

  const columns = useMemo<ColumnDef<MaterialItem>[]>(
    () => [
      { accessorKey: 'name', header: 'Name', cell: ({ row }) => row.original.name },
      { accessorKey: 'productName', header: 'Product Name', cell: ({ row }) => row.original.productName },
      {
        accessorKey: 'url',
        header: 'URL',
        cell: ({ row }) => <a href={row.original.url} target="_blank" rel="noreferrer">{row.original.url}</a>
      },
      { accessorKey: 'cost', header: 'Cost', cell: ({ row }) => formatMoney(row.original.cost) },
      { accessorKey: 'unit', header: 'Unit', cell: ({ row }) => row.original.unit },
      { accessorKey: 'quantity', header: 'Quantity', cell: ({ row }) => row.original.quantity },
      {
        id: 'totalCost',
        header: 'Total Cost',
        cell: ({ row }) => formatMoney(row.original.cost * row.original.quantity)
      }
    ],
    []
  );

  return <UiTable data={data} columns={columns} onRowClick={(row) => onRowClick(row.original)} getRowProps={() => ({ cursor: 'pointer' })} />;
}
