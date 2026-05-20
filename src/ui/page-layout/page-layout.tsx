import { Box, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <Stack h="100vh" w="100%" mx="auto" py={10} px={4}>
      {children}
    </Stack>
  );
}
