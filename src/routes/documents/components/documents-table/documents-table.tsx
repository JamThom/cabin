import { Box, Badge, Stack } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import Icon from '@/ui/icon/icon';
import UiExtrasMenu from '@/ui/extras-menu/extras-menu';
import UiTable from '@/ui/table/table';
import { DocumentFile, DocumentFolder } from '@/store/types';

interface DocRow {
  key: string;
  id: string;
  type: 'folder' | 'file';
  folderId: string;
  name: string;
  tags: string[];
  modified: string;
  mimeType: string;
}

interface DocumentsTableProps {
  folders: DocumentFolder[];
  onFileClick?: (file: DocumentFile) => void;
  onFolderUploadClick?: (folderId: string) => void;
}

export default function DocumentsTable({ folders, onFileClick, onFolderUploadClick }: DocumentsTableProps) {
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set(folders.map((f) => f.id)));
  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null);

  const data = useMemo<DocRow[]>(() => {
    const rows: DocRow[] = [];
    folders.forEach((folder) => {
      rows.push({
        key: `folder-${folder.id}`,
        id: folder.id,
        type: 'folder',
        folderId: folder.id,
        name: folder.name,
        tags: [],
        modified: '',
        mimeType: ''
      });
      if (expandedFolderIds.has(folder.id)) {
        folder.files.forEach((file) => {
          rows.push({
            key: `file-${file.id}`,
            id: file.id,
            type: 'file',
            folderId: folder.id,
            name: file.name,
            tags: file.tags,
            modified: file.modified,
            mimeType: file.mimeType
          });
        });
      }
    });
    return rows;
  }, [expandedFolderIds, folders]);

  const columns = useMemo<ColumnDef<DocRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          if (row.original.type === 'folder') {
            const expanded = expandedFolderIds.has(row.original.id);
            return (
              <Stack direction="row" align="center" gap={2}>
                <Icon name={expanded ? 'chevron-down' : 'chevron-right'} />
                <Icon name="folder" />
                <span>{row.original.name}</span>
              </Stack>
            );
          }
          return (
            <Stack direction="row" align="center" gap={2}>
              <Icon name="file" />
              <span>{row.original.name}</span>
            </Stack>
          );
        }
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => (
          <Stack direction="row" gap={1} wrap="wrap">
            {row.original.tags.map((tag) => (
              <Badge key={tag} size="sm" variant="subtle" colorPalette="gray">{tag}</Badge>
            ))}
          </Stack>
        )
      },
      {
        accessorKey: 'modified',
        header: 'Modified',
        cell: ({ row }) => row.original.modified || null
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => {
          if (row.original.type !== 'folder') return null;
          const visible = hoveredFolderId === row.original.id;
          return (
            <Box
              display="flex"
              justifyContent="flex-end"
              visibility={visible ? 'visible' : 'hidden'}
              onClick={(e) => e.stopPropagation()}
            >
              <UiExtrasMenu
                variant="inline"
                options={[
                  { label: 'Delete', onClick: () => {} },
                  { label: 'Rename', onClick: () => {} },
                  { label: 'Add Subfolder', onClick: () => {} },
                  { label: 'Upload', onClick: () => onFolderUploadClick?.(row.original.id) },
                ]}
              />
            </Box>
          );
        }
      }
    ],
    [expandedFolderIds, hoveredFolderId, onFolderUploadClick]
  );

  return (
    <UiTable
      data={data}
      columns={columns}
      onRowClick={(row) => {
        if (row.original.type === 'folder') {
          setExpandedFolderIds((prev) => {
            const next = new Set(prev);
            if (next.has(row.original.id)) next.delete(row.original.id);
            else next.add(row.original.id);
            return next;
          });
        } else {
          onFileClick?.({
            id: row.original.id,
            folderId: row.original.folderId,
            name: row.original.name,
            tags: row.original.tags,
            modified: row.original.modified,
            mimeType: row.original.mimeType,
          });
        }
      }}
      onRowMouseEnter={(row) => {
        if (row.original.type === 'folder') setHoveredFolderId(row.original.id);
      }}
      onRowMouseLeave={() => setHoveredFolderId(null)}
      getRowProps={(row) => ({
        key: row.original.key,
        cursor: 'pointer',
        fontWeight: row.original.type === 'folder' ? 'semibold' : 'normal',
        bg: row.original.type === 'folder' ? 'gray.50' : undefined,
        _dark: row.original.type === 'folder' ? { bg: 'gray.800' } : undefined
      })}
      getCellProps={(cell) => ({
        pl: cell.column.id === 'name' && cell.row.original.type === 'file' ? 10 : undefined,
        w: cell.column.id === 'actions' ? '1%' : undefined,
        whiteSpace: cell.column.id === 'actions' ? 'nowrap' : undefined,
      })}
    />
  );
}
