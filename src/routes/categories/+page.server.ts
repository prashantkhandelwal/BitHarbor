import { createCategory, deleteCategory, listCategories, updateCategory } from '$lib/server/db/categories';
import { requireUser } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  requireUser(locals.user, url.pathname);
  return { categories: await listCategories() };
};

function readName(data: FormData): string {
  return String(data.get('name') ?? '').trim();
}

export const actions: Actions = {
  create: async ({ locals, request, url }) => {
    requireUser(locals.user, url.pathname);
    const name = readName(await request.formData());
    if (!name) return fail(400, { message: 'Category name is required.' });

    try {
      await createCategory(name);
      return { message: 'Category added.' };
    } catch {
      return fail(400, { message: 'A category with that name already exists.' });
    }
  },
  update: async ({ locals, request, url }) => {
    requireUser(locals.user, url.pathname);
    const data = await request.formData();
    const id = String(data.get('id') ?? '');
    const name = readName(data);
    if (!id || !name) return fail(400, { message: 'Category name is required.' });

    try {
      const updated = await updateCategory(id, name);
      if (!updated) return fail(404, { message: 'Category not found.' });
      return { message: 'Category updated.' };
    } catch {
      return fail(400, { message: 'A category with that name already exists.' });
    }
  },
  delete: async ({ locals, request, url }) => {
    requireUser(locals.user, url.pathname);
    const id = String((await request.formData()).get('id') ?? '');
    if (!id) return fail(400, { message: 'Category not found.' });

    const result = await deleteCategory(id);
    if (result === 'in-use') return fail(409, { message: 'This category is used by a torrent and cannot be deleted.' });
    if (result === 'not-found') return fail(404, { message: 'Category not found.' });
    return { message: 'Category deleted.' };
  }
};