<script lang="ts">
  let { form } = $props();
</script>

<h1 class="text-3xl font-bold">Upload a torrent</h1>
<form class="mt-6 max-w-xl border border-harbor-600/20 bg-white p-6" method="POST" enctype="multipart/form-data">
  <label class="mb-2 block font-bold" for="torrent">Torrent file</label>
  <input class="block w-full border border-gray-300 p-3" id="torrent" name="torrent" type="file" accept=".torrent" required />
  <button class="mt-5 bg-harbor-600 px-5 py-3 font-bold text-white hover:bg-harbor-700" type="submit">Upload</button>
</form>

{#if form?.message}
  <p class="mt-4 max-w-xl border-l-4 border-harbor-600 bg-white p-4">{form.message}</p>
{/if}