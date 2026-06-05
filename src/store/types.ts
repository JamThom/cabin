export type Status = 'to-do' | 'in-progress' | 'blocked' | 'completed';

export interface Task {
  id: string;
  name: string;
  status: Status;
  costEst: string;
  blockedBy?: string;
  description?: string;
  date?: string;
}

export interface Phase {
  id: string;
  name: string;
  tasks: Task[];
}

export interface DocumentFile {
  id: string;
  folderId: string;
  name: string;
  tags: string[];
  modified: string;
  mimeType: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  parentDirectoryId?: string | null;
  files: DocumentFile[];
}

export interface ControlPlanItem {
  id: string;
  activity: string;
  requirement: string;
  performedBy: string;
  reportedAction: string;
  toKA: string;
  toBN: string;
  date: string;
  signature: string;
  note: string;
  translated: string;
}
