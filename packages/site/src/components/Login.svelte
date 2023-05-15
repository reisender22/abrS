<script>
  import Password from "../components/Password.svelte";

  import { session, status } from "../stores/session";

  let email = "";
  let password = "";

  let resetPassword = false;
</script>

{#if resetPassword}
  <form
    on:submit|preventDefault={() => session.requestPasswordReset(email)}
    class="w-64">
    <h1>Passwort zurücksetzen</h1>

    <div class="mb-5">
      <label for="email">Email</label>
      <input type="text" bind:value={email} id="email" />
    </div>

    <button
      disabled={$status === 'REQUESTING_PASSWORD_RESET'}
      class="w-full py-3 text-white bg-teal-600 rounded btn">
      {$status === 'REQUESTING_PASSWORD_RESET' ? 'Einen Moment...' : 'Passwort zurücksetzen'}
    </button>
  </form>
{:else}
  <form
    on:submit|preventDefault={() => session.login(email, password)}
    class="w-64">
    <h1>Anmelden</h1>

    <div class="mb-5">
      <label for="email">Email</label>
      <input type="text" bind:value={email} id="email" />
    </div>

    <div class="mb-5">
      <label for="password">Password</label>
      <Password bind:value={password} id="password" />
    </div>

    <button type="button" on:click={() => (resetPassword = true)} class='mb-8 text-gray-800 btn'>Passwort vergessen?</button>

    <button
      disabled={$status === 'AUTHENTICATING'}
      class="w-full py-3 text-white bg-teal-600 rounded btn">
      {$status === 'AUTHENTICATING' ? 'Einen Moment...' : 'Anmelden'}
    </button>
  </form>
{/if}
