import { Box, For, NativeSelect, Text } from '@chakra-ui/react';
import { MaterialCategory } from '@/api/hooks/materials/use-material-categories';

interface CategorySelectProps {
  categories: MaterialCategory[];
  value: string;
  onChange: (id: string) => void;
}

export default function CategorySelect({ categories, value, onChange }: CategorySelectProps) {
  return (
    <Box mb={4}>
      <Text fontSize="sm" fontWeight="medium" mb={1}>Category</Text>
      <NativeSelect.Root>
        <NativeSelect.Field value={value} onChange={(e) => onChange(e.target.value)}>
          <For each={categories}>
            {(cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>}
          </For>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
    </Box>
  );
}
