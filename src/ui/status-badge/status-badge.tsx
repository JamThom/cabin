import { Badge } from '@chakra-ui/react';
import { statusColour } from '../../store/constants';
import { Status } from '../../store/types';

interface StatusBadgeProps {
  status: Status;
  blockedBy?: string;
}

export default function StatusBadge({ status, blockedBy }: StatusBadgeProps) {
  return (
    <Badge colorPalette={statusColour[status]} variant="subtle" textTransform="capitalize">
      {status === 'blocked' && blockedBy ? blockedBy : status}
    </Badge>
  );
}
