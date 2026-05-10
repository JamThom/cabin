import { faBoxOpen, faChevronDown, faChevronRight, faFile, faFileLines, faFolder, faListCheck, faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type IconName = 'chevron-down' | 'chevron-right' | 'tasks' | 'materials' | 'documents' | 'notes' | 'folder' | 'file';

interface IconProps {
  name: IconName;
}

export default function Icon({ name }: IconProps) {
  const iconByName: Record<IconName, IconDefinition> = {
    'chevron-down': faChevronDown,
    'chevron-right': faChevronRight,
    tasks: faListCheck,
    materials: faBoxOpen,
    documents: faFileLines,
    notes: faNoteSticky,
    folder: faFolder,
    file: faFile
  };

  const icon = iconByName[name];
  return <FontAwesomeIcon icon={icon} />;
}