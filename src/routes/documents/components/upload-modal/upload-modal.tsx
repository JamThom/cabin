import { Box, Button, Dialog, Input, Portal, Stack, Text } from '@chakra-ui/react';
import { DragEvent, useRef, useState } from 'react';
import { DocumentFolder } from '@/store/types';

interface UploadModalProps {
  folders: DocumentFolder[];
  onUpload: (payload: { name: string; folderId: string; tags: string[]; mimeType: string }) => void;
}

export default function UploadModal({ folders, onUpload }: UploadModalProps) {
  const [open, setOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [folderId, setFolderId] = useState('');
  const [tags, setTags] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const dropped = event.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  function handleUpload() {
    if (!file || !folderId) return;
    onUpload({
      name: file.name,
      folderId,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      mimeType: file.type || 'application/octet-stream'
    });
    setFile(null);
    setFolderId('');
    setTags('');
    setOpen(false);
  }

  function handleClose() {
    setFile(null);
    setFolderId('');
    setTags('');
    setOpen(false);
  }

  return (
    <>
      <Button colorPalette="teal" size="sm" onClick={() => setOpen(true)}>
        Upload Document
      </Button>
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFolderId(e.target.value)}
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
                </Box>
                <Input
                  placeholder="Tags (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  size="sm"
                />
                <Stack direction="row" justify="flex-end" gap={2}>
                  <Button variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
                  <Button
                    colorPalette="teal"
                    size="sm"
                    onClick={handleUpload}
                    disabled={!file || !folderId}
                  >
                    Upload
                  </Button>
                </Stack>
              </Stack>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}
