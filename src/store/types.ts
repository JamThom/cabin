export type Status = 'to-do' | 'in-progress' | 'blocked' | 'completed';

export interface SubTask {
  id: string;
  name: string;
  status: Status;
  costEst: string;
}

export interface Task {
  id: string;
  name: string;
  status: Status;
  costEst: string;
  subtasks: SubTask[];
}

export interface Phase {
  id: string;
  name: string;
  tasks: Task[];
}

export interface DrawerItem {
  type: 'task' | 'subtask';
  phaseId: string;
  taskId: string;
  subtaskId?: string;
}

export interface DocumentFile {
  id: string;
  folderId: string;
  name: string;
  tags: string[];
  modified: string;
  url: string;
  mimeType: string;
}

export interface DocumentFolder {
  id: string;
  name: string;
  files: DocumentFile[];
}
