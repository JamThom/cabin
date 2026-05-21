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
    <Box w="64px" bg="white" borderRightWidth="1px" p={3} pt={1} display="flex" flexDir="column" alignItems="center">
      <Box fontSize="xl" mb={4} mt={1}>🏕️</Box>
      <Stack gap={2} alignItems="center">
        {navItems.map((item) => (
          <UiIconButton
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
