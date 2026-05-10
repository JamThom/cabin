export default async function enableApiMocks() {
  if (process.env.NODE_ENV !== 'development') return;
  const { default: createWorker } = await import('./worker');
  const worker = createWorker();
  await worker.start({ onUnhandledRequest: 'bypass' });
}
