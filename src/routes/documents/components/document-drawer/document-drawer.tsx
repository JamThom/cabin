import { CloseButton, Drawer, Portal, Stack, Text } from '@chakra-ui/react';
import UiButton from '@/ui/button/button';
import { DocumentFile } from '@/store/types';
import { formatDate } from '@/utils/format-date';
import { API_BASE_URL } from '@/api/hooks/request';

type Props = {
  file: (DocumentFile & { folderName: string }) | null;
  onClose: () => void;
};

export default function DocumentDrawer({ file, onClose }: Props) {
  const resolvedUrl = file ? (`${API_BASE_URL}/api/documents/files/${file.id}`) : '';

  return (
    <Drawer.Root open={Boolean(file)} onOpenChange={(e) => !e.open && onClose()} placement="end" size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <Drawer.Title>Document</Drawer.Title>
              <Drawer.CloseTrigger asChild><CloseButton size="sm" /></Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body pt={6}>
              <Stack gap={4}>
                <Stack gap={1}><Text fontSize="sm" color="fg.muted">Name</Text><Text>{file?.name ?? ''}</Text></Stack>
                <Stack gap={1}><Text fontSize="sm" color="fg.muted">Folder</Text><Text>{file?.folderName ?? ''}</Text></Stack>
                <Stack gap={1}><Text fontSize="sm" color="fg.muted">Type</Text><Text>{file?.mimeType ?? ''}</Text></Stack>
                <Stack gap={1}><Text fontSize="sm" color="fg.muted">Modified</Text><Text>{file?.modified ? formatDate(file.modified) : ''}</Text></Stack>
                <Stack gap={1}><Text fontSize="sm" color="fg.muted">Tags</Text><Text>{file?.tags.length ? file.tags.join(', ') : 'No tags'}</Text></Stack>
              </Stack>
            </Drawer.Body>
            <Drawer.Footer borderTopWidth="1px" gap={2}>
              <UiButton variant="ghost" onClick={onClose}>Close</UiButton>
              <UiButton
                disabled={!resolvedUrl}
                onClick={() => {
                  if (!resolvedUrl) return;
                  window.open(resolvedUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                Open
              </UiButton>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
