import { Text } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import UiTableCheckbox, { useRowSelection } from '@/ui/table/table-checkbox';
import { MaterialItem } from '@/api/hooks/materials/use-material-categories';
import UiTable from '@/ui/table/table';
import UiBulkActions from '@/ui/bulk-actions/bulk-actions';
import UiButton from '@/ui/button/button';
import BulkEditDrawer from '../bulk-edit-drawer/bulk-edit-drawer';
import { formatMoney } from '@/utils/format-money';

interface MaterialsTableProps {
  categoryId: string;
  items: MaterialItem[];
  onRowClick: (item: MaterialItem) => void;
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

export default function MaterialsTable({ categoryId, items, onRowClick }: MaterialsTableProps) {
  const { rowSelection, setRowSelection, handleRowMouseEnter } = useRowSelection(items);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);

  const selectedItems = useMemo(
    () => items.filter((_, i) => rowSelection[String(i)]),
    [items, rowSelection]
  );

  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.cost * item.quantity, 0),
    [selectedItems]
  );

  const columns = useMemo<ColumnDef<MaterialItem>[]>(
    () => [
      {
        id: 'select',
        enableSorting: false,
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
            }}
            onChange={table.getToggleAllRowsSelectedHandler()}
            style={{ cursor: 'pointer' }}
          />
        ),
        cell: ({ row }) => <UiTableCheckbox row={row} setRowSelection={setRowSelection} />,
      },
      { accessorKey: 'name', header: 'Name', cell: ({ row }) => row.original.name },
      { accessorKey: 'productName', header: 'Product Name', cell: ({ row }) => row.original.productName },
      { accessorKey: 'url', header: 'URL', cell: ({ row }) => <UrlCell url={row.original.url} /> },
      { accessorKey: 'cost', header: 'Cost', cell: ({ row }) => formatMoney(row.original.cost) },
      { accessorKey: 'unit', header: 'Unit', cell: ({ row }) => row.original.unit },
      { accessorKey: 'quantity', header: 'Quantity', cell: ({ row }) => row.original.quantity },
      {
        id: 'totalCost',
        header: 'Total Cost',
        accessorFn: (row) => row.cost * row.quantity,
        cell: ({ row }) => formatMoney(row.original.cost * row.original.quantity),
      },
    ],
    []
  );

  return (
    <>
      <UiTable
        data={items}
        columns={columns}
        onRowClick={(row) => onRowClick(row.original)}
        getRowProps={() => ({ cursor: 'pointer' })}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        onRowMouseEnter={handleRowMouseEnter}
      />
      {selectedItems.length > 0 && (
        <UiBulkActions>
          <Text fontSize="sm" fontWeight="medium">{selectedItems.length} selected · {formatMoney(selectedTotal)}</Text>
          <UiButton size="sm" onClick={() => setBulkEditOpen(true)}>
            Edit {selectedItems.length} items
          </UiButton>
        </UiBulkActions>
      )}
      <BulkEditDrawer
        categoryId={categoryId}
        items={selectedItems}
        open={bulkEditOpen}
        onClose={() => { setBulkEditOpen(false); setRowSelection({}); }}
      />
    </>
  );
}
