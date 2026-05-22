import { Box } from '@chakra-ui/react';
import useDocuments from '@/api/hooks/documents/use-documents';
import useDocumentFoldersCreate from '@/api/hooks/documents/use-document-folders-create';
import useDocumentFoldersDelete from '@/api/hooks/documents/use-document-folders-delete';
import useDocumentFoldersUpdate from '@/api/hooks/documents/use-document-folders-update';
import useDocumentsDelete from '@/api/hooks/documents/use-documents-delete';
import useUiToast from '@/ui/toast/use-ui-toast';
import useDocumentsUpload from '@/api/hooks/documents/use-documents-upload';
import PageHeader from '@/ui/page-header/page-header';
import PageLayout from '@/ui/page-layout/page-layout';
import UiButton from '@/ui/button/button';
import { useMemo, useState } from 'react';
import { DocumentFile } from '@/store/types';
import DocumentsTable from './components/documents-table/documents-table';
import DocumentPreviewModal from './components/document-preview-modal/document-preview-modal';
import UploadModal from './components/upload-modal/upload-modal';
import DocumentDrawer from './components/document-drawer/document-drawer';
import { useConfirmPrompt } from '@/ui/confirm-prompt/confirm-prompt-provider';

export default function Documents() {
  const { data: folders = [] } = useDocuments();
  const createFolder = useDocumentFoldersCreate();
  const deleteFolder = useDocumentFoldersDelete();
  const updateFolder = useDocumentFoldersUpdate();
  const upload = useDocumentsUpload();
  const remove = useDocumentsDelete();
  const [selectedFile, setSelectedFile] = useState<DocumentFile | null>(null);
  const [selectedPreviewFile, setSelectedPreviewFile] = useState<DocumentFile | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFolderId, setUploadFolderId] = useState<string | undefined>(undefined);
  const { showConfirmPrompt } = useConfirmPrompt();
  const { showSuccessToast } = useUiToast();

  const selectedFileWithFolder = useMemo(() => {
    if (!selectedFile) return null;
    const folder = folders.find((item) => item.id === selectedFile.folderId);
    return { ...selectedFile, folderName: folder?.name ?? '' };
  }, [folders, selectedFile]);

  const selectedPreviewFileWithFolder = useMemo(() => {
    if (!selectedPreviewFile) return null;
    const folder = folders.find((item) => item.id === selectedPreviewFile.folderId);
    return { ...selectedPreviewFile, folderName: folder?.name ?? '' };
  }, [folders, selectedPreviewFile]);

  async function handleDeleteFile(file: DocumentFile) {
    const ok = await showConfirmPrompt({ title: 'Delete file?', description: `"${file.name}" will be permanently deleted.` });
    if (!ok) return;
    await remove.mutateAsync(file.id);
    if (selectedFile?.id === file.id) setSelectedFile(null);
    if (selectedPreviewFile?.id === file.id) setSelectedPreviewFile(null);
  }

  async function handleDeleteFolder(folderId: string) {
    const folder = folders.find((f) => f.id === folderId);
    const ok = await showConfirmPrompt({
      title: 'Delete folder?',
      description: `"${folder?.name ?? 'This folder'}" and all files inside will be permanently deleted.`,
    });
    if (!ok) return;
    await deleteFolder.mutateAsync(folderId);
    showSuccessToast('Folder deleted');
  }

  async function handleRenameFolder(folderId: string, name: string) {
    await updateFolder.mutateAsync({ folderId, name });
    showSuccessToast('Folder renamed');
  }

  async function handleAddSubfolder(parentFolderId: string, name: string) {
    const folder = await createFolder.mutateAsync({ name, parentDirectoryId: parentFolderId });
    setUploadFolderId(folder.id);
    setUploadOpen(true);
  }

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
          onFileClick={(file) => setSelectedPreviewFile(file)}
          onFileInfo={(file) => setSelectedFile(file)}
          onFileDelete={handleDeleteFile}
          onFolderDelete={handleDeleteFolder}
          onFolderRename={handleRenameFolder}
          onFolderAddSubfolder={handleAddSubfolder}
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
        onDelete={handleDeleteFile}
      />
      <DocumentPreviewModal
        file={selectedPreviewFileWithFolder}
        onClose={() => setSelectedPreviewFile(null)}
      />
    </PageLayout>
  );
}
