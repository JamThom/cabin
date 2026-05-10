import { http, HttpResponse } from 'msw';
import { createId } from '@/store/create-id';
import { DocumentFile, DocumentFolder } from '@/store/types';

interface UploadBody {
  name: string;
  folderId: string;
  tags: string[];
  mimeType: string;
}

const folders: DocumentFolder[] = [
  {
    id: 'folder-1',
    name: 'Plans',
    files: [
      {
        id: 'file-1',
        folderId: 'folder-1',
        name: 'Floor Plan v1.pdf',
        tags: ['structural', 'approved'],
        modified: '2026-04-12',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        mimeType: 'application/pdf'
      },
      {
        id: 'file-2',
        folderId: 'folder-1',
        name: 'Elevation Drawing.pdf',
        tags: ['structural'],
        modified: '2026-04-20',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        mimeType: 'application/pdf'
      }
    ]
  },
  {
    id: 'folder-2',
    name: 'Permits',
    files: [
      {
        id: 'file-3',
        folderId: 'folder-2',
        name: 'Building Permit.pdf',
        tags: ['legal', 'approved'],
        modified: '2026-03-01',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        mimeType: 'application/pdf'
      }
    ]
  },
  {
    id: 'folder-3',
    name: 'Photos',
    files: [
      {
        id: 'file-4',
        folderId: 'folder-3',
        name: 'Site photo.jpg',
        tags: ['photo'],
        modified: '2026-05-01',
        url: 'https://picsum.photos/seed/cabin/800/600',
        mimeType: 'image/jpeg'
      }
    ]
  }
];

export default function createDocumentHandlers() {
  return [
    http.get('/api/documents', () => {
      return HttpResponse.json(folders);
    }),

    http.post('/api/documents/upload', async ({ request }) => {
      const body = await request.json() as UploadBody;
      const folder = folders.find((f) => f.id === body.folderId);
      if (!folder) return HttpResponse.json({ error: 'Folder not found' }, { status: 404 });

      const file: DocumentFile = {
        id: createId(),
        folderId: body.folderId,
        name: body.name,
        tags: body.tags ?? [],
        modified: new Date().toISOString().slice(0, 10),
        url: '',
        mimeType: body.mimeType ?? 'application/octet-stream'
      };
      folder.files.push(file);
      return HttpResponse.json(file, { status: 201 });
    }),

    http.post('/api/documents/folders', async ({ request }) => {
      const body = await request.json() as { name: string };
      const folder: DocumentFolder = { id: createId(), name: body.name, files: [] };
      folders.push(folder);
      return HttpResponse.json(folder, { status: 201 });
    })
  ];
}
