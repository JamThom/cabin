import { Box } from '@chakra-ui/react';
import useDocuments from '@/api/hooks/documents/use-documents';
import useDocumentsUpload from '@/api/hooks/documents/use-documents-upload';
import PageHeader from '@/ui/page-header/page-header';
import PageLayout from '@/ui/page-layout/page-layout';
import DocumentsTable from './components/documents-table/documents-table';
import UploadModal from './components/upload-modal/upload-modal';

export default function Documents() {
  const { data: folders = [] } = useDocuments();
  const upload = useDocumentsUpload();

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
        <DocumentsTable folders={folders} />
      </Box>
    </PageLayout>
  );
}
