import { Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <Stack h={{ base: 'auto', md: '100vh' }} w="100%" maxW="100vw" mx="auto" py={{ base: 4, md: 10 }} px={4}>
      {children}
    </Stack>
  );
}
