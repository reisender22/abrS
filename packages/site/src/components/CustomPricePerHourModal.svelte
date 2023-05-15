<script>
  import { createEventDispatcher } from "svelte";
  import { clss, status } from "../stores/class";

  export let enrollment;

  status.reset();

  const dispatch = createEventDispatcher();

  let mode = enrollment.custom_price_per_hour ? "custom" : "standard";
  
  let custom_price_per_hour = enrollment.custom_price_per_hour
    ? enrollment.custom_price_per_hour
    : 0;

  $: if (mode === "standard") custom_price_per_hour = null;

  $: if ($status === "UPDATED_ENROLLMENT") dispatch("updated");
</script>

<div
  class="w-full overflow-hidden bg-gray-100 rounded shadow sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4">
  <header class="p-4 bg-white">
    <p class="m-0 text-xl">Stundenpreis anpassen</p>
  </header>
  <div class="p-4 bg-white">
    <form on:input|preventDefault>
      <div class="mb-5">
        <select bind:value={mode}>
          <option value="standard">Standard</option>
          <option value="custom">Benutzerdefniert</option>
        </select>
      </div>

      {#if mode === 'custom'}
        <div>
          <label for="custom_price_per_hour">Stundenpreis</label>
          <input type="number" min="0" bind:value={custom_price_per_hour} />
        </div>
      {/if}
    </form>
  </div>
  <footer class="flex justify-between p-4 bg-gray-200">
    <button on:click={() => dispatch('cancel')} class="btn btn--secondary">
      Abbrechen
    </button>
    <button
      on:click={() => clss.updateEnrollment(enrollment.id, {
          custom_price_per_hour,
        })}
      disabled={$status === 'UPDATING_ENROLLMENT'}
      class="btn btn--primary">
      {$status === 'UPDATING_ENROLLMENT' ? 'Einen Moment...' : 'Speichern'}
    </button>
  </footer>
</div>
