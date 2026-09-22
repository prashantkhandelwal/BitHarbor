<script lang="ts">
  import TorrentList from '$lib/components/TorrentList.svelte';

  let { data } = $props();
</script>

<section class="mb-10 border-b border-harbor-600/20 pb-10">
  <p class="mb-2 font-semibold text-harbor-600">Torrent metadata, safely harbored</p>
  <h1 class="m-0 max-w-2xl text-4xl font-bold">Browse files. Copy magnet links. Use your own client.</h1>
</section>

<h2 class="text-2xl font-bold">Recently added</h2>
<TorrentList torrents={data.torrents} />