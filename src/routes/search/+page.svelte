<script lang="ts">
  import TorrentList from '$lib/components/TorrentList.svelte';

  let { data } = $props();
</script>

<h1 class="text-3xl font-bold">Search torrents</h1>
<form class="my-6 flex max-w-2xl gap-2" method="GET">
  <label class="sr-only" for="query">Search torrents</label>
  <input
    class="min-w-0 flex-1 border border-gray-300 bg-white px-4 py-3 outline-none focus:border-harbor-600"
    id="query"
    name="q"
    placeholder="Search by name"
    value={data.query}
  />
  <button class="bg-harbor-600 px-5 py-3 font-bold text-white hover:bg-harbor-700" type="submit">Search</button>
</form>
<TorrentList torrents={data.torrents} />