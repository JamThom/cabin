import { setupWorker } from 'msw/browser';
import createDocumentHandlers from './document-handlers';
import createMaterialHandlers from './material-handlers';
import createPhaseHandlers from './phase-handlers';

export default function createWorker() {
  return setupWorker(...createPhaseHandlers(), ...createMaterialHandlers(), ...createDocumentHandlers());
}
