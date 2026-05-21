import { ChakraProvider } from '@chakra-ui/react';
import { system } from './theme';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/ui/toast/toaster';
import AppShell from './routes/app-shell/app-shell';
import Documents from './routes/documents/documents';
import Materials from './routes/materials/materials';
import Category from './routes/materials/components/category-view/category-view';
import Notes from './routes/notes/notes';
import NoteDrawer from './routes/notes/components/note-drawer/note-drawer';
import Tasks from './routes/tasks/tasks';
import Phase from './routes/tasks/components/phase-view/phase-view';
import TaskDrawer from './routes/tasks/components/phase-view/components/task-drawer/task-drawer';

export default function App() {
  return (
    <ChakraProvider value={system}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/tasks" replace />} />
            <Route path="tasks" element={<Tasks />}>
              <Route path=":phaseId" element={<Phase />}>
                <Route path="task/:taskId" element={<TaskDrawer />} />
              </Route>
            </Route>
            <Route path="materials" element={<Materials />}>
              <Route path="category/:categoryId" element={<Category />} />
            </Route>
            <Route path="documents" element={<Documents />} />
            <Route path="notes" element={<Notes />}>
              <Route path=":noteId" element={<NoteDrawer />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}
