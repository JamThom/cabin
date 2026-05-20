import { CloseButton, Drawer, Input, Portal, Stack, Text, Textarea } from '@chakra-ui/react';
import UiButton from '@/ui/button/button';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useNotes from '@/api/hooks/notes/use-notes';
import useNotesUpdate from '@/api/hooks/notes/use-notes-update';
import useNotesDelete from '@/api/hooks/notes/use-notes-delete';
import useUiToast from '@/ui/toast/use-ui-toast';

export default function NoteDrawer() {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();
  const { data: notes = [] } = useNotes();
  const notesUpdate = useNotesUpdate();
  const notesDelete = useNotesDelete();
  const { showSuccessToast } = useUiToast();

  const note = useMemo(() => notes.find((n) => n.id === noteId) ?? null, [notes, noteId]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!note) return;
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  function close() {
    navigate('/notes');
  }

  return (
    <Drawer.Root open={Boolean(note)} onOpenChange={(e) => !e.open && close()} placement="end" size="md">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">
              <Drawer.Title>Edit Note</Drawer.Title>
              <Drawer.CloseTrigger asChild><CloseButton size="sm" /></Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body pt={6}>
              <Stack gap={4}>
                <Stack gap={1}>
                  <Text fontSize="sm" fontWeight="medium">Title</Text>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                </Stack>
                <Stack gap={1}>
                  <Text fontSize="sm" fontWeight="medium">Content</Text>
                  <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={12} resize="none" />
                </Stack>
              </Stack>
            </Drawer.Body>
            <Drawer.Footer borderTopWidth="1px" gap={2}>
              <UiButton
                colorPalette="red"
                variant="outline"
                onClick={async () => {
                  await notesDelete.mutateAsync({ noteId: noteId! });
                  showSuccessToast('Note deleted');
                  close();
                }}
              >
                Delete
              </UiButton>
              <UiButton variant="ghost" onClick={close}>Cancel</UiButton>
              <UiButton
                onClick={async () => {
                  await notesUpdate.mutateAsync({ noteId: noteId!, title, content });
                  showSuccessToast('Note saved');
                  close();
                }}
              >
                Save
              </UiButton>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
