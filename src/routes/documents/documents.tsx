import { Box } from '@chakra-ui/react';
import useDocuments from '@/api/hooks/documents/use-documents';
import useDocumentsUpload from '@/api/hooks/documents/use-documents-upload';
import PageHeader from '@/ui/page-header/page-header';
import PageLayout from '@/ui/page-layout/page-layout';
import { useMemo, useState } from 'react';
import { DocumentFile } from '@/store/types';
import DocumentsTable from './components/documents-table/documents-table';
import UploadModal from './components/upload-modal/upload-modal';
import DocumentDrawer from './components/document-drawer/document-drawer';

export default function Documents() {
  const { data: folders = [] } = useDocuments();
  const upload = useDocumentsUpload();
  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null);

  const selectedFileWithFolder = useMemo(() => {
    if (!selectedFile) return null;
    const folder = folders.find((item) => item.id === selectedFile.folderId);
    return { ...selectedFile, folderName: folder?.name ?? '' };
  }, [folders, selectedFile]);

  return (
    <PageLayout>
      <PageHeader
        title="Documents"
        action={
          <UploadModal
            folders={folders}
            onUpload={(payload) => upload.mutate(payload)}
          />
        }
      />
      <Box borderWidth="1px" borderRadius="lg">
        <DocumentsTable folders={folders} onFileClick={(file) => setSelectedFile(file)} />
      </Box>
      <DocumentDrawer file={selectedFileWithFolder} onClose={() => setSelectedFile(null)} />
    </PageLayout>
  );
}
