<script lang="ts">
  let { form } = $props();
</script>

<h1 class="text-3xl font-bold">Log in</h1>
<form class="mt-6 max-w-md border border-harbor-600/20 bg-white p-6" method="POST">
  <label class="mb-2 block font-bold" for="username">Username</label>
  <input class="block w-full border border-gray-300 p-3" id="username" name="username" value={form?.username ?? ''} required autocomplete="username" />

  <label class="mt-5 mb-2 block font-bold" for="password">Password</label>
  <input class="block w-full border border-gray-300 p-3" id="password" name="password" type="password" required autocomplete="current-password" />

  <button class="mt-5 bg-harbor-600 px-5 py-3 font-bold text-white hover:bg-harbor-700" type="submit">Log in</button>
</form>

{#if form?.message}
  <p class="mt-4 max-w-md border-l-4 border-red-600 bg-white p-4">{form.message}</p>
{/if}

<p class="mt-5 text-sm text-gray-600">Have an invite? <a class="font-semibold text-harbor-700 hover:underline" href="/register">Create an account</a>.</p>