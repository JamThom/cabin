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

function base64ToUint8(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getState(db) {
  const row = await db.prepare('SELECT state FROM app_state WHERE id = 1').first();
  if (!row) {
    const initial = { phases: [], categories: [], documentFolders: [], documentBlobById: {} };
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
    const bucket = env.FILES;

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
      const task = { id: crypto_uuid(), name: 'New Task', status: 'to-do', costEst: '', blockedBy: '', description: '', date: '', subtasks: [] };
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
      Object.assign(task, { name: body.name, status: body.status, costEst: body.costEst, blockedBy: body.blockedBy, description: body.description ?? task.description ?? '', date: body.date ?? task.date ?? '' });
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
      const item = { id: crypto_uuid(), name: 'New material', productName: '', url: '', cost: 0, unit: 'piece', quantity: 1 };
      category.items.push(item);
      await saveState(db, state);
      return json(item, 201);
    }

    // PATCH /api/material-categories/:categoryId/items  (bulk update)
    const itemsBulkPatch = pathname.match(/^\/api\/material-categories\/([^/]+)\/items$/);
    if (method === 'PATCH' && itemsBulkPatch) {
      const categoryId = itemsBulkPatch[1];
      const updates = await request.json(); // [{ id, name, productName, url, cost, unit, quantity }]
      const state = await getState(db);
      const category = state.categories.find(c => c.id === categoryId);
      if (!category) return json({ error: 'Not found' }, 404);
      for (const update of updates) {
        const item = category.items.find(i => i.id === update.id);
        if (item) Object.assign(item, {
          name: update.name,
          productName: update.productName,
          url: update.url,
          cost: update.cost,
          unit: update.unit,
          quantity: update.quantity,
        });
      }
      await saveState(db, state);
      return json(category.items);
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
      });
      if (body.targetCategoryId && body.targetCategoryId !== categoryId) {
        const targetCategory = state.categories.find(c => c.id === body.targetCategoryId);
        if (!targetCategory) return json({ error: 'Target category not found' }, 404);
        category.items = category.items.filter(i => i.id !== itemId);
        targetCategory.items.push(item);
      }
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

    // ── Control Plan ────────────────────────────────────────────────────────

    // GET /api/control-plan
    if (method === 'GET' && pathname === '/api/control-plan') {
      const state = await getState(db);
      return json(state.controlPlan ?? []);
    }

    // POST /api/control-plan
    if (method === 'POST' && pathname === '/api/control-plan') {
      const state = await getState(db);
      if (!state.controlPlan) state.controlPlan = [];
      const item = { id: crypto_uuid(), activity: '', requirement: '', performedBy: '', reportedAction: '', toKA: '', toBN: '', date: '', signature: '', note: '', translated: '' };
      state.controlPlan.push(item);
      await saveState(db, state);
      return json(item, 201);
    }

    // PATCH /api/control-plan/:itemId
    const controlPlanPatch = pathname.match(/^\/api\/control-plan\/([^/]+)$/);
    if (method === 'PATCH' && controlPlanPatch) {
      const itemId = controlPlanPatch[1];
      const body = await request.json();
      const state = await getState(db);
      if (!state.controlPlan) state.controlPlan = [];
      const item = state.controlPlan.find(i => i.id === itemId);
      if (!item) return json({ error: 'Not found' }, 404);
      Object.assign(item, body);
      await saveState(db, state);
      return json(item);
    }

    // DELETE /api/control-plan/:itemId
    const controlPlanDelete = pathname.match(/^\/api\/control-plan\/([^/]+)$/);
    if (method === 'DELETE' && controlPlanDelete) {
      const itemId = controlPlanDelete[1];
      const state = await getState(db);
      if (!state.controlPlan) state.controlPlan = [];
      state.controlPlan = state.controlPlan.filter(i => i.id !== itemId);
      await saveState(db, state);
      return noContent();
    }

    // ── Documents ───────────────────────────────────────────────────────────

    // GET /api/documents
    if (method === 'GET' && pathname === '/api/documents') {
      const state = await getState(db);
      return json(state.documentFolders ?? []);
    }

    const documentFileGet = pathname.match(/^\/api\/documents\/files\/([^/]+)$/);
    if (method === 'GET' && documentFileGet) {
      const fileId = documentFileGet[1];

      // Primary: R2
      if (bucket) {
        const object = await bucket.get(fileId);
        if (object) {
          const filename = encodeURIComponent(object.customMetadata?.name || `document-${fileId}`);
          return new Response(object.body, {
            headers: {
              ...CORS_HEADERS,
              'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
              'Content-Disposition': `attachment; filename*=UTF-8''${filename}`,
              'Content-Length': String(object.size),
            },
          });
        }
      }

      // Fallback: legacy D1 JSON blob
      const state = await getState(db);
      const blob = state.documentBlobById?.[fileId];
      if (!blob) return json({ error: 'File not found' }, 404);
      const bytes = base64ToUint8(blob.base64);
      const filename = encodeURIComponent(blob.name || `document-${fileId}`);
      return new Response(bytes.buffer, {
        headers: {
          ...CORS_HEADERS,
          'Content-Type': blob.mimeType || 'application/octet-stream',
          'Content-Disposition': `attachment; filename*=UTF-8''${filename}`,
        },
      });
    }

    const documentDelete = pathname.match(/^\/api\/documents\/([^/]+)$/);
    if (method === 'DELETE' && documentDelete) {
      const fileId = documentDelete[1];
      const state = await getState(db);
      if (!state.documentFolders) state.documentFolders = [];
      let removed = false;
      state.documentFolders.forEach((folder) => {
        const files = Array.isArray(folder.files) ? folder.files : [];
        const next = files.filter((file) => file.id !== fileId);
        if (next.length !== files.length) removed = true;
        folder.files = next;
      });
      if (!removed) return json({ error: 'Not found' }, 404);
      if (bucket) await bucket.delete(fileId);
      if (state.documentBlobById?.[fileId]) delete state.documentBlobById[fileId];
      await saveState(db, state);
      return noContent();
    }

    // PATCH /api/documents/folders/:folderId  (rename)
    const folderPatch = pathname.match(/^\/api\/documents\/folders\/([^/]+)$/);
    if (method === 'PATCH' && folderPatch) {
      const folderId = folderPatch[1];
      const body = await request.json();
      const state = await getState(db);
      if (!state.documentFolders) state.documentFolders = [];
      const folder = state.documentFolders.find((f) => f.id === folderId);
      if (!folder) return json({ error: 'Not found' }, 404);
      folder.name = body.name;
      await saveState(db, state);
      return json(folder);
    }

    // DELETE /api/documents/folders/:folderId  (deletes folder, all descendants, and their files)
    const folderDelete = pathname.match(/^\/api\/documents\/folders\/([^/]+)$/);
    if (method === 'DELETE' && folderDelete) {
      const folderId = folderDelete[1];
      const state = await getState(db);
      if (!state.documentFolders) state.documentFolders = [];

      // Collect all folder ids in the subtree rooted at folderId
      function collectDescendantIds(rootId) {
        const ids = [rootId];
        state.documentFolders.forEach((f) => {
          if (f.parentDirectoryId === rootId) ids.push(...collectDescendantIds(f.id));
        });
        return ids;
      }
      const toDelete = new Set(collectDescendantIds(folderId));

      // Delete R2 files for every folder in the subtree
      if (bucket) {
        for (const folder of state.documentFolders) {
          if (!toDelete.has(folder.id)) continue;
          for (const file of (folder.files ?? [])) {
            await bucket.delete(file.id);
            if (state.documentBlobById?.[file.id]) delete state.documentBlobById[file.id];
          }
        }
      }

      state.documentFolders = state.documentFolders.filter((f) => !toDelete.has(f.id));
      await saveState(db, state);
      return noContent();
    }

    // POST /api/documents/folders
    if (method === 'POST' && pathname === '/api/documents/folders') {
      const body = await request.json();
      const state = await getState(db);
      if (!state.documentFolders) state.documentFolders = [];
      const folder = { id: crypto_uuid(), name: body.name, parentDirectoryId: body.parentDirectoryId ?? null, files: [] };
      state.documentFolders.push(folder);
      await saveState(db, state);
      return json(folder, 201);
    }

    // POST /api/documents/upload
    if (method === 'POST' && pathname === '/api/documents/upload') {
      try {
        if (!bucket) return json({ error: 'File storage not configured' }, 500);
        const state = await getState(db);
        if (!state.documentFolders) state.documentFolders = [];

        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('multipart/form-data')) {
          return json({ error: 'multipart/form-data required' }, 400);
        }

        const form = await request.formData();
        const filePart = form.get('file');
        const folderId = String(form.get('folderId') || '');
        let name = String(form.get('name') || '');
        let mimeType = String(form.get('mimeType') || 'application/octet-stream');
        const rawTags = String(form.get('tags') || '[]');
        let tags = [];
        try { tags = JSON.parse(rawTags); } catch { tags = []; }
        if (!Array.isArray(tags)) tags = [];

        if (!filePart || typeof filePart === 'string') return json({ error: '"file" field required' }, 400);
        if (!folderId) return json({ error: 'folderId required' }, 400);

        const folder = state.documentFolders.find((f) => f.id === folderId);
        if (!folder) return json({ error: 'Folder not found' }, 404);
        if (!Array.isArray(folder.files)) folder.files = [];

        if (!name) name = filePart.name || 'document';
        if (!mimeType || mimeType === 'application/octet-stream') {
          mimeType = filePart.type || 'application/octet-stream';
        }

        const fileId = crypto_uuid();
        await bucket.put(fileId, await filePart.arrayBuffer(), {
          httpMetadata: { contentType: mimeType },
          customMetadata: { name, folderId },
        });

        const file = { id: fileId, folderId, name, tags, modified: new Date().toISOString(), mimeType };
        folder.files.push(file);
        await saveState(db, state);
        return json(file, 201);
      } catch (error) {
        return json({ error: 'Upload failed', detail: String(error?.message || error) }, 500);
      }
    }

    return json({ error: 'Not found' }, 404);
  },
};
