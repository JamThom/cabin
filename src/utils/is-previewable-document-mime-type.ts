export default function isPreviewableDocumentMimeType(mimeType: string) {
  return mimeType.startsWith('image/') || mimeType === 'application/pdf';
}
