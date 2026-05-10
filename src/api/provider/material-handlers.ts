import { http, HttpResponse } from 'msw';
import { createId } from '@/store/create-id';

interface MaterialItem {
  id: string;
  name: string;
  productName: string;
  url: string;
  cost: number;
  unit: string;
  quantity: number;
}

interface MaterialCategory {
  id: string;
  name: string;
  items: MaterialItem[];
}

interface MaterialItemBody {
  name: string;
  productName: string;
  url: string;
  cost: number;
  unit: string;
  quantity: number;
}

const initialMaterialCategories: MaterialCategory[] = [
  {
    id: 'category-1',
    name: 'Framing',
    items: [
      {
        id: 'material-1',
        name: 'Wall studs',
        productName: '2x4 KD Lumber',
        url: 'https://example.com/2x4-lumber',
        cost: 4.5,
        unit: 'piece',
        quantity: 120
      },
      {
        id: 'material-2',
        name: 'Joist hangers',
        productName: 'Galvanized hanger',
        url: 'https://example.com/joist-hanger',
        cost: 1.15,
        unit: 'piece',
        quantity: 80
      }
    ]
  },
  {
    id: 'category-2',
    name: 'Roofing',
    items: [
      {
        id: 'material-3',
        name: 'Roof sheathing',
        productName: 'OSB 7/16"',
        url: 'https://example.com/osb',
        cost: 18,
        unit: 'sheet',
        quantity: 28
      }
    ]
  }
];

export default function createMaterialHandlers() {
  const categories: MaterialCategory[] = structuredClone(initialMaterialCategories);

  return [
    http.get('/api/material-categories', () => HttpResponse.json(categories)),
    http.post('/api/material-categories', async ({ request }) => {
      const body = (await request.json()) as { name: string };
      const category: MaterialCategory = { id: createId(), name: body.name, items: [] };
      categories.push(category);
      return HttpResponse.json(category, { status: 201 });
    }),
    http.patch('/api/material-categories/:categoryId', async ({ params, request }) => {
      const body = (await request.json()) as { name: string };
      const category = categories.find((item) => item.id === params.categoryId);
      if (!category) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      category.name = body.name;
      return HttpResponse.json(category);
    }),
    http.delete('/api/material-categories/:categoryId', ({ params }) => {
      const index = categories.findIndex((item) => item.id === params.categoryId);
      if (index === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      categories.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    }),
    http.post('/api/material-categories/:categoryId/items', ({ params }) => {
      const category = categories.find((item) => item.id === params.categoryId);
      if (!category) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      const item: MaterialItem = {
        id: createId(),
        name: 'New material',
        productName: '',
        url: '',
        cost: 0,
        unit: 'piece',
        quantity: 1
      };
      category.items.push(item);
      return HttpResponse.json(item, { status: 201 });
    }),
    http.patch('/api/material-categories/:categoryId/items/:itemId', async ({ params, request }) => {
      const body = (await request.json()) as MaterialItemBody;
      const category = categories.find((item) => item.id === params.categoryId);
      const item = category?.items.find((entry) => entry.id === params.itemId);
      if (!item) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      item.name = body.name;
      item.productName = body.productName;
      item.url = body.url;
      item.cost = Number(body.cost) || 0;
      item.unit = body.unit;
      item.quantity = Number(body.quantity) || 0;
      return HttpResponse.json(item);
    }),
    http.delete('/api/material-categories/:categoryId/items/:itemId', ({ params }) => {
      const category = categories.find((item) => item.id === params.categoryId);
      if (!category) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      category.items = category.items.filter((item) => item.id !== params.itemId);
      return new HttpResponse(null, { status: 204 });
    })
  ];
}
