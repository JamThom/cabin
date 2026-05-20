import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import UiTable from '@/ui/table/table';
import { Note } from '@/api/hooks/notes/use-notes';

function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(2);
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yy} ${hh}:${min}`;
}

interface NotesTableProps {
  notes: Note[];
  onRowClick: (noteId: string) => void;
}

export default function NotesTable({ notes, onRowClick }: NotesTableProps) {
  const columns = useMemo<ColumnDef<Note>[]>(
    () => [
      { accessorKey: 'title', header: 'Title' },
      {
        accessorKey: 'content',
        header: 'Content',
        cell: ({ getValue }) => {
          const content = getValue<string>();
          return content.length > 50 ? content.slice(0, 50) + '...' : content;
        }
      },
      {
        accessorKey: 'dateModified',
        header: 'Modified',
        cell: ({ getValue }) => formatDate(getValue<string>()),
        sortingFn: 'datetime',
      },
    ],
    []
  );

  return (
    <UiTable
      data={notes}
      columns={columns}
      onRowClick={(row) => onRowClick(row.original.id)}
      getRowProps={() => ({ cursor: 'pointer' })}
    />
  );
}
