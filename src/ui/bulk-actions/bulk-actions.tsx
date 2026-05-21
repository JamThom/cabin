import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

export default function UiBulkActions({ children }: { children: ReactNode }) {
  return (
    <Box
      position="fixed"
      bottom={6}
      left="50%"
      transform="translateX(-50%)"
      zIndex={100}
      bg="white"
      _dark={{ bg: 'gray.800' }}
      borderWidth="1px"
      borderRadius="xl"
      px={4}
      py={3}
      boxShadow="0 8px 32px rgba(0,0,0,0.18)"
      display="flex"
      alignItems="center"
      gap={3}
      whiteSpace="nowrap"
    >
      {children}
    </Box>
  );
}
