<script lang="ts">
  let { data, form } = $props();
</script>

<div class="flex items-end justify-between gap-5">
  <div>
    <h1 class="text-3xl font-bold">Categories</h1>
    <p class="mt-2 text-gray-600">Manage the categories available when uploading torrents.</p>
  </div>
</div>

<form class="mt-6 flex max-w-xl gap-3" method="POST" action="?/create">
  <label class="sr-only" for="new-category">Category name</label>
  <input class="min-w-0 flex-1 border border-gray-300 p-3" id="new-category" name="name" placeholder="Category name" required />
  <button class="bg-harbor-600 px-5 py-3 font-bold text-white hover:bg-harbor-700" type="submit">Add</button>
</form>

{#if form?.message}
  <p class="mt-4 max-w-xl border-l-4 border-harbor-600 bg-white p-4">{form.message}</p>
{/if}

<ul class="mt-6 max-w-xl list-none divide-y divide-gray-200 bg-white p-0">
  {#each data.categories as category}
    <li class="flex gap-3 p-4">
      <form class="flex min-w-0 flex-1 gap-3" method="POST" action="?/update">
        <input type="hidden" name="id" value={category.id} />
        <label class="sr-only" for={`category-${category.id}`}>Category name</label>
        <input class="min-w-0 flex-1 border border-gray-300 p-2" id={`category-${category.id}`} name="name" value={category.name} required />
        <button class="border border-harbor-600 px-4 font-bold text-harbor-700 hover:bg-harbor-50" type="submit">Save</button>
      </form>
      <form method="POST" action="?/delete">
        <input type="hidden" name="id" value={category.id} />
        <button class="h-full border border-red-300 px-4 font-bold text-red-700 hover:bg-red-50" type="submit">Delete</button>
      </form>
    </li>
  {/each}
</ul>