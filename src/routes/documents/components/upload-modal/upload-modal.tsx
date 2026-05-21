import { Box, Dialog, Input, Portal, Stack, Text } from '@chakra-ui/react';
import UiButton from '@/ui/button/button';
import { DragEvent, useRef, useState } from 'react';
import { DocumentFolder } from '@/store/types';
import useDocumentFoldersCreate from '@/api/hooks/documents/use-document-folders-create';

interface UploadModalProps {
  folders: DocumentFolder[];
  onUpload: (payload: { name: string; folderId: string; tags: string[]; mimeType: string }) => void;
}

const NEW_FOLDER_VALUE = '__new__';

export default function UploadModal({ folders, onUpload }: UploadModalProps) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [folderId, setFolderId] = useState('');
  const [tags, setTags] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const createFolder = useDocumentFoldersCreate();

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  async function handleUpload() {
    if (!file || !folderId) return;
    let resolvedFolderId = folderId;
    if (folderId === NEW_FOLDER_VALUE) {
      if (!newFolderName.trim()) return;
      const folder = await createFolder.mutateAsync(newFolderName.trim());
      resolvedFolderId = folder.id;
    }
    onUpload({
      name: file.name,
      folderId: resolvedFolderId,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      mimeType: file.type || 'application/octet-stream'
    });
    setFile(null);
    setFolderId('');
    setTags('');
    setNewFolderName('');
    setOpen(false);
  }

  function handleFolderChange(value: string) {
    if (value !== NEW_FOLDER_VALUE) setNewFolderName('');
    setFolderId(value);
  }

  function handleClose() {
    setFile(null);
    setFolderId('');
    setTags('');
    setNewFolderName('');
    setOpen(false);
  }

  const uploadDisabled = !file || !folderId || (folderId === NEW_FOLDER_VALUE && !newFolderName.trim());

  return (
    <>
      <UiButton size="sm" onClick={() => setOpen(true)}>
        Upload Document
      </UiButton>
      <Dialog.Root open={open} onOpenChange={(event) => { if (!event.open) handleClose(); }} placement="center">
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p={6} maxW="md">
              <Dialog.Title mb={4}>Upload Document</Dialog.Title>
              <Stack gap={4}>
                <Box
                  border="2px dashed"
                  borderColor={dragging ? 'teal.400' : 'border'}
                  borderRadius="md"
                  p={8}
                  textAlign="center"
                  cursor="pointer"
                  bg={dragging ? 'teal.50' : 'transparent'}
                  _dark={{ bg: dragging ? 'teal.900' : 'transparent' }}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                  />
                  {file ? (
                    <Text fontWeight="medium">{file.name}</Text>
                  ) : (
                    <Text color="fg.subtle">Drag & drop a file here, or click to browse</Text>
                  )}
                </Box>
                <Box as="select"
                  value={folderId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFolderChange(e.target.value)}
                  borderWidth="1px"
                  borderRadius="md"
                  px={3}
                  py={2}
                  fontSize="sm"
                >
                  <option value="">Select folder…</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                  <option value={NEW_FOLDER_VALUE}>+ New Folder</option>
                </Box>
                {folderId === NEW_FOLDER_VALUE && (
                  <Input
                    placeholder="Folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    size="sm"
                    autoFocus
                  />
                )}
                <Input
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  size="sm"
                />
                <Stack direction="row" justify="flex-end" gap={2}>
                  <UiButton variant="ghost" size="sm" onClick={handleClose}>Cancel</UiButton>
                  <UiButton size="sm" onClick={handleUpload} disabled={uploadDisabled}>
                    Upload
                  </UiButton>
                </Stack>
              </Stack>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
