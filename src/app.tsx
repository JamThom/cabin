import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/ui/toast/toaster';
import AppShell from './routes/app-shell/app-shell';
import Documents from './routes/documents/documents';
import Materials from './routes/materials/materials';
import Category from './routes/materials/components/category-view/category-view';
import Notes from './routes/notes/notes';
import Tasks from './routes/tasks/tasks';
import Phase from './routes/tasks/components/phase-view/phase-view';
import TaskDrawer from './routes/tasks/components/phase-view/components/task-drawer/task-drawer';

export default function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/tasks" replace />} />
            <Route path="tasks" element={<Tasks />}>
              <Route index element={<Navigate to="/tasks/phase-1" replace />} />
              <Route path=":phaseId" element={<Phase />}>
                <Route path="task/:taskId" element={<TaskDrawer />} />
              </Route>
            </Route>
            <Route path="materials" element={<Materials />}>
              <Route index element={<Navigate to="/materials/category/category-1" replace />} />
              <Route path="category/:categoryId" element={<Category />} />
            </Route>
            <Route path="documents" element={<Documents />} />
            <Route path="notes" element={<Notes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}
