import { toaster } from './toaster';

export default function useUiToast() {
  return {
    showSuccessToast: (title: string) => toaster.create({ type: 'success', title }),
  };
}
