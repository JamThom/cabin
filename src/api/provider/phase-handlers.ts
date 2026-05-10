import { http, HttpResponse } from 'msw';
import { createId } from '@/store/create-id';
import { INITIAL_DATA } from '@/store/initial-data';
import { Status } from '@/store/types';

type PhaseRecord = typeof INITIAL_DATA[number];

interface ItemUpdateBody {
  name: string;
  status: Status;
  costEst: string;
}

export default function createPhaseHandlers() {
  const phases: PhaseRecord[] = structuredClone(INITIAL_DATA);

  return [
    http.get('/api/phases', () => HttpResponse.json(phases)),
    http.post('/api/phases', async ({ request }) => {
      const body = (await request.json()) as { name: string };
      const phase = { id: createId(), name: body.name, tasks: [] };
      phases.push(phase);
      return HttpResponse.json(phase, { status: 201 });
    }),
    http.patch('/api/phases/:phaseId', async ({ params, request }) => {
      const body = (await request.json()) as { name: string };
      const phase = phases.find((item) => item.id === params.phaseId);
      if (!phase) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      phase.name = body.name;
      return HttpResponse.json(phase);
    }),
    http.delete('/api/phases/:phaseId', ({ params }) => {
      const index = phases.findIndex((item) => item.id === params.phaseId);
      if (index === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      phases.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }),
    http.post('/api/phases/:phaseId/tasks', ({ params }) => {
      const phase = phases.find((item) => item.id === params.phaseId);
      if (!phase) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      const task = { id: createId(), name: 'New task', status: 'to-do' as const, costEst: '', subtasks: [] };
      phase.tasks.push(task);
      return HttpResponse.json(task, { status: 201 });
    }),
    http.patch('/api/phases/:phaseId/tasks/:taskId', async ({ params, request }) => {
      const body = (await request.json()) as ItemUpdateBody;
      const phase = phases.find((item) => item.id === params.phaseId);
      const task = phase?.tasks.find((item) => item.id === params.taskId);
      if (!task) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      task.name = body.name;
      task.status = body.status;
      task.costEst = body.costEst;
      return HttpResponse.json(task);
    }),
    http.delete('/api/phases/:phaseId/tasks/:taskId', ({ params }) => {
      const phase = phases.find((item) => item.id === params.phaseId);
      if (!phase) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      phase.tasks = phase.tasks.filter((item) => item.id !== params.taskId);
      return new HttpResponse(null, { status: 204 });
    }),
    http.post('/api/phases/:phaseId/tasks/:taskId/subtasks', ({ params }) => {
      const phase = phases.find((item) => item.id === params.phaseId);
      const task = phase?.tasks.find((item) => item.id === params.taskId);
      if (!task) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      const subtask = { id: createId(), name: 'New sub-task', status: 'to-do' as const, costEst: '' };
      task.subtasks.push(subtask);
      return HttpResponse.json(subtask, { status: 201 });
    }),
    http.patch('/api/phases/:phaseId/tasks/:taskId/subtasks/:subtaskId', async ({ params, request }) => {
      const body = (await request.json()) as ItemUpdateBody;
      const phase = phases.find((item) => item.id === params.phaseId);
      const task = phase?.tasks.find((item) => item.id === params.taskId);
      const subtask = task?.subtasks.find((item) => item.id === params.subtaskId);
      if (!subtask) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      subtask.name = body.name;
      subtask.status = body.status;
      subtask.costEst = body.costEst;
      return HttpResponse.json(subtask);
    }),
    http.delete('/api/phases/:phaseId/tasks/:taskId/subtasks/:subtaskId', ({ params }) => {
      const phase = phases.find((item) => item.id === params.phaseId);
      const task = phase?.tasks.find((item) => item.id === params.taskId);
      if (!task) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      task.subtasks = task.subtasks.filter((item) => item.id !== params.subtaskId);
      return new HttpResponse(null, { status: 204 });
    })
  ];
}
