<script lang="ts">
  import { formatFileSize } from '$lib/format';

  let { data } = $props();

  const magnetLink = $derived(
    `magnet:?xt=urn:btih:${data.torrent.infoHash}&dn=${encodeURIComponent(data.torrent.name)}`
  );
</script>

<article>
  <p class="font-mono text-sm text-gray-500">{data.torrent.infoHash}</p>
  <h1 class="text-3xl font-bold">{data.torrent.name}</h1>
  <p class="mt-2 text-sm font-semibold text-harbor-700">{data.torrent.categoryName ?? 'Uncategorized'}</p>
  <a class="inline-block bg-harbor-600 px-5 py-3 font-bold text-white hover:bg-harbor-700" href={magnetLink}>
    Open magnet link
  </a>

  {#if data.torrent.description}
    <p class="mt-6 max-w-3xl whitespace-pre-wrap text-gray-700">{data.torrent.description}</p>
  {/if}

  {#if data.torrent.tags.length > 0}
    <ul class="mt-4 flex list-none flex-wrap gap-2 p-0" aria-label="Tags">
      {#each data.torrent.tags as tag}
        <li class="border border-harbor-600/30 bg-white px-3 py-1 text-sm text-harbor-700">{tag}</li>
      {/each}
    </ul>
  {/if}

  <h2 class="mt-10 text-xl font-bold">Files</h2>
  <ul class="divide-y divide-gray-200 bg-white p-0">
    {#each data.torrent.files as file}
      <li class="flex justify-between gap-5 px-4 py-3">
        <span>{file.path}</span>
        <span class="whitespace-nowrap text-gray-500">{formatFileSize(file.size)}</span>
      </li>
    {/each}
  </ul>
</article>