import { Table } from '@chakra-ui/react';
import { Cell, ColumnDef, Row, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ComponentProps } from 'react';

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
          <Table.Row key={row.id} onClick={() => onRowClick?.(row)} {...getRowProps?.(row)}>
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