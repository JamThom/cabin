import { Badge } from '@chakra-ui/react';
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
    <a href={url} style={{ color: 'blue', textDecoration: 'underline' }} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
      {display}
    </a>
  );
}

const GROUP_PALETTE: Record<string, string> = {
  framing: 'blue',
  roof: 'orange',
  weatherproofing: 'cyan',
  windows: 'purple',
  doors: 'green',
  cladding: 'red',
  foundations: 'yellow',
  materials: 'gray',
  floors: 'orange',
  bathroom: 'teal',
  kitchen: 'pink',
  heating: 'red',
  electric: 'yellow',
  finishes: 'green',
  ceiling: 'purple',
  other: 'gray',
  paneling: 'teal',
};

const HASH_COLORS = ['red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'];

function getGroupColor(group: string): string {
  const key = group.toLowerCase();
  if (GROUP_PALETTE[key]) return GROUP_PALETTE[key];
  let h = 0;
  for (const c of group) h = (h * 31 + c.charCodeAt(0)) & 0xfffff;
  return HASH_COLORS[h % HASH_COLORS.length];
}

function GroupBadge({ group }: { group: string }) {
  if (!group) return null;
  return <Badge colorPalette={getGroupColor(group)} variant="subtle" size="sm">{group}</Badge>;
}

export default function MaterialsTable({ items, onRowClick }: MaterialsTableProps) {
  const data = useMemo(() => items, [items]);

  const columns = useMemo<ColumnDef<MaterialItem>[]>(
    () => [
      {
        accessorKey: 'group',
        header: 'Group',
        cell: ({ row }) => <GroupBadge group={row.original.group} />
      },
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
