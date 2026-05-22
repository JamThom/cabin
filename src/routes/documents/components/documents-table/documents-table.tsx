import { Box, Badge, Stack } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '@/ui/icon/icon';
import UiExtrasMenu from '@/ui/extras-menu/extras-menu';
import UiTable from '@/ui/table/table';
import { DocumentFile, DocumentFolder } from '@/store/types';
import { API_BASE_URL } from '@/api/hooks/request';

interface DocRow {
  key: string;
  id: string;
  type: 'folder' | 'file';
  folderId: string;
  name: string;
  tags: string[];
  modified: string;
  mimeType: string;
  depth: number;
  indent: number;
}

interface DocumentsTableProps {
  folders: DocumentFolder[];
  onFileClick?: (file: DocumentFile) => void;
  onFileInfo?: (file: DocumentFile) => void;
  onFileDelete?: (file: DocumentFile) => void | Promise<void>;
  onFolderUploadClick?: (folderId: string) => void;
  onFolderAddSubfolder?: (parentFolderId: string, name: string) => void | Promise<void>;
}

function sortByName<T extends { name: string }>(items: T[]) {
  return [...items].sort((left, right) => left.name.localeCompare(right.name));
}

export default function DocumentsTable({ folders, onFileClick, onFileInfo, onFileDelete, onFolderUploadClick, onFolderAddSubfolder }: DocumentsTableProps) {
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(new Set(folders.map((f) => f.id)));
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const seenFolderIds = useRef<Set<string>>(new Set(folders.map((folder) => folder.id)));

  useEffect(() => {
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      folders.forEach((folder) => {
        if (!seenFolderIds.current.has(folder.id)) next.add(folder.id);
      });
      return next;
    });
    seenFolderIds.current = new Set(folders.map((folder) => folder.id));
  }, [folders]);

  const data = useMemo<DocRow[]>(() => {
    const groupedByParent = new Map<string | null, DocumentFolder[]>();
    folders.forEach((folder) => {
      const parentId = folder.parentDirectoryId ?? null;
      const group = groupedByParent.get(parentId) ?? [];
      group.push(folder);
      groupedByParent.set(parentId, group);
    });

    const rows: DocRow[] = [];

    function addFolder(folder: DocumentFolder, depth: number) {
      rows.push({
        key: `folder-${folder.id}`,
        id: folder.id,
        type: 'folder',
        folderId: folder.id,
        name: folder.name,
        tags: [],
        modified: '',
        mimeType: '',
        depth,
        indent: depth * 12,
      });

      if (!expandedFolderIds.has(folder.id)) return;

      sortByName(groupedByParent.get(folder.id) ?? []).forEach((childFolder) => addFolder(childFolder, depth + 1));
      sortByName(folder.files).forEach((file) => {
        rows.push({
          key: `file-${file.id}`,
          id: file.id,
          type: 'file',
          folderId: folder.id,
          name: file.name,
          tags: file.tags,
          modified: file.modified,
          mimeType: file.mimeType,
          depth: depth + 1,
          indent: depth * 12 + 8,
        });
      });
    }

    sortByName(groupedByParent.get(null) ?? []).forEach((folder) => addFolder(folder, 0));
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
          const visible = hoveredRowId === row.original.key;
          return (
            <Box
              display="flex"
              justifyContent="flex-end"
              opacity={visible ? 1 : 0}
              pointerEvents={visible ? 'auto' : 'none'}
              onClick={(e) => e.stopPropagation()}
            >
              <UiExtrasMenu
                variant="inline"
                options={row.original.type === 'folder' ? [
                  { label: 'Delete', onClick: () => {} },
                  { label: 'Rename', onClick: () => {} },
                  {
                    label: 'Add Subfolder',
                    prompt: {
                      title: 'Add Subfolder',
                      placeholder: 'Subfolder name',
                      confirmLabel: 'Add',
                      onConfirm: async (name) => onFolderAddSubfolder?.(row.original.id, name),
                    },
                  },
                  { label: 'Upload', onClick: () => onFolderUploadClick?.(row.original.id) },
                ] : [
                  {
                    label: 'Download',
                    onClick: () => window.open(`${API_BASE_URL}/api/documents/files/${row.original.id}`, '_blank', 'noopener,noreferrer')
                  },
                  { label: 'View Info', onClick: () => onFileInfo?.(row.original) },
                  { label: 'Delete', onClick: () => onFileDelete?.(row.original) },
                ]}
              />
            </Box>
          );
        }
      }
    ],
    [expandedFolderIds, hoveredRowId, onFileClick, onFileDelete, onFileInfo, onFolderAddSubfolder, onFolderUploadClick]
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
      onRowMouseEnter={(row) => setHoveredRowId(row.original.key)}
      onRowMouseLeave={() => setHoveredRowId(null)}
      getRowProps={(row) => ({
        cursor: 'pointer',
        fontWeight: row.original.type === 'folder' ? 'semibold' : 'normal',
        bg: row.original.type === 'folder' ? 'gray.50' : undefined,
        _dark: row.original.type === 'folder' ? { bg: 'gray.800' } : undefined
      })}
      getRowKey={(row) => row.original.key}
      getCellProps={(cell) => ({
        pl: cell.column.id === 'name' ? cell.row.original.indent : undefined,
        w: cell.column.id === 'actions' ? '1%' : undefined,
        whiteSpace: cell.column.id === 'actions' ? 'nowrap' : undefined,
      })}
    />
  );
}
