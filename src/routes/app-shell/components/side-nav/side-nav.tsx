import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '@/ui/icon/icon';

interface NavItem {
  path: string;
  label: string;
  icon: 'tasks' | 'materials' | 'documents' | 'notes';
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
          <Button
            key={item.path}
            justifyContent="flex-start"
            variant={location.pathname.startsWith(item.path) ? 'solid' : 'ghost'}
            colorPalette="teal"
            onClick={() => navigate(item.path)}
          >
            <Icon name={item.icon} />
            <Text ml={2}>{item.label}</Text>
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
