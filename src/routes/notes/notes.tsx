import { Box } from '@chakra-ui/react';
import { Outlet, useNavigate } from 'react-router-dom';
import useNotes from '@/api/hooks/notes/use-notes';
import useNotesCreate from '@/api/hooks/notes/use-notes-create';
import PageLayout from '@/ui/page-layout/page-layout';
import PageHeader from '@/ui/page-header/page-header';
import UiButton from '@/ui/button/button';
import NotesTable from './components/notes-table/notes-table';
import useUiToast from '@/ui/toast/use-ui-toast';

export default function Notes() {
  const { data: notes = [] } = useNotes();
  const createNote = useNotesCreate();
  const navigate = useNavigate();
  const { showSuccessToast } = useUiToast();

  return (
    <PageLayout>
      <PageHeader
        title="Notes"
        action={
          <UiButton
            size="sm"
            icon="plus"
            onClick={async () => {
              const note = await createNote.mutateAsync();
              showSuccessToast('Note created');
              navigate(`/notes/${note.id}`);
            }}
          >
            New Note
          </UiButton>
        }
      />
      <Box borderWidth="1px" borderRadius="lg" overflow="auto" maxH="calc(100vh - 200px)">
        <NotesTable notes={notes} onRowClick={(noteId) => navigate(`/notes/${noteId}`)} />
      </Box>
      <Outlet />
    </PageLayout>
  );
}
