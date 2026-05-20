const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function noContent() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

function crypto_uuid() {
  return crypto.randomUUID();
}

async function getState(db) {
  const row = await db.prepare('SELECT state FROM app_state WHERE id = 1').first();
  if (!row) {
    const initial = { phases: [], categories: [] };
    await db.prepare("INSERT INTO app_state (id, state, updated_at) VALUES (1, ?, ?)").bind(JSON.stringify(initial), new Date().toISOString()).run();
    return initial;
  }
  return JSON.parse(row.state);
}

async function saveState(db, state) {
  await db.prepare('UPDATE app_state SET state = ?, updated_at = ? WHERE id = 1').bind(JSON.stringify(state), new Date().toISOString()).run();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const db = env.DB;

    // ── Phases ──────────────────────────────────────────────────────────────

    // GET /api/phases
    if (method === 'GET' && pathname === '/api/phases') {
      const state = await getState(db);
      return json(state.phases ?? []);
    }

    // POST /api/phases
    if (method === 'POST' && pathname === '/api/phases') {
      const body = await request.json();
      const state = await getState(db);
      const phase = { id: crypto_uuid(), name: body.name, tasks: [] };
      state.phases.push(phase);
      await saveState(db, state);
      return json(phase, 201);
    }

    // PATCH /api/phases/:phaseId
    const phasePatch = pathname.match(/^\/api\/phases\/([^/]+)$/);
    if (method === 'PATCH' && phasePatch) {
      const phaseId = phasePatch[1];
      const body = await request.json();
      const state = await getState(db);
      const phase = state.phases.find(p => p.id === phaseId);
      if (!phase) return json({ error: 'Not found' }, 404);
      Object.assign(phase, { name: body.name });
      await saveState(db, state);
      return json(phase);
    }

    // DELETE /api/phases/:phaseId
    const phaseDelete = pathname.match(/^\/api\/phases\/([^/]+)$/);
    if (method === 'DELETE' && phaseDelete) {
      const phaseId = phaseDelete[1];
      const state = await getState(db);
      state.phases = state.phases.filter(p => p.id !== phaseId);
      await saveState(db, state);
      return noContent();
    }

    // POST /api/phases/:phaseId/tasks
    const taskCreate = pathname.match(/^\/api\/phases\/([^/]+)\/tasks$/);
    if (method === 'POST' && taskCreate) {
      const phaseId = taskCreate[1];
      const state = await getState(db);
      const phase = state.phases.find(p => p.id === phaseId);
      if (!phase) return json({ error: 'Not found' }, 404);
      const task = { id: crypto_uuid(), name: 'New Task', status: 'to-do', costEst: '', blockedBy: '', subtasks: [] };
      phase.tasks.push(task);
      await saveState(db, state);
      return json(task, 201);
    }

    // PATCH /api/phases/:phaseId/tasks/:taskId
    const taskPatch = pathname.match(/^\/api\/phases\/([^/]+)\/tasks\/([^/]+)$/);
    if (method === 'PATCH' && taskPatch) {
      const [, phaseId, taskId] = taskPatch;
      const body = await request.json();
      const state = await getState(db);
      const phase = state.phases.find(p => p.id === phaseId);
      if (!phase) return json({ error: 'Not found' }, 404);
      const task = phase.tasks.find(t => t.id === taskId);
      if (!task) return json({ error: 'Not found' }, 404);
      Object.assign(task, { name: body.name, status: body.status, costEst: body.costEst, blockedBy: body.blockedBy });
      await saveState(db, state);
      return json(task);
    }

    // DELETE /api/phases/:phaseId/tasks/:taskId
    const taskDelete = pathname.match(/^\/api\/phases\/([^/]+)\/tasks\/([^/]+)$/);
    if (method === 'DELETE' && taskDelete) {
      const [, phaseId, taskId] = taskDelete;
      const state = await getState(db);
      const phase = state.phases.find(p => p.id === phaseId);
      if (!phase) return json({ error: 'Not found' }, 404);
      phase.tasks = phase.tasks.filter(t => t.id !== taskId);
      await saveState(db, state);
      return noContent();
    }

    // ── Material Categories ─────────────────────────────────────────────────

    // GET /api/material-categories
    if (method === 'GET' && pathname === '/api/material-categories') {
      const state = await getState(db);
      return json(state.categories ?? []);
    }

    // POST /api/material-categories
    if (method === 'POST' && pathname === '/api/material-categories') {
      const body = await request.json();
      const state = await getState(db);
      const category = { id: crypto_uuid(), name: body.name, items: [] };
      state.categories.push(category);
      await saveState(db, state);
      return json(category, 201);
    }

    // PATCH /api/material-categories/:categoryId
    const catPatch = pathname.match(/^\/api\/material-categories\/([^/]+)$/);
    if (method === 'PATCH' && catPatch) {
      const categoryId = catPatch[1];
      const body = await request.json();
      const state = await getState(db);
      const category = state.categories.find(c => c.id === categoryId);
      if (!category) return json({ error: 'Not found' }, 404);
      category.name = body.name;
      await saveState(db, state);
      return json(category);
    }

    // DELETE /api/material-categories/:categoryId
    const catDelete = pathname.match(/^\/api\/material-categories\/([^/]+)$/);
    if (method === 'DELETE' && catDelete) {
      const categoryId = catDelete[1];
      const state = await getState(db);
      state.categories = state.categories.filter(c => c.id !== categoryId);
      await saveState(db, state);
      return noContent();
    }

    // POST /api/material-categories/:categoryId/items
    const itemCreate = pathname.match(/^\/api\/material-categories\/([^/]+)\/items$/);
    if (method === 'POST' && itemCreate) {
      const categoryId = itemCreate[1];
      const state = await getState(db);
      const category = state.categories.find(c => c.id === categoryId);
      if (!category) return json({ error: 'Not found' }, 404);
      const item = { id: crypto_uuid(), name: 'New material', productName: '', url: '', cost: 0, unit: 'piece', quantity: 1, group: '' };
      category.items.push(item);
      await saveState(db, state);
      return json(item, 201);
    }

    // PATCH /api/material-categories/:categoryId/items/:itemId
    const itemPatch = pathname.match(/^\/api\/material-categories\/([^/]+)\/items\/([^/]+)$/);
    if (method === 'PATCH' && itemPatch) {
      const [, categoryId, itemId] = itemPatch;
      const body = await request.json();
      const state = await getState(db);
      const category = state.categories.find(c => c.id === categoryId);
      if (!category) return json({ error: 'Not found' }, 404);
      const item = category.items.find(i => i.id === itemId);
      if (!item) return json({ error: 'Not found' }, 404);
      Object.assign(item, {
        name: body.name,
        productName: body.productName,
        url: body.url,
        cost: body.cost,
        unit: body.unit,
        quantity: body.quantity,
        group: body.group ?? item.group ?? '',
      });
      await saveState(db, state);
      return json(item);
    }

    // DELETE /api/material-categories/:categoryId/items/:itemId
    const itemDelete = pathname.match(/^\/api\/material-categories\/([^/]+)\/items\/([^/]+)$/);
    if (method === 'DELETE' && itemDelete) {
      const [, categoryId, itemId] = itemDelete;
      const state = await getState(db);
      const category = state.categories.find(c => c.id === categoryId);
      if (!category) return json({ error: 'Not found' }, 404);
      category.items = category.items.filter(i => i.id !== itemId);
      await saveState(db, state);
      return noContent();
    }

    // ── Notes ───────────────────────────────────────────────────────────────

    // GET /api/notes
    if (method === 'GET' && pathname === '/api/notes') {
      const state = await getState(db);
      return json(state.notes ?? []);
    }

    // POST /api/notes
    if (method === 'POST' && pathname === '/api/notes') {
      const state = await getState(db);
      if (!state.notes) state.notes = [];
      const note = { id: crypto_uuid(), title: 'New Note', content: '', dateModified: new Date().toISOString() };
      state.notes.push(note);
      await saveState(db, state);
      return json(note, 201);
    }

    // PATCH /api/notes/:noteId
    const notePatch = pathname.match(/^\/api\/notes\/([^/]+)$/);
    if (method === 'PATCH' && notePatch) {
      const noteId = notePatch[1];
      const body = await request.json();
      const state = await getState(db);
      if (!state.notes) state.notes = [];
      const note = state.notes.find(n => n.id === noteId);
      if (!note) return json({ error: 'Not found' }, 404);
      Object.assign(note, { title: body.title, content: body.content, dateModified: new Date().toISOString() });
      await saveState(db, state);
      return json(note);
    }

    // DELETE /api/notes/:noteId
    const noteDelete = pathname.match(/^\/api\/notes\/([^/]+)$/);
    if (method === 'DELETE' && noteDelete) {
      const noteId = noteDelete[1];
      const state = await getState(db);
      if (!state.notes) state.notes = [];
      state.notes = state.notes.filter(n => n.id !== noteId);
      await saveState(db, state);
      return noContent();
    }

    // ── Documents ───────────────────────────────────────────────────────────

    // GET /api/documents
    if (method === 'GET' && pathname === '/api/documents') {
      const state = await getState(db);
      return json(state.documentFolders ?? []);
    }

    // POST /api/documents/folders
    if (method === 'POST' && pathname === '/api/documents/folders') {
      const body = await request.json();
      const state = await getState(db);
      if (!state.documentFolders) state.documentFolders = [];
      const folder = { id: crypto_uuid(), name: body.name, files: [] };
      state.documentFolders.push(folder);
      await saveState(db, state);
      return json(folder, 201);
    }

    return json({ error: 'Not found' }, 404);
  },
};
