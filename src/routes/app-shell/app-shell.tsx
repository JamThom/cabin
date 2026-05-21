import { Box, Flex, Stack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import SideNav from './components/side-nav/side-nav';

export default function AppShell() {
  return (
    <Flex
      h={{ base: '100vh', md: 'auto' }}
      width={{ base: 'unset', md: 'auto' }}
      border={{ base: '0', md: 'initial' }}
      justifyContent={{ base: 'space-between', md: 'flex-start' }}
      flexDir={{ base: 'column-reverse', md: 'row' }}
    >
      <SideNav />
      <Stack flex="1">
        <Outlet />
      </Stack>
    </Flex>
  );
}
