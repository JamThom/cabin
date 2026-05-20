import { Box, Flex, Stack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import SideNav from './components/side-nav/side-nav';

export default function AppShell() {
  return (
    <Flex h="100vh">
      <SideNav />
      <Stack flex="1">
        <Outlet />
      </Stack>
    </Flex>
  );
}
