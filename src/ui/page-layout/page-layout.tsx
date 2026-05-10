import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function PageLayout({ children }: Props) {
  return (
    <Box maxW="5xl" mx="auto" py={10} px={4}>
      {children}
    </Box>
  );
}
