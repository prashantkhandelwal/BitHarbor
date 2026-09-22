<script lang="ts">
  let { form } = $props();
</script>

<h1 class="text-3xl font-bold">Create an account</h1>
<p class="mt-2 text-gray-600">Registration requires a single-use invite code.</p>

<form class="mt-6 max-w-md border border-harbor-600/20 bg-white p-6" method="POST">
  <label class="mb-2 block font-bold" for="username">Username</label>
  <input class="block w-full border border-gray-300 p-3" id="username" name="username" value={form?.username ?? ''} required minlength="3" maxlength="32" pattern="[a-zA-Z0-9_]+" autocomplete="username" />

  <label class="mt-5 mb-2 block font-bold" for="password">Password</label>
  <input class="block w-full border border-gray-300 p-3" id="password" name="password" type="password" required minlength="8" maxlength="128" autocomplete="new-password" />

  <label class="mt-5 mb-2 block font-bold" for="inviteCode">Invite code</label>
  <input class="block w-full border border-gray-300 p-3 font-mono" id="inviteCode" name="inviteCode" required autocomplete="off" />

  <button class="mt-5 bg-harbor-600 px-5 py-3 font-bold text-white hover:bg-harbor-700" type="submit">Create account</button>
</form>

{#if form?.message}
  <p class="mt-4 max-w-md border-l-4 border-red-600 bg-white p-4">{form.message}</p>
{/if}