import { Phase } from './types';

export const INITIAL_DATA: Phase[] = [
  {
    id: 'phase-1',
    name: 'Phase 1 - Site Prep',
    tasks: [
      {
        id: 'task-1',
        name: 'Clear land',
        status: 'completed',
        costEst: '$500',
        subtasks: [
          { id: 'st-1', name: 'Remove trees', status: 'completed', costEst: '$300' },
          { id: 'st-2', name: 'Level ground', status: 'completed', costEst: '$200' }
        ]
      },
      {
        id: 'task-2',
        name: 'Lay foundation',
        status: 'in-progress',
        costEst: '$4,000',
        subtasks: [
          { id: 'st-3', name: 'Pour concrete', status: 'in-progress', costEst: '$3,000' },
          { id: 'st-4', name: 'Install anchor bolts', status: 'to-do', costEst: '$1,000' }
        ]
      }
    ]
  },
  {
    id: 'phase-2',
    name: 'Phase 2 - Framing',
    tasks: [{ id: 'task-3', name: 'Erect walls', status: 'to-do', costEst: '$6,000', subtasks: [] }]
  }
];
