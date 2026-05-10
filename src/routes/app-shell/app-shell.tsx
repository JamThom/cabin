import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import SideNav from './components/side-nav/side-nav';

export default function AppShell() {
  return (
    <Flex minH="100vh">
      <SideNav />
      <Box flex="1">
        <Outlet />
      </Box>
    </Flex>
  );
}
