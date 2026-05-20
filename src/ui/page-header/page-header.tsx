import { Heading, Stack } from '@chakra-ui/react';
import { ReactNode } from 'react';

type Props = {
  title: ReactNode;
  action?: ReactNode;
};

export default function PageHeader({ title, action }: Props) {
  return (
    <Stack direction="row" justify="space-between" align="center" mb={8}>
      <Heading size="xl">{title}</Heading>
      {action}
    </Stack>
  );
}
