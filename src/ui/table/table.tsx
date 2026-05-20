import { useState } from 'react';
import { Table } from '@chakra-ui/react';
import { Cell, ColumnDef, Row, SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ComponentProps } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

type UiTableRowProps = Omit<ComponentProps<typeof Table.Row>, 'children'>;
type UiTableCellProps = Omit<ComponentProps<typeof Table.Cell>, 'children'>;

interface UiTableProps<TData extends object> {
  data: TData[];
  columns: ColumnDef<TData>[];
  onRowClick?: (row: Row<TData>) => void;
  getRowProps?: (row: Row<TData>) => UiTableRowProps;
  getCellProps?: (cell: Cell<TData, unknown>) => UiTableCellProps;
}

export default function UiTable<TData extends object>({ data, columns, onRowClick, getRowProps, getCellProps }: UiTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  });

  return (
    <Table.Root size="sm">
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id} bg="gray.50" _dark={{ bg: 'gray.800' }}>
            {headerGroup.headers.map((header) => {
              const sorted = header.column.getIsSorted();
              const canSort = header.column.getCanSort();
              return (
                <Table.ColumnHeader
                  key={header.id}
                  position="sticky"
                  top={0}
                  bg="gray.50"
                  _dark={{ bg: 'gray.800' }}
                  zIndex={1}
                  cursor={canSort ? 'pointer' : 'default'}
                  userSelect="none"
                  whiteSpace="nowrap"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {canSort && (
                        <FontAwesomeIcon
                          icon={sorted === 'asc' ? faSortUp : sorted === 'desc' ? faSortDown : faSort}
                          style={{ opacity: sorted ? 1 : 0.35, fontSize: '0.7em' }}
                        />
                      )}
                    </span>
                  )}
                </Table.ColumnHeader>
              );
            })}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body>
        {table.getRowModel().rows.map((row) => (
          <Table.Row
            key={row.id}
            onClick={() => onRowClick?.(row)}
            bg={onRowClick ? 'gray.50' : undefined}
            _dark={onRowClick ? { bg: 'gray.900' } : undefined}
            _hover={onRowClick ? { bg: 'gray.100', _dark: { bg: 'gray.800' } } : undefined}
            {...getRowProps?.(row)}
          >
            {row.getVisibleCells().map((cell) => (
              <Table.Cell key={cell.id} {...getCellProps?.(cell)}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
