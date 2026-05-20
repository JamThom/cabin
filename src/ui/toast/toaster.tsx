import { createToaster, Toaster as ChakraToaster, ToastRoot, ToastTitle, ToastCloseTrigger } from '@chakra-ui/react';

export const toaster = createToaster({ placement: 'top-end', gap: 8 });

export function Toaster() {
  return (
    <ChakraToaster toaster={toaster}>
      {(toast) => (
        <ToastRoot key={toast.id} type={toast.type}>
          <ToastTitle>{toast.title as string}</ToastTitle>
          <ToastCloseTrigger />
        </ToastRoot>
      )}
    </ChakraToaster>
  );
}
