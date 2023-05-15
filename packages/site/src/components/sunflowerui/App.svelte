<script>
  import { setContext } from "svelte";

  let modals = [];

  const api = {
    /**
     * @param
     */
    registerModal(ref) {
      modals.push(ref);
    },

    /**
     *
     */
    unregisterModal(ref) {
      modals = modals.filter(modal => modal !== ref);
    },
  };

  setContext("sunflower-app", api);
</script>

<main>
  <slot />
</main>
