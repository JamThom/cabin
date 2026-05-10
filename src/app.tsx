import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './routes/app-shell/app-shell';
import Documents from './routes/documents/documents';
import Materials from './routes/materials/materials';
import CategoryView from './routes/materials/components/category-view/category-view';
import Notes from './routes/notes/notes';
import Tasks from './routes/tasks/tasks';
import PhaseView from './routes/tasks/components/phase-view/phase-view';

export default function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Navigate to="/tasks" replace />} />
            <Route path="tasks" element={<Tasks />}>
              <Route index element={<Navigate to="/tasks/phase/phase-1" replace />} />
              <Route path="phase/:phaseId" element={<PhaseView />} />
            </Route>
            <Route path="materials" element={<Materials />}>
              <Route index element={<Navigate to="/materials/category/category-1" replace />} />
              <Route path="category/:categoryId" element={<CategoryView />} />
            </Route>
            <Route path="documents" element={<Documents />} />
            <Route path="notes" element={<Notes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}
