import { CloseButton, Dialog, Portal, Spinner, Stack, Text, Box } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { getDocument } from 'pdfjs-dist/build/pdf.mjs';
import { DocumentFile } from '@/store/types';
import { API_BASE_URL } from '@/api/hooks/request';

type Props = {
  file: (DocumentFile & { folderName: string }) | null;
  onClose: () => void;
};

export default function DocumentPreviewModal({ file, onClose }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [pageImages, setPageImages] = useState<string[]>([]);
  const resolvedUrl = useMemo(() => (file ? `${API_BASE_URL}/api/documents/files/${file.id}` : ''), [file]);
  const isPdf = file?.mimeType === 'application/pdf';
  const isImage = file?.mimeType.startsWith('image/') ?? false;

  useEffect(() => {
    if (!file || !isPdf) {
      setStatus('idle');
      setPageImages([]);
      return;
    }

    let cancelled = false;
    const loadingTask = getDocument({ url: resolvedUrl, disableWorker: true } as any);

    async function renderPdf() {
      try {
        setStatus('loading');
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const images: string[] = [];
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNum);
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Canvas context unavailable');
          const viewport = page.getViewport({ scale: 1.5 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;
          images.push(canvas.toDataURL());
        }

        if (!cancelled) {
          setPageImages(images);
          setStatus('ready');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    renderPdf();
    return () => {
      cancelled = true;
      loadingTask.destroy();
    };
  }, [file, isPdf, resolvedUrl]);

  return (
    <Dialog.Root open={Boolean(file)} onOpenChange={(event) => !event.open && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={0} maxW="90vw" maxH="90vh" w="fit-content" h="fit-content">
            <Dialog.CloseTrigger position="absolute" top={4} right={4} zIndex={10} asChild>
              <CloseButton size="lg" />
            </Dialog.CloseTrigger>
            <Dialog.Body p={0} display="flex" alignItems="center" justifyContent="center" overflow="auto">
              {isImage && file ? (
                <Box display="flex" alignItems="center" justifyContent="center" overflow="auto">
                  <img src={resolvedUrl} alt={file.name} style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }} />
                </Box>
              ) : isPdf && file ? status === 'loading' ? (
                <Box display="flex" justifyContent="center" alignItems="center" p={12}>
                  <Spinner size="lg" />
                </Box>
              ) : status === 'error' ? (
                <Box display="flex" alignItems="center" justifyContent="center" p={12}>
                  <Text color="fg.error">Unable to render PDF preview.</Text>
                </Box>
              ) : (
                <Box overflowX="auto" display="flex" gap={0} scrollSnapType="x mandatory" alignItems="center" justifyContent="flex-start">
                  {pageImages.map((imgData, i) => (
                    <Box key={i} flexShrink={0} scrollSnapAlign="center" display="flex" alignItems="center" justifyContent="center">
                      <img src={imgData} alt={`Page ${i + 1}`} style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center" p={12}>
                  <Text color="fg.muted">This file type cannot be previewed.</Text>
                </Box>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
