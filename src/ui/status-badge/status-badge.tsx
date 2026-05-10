import { Badge } from '@chakra-ui/react';
import { statusColour } from '../../store/constants';
import { Status } from '../../store/types';

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge colorPalette={statusColour[status]} variant="subtle" textTransform="capitalize">
      {status}
    </Badge>
  );
}
