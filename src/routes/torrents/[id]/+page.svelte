<script lang="ts">
  let { data } = $props();

  const magnetLink = `magnet:?xt=urn:btih:${data.torrent.infoHash}&dn=${encodeURIComponent(data.torrent.name)}`;
</script>

<article>
  <p class="font-mono text-sm text-gray-500">{data.torrent.infoHash}</p>
  <h1 class="text-3xl font-bold">{data.torrent.name}</h1>
  <a class="inline-block bg-harbor-600 px-5 py-3 font-bold text-white hover:bg-harbor-700" href={magnetLink}>
    Open magnet link
  </a>

  <h2 class="mt-10 text-xl font-bold">Files</h2>
  <ul class="divide-y divide-gray-200 bg-white p-0">
    {#each data.torrent.files as file}
      <li class="flex justify-between gap-5 px-4 py-3">
        <span>{file.path}</span>
        <span class="whitespace-nowrap text-gray-500">{file.size.toLocaleString()} bytes</span>
      </li>
    {/each}
  </ul>
</article>