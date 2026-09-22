<script lang="ts">
  import type { Torrent } from '$lib/types';

  let { torrents }: { torrents: Torrent[] } = $props();

  const formatter = new Intl.NumberFormat('en', {
    style: 'unit',
    unit: 'megabyte',
    maximumFractionDigits: 1
  });
</script>

{#if torrents.length === 0}
  <p class="border border-dashed border-harbor-600/40 bg-white p-8 text-center text-gray-600">
    No torrents found.
  </p>
{:else}
  <ul class="grid list-none gap-3 p-0">
    {#each torrents as torrent}
      <li class="border-l-4 border-harbor-600 bg-white p-5 shadow-sm">
        <a class="text-lg font-bold text-harbor-700 hover:underline" href={`/torrents/${torrent.id}`}>
          {torrent.name}
        </a>
        <p class="mt-2 mb-0 text-sm text-gray-600">
          {formatter.format(torrent.totalSize / 1_048_576)} · {torrent.files.length} file{torrent.files.length === 1 ? '' : 's'}
        </p>
      </li>
    {/each}
  </ul>
{/if}