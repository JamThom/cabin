import { Box, Stack } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import UiIconButton from '@/ui/icon-button/icon-button';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/tasks', label: 'Tasks', icon: 'tasks' },
  { path: '/materials', label: 'Materials', icon: 'materials' },
  { path: '/documents', label: 'Documents', icon: 'documents' },
  { path: '/notes', label: 'Notes', icon: 'notes' }
];

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      w="64px"
      bg="white"
      borderRightWidth="1px"
      p={3}
      pt={1}
      display="flex"
      alignItems="center"
      justifyContent={{ base: 'space-between', md: 'flex-start' }}
      width={{ base: 'unset', md: '64px' }}
      flexDir={{ base: 'row', md: 'column' }}
    >
      <Box display={{
        base: 'none', md: 'unset'
      }} fontSize="xl" mb={4} mt={1}>🏕️</Box>
      <Stack
        gap={2}
        alignItems="center"
        flex={{ base: '1', md: 'unset' }}
        justifyContent={{ base: 'space-between', md: 'flex-start' }}
        flexDir={{ base: 'row', md: 'column' }}
      >
        {navItems.map((item) => (
          <UiIconButton
            flex={{ base: '1', md: 'unset' }}
            key={item.path}
            icon={item.icon}
            label={item.label}
            variant={location.pathname.startsWith(item.path) ? 'solid' : 'ghost'}
            onClick={() => navigate(item.path)}
          />
        ))}
      </Stack>
    </Box>
  );
}
