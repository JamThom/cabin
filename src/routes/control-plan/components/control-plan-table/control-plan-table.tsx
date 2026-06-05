import { ColumnDef } from '@tanstack/react-table';
import { Stack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import Icon from '@/ui/icon/icon';
import UiTable from '@/ui/table/table';
import { ControlPlanItem } from '@/store/types';
import { formatDate } from '@/utils/format-date';

interface ControlPlanTableProps {
  items: ControlPlanItem[];
  onRowClick: (id: string) => void;
}

type TableRow =
  | { kind: 'group'; key: string; category: string; count: number }
  | { kind: 'item'; key: string; item: ControlPlanItem };

const CATEGORY_ORDER = ['New Building Planning', 'Construction', 'Installations', 'Project Close-out'];

export default function ControlPlanTable({ items, onRowClick }: ControlPlanTableProps) {
  const categories = useMemo(() => {
    const all = Array.from(new Set(items.map((i) => i.category))).sort(
      (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
    );
    return all;
  }, [items]);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const data = useMemo<TableRow[]>(() => {
    const rows: TableRow[] = [];
    for (const cat of categories) {
      const group = items.filter((i) => i.category === cat);
      rows.push({ kind: 'group', key: `group-${cat}`, category: cat, count: group.length });
      if (!collapsed.has(cat)) {
        group.forEach((item) => rows.push({ kind: 'item', key: `item-${item.id}`, item }));
      }
    }
    return rows;
  }, [items, categories, collapsed]);

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        id: 'activity',
        header: 'Activity',
        cell: ({ row }) => {
          if (row.original.kind === 'group') {
            const expanded = !collapsed.has(row.original.category);
            return (
              <Stack direction="row" align="center" gap={2}>
                <Icon name={expanded ? 'chevron-down' : 'chevron-right'} />
                <span>{row.original.category}</span>
              </Stack>
            );
          }
          return row.original.item.translated;
        },
      },
      {
        id: 'requirement',
        header: 'Requirement',
        cell: ({ row }) => row.original.kind === 'item' ? row.original.item.requirement : null,
      },
      {
        id: 'reportedAction',
        header: 'Reported Action',
        cell: ({ row }) => row.original.kind === 'item' ? row.original.item.reportedAction : null,
      },
      {
        id: 'date',
        header: 'Completed at',
        cell: ({ row }) =>
          row.original.kind === 'item' && row.original.item.date
            ? formatDate(row.original.item.date)
            : null,
      },
    ],
    [collapsed]
  );

  return (
    <UiTable
      data={data}
      columns={columns}
      getRowKey={(row) => row.original.key}
      onRowClick={(row) => {
        if (row.original.kind === 'group') {
          setCollapsed((prev) => {
            const next = new Set(prev);
            if (next.has(row.original.category)) next.delete(row.original.category);
            else next.add(row.original.category);
            return next;
          });
        } else {
          onRowClick(row.original.item.id);
        }
      }}
      getRowProps={(row) => ({
        cursor: 'pointer',
        fontWeight: row.original.kind === 'group' ? 'semibold' : 'normal',
        bg: row.original.kind === 'group' ? 'gray.50' : undefined,
      })}
    />
  );
}
