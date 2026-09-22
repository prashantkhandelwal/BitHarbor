<script lang="ts">
  let { form } = $props();
</script>

<h1 class="text-3xl font-bold">Invites</h1>
<p class="mt-2 max-w-xl text-gray-600">Generate a single-use code for someone you trust. The code is shown only once.</p>

<form class="mt-6" method="POST">
  <button class="bg-harbor-600 px-5 py-3 font-bold text-white hover:bg-harbor-700" type="submit">Generate invite</button>
</form>

{#if form?.inviteCode}
  <div class="mt-5 max-w-xl border-l-4 border-harbor-600 bg-white p-4">
    <p class="m-0 text-sm font-semibold text-gray-600">New invite code</p>
    <p class="mt-2 mb-0 break-all font-mono text-lg">{form.inviteCode}</p>
  </div>
{/if}