import { CloseButton, Dialog, Portal, Spinner, Text, Box } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs';
import { DocumentFile } from '@/store/types';
import { API_BASE_URL } from '@/api/hooks/request';
import UiButton from '@/ui/button/button';

type Props = {
  file: (DocumentFile & { folderName: string }) | null;
  onClose: () => void;
};

export default function DocumentPreviewModal({ file, onClose }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const resolvedUrl = useMemo(() => (file ? `${API_BASE_URL}/api/documents/files/${file.id}` : ''), [file]);
  const isPdf = file?.mimeType === 'application/pdf';
  const isImage = file?.mimeType.startsWith('image/') ?? false;

  useEffect(() => {
    setCurrentPage(0);
  }, [file]);

  useEffect(() => {
    if (!file || !isPdf) {
      setStatus('idle');
      setPageImages([]);
      return;
    }

    let cancelled = false;

    async function loadAndRenderPdf() {
      try {
        setStatus('loading');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        const loadingTask = pdfjsLib.getDocument({ url: resolvedUrl });
        const pdf = await loadingTask.promise;
        if (cancelled) { loadingTask.destroy(); return; }

        // Pre-fill slots so progressive pages slot in at the right index
        setPageImages(new Array(pdf.numPages).fill(''));

        // Scale to fit the display area — no benefit rendering beyond what's visible.
        // Multiply by DPR (capped at 2) so retina screens stay sharp.
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const maxPx = Math.min(window.innerWidth, window.innerHeight) * 0.9 * dpr;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) { loadingTask.destroy(); return; }

          const page = await pdf.getPage(pageNum);
          const base = page.getViewport({ scale: 1 });
          const scale = Math.min(maxPx / base.width, maxPx / base.height, 2);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Canvas context unavailable');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: context, viewport }).promise;

          if (cancelled) { loadingTask.destroy(); return; }

          const dataUrl = canvas.toDataURL();
          // Show page 1 immediately; remaining pages slot in as they finish
          setPageImages((prev) => { const next = [...prev]; next[pageNum - 1] = dataUrl; return next; });
          if (pageNum === 1) setStatus('ready');
        }

        if (!cancelled) setStatus('ready');
        loadingTask.destroy();
      } catch (error) {
        console.error('PDF rendering error:', error);
        if (!cancelled) setStatus('error');
      }
    }

    loadAndRenderPdf();
    return () => { cancelled = true; };
  }, [file, isPdf, resolvedUrl]);

  const totalPages = pageImages.length;
  const pageReady = Boolean(pageImages[currentPage]);

  const imgStyle: React.CSSProperties = {
    maxHeight: '80vh',
    maxWidth: '100%',
    objectFit: 'contain',
    margin: '1rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  };

  return (
    <Dialog.Root open={Boolean(file)} onOpenChange={(event) => !event.open && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p={0} maxW="90vw" maxH="90vh" display="flex" flexDirection="column" overflow="hidden">
            <Dialog.CloseTrigger position="absolute" top={4} right={4} zIndex={10} asChild>
              <CloseButton bg="gray.200" size="lg" />
            </Dialog.CloseTrigger>

            <Dialog.Body p={0} flex="1" display="flex" alignItems="center" justifyContent="center" overflow="auto" minH={0}>
              {isImage && file ? (
                <img src={resolvedUrl} alt={file.name} style={imgStyle} />
              ) : isPdf && file ? (
                status === 'loading' || (status === 'ready' && !pageReady) ? (
                  <Box display="flex" justifyContent="center" alignItems="center" p={12}>
                    <Spinner size="lg" />
                  </Box>
                ) : status === 'error' ? (
                  <Box display="flex" alignItems="center" justifyContent="center" p={12}>
                    <Text color="fg.error">Unable to render PDF preview.</Text>
                  </Box>
                ) : (
                  <img
                    src={pageImages[currentPage]}
                    alt={`Page ${currentPage + 1}`}
                    style={imgStyle}
                  />
                )
              ) : (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={4} p={12}>
                  <Text color="fg.muted">Preview not available for this file type.</Text>
                </Box>
              )}
            </Dialog.Body>

            {/* Footer: PDF pagination + download */}
            <Box
              borderTopWidth="1px"
              px={4}
              py={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={4}
              flexShrink={0}
            >
              {isPdf && totalPages > 0 ? (
                <Box display="flex" alignItems="center" gap={3}>
                  <UiButton
                    size="sm"
                    variant="ghost"
                    icon="chevron-left"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  />
                  <Text fontSize="sm" color="fg.muted" whiteSpace="nowrap">
                    {currentPage + 1} / {totalPages}
                  </Text>
                  <UiButton
                    size="sm"
                    variant="ghost"
                    icon="chevron-right"
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  />
                </Box>
              ) : (
                <Box />
              )}
              <UiButton
                size="sm"
                variant="ghost"
                icon="download"
                onClick={() => window.open(resolvedUrl, '_blank', 'noopener,noreferrer')}
              >
                Download
              </UiButton>
            </Box>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
