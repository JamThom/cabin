import { Input, Stack, Text } from '@chakra-ui/react';

export interface MaterialFormValues {
  name: string | null;
  productName: string | null;
  url: string | null;
  cost: string | null;
  unit: string | null;
  quantity: string | null;
}

interface Props {
  values: MaterialFormValues;
  onChange: (field: keyof MaterialFormValues, value: string) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack gap={1}>
      <Text fontSize="sm" fontWeight="medium">{label}</Text>
      {children}
    </Stack>
  );
}

function field(values: MaterialFormValues, key: keyof MaterialFormValues) {
  return { value: values[key] ?? '', placeholder: values[key] === null ? 'multiple' : '' };
}

export default function MaterialItemFormFields({ values, onChange }: Props) {
  return (
    <Stack gap={4}>
      <Field label="Name">
        <Input {...field(values, 'name')} onChange={(e) => onChange('name', e.target.value)} />
      </Field>
      <Field label="Product Name">
        <Input {...field(values, 'productName')} onChange={(e) => onChange('productName', e.target.value)} />
      </Field>
      <Field label="URL">
        <Input {...field(values, 'url')} onChange={(e) => onChange('url', e.target.value)} />
      </Field>
      <Field label="Cost">
        <Input type="number" {...field(values, 'cost')} onChange={(e) => onChange('cost', e.target.value)} />
      </Field>
      <Field label="Unit">
        <Input {...field(values, 'unit')} onChange={(e) => onChange('unit', e.target.value)} />
      </Field>
      <Field label="Quantity">
        <Input type="number" {...field(values, 'quantity')} onChange={(e) => onChange('quantity', e.target.value)} />
      </Field>
    </Stack>
  );
}
