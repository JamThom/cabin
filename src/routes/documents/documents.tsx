import { Box } from '@chakra-ui/react';
import useDocuments from '@/api/hooks/documents/use-documents';
import useDocumentsDelete from '@/api/hooks/documents/use-documents-delete';
import useDocumentsUpload from '@/api/hooks/documents/use-documents-upload';
import PageHeader from '@/ui/page-header/page-header';
import PageLayout from '@/ui/page-layout/page-layout';
import UiButton from '@/ui/button/button';
import { useMemo, useState } from 'react';
import { DocumentFile } from '@/store/types';
import DocumentsTable from './components/documents-table/documents-table';
import UploadModal from './components/upload-modal/upload-modal';
import DocumentDrawer from './components/document-drawer/document-drawer';

export default function Documents() {
  const { data: folders = [] } = useDocuments();
  const upload = useDocumentsUpload();
  const remove = useDocumentsDelete();
  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFolderId, setUploadFolderId] = useState<string | undefined>(undefined);

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
          <UiButton
            size="sm"
            icon="upload"
            onClick={() => {
              setUploadFolderId(undefined);
              setUploadOpen(true);
            }}
          >
            Upload Document
          </UiButton>
        }
      />
      <Box borderWidth="1px" borderRadius="lg">
        <DocumentsTable
          folders={folders}
          onFileClick={(file) => setSelectedFile(file)}
          onFolderUploadClick={(folderId) => {
            setUploadFolderId(folderId);
            setUploadOpen(true);
          }}
        />
      </Box>
      <UploadModal
        folders={folders}
        open={uploadOpen}
        onOpenChange={(open) => {
          setUploadOpen(open);
          if (!open) setUploadFolderId(undefined);
        }}
        preselectedFolderId={uploadFolderId}
        hideTrigger
        onUpload={(payload) => upload.mutate(payload)}
      />
      <DocumentDrawer
        file={selectedFileWithFolder}
        onClose={() => setSelectedFile(null)}
        deleting={remove.isPending}
        onDelete={async (file) => {
          if (!window.confirm(`Delete ${file.name}?`)) return;
          await remove.mutateAsync(file.id);
          setSelectedFile(null);
        }}
      />
    </PageLayout>
  );
}
