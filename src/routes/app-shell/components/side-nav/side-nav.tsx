import { Box, Stack, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import UiButton from '@/ui/button/button';

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
    <Box w="240px" borderRightWidth="1px" p={4}>
      <Text fontSize="lg" fontWeight="bold" mb={4}>Cabin</Text>
      <Stack gap={2}>
        {navItems.map((item) => (
          <UiButton
            key={item.path}
            justifyContent="flex-start"
            variant={location.pathname.startsWith(item.path) ? 'solid' : 'ghost'}
            icon={item.icon}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </UiButton>
        ))}
      </Stack>
    </Box>
  );
}
