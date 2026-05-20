import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { MaterialItem } from '@/api/hooks/materials/use-material-categories';
import UiTable from '@/ui/table/table';

interface MaterialsTableProps {
  items: MaterialItem[];
  onRowClick: (item: MaterialItem) => void;
}

function formatMoney(value: number) {
  return `${value.toFixed(2)}`;
}

function UrlCell({ url }: { url: string }) {
  if (!url) return null;
  let valid = false;
  let display = url;
  try {
    const parsed = new URL(url);
    valid = parsed.protocol === 'http:' || parsed.protocol === 'https:';
    display = parsed.hostname;
  } catch { /* not a valid URL */ }
  if (!valid) return <span>{url}</span>;
  return (
    <a href={url} style={{
      color: 'blue',
      textDecoration: 'underline'
    }} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
      {display}
    </a>
  );
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
        cell: ({ row }) => <UrlCell url={row.original.url} />
      },
      { accessorKey: 'cost', header: 'Cost', cell: ({ row }) => formatMoney(row.original.cost) },
      { accessorKey: 'unit', header: 'Unit', cell: ({ row }) => row.original.unit },
      { accessorKey: 'quantity', header: 'Quantity', cell: ({ row }) => row.original.quantity },
      {
        id: 'totalCost',
        header: 'Total Cost',
        accessorFn: (row) => row.cost * row.quantity,
        cell: ({ row }) => formatMoney(row.original.cost * row.original.quantity)
      }
    ],
    []
  );

  return <UiTable data={data} columns={columns} onRowClick={(row) => onRowClick(row.original)} getRowProps={() => ({ cursor: 'pointer' })} />;
}
