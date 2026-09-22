<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>BitHarbor</title>
  <meta name="description" content="Browse and host torrent metadata." />
</svelte:head>

<header class="border-b border-harbor-600/20 bg-white">
  <nav class="mx-auto flex max-w-5xl items-center justify-between px-5 py-4" aria-label="Main navigation">
    <a class="text-xl font-bold text-harbor-700" href="/">BitHarbor</a>
    <div class="flex gap-5 text-sm font-semibold">
      <a class="hover:text-harbor-600" href="/search">Search</a>
      <a class="hover:text-harbor-600" href="/upload">Upload</a>
    </div>
  </nav>
</header>

<main class="mx-auto max-w-5xl px-5 py-10">
  {@render children()}
</main>