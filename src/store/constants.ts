import { Status } from './types';

export const STATUSES: Status[] = ['to-do', 'in-progress', 'blocked', 'completed'];

export const statusColour: Record<Status, string> = {
  'to-do': 'gray',
  'in-progress': 'blue',
  blocked: 'red',
  completed: 'green',
};
